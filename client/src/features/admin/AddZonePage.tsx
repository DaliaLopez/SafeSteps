import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { MapContainer, TileLayer } from "react-leaflet";

import { DrawingOverlay } from "../../components/map/DrawingOverlay";
import LocationTypeSelector from "../../components/admin/LocationTypeSelector";
import { DescriptionInput } from "../../components/student/create_report/DescriptionInput";

import { createLocationService } from "../../services/locations.service";
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

  const convertToWKT = (points: LatLng[]) => {
    if (points.length < 3) return "";

    const closedPoints = [...points, points[0]];

    const coordinates = closedPoints
      .map((point) => `${point.lng} ${point.lat}`)
      .join(", ");

    return `POLYGON((${coordinates}))`;
  };

  const handleSaveZone = async () => {
    if (
      !zoneName ||
      !description ||
      !selectedType ||
      boundaryPoints.length < 3
    ) {
      alert("Completa todos los campos y dibuja una zona válida.");
      return;
    }

    try {
      setIsSaving(true);

      await createLocationService({
        name: zoneName,
        type: selectedType,
        description,
        boundary: convertToWKT(boundaryPoints),
      });

      alert("Zona creada con éxito");

      setZoneName("");
      setDescription("");
      setSelectedType(null);
      setBoundaryPoints([]);
    } catch (error) {
      console.error(error);
      alert("Error al crear la zona");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-32">

      <header className="px-8 pt-8 py-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>

        <h2 className="text-2xl font-bold text-black">
          Agregar zonas
        </h2>
      </header>

      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-5">

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">
              Dibujar zona
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Haz clic en el mapa para crear el polígono.
            </p>
          </div>

          <div className="h-[450px] rounded-3xl overflow-hidden">
            <MapContainer
              center={[3.3415, -76.5301]}
              zoom={17}
              className="h-full w-full z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <DrawingOverlay
                onSave={(points: LatLng[]) => {
                  setBoundaryPoints(points);
                }}
                onCancel={() => {
                  setBoundaryPoints([]);
                }}
              />
            </MapContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          
          <h3 className="mb-3 font-medium text-gray-700">
            Nombre de la zona
          </h3>

          <input
            type="text"
            placeholder="Ej: Zona de construcción bloque B"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F7F7F5] outline-none text-sm"
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

        <button
          onClick={handleSaveZone}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-4 rounded-3xl shadow-md disabled:opacity-50"
        >
          {isSaving ? "Guardando zona..." : "Guardar zona"}
        </button>

      </div>
    </div>
  );
}