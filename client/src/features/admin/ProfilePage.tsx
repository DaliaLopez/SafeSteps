import { useEffect, useState } from 'react';
import { Map, Bell, Clock, CheckCircle, XCircle, User, LogOut, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileHeader } from '../../components/admin/profile/ProfileHeader';
import { UserCard } from '../../components/admin/profile/UserCard';
import { StatCard } from '../../components/admin/profile/StatCard';
import { MenuOption } from '../../components/admin/profile/MenuOption';
import { getLocationsService } from '../../services/accessibility.service';
import { getApprovedReportsService, getPendingReportsService } from '../../services/admin.service';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    const [stats, setStats] = useState({
        zonas: 0,
        alertas: 0,
        pendientes: 0,
        aprobados: 0,
        rechazados: 0
    });

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const [locations, pending, approved] = await Promise.all([
                    getLocationsService(),
                    getPendingReportsService(),
                    getApprovedReportsService()
                ]);

                setStats({
                    zonas: locations.length,
                    alertas: approved.length,
                    pendientes: pending.length,
                    aprobados: approved.length,
                    rechazados: 0
                });
            } catch (error) {
                console.error("Error cargando estadísticas:", error);
            }
        };

        fetchAdminStats();
    }, []);

    return (
        <div className="min-h-screen pb-10">
            <ProfileHeader title="Perfil" />

            <main className="max-w-md mx-auto px-6 space-y-6">
                <UserCard name={user?.name} email={user?.email} role="admin" />

                <section className="grid grid-cols-2 gap-3">
                    <StatCard
                        label="Zonas creadas"
                        value={stats.zonas}
                        icon={Map}
                        colorClass="text-blue-500"
                        bgClass="bg-blue-50"
                    />
                    <StatCard
                        label="Alertas activas"
                        value={stats.alertas}
                        icon={Bell}
                        colorClass="text-orange-500"
                        bgClass="bg-orange-50"
                    />
                    <StatCard
                        label="Reportes Pendientes"
                        value={stats.pendientes}
                        icon={Clock}
                        colorClass="text-purple-500"
                        bgClass="bg-purple-50"
                    />
                    <StatCard
                        label="Aprobaciones"
                        value={stats.aprobados}
                        icon={CheckCircle}
                        colorClass="text-green-500"
                        bgClass="bg-green-50"
                    />
                    <StatCard
                        label="Rechazos"
                        value={stats.rechazados}
                        icon={XCircle}
                        colorClass="text-red-500"
                        bgClass="bg-red-50"
                    />
                </section>

                <div className="space-y-3">
                    <MenuOption label="Editar perfil" icon={<User size={18} />} path="/admin/profile/edit" />
                    <MenuOption label="Actividad reciente" icon={<Activity size={18} />} path="/admin/activity" />
                </div>

                <button
                    onClick={logout}
                    className="w-full bg-red-500 text-white p-3 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-red-100 active:scale-95 transition-all"
                >
                    <LogOut size={22} />
                    Cerrar sesión
                </button>
            </main>
        </div>
    );
}