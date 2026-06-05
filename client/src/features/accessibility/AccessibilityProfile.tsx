import { useEffect } from 'react';
import { Volume2, Navigation, BellRing, LogOut, UserPen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { ProfileHeader } from '../../components/accessibility/profile/ProfileHeader';
import { UserCard } from '../../components/accessibility/profile/UserCard';
import { MenuOption } from '../../components/accessibility/profile/MenuOption';

export default function AccessibilityProfile() {
    const { user, logout } = useAuth();

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        speak("Pantalla de Perfil. Desliza para navegar por las opciones. Editar perfil. Audio y accesibilidad. Vibracion. Opciones de navegacion. Cerrar sesion");
    }, []);

    const handleLogout = () => {
        speak("Cerrando sesión. Hasta luego.");
        logout();
    };

    return (
        <div className="min-h-screen pb-10">

            <ProfileHeader title="Perfil" />

            <main className="max-w-md mx-auto px-6 space-y-8 pb-8">

                <div 
                    tabIndex={0} 
                    onFocus={() => speak(`Usuario: ${user?.name || 'Laura'}. Correo: ${user?.email || 'laura@campus.u.edu'}`)}
                    className="outline-none"
                >
                    <UserCard 
                        name={user?.name || "Laura"} 
                        email={user?.email || "laura@campus.u.edu"} 
                        role={user?.role || "Usuario"}
                    />
                </div>

                <section className="space-y-4">

                    <div tabIndex={0} onFocus={() => speak("Configuración: Editar perfil")} className="outline-none">
                        <MenuOption
                            label="Editar perfil"
                            icon={<UserPen size={20} />}
                            path="/accessibility/profile/edit"
                        />
                    </div>

                    <div tabIndex={0} onFocus={() => speak("Configuración: Audio y accesibilidad")} className="outline-none">
                        <MenuOption
                            label="Audio y accesibilidad"
                            icon={<Volume2 size={20} />}
                            path="/accessibility/settings/audio"
                        />
                    </div>

                    <div tabIndex={0} onFocus={() => speak("Configuración: Vibración")} className="outline-none">
                        <MenuOption
                            label="Vibración"
                            icon={<BellRing size={20} />}
                            path="/accessibility/settings/vibration"
                        />
                    </div>

                    <div tabIndex={0} onFocus={() => speak("Configuración: Opciones de navegación")} className="outline-none">
                        <MenuOption
                            label="Opciones de navegación"
                            icon={<Navigation size={20} />}
                            path="/accessibility/settings/navigation"
                        />
                    </div>

                </section>

                <button
                    onClick={handleLogout}
                    onFocus={() => speak("Botón: Cerrar sesión")}
                    className="w-full bg-[#FF2D2D] text-white p-5 rounded-[30px] font-bold flex items-center justify-center gap-3 shadow-xl shadow-red-100 active:scale-95 transition-all mt-10 outline-none focus:ring-4 focus:ring-red-200"
                >
                    <LogOut size={22} />
                    Cerrar sesión
                </button>

            </main>

        </div>

    );
    
}