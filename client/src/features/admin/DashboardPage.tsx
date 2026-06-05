import { useEffect, useState } from 'react'
import { MapView } from '../../components/map/MapView'
import { ReportMarkers } from '../../components/student/report/ReportMarkers'
import NavbarAdmin from '../../components/admin/NavbarAdmin'
import Header from '../../components/Header'
import { getApprovedReportsService } from '../../services/admin.service'
import type { ReportDTO } from '../../types/admin.types'
import useSupabase from '../../hooks/useSupabase'

const CAMPUS_CENTER: [number, number] = [3.341571, -76.530198] 

export default function DashboardPage() {
  const [reports, setReports] = useState<ReportDTO[]>([])
  const supabase = useSupabase();

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getApprovedReportsService();
        setReports(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadReports();

    const channel = supabase
      .channel("realtime-alerts-admin-map")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        (payload) => {
          console.log("Cambio en alertas detectado en mapa del Admin:", payload);
          setTimeout(() => {
            loadReports();
          }, 300);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase])

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden">

      <Header />

      <div className="flex-1 relative">

        <MapView center={CAMPUS_CENTER}>
          <ReportMarkers reports={reports} />
        </MapView>
        
      </div>

      <NavbarAdmin />
    </div>
  )
}