import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { getApprovedReportsService, getPendingReportsService } from '../../services/admin.service';
import type { ReportDTO } from '../../types/admin.types';
import { useNavigate } from 'react-router-dom';

export default function ActivityHistoryPage() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('Hoy');
    const [activities, setActivities] = useState<ReportDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadActivity = async () => {
            setLoading(true);
            try {
                const [approved, pending] = await Promise.all([
                    getApprovedReportsService(),
                    getPendingReportsService()
                ]);

                const allActivity = [...approved, ...pending];

                const sorted = allActivity.sort((a, b) =>
                    new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
                );

                setActivities(sorted);
            } catch (error) {
                console.error("Error al cargar actividad:", error);
            } finally {
                setLoading(false);
            }
        };

        loadActivity();
    }, []);

    const filteredActivities = activities.filter(activity => {
        if (!activity.created_at) return false;
        const date = new Date(activity.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (activeFilter === 'Hoy') return diffDays <= 1;
        if (activeFilter === 'Semana') return diffDays <= 7;
        if (activeFilter === 'Mes') return diffDays <= 30;
        return true;
    });

    const getStatusStyles = (status: string) => {

        switch (status) {
            case 'Aprobado': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Aprobaste un reporte' };
            case 'Pendiente': return { icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Reporte por revisar' };
            case 'Rechazado': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Rechazaste un reporte' };
            default: return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50', label: 'Actividad registrada' };
        }

    };

    return (

        <div className="min-h-screen pb-10">

            <header className="px-8 pt-8 pb-6 flex items-center gap-4">

                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white rounded-full shadow-sm active:scale-90 border border-gray-100"
                >

                    <ArrowLeft size={22} className="text-gray-800" />
                </button>

                <h2 className="text-2xl font-bold text-[#1E293B]">Actividad reciente</h2>

            </header>

            <main className="max-w-md mx-auto px-8 space-y-4">

                <div className="flex justify-center">

                    <div className="flex p-1.5 w-full max-w-xs">
                        {['Hoy', 'Semana', 'Mes'].map((f) => (
                            
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`flex-1
                            h-9
                            rounded-2xl
                            text-[12px]
                            font-semibold
                            transition-all
                            shadow-sm
                            border ${activeFilter === f
                                        ? 'bg-[#296BFF] text-white border-[#296BFF]'
                                        : 'bg-white text-[#6B7280] border-[#ECECEC]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}

                    </div>

                </div>

                <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-50 min-h-full">

                    {loading ? (
                        <p className="text-center text-gray-400 text-sm py-20">Cargando historial...</p>
                    ) : filteredActivities.length > 0 ? (
                        
                        <div className="space-y-6">
                            {filteredActivities.map((item) => {
                                const style = getStatusStyles(item.status);
                                return (
                                    
                                    <div key={item.id} className="flex items-start gap-4 border-b border-gray-50 pb-4 last:border-0">
                                        
                                        <div className={`p-3 rounded-2xl ${style.bg} ${style.color}`}>
                                            <style.icon size={20} />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-[#1E293B]">{style.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.description || 'Sin descripción'}</p>
                                            <p className="text-[10px] text-blue-500 mt-2">
                                                {new Date(item.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>

                                    </div>

                                );
                            })}

                        </div>

                    ) : (

                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                            <AlertCircle size={48} className="mb-2" />
                            <p className="text-sm font-bold">No hay actividad registrada</p>
                        </div>

                    )}
                </div>

            </main>

        </div>
        
    );
}