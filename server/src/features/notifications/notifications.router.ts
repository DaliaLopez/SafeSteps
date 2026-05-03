import { Router } from 'express';
import {
    createNotificationController,
    markNotificationDeliveredController,
    getUserNotificationHistoryController,
} from './notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.post('/', createNotificationController);
notificationsRouter.patch('/:id/delivered', markNotificationDeliveredController);
notificationsRouter.get('/me', getUserNotificationHistoryController);