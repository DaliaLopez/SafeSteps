import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
    createAlertService,
    getAlertByLocationService,
    getAlertsForAccessibilityService,
    deactivateAlertService,
} from './alerts.service';

// Crear alerta manual (SOLO ADMIN)

export const createAlertController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { location_id, message } = req.body;

        if (!location_id || !message) {
            throw Boom.badRequest('Missing fields');
        }

        const alert = await createAlertService({ location_id, message });

        res.status(201).json(alert);
    } catch (error) {
        next(error);
    }
};


// Obtener alerta por ubicación
export const getAlertByLocationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { location_id } = req.params;

        if (!location_id) throw Boom.badRequest('Location id is required');

        const alert = await getAlertByLocationService(location_id as string);

        res.json(alert);
    } catch (error) {
        next(error);
    }
};


// Lista general de alertas activas
export const getAlertsForAccessibilityController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const alerts = await getAlertsForAccessibilityService();
        res.json(alerts);
    } catch (error) {
        next(error);
    }
};


// Desactivar alerta
export const deactivateAlertController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { location_id } = req.params;

        if (!location_id) throw Boom.badRequest('Location id is required');

        const result = await deactivateAlertService(location_id as string);

        res.json(result);
    } catch (error) {
        next(error);
    }
};