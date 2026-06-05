import { useEffect, useRef, useState } from 'react';
import { point } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

import { calculateDistanceInMetres } from '../utils/distance';
import { createNotificationService } from '../services/accessibility.service';

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
    const notifiedItems = useRef<Record<string, number>>({});

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setCurrentLocation({
                    lat: latitude,
                    lng: longitude,
                });

                const now = Date.now();
                const userPoint = point([longitude, latitude]);

                // ==========================
                // 1. DETECTAR ENTRADA/SALIDA DE EDIFICIO
                // ==========================
                const buildingFound = locations.find((loc) => {
                    if (loc.type !== 'building') return false;

                    try {
                        const polygon = JSON.parse(loc.boundary);
                        return booleanPointInPolygon(userPoint, polygon);
                    } catch {
                        return false;
                    }
                });

                if (
                    buildingFound &&
                    currentBuilding.current !== buildingFound.id
                ) {
                    currentBuilding.current = buildingFound.id;
                    speak(`Has ingresado al ${buildingFound.name}`);
                }

                if (!buildingFound && currentBuilding.current) {
                    const previousBuilding = locations.find(
                        (l) => l.id === currentBuilding.current
                    );

                    if (previousBuilding) {
                        speak(`Has salido de ${previousBuilding.name}`);
                    }

                    currentBuilding.current = null;
                }

                // ==========================
                // 2. ALERTAS Y ZONAS (SOLO SI ESTÁ DENTRO DEL EDIFICIO)
                // ==========================
                if (currentBuilding.current) {
                    
                    // --- A. EVALUAR ALERTAS ACTIVAS ---
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

                            if (now - last > 30000) {
                                notifiedItems.current[alertKey] = now;

                                const tipoProblema = alert.problem_type ? `Problema detectado: ${alert.problem_type}. ` : '';
                                const nivelRiesgo = alert.danger_level ? `Nivel de riesgo: ${alert.danger_level}. ` : '';
                                
                                const mensajeFinal = `Precaución. ${tipoProblema}${nivelRiesgo}${alert.description}`;

                                speak(mensajeFinal);

                                if (window.navigator.vibrate) {
                                    window.navigator.vibrate([300, 100, 300]);
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

                    // --- B. EVALUAR ZONAS (ESCALERAS, BAÑOS, ASCENSORES, RAMPAS, ETC) ---
                    locations.forEach((loc) => {
                        // Ignoramos los edificios porque ya los manejamos con el polígono arriba
                        if (
                            loc.type === 'building' ||
                            !loc.latitude || 
                            !loc.longitude
                        ) {
                            return;
                        }

                        const distance = calculateDistanceInMetres(
                            latitude,
                            longitude,
                            Number(loc.latitude),
                            Number(loc.longitude)
                        );

                        if (distance <= alertDistanceSetting) {
                            const zoneKey = `zone-${loc.id}`;
                            const last = notifiedItems.current[zoneKey] || 0;

                            if (now - last > 30000) {
                                notifiedItems.current[zoneKey] = now;

                                let message = '';
                                switch (loc.type) {
                                    case 'stairs':
                                        message = `Estás cerca de una escalera en ${loc.name}.`;
                                        break;
                                    case 'elevator':
                                        message = `Estás cerca de un ascensor en ${loc.name}.`;
                                        break;
                                    case 'bathroom':
                                        message = `Estás cerca de un baño en ${loc.name}.`;
                                        break;
                                    case 'ramp':
                                        message = `Estás cerca de una rampa en ${loc.name}.`;
                                        break;
                                    default:
                                        message = `Estás en la zona: ${loc.name}.`;
                                        break;
                                }

                                speak(message);

                                if (window.navigator.vibrate) {
                                    window.navigator.vibrate([300, 100, 300]);
                                }
                            }
                        }
                    });
                }
            },
            console.error,
            {
                enableHighAccuracy: true,
                maximumAge: 0,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [userId, locations, activeAlerts, alertDistanceSetting]);

    return { currentLocation };
};