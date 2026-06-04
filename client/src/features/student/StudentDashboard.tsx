import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { MapView } from "../../components/map/MapView";
import NavbarStudent from "../../components/student/NavbarStudent";
import { ReportMarkers } from "../../components/student/report/ReportMarkers";
import { getApprovedReportsService } from "../../services/admin.service";
import type { ReportDTO } from "../../types/admin.types";
import useSupabase from "../../hooks/useSupabase";

export default function StudentDashboard() {
  const universityCenter: [number, number] = [3.341, -76.530];
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const supabase = useSupabase();

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getApprovedReportsService();
        setReports(data);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      }
    };
    
    loadReports();

    const channel = supabase
      .channel("realtime-alerts-student")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        (payload) => {
          console.log("Cambio en alertas detectado en Estudiante:", payload);
          setTimeout(() => {
            loadReports();
          }, 300);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    
  }, [supabase]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <div className="relative z-20">
        <Header />
      </div>

      <main className="flex-1 relative z-10 -mt-16">
        <MapView center={universityCenter} zoom={17}>
          <ReportMarkers reports={reports} />
        </MapView>
      </main>

      <div className="relative z-20">
        <NavbarStudent />
      </div>
    </div>
  );
}