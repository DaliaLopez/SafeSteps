export interface Alert {
    id: string;
    location_id: string;
    message: string;
    latitude?: number;
    longitude?: number;
    is_active: boolean;
    created_at: string;
}

export interface CreateAlertDTO {
    location_id: string;
    message: string;
    latitude?: number;
    longitude?: number;
}