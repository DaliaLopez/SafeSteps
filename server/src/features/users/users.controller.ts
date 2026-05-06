import type { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
} from './users.service';

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

export const updateUserController = async (req: Request, res: Response) => {
    const { id, name } = req.body;

    if (!id || !name) throw Boom.badRequest('Missing data');

    const user = await updateUserService({ id, name });
    res.json(user);
};

export const deleteUserController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await deleteUserService(id as string);
    res.json(user);
};