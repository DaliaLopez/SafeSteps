import {
  Trash2,
  MapPin,
  FileText,
  PenLine,
} from "lucide-react";

import type { Location } from "../../services/locations.service";

interface LocationCardProps {
  location: Location;
  onDelete: (id: string) => void;
}

const LOCATION_LABELS: Record<string, string> = {
  building: "Edificio",
  ramp: "Rampa",
  stairs: "Escaleras",
  bathroom: "Baño accesible",
  cafeteria: "Cafetería",
  elevator: "Ascensor",
  walkway: "Sendero",
};

export default function LocationCard({
  location,
  onDelete,
}: LocationCardProps) {
  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] mb-5">

      <div className="flex flex-col gap-5">

        <div className="flex items-start gap-3">

          <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-[#296BFF]" />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[#8A94A6] text-[13px] font-medium">
              Nombre de la zona
            </span>

            <span className="text-[15px] leading-5 font-semibold text-[#1E293B]">
              {location.name}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">

          <div className="w-8 h-8 rounded-full bg-[#F6EEFF] flex items-center justify-center shrink-0">
            <PenLine size={18} className="text-[#C026FF]" />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[#8A94A6] text-[13px] font-medium">
              Tipo de zona
            </span>

            <span className="text-[14px] leading-5 text-[#364153]">
              {LOCATION_LABELS[location.type]}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">

          <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
            <FileText size={18} className="text-[#9CA3AF]" />
          </div>

          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[#8A94A6] text-[13px] font-medium">
              Descripción
            </span>

            <p className="text-[14px] leading-5 text-[#4B5563] break-words">
              {location.description || "Sin descripción"}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-[#ECECEC] my-5" />

      <button
        onClick={() => onDelete(location.id)}
        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all text-white font-semibold py-3 rounded-2xl"
      >
        <Trash2 size={18} />
        Eliminar zona
      </button>
    </div>
  );
}