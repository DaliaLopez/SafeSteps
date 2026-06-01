import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import useSupabase from "../hooks/useSupabase"; 
import {
  getLocationsService,
  deleteLocationService,
  type Location,
} from "../services/locations.service";


interface LocationsContextType {
  locations: Location[];
  loading: boolean;
  deleteLocation: (id: string) => Promise<void>;
}

const LocationsContext = createContext<LocationsContextType | undefined>(undefined);

export const LocationsProvider = ({ children }: { children: ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocationsService();
        setLocations(data);
      } catch (err) {
        console.error("Error al cargar las zonas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();

    const channel = supabase
      .channel("realtime-locations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "locations" },
        (payload) => {
          console.log("Cambio detectado en tiempo real:", payload);
          fetchLocations(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const deleteLocation = async (id: string) => {
    try {
      await deleteLocationService(id);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err) {
      console.error("Error en deleteLocation:", err);
      throw err;
    }
  };

  return (
    <LocationsContext.Provider value={{ locations, loading, deleteLocation }}>
      {children}
    </LocationsContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useLocationsContext = () => {
  const context = useContext(LocationsContext);
  if (context === undefined) {
    throw new Error("useLocationsContext debe ser usado dentro de un LocationsProvider");
  }
  return context;
};