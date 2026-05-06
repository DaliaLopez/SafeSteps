import { Router } from 'express';
import {
    createAlertController,
    getAlertByLocationController,
    getAlertsForAccessibilityController,
    deactivateAlertController,
} from './alerts.controller';

export const alertsRouter = Router();

alertsRouter.post('/', createAlertController);
alertsRouter.get('/accessibility', getAlertsForAccessibilityController);
alertsRouter.get('/:location_id', getAlertByLocationController);

// desactivar alerta
alertsRouter.patch('/:location_id/deactivate', deactivateAlertController);