import { Link } from "react-router-dom";
import logo from "../assets/LogoBlanco.png";

export default function LandingPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-600 to-gray-200 px-4">

      <div className="w-full max-w-sm text-center">

        {/* Logo + título */}
        <div className="mb-10">
          <img src={logo} alt="SafeSteps" className="w-32 mx-auto mb-4" />

          <h1 className="text-4xl font-light text-white" style={{ color: "#FFFFFF" }}>
            Safe <span className="font-bold text-blue-700">Steps</span>
          </h1>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-4">

          <Link
            to="/login"
            className="w-full py-3 rounded-full bg-blue-600 text-white font-medium shadow-md hover:scale-105 transition text-center"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="w-full py-3 rounded-full bg-blue-400 text-white font-medium shadow-md hover:scale-105 transition text-center"
          >
            Registrarse
          </Link>

        </div>

      </div>
    </div>
  );
}