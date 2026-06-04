import { useState } from 'react'
import { useMapEvents, Polygon as LeafletPolygon, Marker } from 'react-leaflet'
import L from 'leaflet'
export interface LatLng {
  lat: number;
  lng: number;
}

const pointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface DrawingOverlayProps {
  onSave: (points: LatLng[]) => void
  onCancel: () => void
}

export const DrawingOverlay = ({ onSave, onCancel }: DrawingOverlayProps) => {
  const [points, setPoints] = useState<LatLng[]>([])

  useMapEvents({
    click(e) {
      setPoints((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }])
    },
  })

  const handleSave = () => {
    if (points.length >= 3) {
      onSave(points)
      setPoints([])
    }
  }

  const handleCancel = () => {
    setPoints([])
    onCancel()
  }

  return (
    <>
      {points.map((point, idx) => (
        <Marker key={idx} position={[point.lat, point.lng]} icon={pointIcon} />
      ))}

      {points.length >= 3 && (
        <LeafletPolygon
          positions={points.map((p) => [p.lat, p.lng] as [number, number])}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.12,
            dashArray: '6, 10',
            weight: 2,
          }}
        />
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000">
        <div className="bg-white rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg border border-gray-200">
          <span className="text-sm text-gray-500">
            {points.length === 0
              ? 'Haz clic en el mapa para agregar puntos'
              : `${points.length} punto${points.length > 1 ? 's' : ''}`}
          </span>

          {points.length > 0 && (
            <button
              onClick={() => setPoints((prev) => prev.slice(0, -1))}
              className="px-3 py-1.5 text-xs rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition cursor-pointer"
            >
              Deshacer
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={points.length < 3}
            className="px-4 py-1.5 text-xs rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Guardar zona
          </button>

          <button
            onClick={handleCancel}
            className="px-4 py-1.5 text-xs rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}