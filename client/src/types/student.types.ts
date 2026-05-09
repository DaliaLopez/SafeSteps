export enum Problem{
    OBSTACLE = 'obstacle',
    DAMAGED_STAIRS = 'damaged_stairs',
    SLIPPERY_RAMP = 'slippery_ramp',
    BROKEN_ELEVATOR = 'broken_elevator',
    BLOCKED_PATH = 'blocked_path',
}

export enum DangerLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum ReportStatus {
    PENDING = 'Pendiente',
    APPROVED = 'Aprobado',
    REJECTED = 'Rechazado',
    RESOLVED = 'Resuelto',
}

export interface CheckLocationDTO {
    latitude: number;
    longitude: number;
}

export interface CreateReportDTO {
    user_id: string;
    description: string;
    problem_type: Problem;
    danger_level: DangerLevel;
    latitude: number;
    longitude: number;
}

export interface ReportDTO {
    id: string;
    user_id: string;
    description: string;
    problem_type: Problem;
    danger_level: DangerLevel;
    location: string; 
    status: ReportStatus;
    created_at: string;
}

export interface NotificationDTO {
    id: string;
    user_id: string;
    alert_id: string;
    message?: string; 
    delivered_at: string | null;
    created_at: string;
    notified: boolean;
}

export interface LocationInfoDTO {
    name: string;
    description?: string;
    type: string;
}