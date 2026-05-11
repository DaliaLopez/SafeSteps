import { NavLink } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

export default function NavbarStudent() {
    return (
        <nav className="fixed bottom-0 bg-white p-6 rounded-t-[40px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] w-full mt-auto">
            <div className="flex flex-col gap-2 max-w-full justify-center">

                <NavLink
                    to="/student/reports/create"
                    className="flex items-center justify-center gap-2 p-3 rounded-3xl transition-all bg-blue-600 text-white hover:bg-blue-700">
                    <div>
                        <TriangleAlert size={20} strokeWidth={2} />
                    </div>
                    <div className="flex text-center">
                        <span className="font-bold text-sm leading-tight">Reportar un problema</span>
                    </div>
                </NavLink>

                <NavLink
                    to="/student/reports"
                    className="gap-4 p-3 rounded-3xl transition-all flex-1 bg-gray-600 text-white hover:bg-gray-700">
                    <div className="flex flex-col text-center">
                        <span className="font-bold text-sm leading-tight">Ver mis reportes</span>
                    </div>
                </NavLink>

                <NavLink
                    to="/student/profile"
                    className="gap-4 p-3 rounded-3xl transition-all flex-1 bg-blue-400 text-white hover:bg-gray-700">
                    <div className="flex flex-col text-center">
                        <span className="font-bold text-sm leading-tight">Ver perfil</span>
                    </div>
                </NavLink>

            </div>
        </nav>
    );
}