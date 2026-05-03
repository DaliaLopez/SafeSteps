import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    createNotificationService,
    markNotificationDeliveredService,
    getUserNotificationHistoryService,
} from './notifications.service';

// Crear notificación
export const createNotificationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userid = (req as any).user?.id;
        const { alert_id } = req.body;

        if (!userid || !alert_id) {
            throw Boom.badRequest('Missing fields');
        }

        const notification = await createNotificationService({
            user_id: userid, // 🔥 CAMBIO
            alert_id,
        });

        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

// Marcar como entregada
export const markNotificationDeliveredController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) throw Boom.badRequest('Id is required');

        const notification = await markNotificationDeliveredService(id as string);

        res.json(notification);
    } catch (error) {
        next(error);
    }
};

// Historial del usuario
export const getUserNotificationHistoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userid = (req as any).user?.id;

        if (!userid) {
            throw Boom.unauthorized('User not authenticated');
        }

        const history = await getUserNotificationHistoryService(userid);

        res.json(history);
    } catch (error) {
        next(error);
    }
};