import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfileService } from '../../services/student.service';

export default function StudentEditProfile() {
  const navigate = useNavigate();
  const { user, updateUserContext } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Nombre y correo son obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Limpiamos los datos antes de enviar para evitar el error 400
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        // Solo enviamos la contraseña si el usuario escribió algo
        ...(formData.password.trim() !== '' && { password: formData.password })
      };

      const updatedUser = await updateProfileService(user!.id, dataToSend);
      
      // Actualizamos el contexto global para que el cambio se vea en toda la app
      updateUserContext(updatedUser);
      
      alert('Perfil actualizado correctamente');
      navigate(-1);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans pb-10">
      <header className="px-8 pt-10 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform border border-gray-100"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-[#1E293B]">Editar perfil</h2>
      </header>

      <main className="px-8 mt-14 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-32 h-32 rounded-full bg-[#296BFF] flex items-center justify-center shadow-xl shadow-blue-100">
            <User size={60} strokeWidth={1.5} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-black text-[#1E293B]">{user?.name}</h2>
          <div className="mt-3 px-6 py-1.5 rounded-full bg-[#E0EBFF] text-[#296BFF] text-xs font-black uppercase tracking-widest italic">
            {user?.role}
          </div>
        </div>

        <div className="space-y-10">
          {/* Campo Nombre */}
          <div className="relative border-b border-gray-200 py-2 focus-within:border-[#296BFF] transition-colors">
            <label className="absolute -top-5 left-0 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Nombre completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent outline-none font-bold text-[#1E293B] text-[16px]"
              placeholder="Tu nombre"
            />
          </div>

          {/* Campo Email */}
          <div className="relative border-b border-gray-200 py-2 focus-within:border-[#296BFF] transition-colors">
            <label className="absolute -top-5 left-0 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-transparent outline-none font-bold text-[#1E293B] text-[16px]"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Campo Password */}
          <div className="relative border-b border-gray-200 py-2 focus-within:border-[#296BFF] transition-colors">
            <label className="absolute -top-5 left-0 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Nueva contraseña</label>
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent outline-none font-bold text-[#1E293B] text-[16px]"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="text-gray-400 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[#296BFF] text-white py-5 rounded-full font-black text-[15px] shadow-2xl shadow-blue-300 active:scale-95 transition-all disabled:opacity-50 mt-16 tracking-widest uppercase"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </main>
    </div>
  );
}