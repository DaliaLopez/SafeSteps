import { useEffect } from 'react';
import NavbarAccessibility from "../../components/accessibility/NavbarAccessibility";
import Header from "../../components/Header";
import { MapView } from "../../components/map/MapView";
import { useAuth } from '../../context/AuthContext';

export default function AccessibilityDashboard() {
    const { user } = useAuth();
    const universityCenter: [number, number] = [3.341, -76.530];

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    };

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
            <div
                className="relative z-20 outline-none"
                tabIndex={0}
                onFocus={() => speak(`Bienvenido o bienvenida, ${user?.name || ''}.`)}
            >
                <Header />
            </div>

            <main className="flex-1 relative z-10 -mt-16 outline-none" tabIndex={0} onFocus={() => speak("Mapa de la universidad")}>
                <MapView center={universityCenter} zoom={17} />
            </main>

            <div className="relative z-20">
                <NavbarAccessibility onRepeat={repeatDashboardInfo} />
            </div>
        </div>
    );
}