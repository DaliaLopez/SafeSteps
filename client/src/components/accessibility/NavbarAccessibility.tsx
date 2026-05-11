import { useNavigate } from 'react-router-dom';
import { Volume2 } from 'lucide-react';

interface NavbarProps {
    onRepeat?: () => void;
}

export default function NavbarAccessibility({ onRepeat }: NavbarProps) {
    const navigate = useNavigate();

    // Función para hablar y ejecutar una acción al terminar
    const speakAndThen = (text: string, callback: () => void) => {
        window.speechSynthesis.cancel(); // Detiene cualquier voz previa
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';

        // Evento que detecta cuando la voz termina de hablar
        utterance.onend = () => {
            callback();
        };

        window.speechSynthesis.speak(utterance);
    };

    return (
        <nav className="fixed bottom-0 bg-white p-6 rounded-t-[40px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] w-full mt-auto z-50">
            <div className="flex flex-col gap-2 max-w-full justify-center">

                {/* BOTÓN INICIAR NAVEGACIÓN */}
                <button
                    onClick={() => speakAndThen(
                        "Botón presionado: Iniciar navegación. Redirigiendo a la pantalla de mapa.",
                        () => navigate("/accessibility/navegation")
                    )}
                    className="gap-4 p-3 rounded-3xl transition-all flex-1 bg-blue-600 text-white hover:bg-blue-700 text-center font-bold text-sm outline-none focus:ring-4 focus:ring-blue-200"
                >
                    Iniciar navegación
                </button>

                {/* BOTÓN REPETIR INFORMACIÓN */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        speakAndThen(
                            "Botón presionado: Repetir información.",
                            () => onRepeat?.()
                        );
                    }}
                    className="flex items-center justify-center gap-2 p-3 rounded-3xl transition-all bg-gray-600 text-white hover:bg-gray-700 outline-none focus:ring-4 focus:ring-gray-200"
                >
                    <Volume2 size={20} />
                    <span className="font-bold text-sm">Repetir información</span>
                </button>

                {/* BOTÓN VER PERFIL */}
                <button
                    onClick={() => speakAndThen(
                        "Botón presionado: Ver perfil. Redirigiendo a tus ajustes de cuenta.",
                        () => navigate("/accessibility/profile")
                    )}
                    className="gap-4 p-3 rounded-3xl transition-all flex-1 bg-blue-400 text-white hover:bg-blue-500 text-center font-bold text-sm outline-none focus:ring-4 focus:ring-blue-100"
                >
                    Ver perfil
                </button>

            </div>
        </nav>
    );
}