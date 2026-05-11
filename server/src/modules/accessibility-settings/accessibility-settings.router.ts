import { Router } from 'express';

import {
    getAccessibilitySettingsController,
    updateAccessibilitySettingsController
} from './accessibility-settings.controller';

export const accessibilitySettingsRouter = Router();

// Obtener configuración
accessibilitySettingsRouter.get(
    '/:userId',
    getAccessibilitySettingsController
);

// Actualizar configuración
accessibilitySettingsRouter.put(
    '/:userId',
    updateAccessibilitySettingsController
);