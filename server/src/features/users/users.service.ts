import { pool } from '../../config/database';
import Boom from '@hapi/boom';
import type { CreateUserDBDTO, UpdateUserDTO } from './users.types';

// obtener todos los usuarios
export const getUsersService = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
};

// obtener por id
export const getUserByIdService = async (id: string) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw Boom.notFound('User not found');
    }

    return result.rows[0];
};

// Crear usuario en la base de datos
export const createUserDBService = async (user: CreateUserDBDTO) => {
    const result = await pool.query(
        `INSERT INTO users (id, name, role, email)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [user.id, user.name, user.role, user.email]
    );

    return result.rows[0];
};

// actualizar nombre del usuario
export const updateUserService = async (user: UpdateUserDTO) => {
    const result = await pool.query(
        `UPDATE users SET name = $2 WHERE id = $1 RETURNING *`,
        [user.id, user.name]
    );

    return result.rows[0];
};

// eliminar usuario
export const deleteUserService = async (id: string) => {
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [id]
    );

    return result.rows[0];
};