import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import {
  DangerLevel,
  ReportStatus,
  ProblemType,
  type ReportDTO,
} from '../../../types/reports.types'


export type { ApprovedReport } from '../../../types/reports.types'

const PROBLEM_LABELS: Record<ProblemType, string> = {
  [ProblemType.OBSTACLE]: 'Obstáculo',
  [ProblemType.DAMAGED_STAIRS]: 'Escaleras dañadas',
  [ProblemType.SLIPPERY_RAMP]: 'Rampa resbaladiza',
  [ProblemType.BROKEN_ELEVATOR]: 'Elevador dañado',
  [ProblemType.BLOCKED_PATH]: 'Camino bloqueado',
}


const highIcon = new L.DivIcon({
  className: '',
  iconSize: [44, 52],
  iconAnchor: [22, 52],
  popupAnchor: [0, -56],
  html: `
    <div style="position:relative;width:44px;height:52px">
      <div style="position:absolute;bottom:0;left:50%;width:44px;height:44px;background:#EF4444;border-radius:50% 50% 50% 0;transform:translateX(-50%) rotate(-45deg);box-shadow:0 3px 12px rgba(239,68,68,0.45)"></div>
      <div style="position:absolute;bottom:8px;left:0;right:0;display:flex;align-items:center;justify-content:center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
    </div>`,
})

const mediumIcon = new L.DivIcon({
  className: '',
  iconSize: [44, 52],
  iconAnchor: [22, 52],
  popupAnchor: [0, -56],
  html: `
    <div style="position:relative;width:44px;height:52px">
      <div style="position:absolute;bottom:0;left:50%;width:44px;height:44px;background:#F97316;border-radius:50% 50% 50% 0;transform:translateX(-50%) rotate(-45deg);box-shadow:0 3px 12px rgba(249,115,22,0.45)"></div>
      <div style="position:absolute;bottom:8px;left:0;right:0;display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1">🚧</div>
    </div>`,
})

const lowIcon = new L.DivIcon({
  className: '',
  iconSize: [44, 52],
  iconAnchor: [22, 52],
  popupAnchor: [0, -56],
  html: `
    <div style="position:relative;width:44px;height:52px">
      <div style="position:absolute;bottom:0;left:50%;width:44px;height:44px;background:#EAB308;border-radius:50% 50% 50% 0;transform:translateX(-50%) rotate(-45deg);box-shadow:0 3px 12px rgba(234,179,8,0.4)"></div>
      <div style="position:absolute;bottom:8px;left:0;right:0;display:flex;align-items:center;justify-content:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
    </div>`,
})

const iconByLevel: Record<DangerLevel, L.DivIcon> = {
  [DangerLevel.HIGH]:   highIcon,
  [DangerLevel.MEDIUM]: mediumIcon,
  [DangerLevel.LOW]:    lowIcon,
}

const levelLabel: Record<DangerLevel, string> = {
  [DangerLevel.HIGH]:   'Peligro alto',
  [DangerLevel.MEDIUM]: 'Peligro medio',
  [DangerLevel.LOW]:    'Aviso menor',
}

const levelColor: Record<DangerLevel, string> = {
  [DangerLevel.HIGH]:   '#EF4444',
  [DangerLevel.MEDIUM]: '#F97316',
  [DangerLevel.LOW]:    '#EAB308',
}

interface ReportMarkersProps {
  reports: ReportDTO[]
}

export const ReportMarkers = ({ reports }: ReportMarkersProps) => {
  const visible = reports.filter((r) => r.status === ReportStatus.APPROVED)

  return (
    <>
      {visible.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={iconByLevel[report.danger_level]}
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <p style={{ fontWeight: 700, marginBottom: 4, color: levelColor[report.danger_level] }}>
                {levelLabel[report.danger_level]}
              </p>
              <p style={{ fontWeight: 600, marginBottom: 2 }}>
                {PROBLEM_LABELS[report.problem_type]}
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
                {report.description}
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                📍 {report.location_name}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}