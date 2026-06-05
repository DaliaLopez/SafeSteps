import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const blueDotIcon = new L.DivIcon({
  className: 'custom-gps-dot',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  html: `
    <div style="position: relative; width: 24px; height: 24px; display: flex; items-center: center; justify-content: center;">
      <style>
        @keyframes customPulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      </style>
      
      <div style="
        position: absolute; 
        width: 100%; 
        height: 100%; 
        background: #296BFF; 
        border-radius: 50%; 
        animation: customPulse 1.8s ease-out infinite;
      "></div>
      
      <div style="
        position: absolute; 
        top: 4px; 
        left: 4px; 
        width: 16px; 
        height: 16px; 
        background: #296BFF; 
        border: 2.5px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        z-index: 2;
      "></div>
    </div>
  `
})

interface MapViewProps {
  center: [number, number]
  zoom?: number
  children?: React.ReactNode
}

export const MapView = ({ center, zoom = 17, children }: MapViewProps) => {
  const [myPosition, setMyPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!("geolocation" in navigator)) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setMyPosition([latitude, longitude])
      },
      (error) => {
        console.error('Error obteniendo GPS real en MapView:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return (

    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {myPosition && (
        <Marker position={myPosition} icon={blueDotIcon}>
          <Popup>
            <div style={{ textAlign: 'center', padding: '2px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', color: '#296BFF', margin: 0 }}>
                📍 Tu ubicación en tiempo real
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {children}
    </MapContainer>

  )
  
}