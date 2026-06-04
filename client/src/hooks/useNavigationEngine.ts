import { useEffect, useRef, useState } from 'react';
import { calculateDistanceInMetres } from '../utils/distance';
import { createNotificationService } from '../services/accessibility.service';

export const useNavigationEngine = (
    userId: string | undefined,
    locations: any[], 
    activeAlerts: any[], 
    alertDistanceSetting: number
) => {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
    
    // Rastreo de zonas actuales (¿en qué edificio estoy?)
    const currentZoneId = useRef<string | null>(null);
    // Rastreo de alertas (historial de notificaciones por alerta)
    const notifiedAlerts = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
                const now = Date.now();

                // 1. LÓGICA DE ZONAS (Entrada y Salida)
                let zoneFound = locations.find(loc => 
                    calculateDistanceInMetres(latitude, longitude, loc.latitude, loc.longitude) <= 30 // Rango de zona (ej: 30m)
                );

                if (zoneFound && currentZoneId.current !== zoneFound.id) {
                    currentZoneId.current = zoneFound.id;
                    const mensaje = `Has ingresado al ${zoneFound.name}.`;
                    
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance(mensaje));
                } else if (!zoneFound && currentZoneId.current !== null) {
                    currentZoneId.current = null;
                    const mensaje = `Has salido de la zona.`;
                    
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance(mensaje));
                }

                // 2. LÓGICA DE ALERTAS Y ZONAS FIJAS (Escaleras, Ascensores, Peligros)
                // Estos notifican CADA VEZ que el usuario se acerca, sin importar si está en un edificio
                activeAlerts.forEach((item) => {
                    const dist = calculateDistanceInMetres(latitude, longitude, item.latitude, item.longitude);
                    
                    if (dist <= alertDistanceSetting) {
                        const lastNotified = notifiedAlerts.current[item.id] || 0;
                        
                        // Si el usuario vuelve a pasar cerca, volvemos a notificar (cada 2 minutos)
                        if (now - lastNotified > 120000) {
                            notifiedAlerts.current[item.id] = now;

                            let mensaje = "";
                            // Si es una alerta de reporte (tiene description)
                            if (item.description && !['building', 'stairs', 'elevator', 'bathroom'].includes(item.type)) {
                                mensaje = `¡Precaución! ${item.description}.`;
                            } else {
                                // Si es una zona fija
                                switch (item.type) {
                                    case 'stairs': mensaje = `Estás cerca de una escalera.`; break;
                                    case 'elevator': mensaje = `Estás cerca de un ascensor.`; break;
                                    case 'bathroom': mensaje = `Estás cerca de un baño.`; break;
                                    default: mensaje = `Estás cerca de ${item.location_name}.`;
                                }
                            }

                            window.speechSynthesis.cancel();
                            window.speechSynthesis.speak(new SpeechSynthesisUtterance(mensaje));
                            if (window.navigator.vibrate) window.navigator.vibrate([300, 100, 300]);
                            
                            if (userId && item.id.length > 5) { // Evita notificar puntos fijos como alertas
                                createNotificationService({ user_id: userId, alert_id: item.id }).catch(console.error);
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