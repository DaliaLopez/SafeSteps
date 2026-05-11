export interface Notification {
    id: string;
    user_id: string;
    alert_id: string;
    delivered_at: string | null;
    created_at: string;
    notified: boolean;
}

export interface CreateNotificationDTO {
    user_id: string;
    alert_id: string;
}