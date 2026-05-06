import type { Request, Response, NextFunction } from 'express'; 
import Boom from '@hapi/boom';
import { authenticateUserService, createUserService } from './auth.service';
import { UserRole } from './auth.types';

export const authenticateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const { email, password } = req.body;
        if (!email || !password) throw Boom.badRequest('Email and password are required');

        const result = await authenticateUserService({ email, password });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const { email, name, password, role } = req.body;

        if (!email || !name || !password || !role) throw Boom.badRequest('Missing fields');

        if (!Object.values(UserRole).includes(role as UserRole)) {
            throw Boom.badRequest('Invalid role');
        }

        const user = await createUserService({ email, name, password, role });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};