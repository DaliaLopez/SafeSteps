import { useEffect, useState } from 'react'
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

  // 🌟 MODO DIBUJO LIMPIO:
  // Cuando entras a modo dibujo, le metemos una clase al contenedor del mapa general.
  // Esto nos permite apagar las zonas viejas de fondo con precisión quirúrgica
  // SIN tocar absolutamente nada de lo que tú estás dibujando en tiempo real.
  useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      mapContainer.classList.add('modo-dibujo-activo');
    }

    // Insertamos un estilo que solo afecte a los elementos del mapa base
    const style = document.createElement('style');
    style.id = 'filtro-dibujo-limpio';
    style.innerHTML = `
      /* Oculta las zonas creadas previamente que están en los otros componentes padres */
      .modo-dibujo-activo .leaflet-overlay-pane svg path:not(.dibujo-nuevo) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Cuando guardas o cancelas, limpiamos las clases y todo vuelve a la normalidad
    return () => {
      if (mapContainer) {
        mapContainer.classList.remove('modo-dibujo-activo');
      }
      const existingStyle = document.getElementById('filtro-dibujo-limpio');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  // 🎯 CAPTURA DE CLICS REPARADA:
  const map = useMapEvents({
    click(e) {
      // 🌟 EL FIX DEFINITIVO CONTRA EL DESFASE:
      // Obliga a Leaflet a recalcular sus márgenes reales en la pantalla antes de guardar el punto.
      // Esto elimina los saltos o desvíos causados por headers flotantes o scroll en la página.
      map.invalidateSize();

      setPoints((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
    },
  });

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
      {/* 🔵 El polígono que se va armando con tus clics */}
      {points.length >= 3 && (
        <LeafletPolygon
          positions={points}
          pathOptions={{
            className: 'dibujo-nuevo', // 👈 Esta clase le dice al CSS: "¡A mí no me borres!"
            color: '#296BFF',
            fillColor: '#296BFF',
            fillOpacity: 0.2,
            weight: 3,
          }}
        />
      )}

      {/* 📐 La línea punteada que une el último punto con el primero */}
      {points.length > 1 && (
        <Polyline
          positions={[points[points.length - 1], points[0]]}
          pathOptions={{
            className: 'dibujo-nuevo', // 👈 Protegido contra el filtro
            color: '#296BFF', 
            weight: 2,
            dashArray: '6, 8',
          }}
        />
      )}

      {/* 🔴 Los círculos (nodos) de cada esquina que vas marcando */}
      {points.map((point, index) => (
        <CircleMarker
          key={index}
          center={[point.lat, point.lng]}
          radius={6}
          pathOptions={{
            className: 'dibujo-nuevo', // 👈 Protegido contra el filtro
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

      {/* Caja de herramientas flotante */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000 w-auto max-w-[90vw]">
        <div className="bg-white rounded-3xl px-5 py-3 flex items-center gap-3 shadow-xl border border-gray-100 animate-fade-in transition-all">
          
          <span className="text-xs md:text-sm font-semibold text-gray-700">
            {points.length === 0
              ? 'Instrucciones: Crea los puntos en el mapa y presiona "Cerrar zona".'
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
              className="px-4 py-1.5 text-xs rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition active:scale-95 cursor-pointer shadow-md"
            >
              Cerrar zona
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs rounded-xl font-medium bg-red-50 hover:bg-red-100 text-red-600 transition active:scale-95 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}