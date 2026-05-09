import { useState } from 'react'
import { MapView } from '../../components/map/MapView'
import { PolygonLayer } from '../../components/map/PolygonLayer'
import { DrawingOverlay } from '../../components/map/DrawingOverlay'
import { ZonesSidebar } from '../../components/map/ZonesSidebar'
import { useLocations, type LatLng } from '../../hooks/useLocations'

const CAMPUS_CENTER: [number, number] = [3.341571, -76.530198]

const ZONE_TYPES = [
  { value: 'building', label: 'Edificio' },
  { value: 'ramp', label: 'Rampa' },
  { value: 'stairs', label: 'Escaleras' },
  { value: 'parking', label: 'Parqueadero' },
  { value: 'other', label: 'Otro' },
]

export default function ZonesPage() {
  const { locations, loading, createLocation, deleteLocation } = useLocations()

  const [drawingMode, setDrawingMode] = useState(false)
  const [pendingPoints, setPendingPoints] = useState<LatLng[] | null>(null)

  // Modal form state
  const [zoneName, setZoneName] = useState('')
  const [zoneType, setZoneType] = useState('building')
  const [zoneDescription, setZoneDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrawingSave = (points: LatLng[]) => {
    setPendingPoints(points)
    setDrawingMode(false)
  }

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pendingPoints || !zoneName.trim()) return
    setSaving(true)
    setError(null)
    const success = await createLocation(zoneName.trim(), zoneType, pendingPoints, zoneDescription || undefined)
    if (success) {
      setPendingPoints(null)
      setZoneName('')
      setZoneType('building')
      setZoneDescription('')
    } else {
      setError('Error al guardar la zona, intenta de nuevo')
    }
    setSaving(false)
  }

  const handleCancelSave = () => {
    setPendingPoints(null)
    setZoneName('')
    setZoneType('building')
    setZoneDescription('')
    setError(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 animate-pulse" />
          <p className="text-sm text-gray-400">Cargando mapa…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen">

      {/* Mapa — deja espacio para el sidebar */}
      <div className="absolute inset-0" style={{ right: '288px' }}>
        <MapView center={CAMPUS_CENTER}>
          <PolygonLayer locations={locations} />
          {drawingMode && (
            <DrawingOverlay
              onSave={handleDrawingSave}
              onCancel={() => setDrawingMode(false)}
            />
          )}
        </MapView>
      </div>

      {/* Sidebar */}
      <ZonesSidebar
        locations={locations}
        drawingMode={drawingMode}
        onStartDrawing={() => setDrawingMode(true)}
        onDeleteLocation={deleteLocation}
      />

      {/* Modal para nombrar la zona */}
      {pendingPoints && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-white rounded-2xl p-7 shadow-2xl">

            <h3 className="text-lg font-bold text-gray-900 mb-1">Guardar zona</h3>
            <p className="text-sm text-gray-400 mb-5">
              {pendingPoints.length} puntos seleccionados
            </p>

            <form onSubmit={handleSaveZone} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Nombre de la zona</label>
                <input
                  type="text"
                  placeholder="Ej: Bloque A, Rampa norte..."
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={zoneType}
                  onChange={(e) => setZoneType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                >
                  {ZONE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Descripción breve..."
                  value={zoneDescription}
                  onChange={(e) => setZoneDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={handleCancelSave}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !zoneName.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}