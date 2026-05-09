import { Polygon as LeafletPolygon, Popup } from 'react-leaflet'
import type { Location } from '../../services/locationsService'

interface PolygonLayerProps {
  locations: Location[]
}

// Convierte el GeoJSON del backend [lng, lat] → [lat, lng] que espera Leaflet
const toLeafletCoords = (coordinates: number[][][]): [number, number][] =>
  coordinates[0].map(([lng, lat]) => [lat, lng])

export const PolygonLayer = ({ locations }: PolygonLayerProps) => {
  return (
    <>
      {locations.map((loc) => (
        <LeafletPolygon
          key={loc.id}
          positions={toLeafletCoords(loc.boundary.coordinates)}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.15,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{loc.name}</strong>
            {loc.description && <><br />{loc.description}</>}
            <br />
            <span className="text-xs text-gray-500">{loc.type}</span>
          </Popup>
        </LeafletPolygon>
      ))}
    </>
  )
}