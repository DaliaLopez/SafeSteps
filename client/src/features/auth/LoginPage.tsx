import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/LogoAzul.png";
import { useAuth } from "../../context/AuthContext";
import { getRedirectPathForRole } from "../../routes/routes";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const savedUser = localStorage.getItem("user");
      let role: unknown = null;
      if (savedUser) {
        try {
          role = JSON.parse(savedUser)?.role;
        } catch {
          role = null;
        }
      }
      navigate(getRedirectPathForRole(role));
    } catch {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-100 p-6 md:p-10 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6 text-center">
          <img
            src={logo}
            alt="SafeSteps"
            className="w-30 h-30 object-contain"
          />
        
          <h2 className="font-bold" style={{ color: '#2563eb' }}>
          Iniciar sesión
        </h2>
        </div>

        {error && (
          <p className="w-full text-[11px] text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-4 text-center border border-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-gray-500 ml-1 text-left w-full">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-gray-500 ml-1 text-left w-full">
              {" "}
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-100 transition-all duration-200 mt-2 active:scale-[0.98]"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-3">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
