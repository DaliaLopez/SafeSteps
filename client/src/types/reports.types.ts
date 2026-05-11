/** Alineado con `server/src/features/reports/reports.types.ts` */

export enum ProblemType {
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

export interface ApprovedReport {
  id: string
  description: string
  problem_type: ProblemType
  danger_level: DangerLevel
  location_name: string
  status: ReportStatus
  created_at: string
  latitude: number
  longitude: number
}
