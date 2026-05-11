import { useNavigate } from 'react-router-dom';
import { Volume2 } from 'lucide-react';

interface Props {
    onRepeat?: () => void;
}

export default function NavbarNavegation({ onRepeat }: Props) {
    const navigate = useNavigate();

    // --- FUNCIÓN PARA ESPERAR A QUE TERMINE LA VOZ ---
    const speakAndThen = (text: string, callback: () => void) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';

        // Esta es la clave: el callback solo se ejecuta cuando la voz termina
        utterance.onend = () => {
            callback();
        };

        window.speechSynthesis.speak(utterance);
    };

    return (
        <nav className="fixed bottom-0 bg-white p-6 rounded-t-[40px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] w-full z-50">
            <div className="flex flex-col gap-2 max-w-full justify-center">

                {/* BOTÓN DETENER: Ahora es un button, no un NavLink directo */}
                <button
                    onClick={() => speakAndThen(
                        "Botón presionado: Deteniendo navegación. Volviendo al panel principal.", 
                        () => navigate("/accessibility/dashboard")
                    )}
                    className="gap-4 p-3 rounded-3xl transition-all flex-1 bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm"
                >
                    Detener navegación
                </button>

                {/* BOTÓN REPETIR */}
                <button
                    onClick={() => speakAndThen(
                        "Botón presionado: Repitiendo información de navegación.", 
                        () => onRepeat?.()
                    )}
                    className="flex items-center justify-center gap-2 p-3 rounded-3xl transition-all bg-gray-600 text-white hover:bg-gray-700 outline-none"
                >
                    <Volume2 size={20} strokeWidth={2} />
                    <span className="font-bold text-sm">Repetir información</span>
                </button>

            </div>
        </nav>
    );
}