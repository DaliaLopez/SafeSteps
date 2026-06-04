import { useEffect, useRef, useState } from 'react';
import { calculateDistanceInMetres } from '../utils/distance';
import { createNotificationService } from '../services/accessibility.service';

export const useNavigationEngine = (
    userId: string | undefined,
    locations: any[], // Zonas normales (Edificios, escaleras)
    activeAlerts: any[], // Peligros reportados
    alertDistanceSetting: number
) => {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
    
    // Memoria plana anti-spam (guarda IDs de zonas y alertas)
    const notifiedHistory = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
                const now = Date.now();

                // 1. NAVEGACIÓN NORMAL (Guía de ubicación)
                locations.forEach((loc) => {
                    // Validar que el backend sí mandó las coordenadas
                    if (!loc.latitude || !loc.longitude) return; 

                    const distance = calculateDistanceInMetres(latitude, longitude, loc.latitude, loc.longitude);
                    if (distance <= alertDistanceSetting) {
                        const lastNotified = notifiedHistory.current[`loc_${loc.id}`] || 0;
                        if (now - lastNotified > 180000) { // 3 minutos anti-spam
                            notifiedHistory.current[`loc_${loc.id}`] = now;

                            let mensaje = "";
                            if (loc.type === 'building') {
                                mensaje = `Has ingresado al ${loc.name}.`;
                            } else if (loc.type === 'stairs') {
                                mensaje = `Estás cerca de una escalera en ${loc.name}.`;
                            } else if (loc.type === 'elevator') {
                                mensaje = `Estás cerca de un ascensor en ${loc.name}.`;
                            } else if (loc.type === 'bathroom') {
                                mensaje = `Estás cerca de un baño en ${loc.name}.`;
                            } else {
                                mensaje = `Estás en la zona: ${loc.name}.`;
                            }

                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(mensaje);
                            utterance.lang = 'es-ES';
                            window.speechSynthesis.speak(utterance);
                        }
                    }
                });

                // 2. ALERTAS DE PELIGRO (Obstáculos reportados)
                activeAlerts.forEach((alert) => {
                    if (!alert.latitude || !alert.longitude) return;

                    const distance = calculateDistanceInMetres(latitude, longitude, alert.latitude, alert.longitude);
                    if (distance <= alertDistanceSetting) {
                        const lastNotified = notifiedHistory.current[`alert_${alert.id}`] || 0;
                        if (now - lastNotified > 180000) {
                            notifiedHistory.current[`alert_${alert.id}`] = now;

                            // Notificación de peligro real
                            const mensajePeligro = `¡Precaución! Obstáculo cercano en ${alert.location_name}: ${alert.description}.`;

                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(mensajePeligro);
                            utterance.lang = 'es-ES';
                            window.speechSynthesis.speak(utterance);

                            if (window.navigator.vibrate) {
                                window.navigator.vibrate([400, 200, 400, 200, 400]); // Vibración más fuerte para peligros
                            }

                            if (userId) {
                                createNotificationService({ user_id: userId, alert_id: alert.id })
                                    .catch(err => console.error(err));
                            }
                        }
                    }
                });
            },
            (error) => console.error(error),
            { enableHighAccuracy: true, maximumAge: 0 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [locations, activeAlerts, alertDistanceSetting, userId]);

    return { currentLocation };
};