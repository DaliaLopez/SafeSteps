import { useState } from 'react'
import L from 'leaflet' 
import { useMapEvents, Polygon as LeafletPolygon, Polyline, CircleMarker } from 'react-leaflet'

export interface LatLng {
  lat: number;
  lng: number;
}

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

  const handleReset = () => {
    setPoints([])
    onCancel()
  }

  return (

    <>
      {points.length >= 3 && (
        <LeafletPolygon
          positions={points}
          pathOptions={{
            color: '#296BFF',
            fillColor: '#296BFF',
            fillOpacity: 0.2,
            weight: 3,
          }}
        />
      )}

      {points.length > 1 && (
        <Polyline
          positions={[points[points.length - 1], points[0]]}
          pathOptions={{
            color: '#296BFF', 
            weight: 2,
            dashArray: '6, 8',
          }}
        />
      )}

      {points.map((point, index) => (
        <CircleMarker
          key={index}
          center={[point.lat, point.lng]}
          radius={6}
          pathOptions={{
            fillColor: '#296BFF',
            color: 'white',
            weight: 2,
            fillOpacity: 1,
          }}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e);
            },
          }}
        />
      ))}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000 w-auto max-w-[90vw]">
        <div className="bg-white rounded-3xl px-5 py-3 flex items-center gap-3 shadow-xl border border-gray-100 animate-fade-in transition-all">
          
          <span className="text-xs md:text-sm font-semibold text-gray-700 whitespace-normal md:whitespace-nowrap">
            {points.length === 0
              ? 'Instrucciones: Crea todos los puntos en el mapa y luego presiona "Cerrar zona".'
              : `${points.length} punto${points.length > 1 ? 's' : ''} ubicado${points.length > 1 ? 's' : ''}`}
          </span>

          {points.length > 0 && (
            <button
              onClick={() => setPoints((prev) => prev.slice(0, -1))}
              className="px-3 py-1.5 text-xs rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 transition active:scale-95 cursor-pointer"
            >
              Deshacer
            </button>
          )}

          {points.length >= 3 && (
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition active:scale-95 cursor-pointer shadow-md shadow-green-100"
            >
              Cerrar zona
            </button>
          )}

          {points.length > 0 && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs rounded-xl font-medium bg-red-50 hover:bg-red-100 text-red-600 transition active:scale-95 cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

      </div>

    </>

  )
  
}