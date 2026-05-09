import api from './api';
import type {CheckLocationDTO, NotificationDTO } from '../types/accessibility.types';

// --- UBICACIONES ---

// Obtiene todas las zonas para que el usuario pueda saber en que edificio esta 
export const getLocationsService = async (): Promise<any[]> => {
    const { data } = await api.get('/locations');
    return data;
};

// Se llama constantemente mientras el usuario camina para saber si entró a un edificio o rampa
export const checkIfUserIsInsideService = async (coords: CheckLocationDTO): Promise<any> => {
    const { data } = await api.post('/locations/check', coords);
    return data;
};

// --- NOTIFICACIONES  ---

// Crea el registro de que el usuario debe ser notificado (incluye lógica anti-spam de 3 mins)
export const createNotificationService = async (notificationData: { user_id: string, alert_id: string }): Promise<NotificationDTO> => {
    const { data } = await api.post<NotificationDTO>('/notifications', notificationData);
    return data;
};

// Se activa cuando el celular hace sonar la alerta o vibra, para confirmar la recepción
export const markNotificationDeliveredService = async (id: string): Promise<NotificationDTO> => {
    const { data } = await api.patch<NotificationDTO>(`/notifications/${id}/delivered`);
    return data;
};

// Carga el historial de alertas que han pasado cerca del usuario (para la pantalla de inicio o perfil)
export const getUserNotificationHistoryService = async (userId: string): Promise<NotificationDTO[]> => {
    const { data } = await api.get<NotificationDTO[]>(`/notifications/user/${userId}`);
    return data;
};

// --- USUARIOS (USERS) ---

// Para actualizar las preferencias de voz o vibración 
export const updateUserService = async (userId: string, userData: { name?: string }): Promise<any> => {
    const { data } = await api.patch(`/users/${userId}`, userData);
    return data;
};