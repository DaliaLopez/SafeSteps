import type { Location } from '../../services/locationsService'

interface ZonesSidebarProps {
  locations: Location[]
  drawingMode: boolean
  onStartDrawing: () => void
  onDeleteLocation: (id: string) => void
}

const TYPE_LABELS: Record<string, string> = {
  building: 'Edificio',
  ramp: 'Rampa',
  stairs: 'Escaleras',
  parking: 'Parqueadero',
  other: 'Otro',
}

export const ZonesSidebar = ({
  locations,
  drawingMode,
  onStartDrawing,
  onDeleteLocation,
}: ZonesSidebarProps) => {
  return (
    <div className="absolute top-0 right-0 h-full w-72 z-[1000] flex flex-col bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
      <div className="p-5 flex flex-col flex-1">

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">Zonas del campus</h2>
          <p className="text-xs text-gray-400 mt-0.5">Gestiona las zonas del mapa</p>
        </div>

        <div className="border-t border-gray-100 mb-4" />

        {/* Botón dibujar */}
        <button
          onClick={onStartDrawing}
          disabled={drawingMode}
          className="w-full py-2.5 rounded-xl text-sm font-semibold mb-5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          {drawingMode ? 'Dibujando…' : '+ Dibujar zona'}
        </button>

        {/* Lista de zonas */}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Zonas ({locations.length})
        </h3>

        {locations.length === 0 ? (
          <div className="rounded-xl p-4 text-center border border-dashed border-gray-200">
            <p className="text-xs text-gray-400">No hay zonas creadas aún</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="group rounded-xl p-3 bg-gray-50 border border-gray-100 hover:border-gray-200 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-800 flex-1 truncate">{loc.name}</p>
                  <button
                    onClick={() => onDeleteLocation(loc.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 cursor-pointer"
                    title="Eliminar zona"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-400 ml-[18px] mt-0.5">
                  {TYPE_LABELS[loc.type] ?? loc.type}
                  {loc.description && ` · ${loc.description}`}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}