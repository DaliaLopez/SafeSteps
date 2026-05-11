import type {
    Request,
    Response,
    NextFunction
} from 'express';

import {
    getAccessibilitySettingsService,
    updateAccessibilitySettingsService
} from './accessibility-settings.service';

// Obtener configuración
export const getAccessibilitySettingsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { userId } = req.params;

        const settings =
            await getAccessibilitySettingsService(userId as string);

        res.json(settings);

    } catch (error) {
        next(error);
    }
};

// Actualizar configuración
export const updateAccessibilitySettingsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { userId } = req.params;

        const updated =
            await updateAccessibilitySettingsService({
                user_id: userId,
                ...req.body
            });

        res.json(updated);

    } catch (error) {
        next(error);
    }
};