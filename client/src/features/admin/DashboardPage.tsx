import { useEffect, useState } from 'react'
import { MapView } from '../../components/map/MapView'
import { ReportMarkers, type ApprovedReport } from '../../components/student/report/ReportMarkers'
import NavbarAdmin from '../../components/admin/NavbarAdmin'
import Header from '../../components/student/dashboard/Header'
import { getApprovedReportsService } from '../../services/admin.service'

const CAMPUS_CENTER: [number, number] = [3.341571, -76.530198] 

export default function DashboardPage() {
  const [reports, setReports] = useState<ApprovedReport[]>([])

  useEffect(() => {
    getApprovedReportsService()
      .then(setReports)
      .catch((err: unknown) => console.error('Error cargando reportes:', err))
  }, [])

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