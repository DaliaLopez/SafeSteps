import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import LocationCard from "../../components/admin/ZoneCard";

import { useLocationsContext } from "../../providers/LocationsProvider"; 

export default function DeleteZonePage() {
  const navigate = useNavigate();
  
  const { locations, loading, deleteLocation } = useLocationsContext();

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "¿Seguro que deseas eliminar esta zona?"
    );

    if (!confirmDelete) return;

    try {
      await deleteLocation(id);
      
      alert("Zona eliminada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la zona");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
        <p className="text-gray-500 font-medium text-sm animate-pulse">Cargando zonas...</p>
      </div>
    );
  }

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
          Eliminar zonas
        </h2>
      </header>

      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Gestiona y elimina zonas registradas en el mapa.
          </p>
        </div>

        <div className="flex flex-col">
          {locations.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-10">
              No hay zonas activas registradas en el sistema.
            </p>
          ) : (
            locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onDelete={() => handleDelete(location.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}