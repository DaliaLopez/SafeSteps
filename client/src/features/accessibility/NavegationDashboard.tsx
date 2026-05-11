import { useEffect } from 'react';
import { MapView } from "../../components/map/MapView";
import NavbarNavegation from "../../components/accessibility/NavbarNavegation";
import HeaderNavegation from '../../components/accessibility/HeaderNavegation';
import { useAuth } from '../../context/AuthContext';
import { getAlertsForAccessibilityService } from '../../services/student.service';

export default function NavegationDashboard() {
    const { user } = useAuth();
    const universityCenter: [number, number] = [3.341, -76.530];

    const speak = (text: string, callback?: () => void) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';

        if (callback) {
            utterance.onend = () => callback();
        }

        window.speechSynthesis.speak(utterance);
    };

    // Función principal que construye el mensaje de voz basado en alertas reales
    const repeatNavegationInfo = async () => {
        try {
            let message = `Pantalla de navegación activa. `;

            // Obtenemos las alertas vigentes del servicio
            const alerts = await getAlertsForAccessibilityService();

            if (alerts && alerts.length > 0) {
                // Tomamos las descripciones de las primeras alertas para no saturar
                const pointsDescription = alerts
                    .slice(0, 3)
                    .map(a => a.description || "Obstáculo no especificado")
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

    // Al entrar a la pantalla por primera vez
    useEffect(() => {
        repeatNavegationInfo();
    }, [user]);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <div className="relative z-20 outline-none" tabIndex={0} onFocus={() => speak("Navegación activa")}>
                <HeaderNavegation />
            </div>

            <main className="flex-1 relative z-10 -mt-16 outline-none" tabIndex={0} onFocus={() => speak("Mapa de navegación en tiempo real")}>
                <MapView center={universityCenter} zoom={17} />
            </main>

            <div className="relative z-20">
                {/* Pasamos la función para que el botón de la navbar la use */}
                <NavbarNavegation onRepeat={repeatNavegationInfo} />
            </div>
        </div>
    );
}