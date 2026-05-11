import api from './api'
import { ReportStatus, type ApprovedReport } from '../types/reports.types'

export interface UpdateReportStatusPayload {
  id: string
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Resuelto'
}

// ── Reportes ──────────────────────────────────────────────────────────────────

export const getApprovedReportsService = async (): Promise<ApprovedReport[]> => {
  const { data } = await api.get<ApprovedReport[]>('/reports')
  return data.filter((r: ApprovedReport) => r.status === ReportStatus.APPROVED)
}

export const getPendingReportsService = async (): Promise<ApprovedReport[]> => {
  const { data } = await api.get<ApprovedReport[]>('/reports/pending')
  return data
}

export const updateReportStatusService = async (
  payload: UpdateReportStatusPayload
): Promise<ApprovedReport> => {
  const { data } = await api.patch<ApprovedReport>(`/reports/${payload.id}/status`, {
    status: payload.status,
  })
  return data
}

export const promoteReportToAlertService = async (reportId: string): Promise<void> => {
  await api.post(`/reports/${reportId}/promote`)
}

export const resolveReportService = async (reportId: string): Promise<void> => {
  await api.post(`/reports/${reportId}/resolve`)
}