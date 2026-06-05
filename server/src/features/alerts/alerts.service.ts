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
            a.message as description,
            a.latitude,
            a.longitude,

            l.name as location_name,
            l.type

        FROM alerts a
        JOIN locations l
            ON l.id = a.location_id

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