export interface AccessibilitySettings {
    id: string;
    user_id: string;

    // AUDIO
    volume: number;
    voice_speed: string;
    auto_repeat: boolean;

    // VIBRACIÓN
    vibration_active: boolean;
    vibration_intensity: string;

    // NAVEGACIÓN
    alert_distance: string;
    alert_type: string;

    created_at?: string;
    updated_at?: string;
}

export interface UpdateAccessibilitySettingsDTO {
    volume?: number;
    voice_speed?: string;
    auto_repeat?: boolean;

    vibration_active?: boolean;
    vibration_intensity?: string;

    alert_distance?: string;
    alert_type?: string;
}