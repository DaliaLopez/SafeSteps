import api from './api';
import type {CheckLocationDTO, CreateReportDTO, ReportDTO, NotificationDTO } from '../types/student.types'

export const checkIfUserIsInsideService = async (coords: CheckLocationDTO): Promise<any> => {
    const { data } = await api.post('/locations/check', coords);
    return data;
};

export const getAlertByLocationService = async (locationId: string): Promise<any> => {
    const { data } = await api.get(`/alerts/location/${locationId}`);
    return data;
};

// --- REPORTES ---

// Permite al estudiante reportar un obstáculo o falla (ej. rampa bloqueada).

export const createReportService = async (reportDTO: CreateReportDTO): Promise<ReportDTO> => {
    const { data } = await api.post<ReportDTO>('/reports', reportDTO);
    return data;
};

// --- NOTIFICACIONES (HISTORIAL) ---

// Trae todas las alertas que el estudiante ha recibido (historial personal).

export const getUserNotificationHistoryService = async (userId: string): Promise<NotificationDTO[]> => {
    const { data } = await api.get<NotificationDTO[]>(`/notifications/user/${userId}`);
    return data;
};


// Confirma que el celular del estudiante recibió la notificación.

export const markNotificationDeliveredService = async (notificationId: string): Promise<NotificationDTO> => {
    const { data } = await api.patch<NotificationDTO>(`/notifications/${notificationId}/delivered`);
    return data;
};

// --- CONSULTA GENERAL ---

// Lista todas las alertas vigentes en el campus para que el estudiante las consulte.

export const getAlertsForAccessibilityService = async (): Promise<any[]> => {
    const { data } = await api.get('/alerts/accessibility');
    return data;
};

// Retorna { aprobados: number, pendientes: number, rechazados: number }
export const getUserReportStatsService = async (userId: string) => {
    const { data } = await api.get(`/reports/user/${userId}/stats`);
    return data; 
};

export const updateProfileService = async (userId: string, formData: any) => {
    // CORRECCIÓN: Pasamos el id en la URL para que coincida con el router
    const { data } = await api.put(`/users/${userId}`, formData);
    return data;
};