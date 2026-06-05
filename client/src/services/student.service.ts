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

export const createReportService = async (reportDTO: CreateReportDTO): Promise<ReportDTO> => {
    const { data } = await api.post<ReportDTO>('/reports', reportDTO);
    return data;
};
export const getUserNotificationHistoryService = async (userId: string): Promise<NotificationDTO[]> => {
    const { data } = await api.get<NotificationDTO[]>(`/notifications/user/${userId}`);
    return data;
};

export const markNotificationDeliveredService = async (notificationId: string): Promise<NotificationDTO> => {
    const { data } = await api.patch<NotificationDTO>(`/notifications/${notificationId}/delivered`);
    return data;
};

export const getAlertsForAccessibilityService = async (): Promise<any[]> => {
    const { data } = await api.get('/alerts/accessibility');
    return data;
};

export const getUserReportStatsService = async (userId: string) => {
    const { data } = await api.get(`/reports/user/${userId}/stats`);
    return data; 
};

export const updateProfileService = async (userId: string, formData: any) => {
    const { data } = await api.put(`/users/${userId}`, formData);
    return data;
};