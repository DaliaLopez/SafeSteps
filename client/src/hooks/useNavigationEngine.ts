import { useEffect, useRef, useState } from 'react';
import { point } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

import { calculateDistanceInMetres } from '../utils/distance';
import { createNotificationService } from '../services/accessibility.service';

const TRADUCTOR_PROBLEMAS: Record<string, string> = {
    'obstacle': 'Obstáculo en la vía',
    'damaged_stairs': 'Escaleras dañadas o en mal estado',
    'slippery_ramp': 'Rampa resbalosa o inclinada',
    'broken_elevator': 'Ascensor fuera de servicio',
    'blocked_path': 'Sendero o camino bloqueado',
};

const TRADUCTOR_RIESGO: Record<string, string> = {
    'low': 'Bajo',
    'medium': 'Medio',
    'high': 'Alto o crítico',
};

const TRADUCTOR_ZONAS: Record<string, string> = {
    'building': 'Edificio',
    'ramp': 'Rampa de acceso',
    'stairs': 'Zona de escaleras',
    'bathroom': 'Baño de accesibilidad',
    'cafeteria': 'Cafetería',
    'elevator': 'Ascensor',
    'walkway': 'Sendero',
};

export const useNavigationEngine = (
    userId: string | undefined,
    locations: any[],
    activeAlerts: any[],
    alertDistanceSetting: number
) => {
    const [currentLocation, setCurrentLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const currentBuilding = useRef<string | null>(null);
    const currentFixedZoneId = useRef<string | null>(null);
    const notifiedItems = useRef<Record<string, number>>({});

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (!navigator.geolocation) return;
        if (locations.length === 0) return;

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setCurrentLocation({ lat: latitude, lng: longitude });

                const now = Date.now();
                const userPoint = point([longitude, latitude]);

                let buildingFound = null;
                let zoneFound = null;

                for (const loc of locations) {
                    const currentType = loc.location_fixed_type || loc.type;

                    try {
                        if (loc.boundary) {
                            const polygon = JSON.parse(loc.boundary);
                            if (booleanPointInPolygon(userPoint, polygon)) {
                                if (currentType === 'building') {
                                    buildingFound = loc;
                                } else {
                                    zoneFound = loc;
                                }
                            }
                        }
                    } catch {
                        if (loc.latitude && loc.longitude) {
                            const distToCenter = calculateDistanceInMetres(
                                latitude,
                                longitude,
                                Number(loc.latitude),
                                Number(loc.longitude)
                            );
                            const radiusCheck = currentType === 'building' ? 35 : 15;
                            if (distToCenter <= radiusCheck) {
                                if (currentType === 'building') buildingFound = loc;
                                else zoneFound = loc;
                            }
                        }
                    }
                }

                // --- Control estricto de Edificios (SUENA DE PRIMERO) ---
                let justEnteredBuilding = false; // Bandera para saber si acabamos de cruzar la puerta

                if (buildingFound) {
                    if (currentBuilding.current !== buildingFound.id) {
                        currentBuilding.current = buildingFound.id;
                        justEnteredBuilding = true;
                        speak(`Has ingresado al ${buildingFound.name}`);
                    }
                } else {
                    if (currentBuilding.current) {
                        const previousBuilding = locations.find((l) => l.id === currentBuilding.current);
                        if (previousBuilding) {
                            speak(`Has salido del ${previousBuilding.name}`);
                        }
                        currentBuilding.current = null;
                    }
                }

                if (zoneFound) {
                    if (currentFixedZoneId.current !== zoneFound.id) {
                        currentFixedZoneId.current = zoneFound.id;
                        const fixType = zoneFound.location_fixed_type || zoneFound.type;
                        
                        let mensaje = "";
                        if (fixType === 'stairs') {
                            mensaje = `Estás cerca de una escalera en ${zoneFound.name}.`;
                        } else if (fixType === 'elevator') {
                            mensaje = `Estás cerca de un ascensor en ${zoneFound.name}.`;
                        } else if (fixType === 'bathroom') {
                            mensaje = `Estás cerca de un baño en ${zoneFound.name}.`;
                        } else {
                            const tipoTraducido = TRADUCTOR_ZONAS[fixType] || 'zona de interés';
                            mensaje = `Estás en la ${tipoTraducido}: ${zoneFound.name}.`;
                        }
                        speak(mensaje);
                    }
                } else {
                    currentFixedZoneId.current = null;
                }

                if (currentBuilding.current) {
                    activeAlerts.forEach((alert) => {
                        if (
                            alert.location_id !== currentBuilding.current ||
                            !alert.latitude ||
                            !alert.longitude
                        ) {
                            return;
                        }

                        const distance = calculateDistanceInMetres(
                            latitude,
                            longitude,
                            Number(alert.latitude),
                            Number(alert.longitude)
                        );

                        if (distance <= alertDistanceSetting) {
                            const alertKey = `alert-${alert.id}`;
                            const last = notifiedItems.current[alertKey] || 0;

                            if (now - last > 45000) {
                                notifiedItems.current[alertKey] = now;

                                const rawObstacle = alert.problem_type || "";
                                const tipoObstaculoEspañol = TRADUCTOR_PROBLEMAS[rawObstacle] || "Obstáculo indeterminado";

                                const rawRisk = alert.danger_level || "";
                                const nivelRiesgoEspañol = TRADUCTOR_RIESGO[rawRisk] || "Medio";

                                const fraseAlerta = 
                                    `Precaución. Te estás acercando a un peligro. ` +
                                    `Detalle: ${alert.description}. ` +
                                    `Tipo de problema: ${tipoObstaculoEspañol}. ` +
                                    `Nivel de riesgo: ${nivelRiesgoEspañol}.`;

                                if (justEnteredBuilding) {
                                    setTimeout(() => {
                                        speak(fraseAlerta);
                                        if (window.navigator.vibrate) window.navigator.vibrate([300, 100, 300]);
                                    }, 2500);
                                } else {
                                    speak(fraseAlerta);
                                    if (window.navigator.vibrate) window.navigator.vibrate([300, 100, 300]);
                                }

                                if (userId) {
                                    createNotificationService({
                                        user_id: userId,
                                        alert_id: alert.id,
                                    }).catch(console.error);
                                }
                            }
                        }
                    });
                }
            },
            (error) => console.error("Error obteniendo coordenadas:", error),
            {
                enableHighAccuracy: true,
                timeout: 2000,
                maximumAge: 0,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [userId, locations, activeAlerts, alertDistanceSetting]);

    return { currentLocation };
};