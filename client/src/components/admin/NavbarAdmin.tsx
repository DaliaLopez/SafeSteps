import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ClipboardList,
  SquarePen,
} from "lucide-react";
import { useState } from "react";

export default function NavbarAdmin() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 z-[9999] bg-white p-6 md:p-3 rounded-t-[40px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] md:shadow-md w-full mt-auto">
      <div className="flex justify-center mb-2 md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-100 p-1 rounded-full text-gray-400 active:scale-95"
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-4 max-w-full md:max-w-6xl justify-center">
        <NavLink
          to="/admin/add-zone"
          className="flex md:flex-col items-center justify-center gap-2 md:gap-1 p-3 rounded-3xl transition-all bg-blue-600 text-white hover:bg-blue-700"
        >
          <div>
            <Plus size={20} strokeWidth={2} />
          </div>
          <div className="flex text-center">
            <span className="font-bold text-sm leading-tight">
              Agregar zona
            </span>
          </div>
        </NavLink>

        <NavLink
          to="/admin/delete-zone"
          className="flex md:flex-col items-center justify-center gap-2 md:gap-1 p-3 rounded-3xl transition-all bg-blue-600 text-white hover:bg-blue-700"
        >
          <div>
            <Trash2 size={20} strokeWidth={2} />
          </div>
          <div className="flex text-center">
            <span className="font-bold text-sm leading-tight">
              Eliminar zona
            </span>
          </div>
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={`${isExpanded ? "flex" : "hidden"} flex md:flex-col items-center justify-center gap-2 md:gap-1 p-3 rounded-3xl transition-all bg-gray-600 text-white hover:bg-gray-700`}
        >
          <div>
            <ClipboardList size={20} strokeWidth={2} />
          </div>
          <div className="flex text-center">
            <span className="font-bold text-sm leading-tight">
              Ver reportes pendientes
            </span>
          </div>
        </NavLink>

        <NavLink
          to="/admin/alerts"
          className={`${isExpanded ? "flex" : "hidden"} flex md:flex-col items-center justify-center gap-2 md:gap-1 p-3 rounded-3xl transition-all bg-gray-600 text-white hover:bg-gray-700`}
        >
          <div>
            <SquarePen size={20} strokeWidth={2} />
          </div>
          <div className="flex text-center">
            <span className="font-bold text-sm leading-tight">
              Actualizar alertas
            </span>
          </div>
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={`${isExpanded ? "flex" : "hidden"} flex items-center justify-center gap-4 p-3 rounded-3xl transition-all bg-blue-400 text-white hover:bg-blue-500`}
        >
          <div className="flex flex-col text-center">
            <span className="font-bold text-sm leading-tight">Ver perfil</span>
          </div>
        </NavLink>
      </div>
    </nav>
  );
}
