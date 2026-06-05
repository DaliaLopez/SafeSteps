import { pool } from '../../config/database';
import type { CreateAlertDTO } from './alerts.types';

export const createAlertService = async (alert: CreateAlertDTO) => {
    const result = await pool.query(
        `
        INSERT INTO alerts (
            location_id,
            message,
            latitude,
            longitude
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            alert.location_id,
            alert.message,
            alert.latitude ?? null,
            alert.longitude ?? null
        ]
    );

    return result.rows[0];
};

export const getAlertByLocationService = async (locationId: string) => {
    const result = await pool.query(
        `SELECT a.id, a.message, l.name as building_name
        FROM alerts a
        JOIN locations l ON a.location_id = l.id
        WHERE a.location_id = $1
        AND a.is_active = true 
        ORDER BY a.created_at DESC
        LIMIT 1`,
        [locationId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
};

export const getAlertsForAccessibilityService = async () => {
    const result = await pool.query(
        `
        SELECT
            a.id,
            a.location_id,
            a.message as description,
            a.latitude,
            a.longitude,
            l.name as location_name,
            -- 🏢 Renombramos l.type para que no pise la variable 'type' de la alerta en el frontend
            l.type as location_fixed_type,
            -- 🛡️ Si viene de un reporte usamos su tipo, si es alerta manual del admin va como 'obstacle'
            COALESCE(r.problem_type, 'obstacle') as problem_type,
            -- 🚨 Si no hay reporte asociado, le asignamos riesgo medio automático para la locución
            COALESCE(r.danger_level, 'medium') as danger_level
        FROM alerts a
        JOIN locations l
            ON l.id = a.location_id
        LEFT JOIN reports r 
            ON r.description = a.message -- Acople seguro si report_id viene null
        WHERE a.is_active = true
        ORDER BY l.name ASC
        `
    );

    return result.rows;
};

export const deactivateAlertService = async (locationId: string) => {
    const result = await pool.query(
        `UPDATE alerts 
        SET is_active = false
        WHERE location_id = $1
        RETURNING *`,
        [locationId]
    );

    return result.rows;
};