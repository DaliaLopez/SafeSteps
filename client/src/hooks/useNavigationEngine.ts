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
                // 2. ALERTAS ACTIVAS (SOLO SI ESTÁ DENTRO DEL EDIFICIO)
                // ==========================
                if (currentBuilding.current) {
                    activeAlerts.forEach((alert) => {
                        // REGLA CLAVE: La alerta debe pertenecer al edificio actual
                        // Y debe tener coordenadas válidas para medir la distancia
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

                            // Prevenir spam (retraso de 30 segundos)
                            if (now - last > 30000) {
                                notifiedItems.current[alertKey] = now;

                                speak(`Precaución. ${alert.description}`);

                                if (window.navigator.vibrate) {
                                    window.navigator.vibrate([
                                        300, 100, 300,
                                    ]);
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
