export interface Alert {
    id: string;
    location_id: string;
    message: string;
    is_active: boolean; 
    created_at: string;
}

// DTO crear alerta manual (admin)
export interface CreateAlertDTO {
    location_id: string;
    message: string;
}