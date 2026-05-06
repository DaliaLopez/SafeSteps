import { Router } from 'express';
import {
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
} from './users.controller';

export const usersRouter = Router();

usersRouter.get('/', getUsersController);
usersRouter.get('/:id', getUserByIdController);
usersRouter.put('/', updateUserController);
usersRouter.delete('/:id', deleteUserController);