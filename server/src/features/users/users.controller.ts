import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
} from './users.service';
import { supabase } from '../../config/supabase';

export const getUsersController = async (_req: Request, res: Response) => {
    const users = await getUsersService();
    res.json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) throw Boom.badRequest('Id is required');

    const user = await getUserByIdService(id as string);
    res.json(user);
};

// users.controller.ts
export const updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        if (!name && !email && !password) {
            throw Boom.badRequest('No data to update');
        }

        // Actualizar en Supabase Auth
        if (password || email) {
            const updateData: any = {};

            if (password) updateData.password = password;
            if (email) updateData.email = email;

            const { error } =
                await supabase.auth.admin.updateUserById(
                    id as string,
                    updateData
                );

            console.log(error);

            if (error) {
                throw Boom.badRequest(error.message);
            }
        }

        // Actualizar PostgreSQL
        const updatedUser = await updateUserService({
            id: id as string,
            name,
            email,
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await deleteUserService(id as string);
    res.json(user);
};