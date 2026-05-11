import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';
import { pool } from '../../config/database';
import type { AuthenticateUserDTO, CreateUserDTO } from './auth.types';

import { createUserDBService } from '../users/users.service';

// Login
export const authenticateUserService = async (
    credentials: AuthenticateUserDTO
) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) {
        throw Boom.unauthorized(error.message);
    }

    const dbUser = await pool.query(
        `SELECT id, name, role, email FROM users WHERE id = $1`,
        [data.user?.id]
    );

    if (dbUser.rows.length === 0) {
        throw Boom.notFound('User not found in database');
    }

    return {
        session: data.session,
        user: dbUser.rows[0],
    };
};

// Registro
export const createUserService = async (user: CreateUserDTO) => {
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
    });

    if (error) {
        throw Boom.badRequest(error.message);
    }

    const authUser = data.user;

    if (!authUser) {
        throw Boom.internal('Error creating user in auth');
    }

    try {
        const newUser = await createUserDBService({
            id: authUser.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        await pool.query(
            `
                INSERT INTO accessibility_settings (user_id)
                VALUES ($1)
            `,
            [authUser.id]
        );

        return newUser;
    } catch (err) {
        console.error(err);
        throw Boom.internal('Database error');
    }
};

export const updateAuthService = async (userId: string, data: { email?: string, password?: string }) => {
    const { data: user, error } = await supabase.auth.admin.updateUserById(userId, {
        email: data.email,
        password: data.password
    });

    if (error) throw Boom.badRequest(error.message);
    return user;
};