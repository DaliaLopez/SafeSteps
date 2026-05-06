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
}

// DTO para crear location
export interface CreateLocationDTO {
    name: string;
    boundary: string; 
    type: LocationType; 
    description?: string;
}

// DTO para verificar ubicación
export interface CheckLocationDTO {
    latitude: number;
    longitude: number;
}