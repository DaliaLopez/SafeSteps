import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MapContainer, TileLayer, Polygon as ExistingPolygon, Popup } from "react-leaflet";
import { DrawingOverlay } from "../../components/map/DrawingOverlay";
import LocationTypeSelector from "../../components/admin/LocationTypeSelector";
import { DescriptionInput } from "../../components/student/create_report/DescriptionInput";
import { createLocationService, getLocationsService } from "../../services/locations.service";
import { LocationType } from "../../types/accessibility.types";

interface LatLng {
  lat: number;
  lng: number;
}

export default function AddZonePage() {
  const navigate = useNavigate();

  const [zoneName, setZoneName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<LocationType | null>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<LatLng[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [existingZones, setExistingZones] = useState<any[]>([]);
  const [showMapSuccessNotice, setShowMapSuccessNotice] = useState(false);
  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLocationsService()
      .then(setExistingZones)
      .catch((err) => console.error("Error cargando zonas históricas:", err));
  }, []);

  const convertToWKT = (points: LatLng[]) => {
    if (points.length < 3) return "";
    const closedPoints = [...points, points[0]];
    const coordinates = closedPoints
      .map((point) => `${point.lng} ${point.lat}`)
      .join(", ");
    return `POLYGON((${coordinates}))`;
  };

  const handleSaveZone = async () => {
    if (!zoneName.trim()) return alert("Por favor, ingresa el nombre de la zona");
    if (!selectedType) return alert("Por favor, selecciona un tipo de zona");
    if (boundaryPoints.length < 3) return alert("Por favor, dibuja un polígono de al menos 3 puntos en el mapa");

    setIsSaving(true);
    const wktBoundary = convertToWKT(boundaryPoints);

    try {
      await createLocationService({
        name: zoneName,
        boundary: wktBoundary,
        type: selectedType,
        description: description || undefined,
      });

      alert("¡Zona creada con éxito!");
      navigate("/admin/dashboard"); 
    } catch (error) {
      console.error(error);
      alert("Error al guardar la zona en el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#F9FAF7] pb-12">

      <header className="p-6 max-w-md mx-auto flex items-center gap-4 bg-[#F9FAF7]">

        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white hover:bg-gray-50 rounded-2xl shadow-sm border border-gray-100 transition active:scale-95"
        >

          <ArrowLeft size={22} className="text-gray-800" />

        </button>

        <h2 className="text-2xl font-bold text-black">Agregar zona</h2>

      </header>

      <main className="max-w-md mx-auto px-6 space-y-6">

        <div className="bg-white p-4 rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">

          <div className="w-full h-80 rounded-[30px] overflow-hidden relative shadow-inner">
            <MapContainer
              center={[3.341, -76.530]}
              zoom={17}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {existingZones && existingZones.map((zone) => {
                const lat = Number(zone.latitude);
                const lng = Number(zone.longitude);
                if (isNaN(lat) || isNaN(lng)) return null;

                const boundsPoints: [number, number][] = [
                  [lat + 0.00025, lng - 0.00025],
                  [lat + 0.00025, lng + 0.00025],
                  [lat - 0.00025, lng + 0.00025],
                  [lat - 0.00025, lng - 0.00025],
                ];

                return (
                  <ExistingPolygon
                    key={zone.id || zone.name}
                    positions={boundsPoints}
                    pathOptions={{
                      color: '#9CA3AF',
                      fillColor: '#6B7280',
                      fillOpacity: 0.15,
                      weight: 1.5,
                      dashArray: '3, 5'
                    }}
                  >
                    <Popup>

                      <div className="p-1 text-xs">
                        <p className="font-bold text-gray-900">🏢 {zone.name}</p>
                        <p className="text-gray-500 text-[10px]">Tipo: {zone.type}</p>
                      </div>

                    </Popup>

                  </ExistingPolygon>
                );
              })}

              <DrawingOverlay
                onSave={(points: LatLng[]) => {
                  setBoundaryPoints(points);
                  setShowMapSuccessNotice(true);
                  
                  setTimeout(() => {
                    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                onCancel={() => {
                  setBoundaryPoints([]);
                  setShowMapSuccessNotice(false);
                }}
              />
            </MapContainer>

          </div>

        </div>

        {showMapSuccessNotice && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 animate-fade-in flex flex-col gap-1">
            
            <span className="font-bold text-sm flex items-center gap-2">
              ¡Estructura del mapa delimitada!
            </span>

            <span className="text-xs text-emerald-700">
              Por favor, completa los campos de texto que aparecen abajo para registrar el nombre y tipo de zona en el campus.
            </span>

          </div>
        )}

        <div ref={formSectionRef} className="space-y-6 transition-all">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">

            <h3 className="mb-3 font-medium text-gray-700 text-sm">
              Nombre de la zona
            </h3>

            <input
              type="text"
              placeholder="Ej: Zona de construcción bloque B"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#F7F7F5] outline-none text-sm border-none focus:ring-1 focus:ring-blue-500"
            />

          </div>

          <LocationTypeSelector
            selectedType={selectedType}
            onSelect={setSelectedType}
          />

          <DescriptionInput
            value={description}
            onChange={setDescription}
          />

        </div>

        <button
          onClick={handleSaveZone}
          disabled={isSaving || boundaryPoints.length < 3}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-4 rounded-3xl shadow-lg shadow-blue-100 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          {isSaving ? "Guardando estructura..." : "Registrar zona"}
        </button>

      </main>

    </div>

  );
  
}