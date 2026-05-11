import api from './api';

import type {
    AccessibilitySettings,
    UpdateAccessibilitySettingsDTO
} from '../types/accessibility-settings.types';

// Obtener settings
export const getAccessibilitySettingsService = async (
    userId: string
): Promise<AccessibilitySettings> => {

    const { data } = await api.get(
        `/accessibility-settings/${userId}`
    );

    return data;
};

// Actualizar settings
export const updateAccessibilitySettingsService = async (
    userId: string,
    settings: UpdateAccessibilitySettingsDTO
): Promise<AccessibilitySettings> => {

    const { data } = await api.put(
        `/accessibility-settings/${userId}`,
        settings
    );

    return data;
};