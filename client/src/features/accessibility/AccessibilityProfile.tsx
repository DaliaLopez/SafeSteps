import { Volume2, Navigation, BellRing, LogOut, UserPen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Importamos tus componentes base
import { ProfileHeader } from '../../components/accessibility/profile/ProfileHeader';
import { UserCard } from '../../components/accessibility/profile/UserCard';
import { MenuOption } from '../../components/accessibility/profile/MenuOption';

export default function AccessibilityProfile() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen pb-10 bg-[#F8F9FA]">
            {/* Header reutilizado con el título de la imagen */}
            <ProfileHeader title="Perfil" />

            <main className="max-w-md mx-auto px-6 space-y-6 pb-8">
                {/* Tarjeta de usuario adaptada a Laura */}
                <UserCard 
                    name={user?.name || "Laura"} 
                    email={user?.email || "laura@campus.u.edu"} 
                    role="Usuario" 
                />

                {/* Listado de opciones de configuración */}
                <section className="space-y-3">
                    <MenuOption
                        label="Editar perfil"
                        icon={<UserPen size={20} />}
                        path="/accessibility/profile/edit"
                    />

                    <MenuOption
                        label="Audio y accesibilidad"
                        icon={<Volume2 size={20} />}
                        path="/accessibility/settings/audio"
                    />

                    <MenuOption
                        label="Vibración"
                        icon={<BellRing size={20} />}
                        path="/accessibility/settings/vibration"
                    />

                    <MenuOption
                        label="Opciones de navegación"
                        icon={<Navigation size={20} />}
                        path="/accessibility/settings/navigation"
                    />
                </section>

                {/* Botón de acción principal adaptado al estilo rojo de la imagen */}
                <button
                    onClick={logout}
                    className="w-full bg-[#FF1A1A] text-white p-4 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-red-100 active:scale-95 transition-all mt-6"
                >
                    <LogOut size={22} />
                    Cerrar sesión
                </button>
            </main>
        </div>
    );
}