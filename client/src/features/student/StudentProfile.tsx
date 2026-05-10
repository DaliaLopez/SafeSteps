import { useEffect, useState } from 'react';
import { Settings, LogOut, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserReportStatsService } from '../../services/student.service';

import { ProfileHeader } from '../../components/student/profile/ProfileHeader';
import { UserCard } from '../../components/student/profile/UserCard';
import { StatCard } from '../../components/student/profile/StatCard';
import { MenuOption } from '../../components/student/profile/MenuOption';

export default function StudentProfile() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ aprobados: 0, pendientes: 0, rechazados: 0 });

    useEffect(() => {
        if (user?.id) {
            getUserReportStatsService(user.id).then(setStats).catch(console.error);
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-[#F9FAF7] pb-10">
            <ProfileHeader title="Perfil" />

            <main className="max-w-md mx-auto px-6 space-y-8">
                <UserCard name={user?.name} email={user?.email} role={user?.role} />

                <section>
                    <h3 className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2 italic">Estadísticas</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <StatCard label="Reportes aprobados" value={stats.aprobados} icon={CheckCircle} color="bg-[#22C55E]" shadow="shadow-green-100" />
                        <StatCard label="Reportes pendientes" value={stats.pendientes} icon={Clock} color="bg-[#296BFF]" shadow="shadow-blue-100" />
                        <StatCard label="Reportes rechazados" value={stats.rechazados} icon={XCircle} color="bg-[#FBBF24]" shadow="shadow-orange-100" />
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2 italic">Configuración</h3>
                    
                    <MenuOption 
                        label="Ver mis reportes" 
                        icon={<Settings size={20} />} 
                        path="/student/reports" 
                    />

                    <MenuOption 
                        label="Editar perfil" 
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg>
                        } 
                        path="/student/profile/edit" 
                    />
                </section>

                <button 
                    onClick={logout}
                    className="w-full bg-[#FF2D2D] text-white p-5 rounded-[30px] font-bold flex items-center justify-center gap-3 shadow-xl shadow-red-100 active:scale-95 transition-all mt-10"
                >
                    <LogOut size={22} />
                    Cerrar sesión
                </button>
            </main>
        </div>
    );
}