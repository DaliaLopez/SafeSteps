import { useEffect, useState } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ReportCard } from "../../components/student/report/ReportCard";

import {
  getApprovedReportsService,
  resolveReportService,
} from "../../services/admin.service";

import type { ReportDTO } from "../../types/student.types";

export default function AlertsPage() {
const navigate = useNavigate();
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getApprovedReportsService();

        setReports(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleResolveAlert = async (reportId: string) => {
    const confirmResolve = confirm(
      "¿Marcar esta alerta como solucionada?"
    );

    if (!confirmResolve) return;

    try {
      await resolveReportService(reportId);

      setReports((prev) =>
        prev.filter((report) => report.id !== reportId)
      );

      alert("Alerta solucionada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al resolver la alerta");
    }
  };

  return (
    
    <div className="min-h-screen bg-[#F4F7FB] px-4 py-6 pb-32">

      <header className="px-8 pt-8 py-6 flex items-center gap-4">

        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
        >

          <ArrowLeft size={22} className="text-gray-800" />

        </button>

        <div>

          <h2 className="text-2xl font-bold text-black">Alertas activas</h2>

          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona las alertas activas del mapa.
          </p>

        </div>

      </header>

        {loading ? (
          <p className="text-sm text-gray-500">
            Cargando alertas...
          </p>

        ) : reports.length === 0 ? (

          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">

            <p className="text-gray-500">
              No hay alertas activas.
            </p>

          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {reports.map((report) => (
              <div key={report.id}>

                <ReportCard report={report} />

                <div className="px-4 -mt-2 mb-5">

                  <button
                    onClick={() => handleResolveAlert(report.id)}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-4 rounded-2xl shadow-sm"
                  >
                    <CheckCircle2 size={20} />

                    <span>Alerta solucionada</span>
                  </button>

                </div>

              </div>

            ))}
          </div>

        )}
      </div>

  );
  
}