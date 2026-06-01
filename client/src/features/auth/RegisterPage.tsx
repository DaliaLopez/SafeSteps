import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoAzul.png";
import { registerService } from "../../services/auth.service";
import { ChevronDown } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("student");
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
        role: role as "student" | "accessibility" | "admin",
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-100 p-6 md:p-10 flex flex-col items-center mt-2">
        <img src={logo} alt="SafeSteps" className="w-30 h-30 object-contain" />

        <h2 className="font-bold pb-4" style={{ color: "#2563eb" }}>
          Registrate
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-gray-500 ml-1 text-left w-full">
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
            <label className="text-[14px] font-semibold text-gray-500 ml-1 text-left w-full">
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

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-gray-500 ml-1 text-left w-full">
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
              <label className="text-[14px] font-semibold text-gray-500 ml-1 text-left w-full">
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

          <div className="space-y-1">
            <label className="text-[14px] font-semibold text-gray-500 ml-1 text-left w-full">
              Selecciona tu rol
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-white rounded-xl text-sm border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option value="student">Estudiante</option>
                <option value="accessibility">Persona con discapacidad</option>
                <option value="admin">Administrador</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-4 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          {error && (
            <p className="text-[10px] text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-100 transition-all duration-200"
          >
            {loading ? "Registrando" : "Crear cuenta"}
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
