export interface AccessibilitySettings {
    id: string;
    user_id: string;

    volume: number;
    voice_speed: string;
    auto_repeat: boolean;

    vibration_active: boolean;
    vibration_intensity: string;

    alert_distance: string;
    alert_type: string;

    created_at?: string;
    updated_at?: string;
}

export interface UpdateAccessibilitySettingsDTO {
    user_id: string;

    volume?: number;
    voice_speed?: string;
    auto_repeat?: boolean;

    vibration_active?: boolean;
    vibration_intensity?: string;

    alert_distance?: string;
    alert_type?: string;
}