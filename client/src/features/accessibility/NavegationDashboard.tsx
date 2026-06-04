import { useEffect, useState } from 'react';
import { CircleMarker } from 'react-leaflet';
import { MapView } from "../../components/map/MapView";
import NavbarNavegation from "../../components/accessibility/NavbarNavegation";
import HeaderNavegation from '../../components/accessibility/HeaderNavegation';
import { useAuth } from '../../context/AuthContext';
import { getLocationsService } from '../../services/accessibility.service';
import { getAlertsForAccessibilityService } from '../../services/student.service';
import type { ReportDTO } from '../../types/admin.types'; 
import { getApprovedReportsService } from '../../services/admin.service';
import { getAccessibilitySettingsService } from '../../services/accessibility-settings.service';
import { ReportMarkers } from '../../components/student/report/ReportMarkers';
import { useNavigationEngine } from '../../hooks/useNavigationEngine';
import useSupabase from '../../hooks/useSupabase';

export default function NavegationDashboard() {
    const { user } = useAuth();
    const universityCenter: [number, number] = [3.341, -76.530];
    
    // Estados para pintar los pines (reportes aprobados)
    const [reports, setReports] = useState<ReportDTO[]>([]);

    // Estados para el motor GPS (Navegación + Peligros)
    const [locations, setLocations] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [alertDistance, setAlertDistance] = useState<number>(5);
    const supabase = useSupabase();

    useEffect(() => {
        const loadMapReports = async () => {
            try {
                const approvedData = await getApprovedReportsService();
                setReports(approvedData);
            } catch (error) {
                console.error("Error en navegación cargando marcadores del mapa:", error);
            }
        };

        loadMapReports();

        const channel = supabase
            .channel("realtime-alerts-navigation")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "alerts" },
                (payload) => {
                    console.log("Nueva alerta detectada", payload);
                    setTimeout(() => {
                        loadMapReports();
                    }, 300);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);
    
    useEffect(() => {
        const loadInitialData = async () => {
            try {

                if (user?.id) {
                    const settings = await getAccessibilitySettingsService(user.id);
                    setAlertDistance(parseInt(settings.alert_distance.split(' ')[0]) || 5);
                }
                
                // Cargamos ambas listas para el GPS
                const locationsData = await getLocationsService();
                setLocations(locationsData);

                const alertsData = await getAlertsForAccessibilityService();
                setAlerts(alertsData);
            } catch (error) {
                console.error(error);
            }
        };
        loadInitialData();
    }, [user]);

    // Pasamos ambas listas al motor
    const { currentLocation } = useNavigationEngine(user?.id, locations, alerts, alertDistance);

    const speak = (text: string, callback?: () => void) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';

        if (callback) {
            utterance.onend = () => callback();
        }

        window.speechSynthesis.speak(utterance);
    };

    const repeatNavegationInfo = async () => {
        try {
            let message = `Pantalla de navegación activa. `;

            const alertsData = await getAlertsForAccessibilityService();

            if (alertsData && alertsData.length > 0) {
                const pointsDescription = alertsData
                    .slice(0, 3)
                    .map((a: any) => a.description || "Obstáculo no especificado")
                    .join(", ");

                message += `Puntos de interés detectados cerca de ti: ${pointsDescription}. `;
            } else {
                message += "No se detectan obstáculos o alertas en tu zona actual. ";
            }

            message += "Opciones disponibles en la parte inferior: detener navegación y repetir información.";
            speak(message);
        } catch (error) {
            console.error(error);
            speak("Pantalla de navegación activa. Error al cargar puntos cercanos. Opciones disponibles: detener navegación y repetir información.");
        }
    };

    useEffect(() => {
        repeatNavegationInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <div className="relative z-20 outline-none" tabIndex={0} onFocus={() => speak("Navegación activa")}>
                <HeaderNavegation />
            </div>

            <main className="flex-1 relative z-10 -mt-16 outline-none" tabIndex={0} onFocus={() => speak("Mapa de navegación en tiempo real")}>
                <MapView 
                    center={currentLocation ? [currentLocation.lat, currentLocation.lng] : universityCenter} 
                    zoom={17}
                > 
                    <ReportMarkers reports={reports} />
                    
                    {currentLocation && (
                        <CircleMarker 
                            center={[currentLocation.lat, currentLocation.lng]} 
                            radius={8}
                            pathOptions={{ fillColor: '#296BFF', color: 'white', weight: 2, fillOpacity: 1 }}
                        />
                    )}
                </MapView>
            </main>

            <div className="relative z-20">
                <NavbarNavegation onRepeat={repeatNavegationInfo} />
            </div>
        </div>
    );
}