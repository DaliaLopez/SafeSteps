import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateUserService } from '../../services/accessibility.service';

export default function AccessibilityEditProfile() {
  const navigate = useNavigate();
  const { user, updateUserContext } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  // --- LÓGICA DE VOZ (SIN AFECTAR ESTILOS) ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speak("Pantalla de editar perfil.");
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      speak("Nombre y correo son obligatorios");
      alert('Nombre y correo son obligatorios');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        ...(formData.password.trim() !== '' && { password: formData.password })
      };

      const updatedUser = await updateUserService(user!.id, dataToSend);
      updateUserContext(updatedUser);

      speak("Perfil actualizado con éxito");
      alert('Perfil actualizado correctamente');
      navigate(-1);
    } catch (error: any) {
      speak("Error al actualizar el perfil");
      alert(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header con tus estilos originales */}
      <header className="px-8 pt-8 pb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          onFocus={() => speak("Regresar")}
          className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform border border-gray-100"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-[#1E293B]">Editar perfil</h2>
      </header>

      <main className="px-8 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8 text-center gap-2">
          <div className="w-20 h-20 rounded-full bg-[#296BFF] flex items-center justify-center shadow-xl shadow-blue-100">
            <User size={40} strokeWidth={1.5} className="text-white" />
          </div>
          <h3>{user?.name}</h3>
          <div className="px-4 py-1 bg-[#E0EBFF] text-[#2563EB] rounded-full text-xs">
            {user?.role || 'Usuario'}
          </div>
        </div>

        <div className="space-y-2">
          {/* Campo Nombre - Estilos originales */}
          <div className="relative focus-within:border-[#296BFF] transition-colors gap-4">
            <label className="text-[#364153] font-semibold text-[15px]">Nombre completo</label>
            <input
              type="text"
              value={formData.name}
              onFocus={() => speak("Editando nombre")}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-white rounded-2xl text-xs border-none focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Tu nombre"
            />
          </div>

          {/* Campo Email - Estilos originales */}
          <div className="relative py-2 focus-within:border-[#296BFF] transition-colors">
            <label className="text-[#364153] font-semibold text-[15px]">Email</label>
            <input
              type="email"
              value={formData.email}
              onFocus={() => speak("Editando correo electrónico")}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-white rounded-2xl text-xs border-none focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Campo Password - Estilos originales */}
          <div className="relative py-2 focus-within:border-[#296BFF] transition-colors">
            <label className="text-[#364153] font-semibold text-[15px]">Nueva contraseña</label>
            <div className="flex items-center w-full p-3 bg-white rounded-2xl text-xs border-none focus:ring-1 focus:ring-blue-500 outline-none">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onFocus={() => speak("Escribir nueva contraseña")}
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full"
              />
              <button
                type="button"
                onClick={() => {
                  const s = !showPassword;
                  setShowPassword(s);
                  speak(s ? "Mostrando contraseña" : "Contraseña oculta");
                }}
                className="text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          onFocus={() => speak("Guardar cambios")}
          disabled={loading}
          className="w-full bg-[#296BFF] text-white sticky bottom-6 rounded-2xl p-3 font-bold text-[15px] shadow-2xl shadow-blue-300 active:scale-95 transition-all disabled:opacity-50 mt-10"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </main>
    </div>
  );
}