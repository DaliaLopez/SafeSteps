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

                // ==========================
                // DETECTAR EDIFICIO
                // ==========================

                const userPoint = point([longitude, latitude]);

                const buildingFound = locations.find((loc) => {
                    if (loc.type !== 'building') return false;

                    try {
                        const polygon = JSON.parse(loc.boundary);

                        return booleanPointInPolygon(
                            userPoint,
                            polygon
                        );
                    } catch {
                        return false;
                    }
                });

                if (
                    buildingFound &&
                    currentBuilding.current !== buildingFound.id
                ) {
                    currentBuilding.current = buildingFound.id;

                    speak(
                        `Has ingresado al ${buildingFound.name}`
                    );
                }

                if (
                    !buildingFound &&
                    currentBuilding.current
                ) {
                    const previousBuilding = locations.find(
                        (l) => l.id === currentBuilding.current
                    );

                    if (previousBuilding) {
                        speak(
                            `Has salido de ${previousBuilding.name}`
                        );
                    }

                    currentBuilding.current = null;
                }

                // ==========================
                // ESCALERAS, ASCENSORES, BAÑOS
                // ==========================

                locations.forEach((loc) => {
                    if (
                        ![
                            'stairs',
                            'elevator',
                            'bathroom'
                        ].includes(loc.type)
                    ) {
                        return;
                    }

                    const distance =
                        calculateDistanceInMetres(
                            latitude,
                            longitude,
                            Number(loc.latitude),
                            Number(loc.longitude)
                        );

                    if (distance <= alertDistanceSetting) {
                        const last =
                            notifiedItems.current[loc.id] || 0;

                        if (now - last > 30000) {
                            notifiedItems.current[loc.id] = now;

                            let message = '';

                            switch (loc.type) {
                                case 'stairs':
                                    message =
                                        'Estás cerca de una escalera';
                                    break;

                                case 'elevator':
                                    message =
                                        'Estás cerca de un ascensor';
                                    break;

                                case 'bathroom':
                                    message =
                                        'Estás cerca de un baño';
                                    break;
                            }

                            speak(message);
                        }
                    }
                });

                // ==========================
                // ALERTAS ACTIVAS
                // ==========================

                activeAlerts.forEach(async (alert) => {
                    const distance =
                        calculateDistanceInMetres(
                            latitude,
                            longitude,
                            Number(alert.latitude),
                            Number(alert.longitude)
                        );

                    if (distance <= alertDistanceSetting) {
                        const last =
                            notifiedItems.current[
                                `alert-${alert.id}`
                            ] || 0;

                        if (now - last > 30000) {
                            notifiedItems.current[
                                `alert-${alert.id}`
                            ] = now;

                            speak(
                                `Precaución. ${alert.description}`
                            );

                            if (
                                window.navigator.vibrate
                            ) {
                                window.navigator.vibrate([
                                    300,
                                    100,
                                    300,
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
    }, [
        userId,
        locations,
        activeAlerts,
        alertDistanceSetting,
    ]);

    return { currentLocation };
};