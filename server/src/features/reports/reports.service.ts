import { pool } from '../../config/database';
import Boom from '@hapi/boom';
import type {
    CreateReportDTO,
    UpdateReportStatusDTO,
} from './reports.types';

// Obtener todos los reportes (debug/admin)
export const getReportsService = async () => {
    const result = await pool.query(`
        SELECT *,
            ST_Y(location::geometry) as latitude,
            ST_X(location::geometry) as longitude
        FROM reports
    `)
    return result.rows
}

// Obtener un reporte específico
export const getReportByIdService = async (id: string) => {
    const result = await pool.query(
        `SELECT * FROM reports WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw Boom.notFound('Report not found');
    }

    return result.rows[0];
};

// Lista de pendientes para el admin
// Aquí es donde el admin decide aprobar o rechazar
export const getPendingReportsService = async () => {
    const result = await pool.query(`
        SELECT r.*,
            ST_Y(r.location::geometry) as latitude,
            ST_X(r.location::geometry) as longitude,
            u.name as reporter_name 
        FROM reports r
        JOIN users u ON r.user_id = u.id
        WHERE r.status = 'Pendiente'
        ORDER BY r.created_at ASC
    `)
    return result.rows
}

// Crear reporte (lo hace el usuario)
// Ej: "hay una escalera dañada aquí"
// Guarda un PUNTO en el mapa (no área)
export const createReportService = async (report: CreateReportDTO) => {
    try {
        const result = await pool.query(
            `INSERT INTO reports(
                user_id, 
                description, 
                problem_type, 
                danger_level, 
                location, 
                location_name
            ) 
            VALUES (
                $1, $2, $3, $4, 
                ST_SetSRID(ST_MakePoint($5, $6), 4326)::geography, 
                COALESCE(
                    (
                        SELECT name FROM locations 
                        WHERE ST_Intersects(boundary, ST_SetSRID(ST_MakePoint($5, $6), 4326)::geography)
                        LIMIT 1
                    ),
                    $7, -- Si no hay intersección, usa lo que el usuario escribió
                    'Ubicación externa' -- Si el usuario no escribió nada, usa este genérico
                )
            ) 
            RETURNING *`,
            [
                report.user_id,
                report.description,
                report.problem_type,
                report.danger_level,
                report.longitude,    // $5
                report.latitude,     // $6
                report.location_name // $7
            ]
        );

        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw Boom.badRequest('Error creating report');
    }
};

// Cambiar estado del reporte
// Admin decide: Pendiente → Aprobado / Rechazado
export const updateReportStatusService = async (
    data: UpdateReportStatusDTO
) => {
    const result = await pool.query(
        `UPDATE reports SET status = $1 WHERE id = $2 RETURNING *`,
        [data.status, data.id]
    );

    return result.rows[0];
};

// Convierte un reporte aprobado en una ALERTA REAL
export const promoteReportToAlertService = async (reportId: string) => {
    const result = await pool.query(
        `INSERT INTO alerts (location_id, message)
        SELECT (
            SELECT id FROM locations l
            ORDER BY ST_Distance(l.boundary, r.location) ASC
            LIMIT 1
        ), r.description
        FROM reports r
        WHERE r.id = $1
        AND r.status = 'Aprobado'
        RETURNING *`,
        [reportId]
    );

    return result.rows[0];
};

// Si ya no hay el problema en ese punto resuelve el problema 
export const resolveReportService = async (reportId: string) => {
    try {
        // 1. marcar como resuelto
        await pool.query(
            `UPDATE reports SET status = 'Resuelto' WHERE id = $1`,
            [reportId]
        );

        // 2. apagar la alerta asociada
        await pool.query(
            `UPDATE alerts 
            SET is_active = false
            WHERE location_id IN (
                SELECT l.id
                FROM reports r, locations l
                WHERE r.id = $1
                AND ST_Intersects(l.boundary, r.location)
            )`,
            [reportId]
        );

        return { message: 'Reporte resuelto y alerta desactivada' };
    } catch (error) {
        console.error(error);
        throw Boom.badRequest('Error resolving report');
    }
};

export const getReportsByUserService = async (userId: string) => {
    const result = await pool.query(
        `SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
};

// reports.service.ts
export const getUserReportStatsService = async (userId: string) => {
    const result = await pool.query(
        `SELECT 
            COUNT(*) FILTER (WHERE status = 'Aprobado') as aprobados,
            COUNT(*) FILTER (WHERE status = 'Pendiente') as pendientes,
            COUNT(*) FILTER (WHERE status = 'Rechazado') as rechazados
        FROM reports 
        WHERE user_id = $1`,
        [userId]
    );

    // Convertimos los strings que devuelve Postgres a números
    const stats = result.rows[0];
    return {
        aprobados: parseInt(stats.aprobados),
        pendientes: parseInt(stats.pendientes),
        rechazados: parseInt(stats.rechazados)
    };
};