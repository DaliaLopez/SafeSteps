import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from "lucide-react";
import { CheckCircle, XCircle } from 'lucide-react'
import { ReportCard } from '../../components/student/report/ReportCard'
import {
  getPendingReportsService,
  updateReportStatusService,
} from '../../services/admin.service'
import { ReportStatus } from '../../types/admin.types'
import type { ReportDTO } from '../../types/admin.types'

export default function PendingReportsPage() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<ReportDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    getPendingReportsService()
      .then(setReports)
      .catch((err: unknown) => console.error('Error cargando reportes:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleStatus = async (id: string, status: ReportStatus.APPROVED | ReportStatus.REJECTED) => {
    setUpdating(id)
    try {
      await updateReportStatusService({ id, status })
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Error actualizando reporte:', err)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="px-8 pt-8 py-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-black">
          Reportes pendientes
        </h2>
      </header>
 
      <div className="flex-1 py-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-lg bg-blue-600 animate-pulse" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-4xl">✅</div>
            <p className="text-gray-500 font-medium">Sin reportes pendientes</p>
            <p className="text-gray-400 text-sm">Todos los reportes han sido revisados</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="relative">
              <ReportCard report={report} />

              <div className="flex gap-3 px-4 -mt-2 mb-5">
                <button
                  onClick={() => handleStatus(report.id, ReportStatus.APPROVED)}
                  disabled={updating === report.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <CheckCircle size={18} />
                  {updating === report.id ? '…' : 'Aprobar'}
                </button>

                <button
                  onClick={() => handleStatus(report.id, ReportStatus.REJECTED)}
                  disabled={updating === report.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <XCircle size={18} />
                  {updating === report.id ? '…' : 'Rechazar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}