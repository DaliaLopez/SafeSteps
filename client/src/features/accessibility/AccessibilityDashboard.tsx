import { useEffect, useState } from 'react';
import NavbarAccessibility from "../../components/accessibility/NavbarAccessibility";
import Header from "../../components/Header";
import { MapView } from "../../components/map/MapView";
import { useAuth } from '../../context/AuthContext';
import { getApprovedReportsService } from '../../services/admin.service';
import { ReportMarkers } from '../../components/student/report/ReportMarkers';
import type { ReportDTO } from '../../types/reports.types';
import useSupabase from '../../hooks/useSupabase';

export default function AccessibilityDashboard() {
    const { user } = useAuth();
    const universityCenter: [number, number] = [3.341, -76.530];
    const [reports, setReports] = useState<ReportDTO[]>([]);
    const supabase = useSupabase();

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {

        const loadReports = async () => {
        try {
            const data = await getApprovedReportsService();
            setReports(data);
        } catch (error) {
            console.error(error);
        }
    };

        loadReports();

        const channel = supabase
            .channel("realtime-alerts-accessibility")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "alerts" },
                (payload) => {
                    console.log("Cambio en alertas detectado en Accesibilidad:", payload);
                    setTimeout(() => {
                        loadReports();
                    }, 300);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const repeatDashboardInfo = () => {
        const welcomeMessage = user?.name ? `Bienvenido ${user.name}` : "Bienvenido o bienvenida";

        speak(
            `${welcomeMessage} a la página principal de accesibilidad. Te encuentras en la Universidad Icesi. ` +
            "El mapa interactivo está cargado en tu posición actual. " +
            "Opciones disponibles en la parte inferior: Iniciar navegación, Repetir información y Ver perfil."
        );
    };

    useEffect(() => {
        repeatDashboardInfo();
    }, [user]);

    return (

        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <div className="relative z-20 outline-none" tabIndex={0} onFocus={() => speak(`Bienvenido o bienvenida, ${user?.name || 'usuario'}.`)}>
                <Header />
            </div>

            <main className="flex-1 relative z-10 -mt-16 outline-none" tabIndex={0} onFocus={() => speak("Mapa de la universidad")}>
                <MapView center={universityCenter} zoom={17}>
                    <ReportMarkers reports={reports} />
                </MapView>
            </main>

            <div className="relative z-20">
                <NavbarAccessibility />
            </div>

        </div>

    );
    
}