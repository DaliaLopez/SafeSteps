export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface UpdateUserDTO {
    id: string;
    name?: string;
    email?: string;
    password?: string;
}

export enum LocationType {
    BUILDING = 'building',
    RAMP = 'ramp',
    STAIRS = 'stairs',
    BATHROOM = 'bathroom',
    CAFETERIA = 'cafeteria',
    ELEVATOR = 'elevator',
    WALKWAY = 'walkway',
}

export interface Location {
    id: string;
    name: string;
    type: LocationType;
    description?: string;
    boundary: string; 
}

export interface CheckLocationDTO {
    latitude: number;
    longitude: number;
}

export interface Alert {
    id: string;
    location_id: string;
    message: string;
    is_active: boolean;
    created_at: string;
    
    building_name?: string; 
    type?: LocationType;
}

export interface NotificationDTO {
    id: string;
    user_id: string;
    alert_id: string;
    delivered_at: string | null;
    created_at: string;
    notified: boolean;
    message?: string; 
}

export interface CreateNotificationDTO {
    user_id: string;
    alert_id: string;
}