import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoAzul.png";
import { registerService } from "../../services/auth.service";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visual, setVisual] = useState<"no" | "si">("no");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await registerService({
        name,
        email,
        password,
        role: visual === "si" ? "accessibility" : "student",
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
      {/* Contenedor principal con ancho controlado y padding reducido */}
      <div className="w-full max-w-[400px] bg-white rounded-[24px] shadow-sm p-6 md:p-8 flex flex-col items-center border border-gray-100">
        {/* Icono más pequeño para ahorrar espacio vertical */}
        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
          <img
            src={logo}
            alt="SafeSteps"
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Títulos con márgenes mínimos */}
        <h1 className="font-bold" style={{ color: "#2563eb" }}>
          Crear cuenta
        </h1>
        <p className="text-sm text-gray-400 pb-6">
          Completa los datos para registrarte
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="block text-[11px] font-semibold text-gray-500 ml-1 uppercase tracking-wider text-left w-full">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-[11px] font-semibold text-gray-500 ml-1 uppercase tracking-wider text-left w-full">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Fila de contraseñas para ahorrar espacio vertical */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="block text-[11px] font-semibold text-gray-500 ml-1 uppercase tracking-wider text-left w-full">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-[11px] font-semibold text-gray-500 ml-1 uppercase tracking-wider text-left w-full">
                Confirmar
              </label>
              <input
                id="confirm"
                type="password"
                placeholder="Repite"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-[11px] font-semibold text-gray-500 ml-1 uppercase tracking-wider text-left w-full">
              ¿Tienes discapacidad visual?
            </label>
            <select
              id="visual"
              value={visual}
              onChange={(e) => setVisual(e.target.value as "si" | "no")}
              className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-blue-500 transition bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_12px_center] bg-no-repeat"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {error && (
            <p className="text-[10px] text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-100 transition-all duration-200"
          >
            {loading ? "Registrando…" : "Crear cuenta"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-3">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
