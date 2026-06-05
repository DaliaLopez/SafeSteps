import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { StatusFilters } from '../../components/student/report/StatusFilters';
import { ReportCard } from '../../components/student/report/ReportCard';
import type { ReportDTO } from '../../types/student.types';
import { ReportStatus } from '../../types/student.types';
import api from '../../services/api';
import useSupabase from '../../hooks/useSupabase';

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReportStatus>(ReportStatus.PENDING);
  const supabase = useSupabase();

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return;
  const user = JSON.parse(storedUser);

  const fetchReports = async () => {
    try {
      const { data } = await api.get(`/reports/user/${user.id}`);
      setReports(data);
    } catch (error) {
      console.error("Error cargando reportes", error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchReports();

  const channel = supabase
    .channel(`user-reports-realtime-${user.id}`)
    .on(
      "postgres_changes",
      { 
        event: "UPDATE", 
        schema: "public",
        table: "reports", 
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        console.log("¡El administrador cambió el estado de tu reporte!", payload);
        fetchReports();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [supabase]);

  const filteredReports = reports.filter(r => r.status === activeTab);

  return (
    <div className="min-h-screen">

      <header className="px-8 pt-8 py-6 flex items-center gap-4">

        <button onClick={() => navigate('/student/dashboard')} className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform">
          
          <ArrowLeft size={22} className="text-gray-800" />

        </button>

        <h2 className="text-2xl font-bold text-black">Mis reportes</h2>

      </header>

      <StatusFilters activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-150 mx-auto px-4 pb-20">
        {loading ? (

          <div className="flex flex-col items-center justify-center pt-32 gap-4">

            <div className="w-12 h-12 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin" />

            <p className="text-gray-400 font-semibold italic">Sincronizando reportes...</p>

          </div>
        ) : filteredReports.length > 0 ? (
          <div className="space-y-6">
            {filteredReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-12 text-center px-8">
            
            <div className="bg-white p-8 rounded-[40px] mb-6 shadow-sm border border-gray-50 text-gray-200">
              <FileText size={60} strokeWidth={1} />
            </div>

            <h2 className="text-[#1E293B] font-bold text-xl mb-2">Sin actividad</h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              No hay reportes marcados como <span className="font-bold text-[#296BFF]">{activeTab.toLowerCase()}</span> en este momento.
            </p>

          </div>
        )}
      </main>
      
    </div>
  );
}