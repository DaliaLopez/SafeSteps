import api from './api';
import type {CheckLocationDTO, NotificationDTO } from '../types/accessibility.types';

export const getLocationsService = async (): Promise<any[]> => {
    const { data } = await api.get('/locations');
    return data;
};

export const checkIfUserIsInsideService = async (coords: CheckLocationDTO): Promise<any> => {
    const { data } = await api.post('/locations/check', coords);
    return data;
};


export const createNotificationService = async (notificationData: { user_id: string, alert_id: string }): Promise<NotificationDTO> => {
    const { data } = await api.post<NotificationDTO>('/notifications', notificationData);
    return data;
};


export const markNotificationDeliveredService = async (id: string): Promise<NotificationDTO> => {
    const { data } = await api.patch<NotificationDTO>(`/notifications/${id}/delivered`);
    return data;
};

export const getUserNotificationHistoryService = async (userId: string): Promise<NotificationDTO[]> => {
    const { data } = await api.get<NotificationDTO[]>(`/notifications/user/${userId}`);
    return data;
};

export const updateUserService = async (
    userId: string,
    userData: {
        name?: string;
        email?: string;
        password?: string;
    }
): Promise<any> => {
    const { data } = await api.put(`/users/${userId}`, userData);
    return data;
};