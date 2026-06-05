import { pool } from '../../config/database';
import Boom from '@hapi/boom';
import type { CreateLocationDTO, CheckLocationDTO } from './locations.types';

// Obtener todas las zonas registradas en el sistema
// Esto incluye edificios, rampas, escaleras, etc. Se usa para pintar el mapa completo en el frontend

export const getLocationsService = async () => {
    const result = await pool.query(
        `SELECT 
            id,
            name,
            type,
            description,

            ST_AsGeoJSON(boundary::geometry) as boundary,

            ST_Y(ST_Centroid(boundary::geometry)) as latitude,
            ST_X(ST_Centroid(boundary::geometry)) as longitude

        FROM locations
        WHERE is_deleted = false`
    );

    return result.rows;
};



// Crear una nueva zona (ej: un edificio o una rampa)
// Aquí el admin define zonas FIJAS del sistema 

export const createLocationService = async (location: CreateLocationDTO) => {
    try {
        const result = await pool.query(
            `INSERT INTO locations (name, boundary, type, description)
            VALUES ($1, $2::geography, $3, $4)
            RETURNING *`,
            [
                location.name,
                location.boundary, // polígono (área del mapa)
                location.type,     // tipo: building, ramp, stairs, etc
                location.description || null,
            ]
        );

        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw Boom.badRequest('Error creating location');
    }
};


// Saber en qué zona está el usuario
// Compara ese punto con TODOS los polígonos (locations) Si cae dentro de uno → devuelve ese lugar

export const checkIfUserIsInsideService = async (
    coords: CheckLocationDTO
) => {
    const result = await pool.query(
        `SELECT name, description, type  
        FROM locations 
        WHERE is_deleted = false 
        AND ST_Intersects(
            boundary,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        )`,
        [
            coords.longitude, 
            coords.latitude,  
        ]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

// Eliminar zona (solo admin)
export const deleteLocationService = async (id: string) => {
    try {
        const result = await pool.query(
            `UPDATE locations SET is_deleted = true WHERE id = $1 RETURNING *`,
            [id]
        );

        return result.rows[0];

    } catch (error: any) {
        console.error(error);
        throw Boom.internal('Error deleting location'); 
    }

};