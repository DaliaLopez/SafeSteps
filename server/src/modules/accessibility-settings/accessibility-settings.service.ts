import { pool } from '../../config/database';
import Boom from '@hapi/boom';

import type {
    AccessibilitySettings,
    UpdateAccessibilitySettingsDTO
} from './accessibility-settings.types';

// Obtener configuración
export const getAccessibilitySettingsService = async (
    userId: string
): Promise<AccessibilitySettings> => {

    const result = await pool.query(
        `
        SELECT *
        FROM accessibility_settings
        WHERE user_id = $1
        `,
        [userId]
    );

    if (result.rows.length === 0) {
        throw Boom.notFound('Settings not found');
    }

    return result.rows[0];
};

// Actualizar configuración
export const updateAccessibilitySettingsService = async (
    settings: UpdateAccessibilitySettingsDTO
): Promise<AccessibilitySettings> => {

    const result = await pool.query(
        `
        UPDATE accessibility_settings
        SET
            volume = COALESCE($2, volume),
            voice_speed = COALESCE($3, voice_speed),
            auto_repeat = COALESCE($4, auto_repeat),

            vibration_active = COALESCE($5, vibration_active),
            vibration_intensity = COALESCE($6, vibration_intensity),

            alert_distance = COALESCE($7, alert_distance),
            alert_type = COALESCE($8, alert_type),

            updated_at = CURRENT_TIMESTAMP

        WHERE user_id = $1

        RETURNING *
        `,
        [
            settings.user_id,

            settings.volume,
            settings.voice_speed,
            settings.auto_repeat,

            settings.vibration_active,
            settings.vibration_intensity,

            settings.alert_distance,
            settings.alert_type
        ]
    );

    if (result.rows.length === 0) {
        throw Boom.notFound('Settings not found');
    }

    return result.rows[0];
};