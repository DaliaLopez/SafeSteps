import api from './api'
import { ReportStatus } from '../types/admin.types'
import type { ReportDTO } from '../types/admin.types'

export interface UpdateReportStatusPayload {
  id: string
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Resuelto'
}


export const getApprovedReportsService = async (): Promise<ReportDTO[]> => {
  const { data } = await api.get<ReportDTO[]>('/reports')
  return data.filter((r: ReportDTO) => r.status === ReportStatus.APPROVED)
}

export const getPendingReportsService = async (): Promise<ReportDTO[]> => {
  const { data } = await api.get<ReportDTO[]>('/reports/pending')
  return data
}

export const updateReportStatusService = async (
  payload: UpdateReportStatusPayload
): Promise<ReportDTO> => {
  const { data } = await api.put<ReportDTO>('/reports/status', {
    id: payload.id,
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