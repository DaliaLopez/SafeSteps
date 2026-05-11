import { useAuth } from '../../context/AuthContext';
import logoBlanco from "../../assets/LogoBlanco.png";

export default function HeaderNavegation() {
    const { user } = useAuth();

    return (
        <header className="bg-blue-600 text-white p-8 pb-8 pt-12 rounded-b-[40px] shadow-md relative overflow-hidden">
            <div className="absolute right-1 top-2 w-40 h-40">
                <img
                    src={logoBlanco}
                    alt="SafeSteps Logo Decorative"
                    className="w-full h-full object-contain opacity-15"
                />
            </div>

            <div className="relative z-10 flex items-start gap-4">
                {/* Icono de accesibilidad */}
                {user?.role === 'accessibility' && (
                    <div className="mt-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </div>
                )}

                <div className="flex flex-col items-start text-left gap-2">
                    <h2 className="text-2xl font-bold">
                        Navegación Activa
                    </h2>
                    <p className="text-white text-xs font-normal opacity-80">
                        Recibiendo alertas en tiempo real.
                    </p>
                </div>
            </div>
        </header>
    );
}