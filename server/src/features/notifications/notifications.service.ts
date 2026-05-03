import { pool } from '../../config/database';
import type { CreateNotificationDTO } from './notifications.types';

// Crear notificación para un usuario
// Se usa cuando el usuario entra a una zona con alerta
export const createNotificationService = async (
    data: CreateNotificationDTO
) => {
    // ANTI-SPAM 
    // Evita enviar la misma alerta muchas veces seguidas
    const lastNotification = await pool.query(
        `SELECT * FROM notifications 
        WHERE user_id = $1 
        AND alert_id = $2 
        AND created_at > NOW() - INTERVAL '3 minutes'
        ORDER BY created_at DESC
        LIMIT 1`,
        [data.user_id, data.alert_id]
    );

    if (lastNotification.rows.length > 0) {
        return lastNotification.rows[0];
    }

    const result = await pool.query(
        `INSERT INTO notifications (user_id, alert_id)
        VALUES ($1, $2)
        RETURNING *`,
        [data.user_id, data.alert_id]
    );

    return result.rows[0];
};

// Marcar como entregada (cuando el celular la recibe)
export const markNotificationDeliveredService = async (id: string) => {
    const result = await pool.query(
        `UPDATE notifications 
        SET delivered_at = CURRENT_TIMESTAMP, notified = true 
        WHERE id = $1 
        RETURNING *`,
        [id]
    );

    return result.rows[0];
};

// Historial del usuario
// Para mostrar “alertas recientes”
export const getUserNotificationHistoryService = async (userId: string) => {
    const result = await pool.query(
        `SELECT n.*, a.message 
        FROM notifications n
        JOIN alerts a ON n.alert_id = a.id
        WHERE n.user_id = $1
        ORDER BY n.created_at DESC`,
        [userId]
    );

    return result.rows;
};