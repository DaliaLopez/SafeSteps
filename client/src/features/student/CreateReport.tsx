import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LocationSelector } from '../../components/student/create_report/LocationSelector';
import { ProblemTypeSelector } from '../../components/student/create_report/ProblemTypeSelector';
import { DangerLevelSelector } from '../../components/student/create_report/DangerLevelSelector';
import { DescriptionInput } from '../../components/student/create_report/DescriptionInput';
import { createReportService } from '../../services/student.service';
import { Problem, DangerLevel } from '../../types/student.types';

export default function CreateReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    problemType: Problem.OBSTACLE,
    dangerLevel: DangerLevel.HIGH,
    description: '',
    location_name: '',
    location: null as { lat: number; lng: number } | null
  });

  const handleSend = async () => {
    if (!formData.location) {
      return alert("Por favor, selecciona una ubicación en el mapa");
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser.id;

    if (!userId) {
      return alert("No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.");
    }

    setLoading(true);
    try {
      await createReportService({
        user_id: userId,
        description: formData.description,
        problem_type: formData.problemType,
        danger_level: formData.dangerLevel,
        latitude: formData.location.lat,
        longitude: formData.location.lng,
        location_name: formData.location_name
      });

      navigate('/student/reports');
    } catch (error: any) {
      console.error("Error en el envío:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error al enviar el reporte. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <header className="px-8 pt-8 py-6 flex items-center gap-4">
        <button onClick={() => navigate('/student/dashboard')} className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform">
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold text-black">Nuevo reporte</h2>
      </header>

      <main className="px-8 space-y-6 max-w-md mx-auto h-full pb-325">
        <LocationSelector
          onSelect={(loc) => setFormData({ ...formData, location: loc })}
          locationName={formData.location_name} 
          onLocationNameChange={(val) => setFormData({ ...formData, location_name: val })} 
        />

        <ProblemTypeSelector
          value={formData.problemType}
          onChange={(val: Problem) => setFormData({ ...formData, problemType: val })}
        />

        <DangerLevelSelector
          value={formData.dangerLevel}
          onChange={(val: DangerLevel) => setFormData({ ...formData, dangerLevel: val })}
        />

        <DescriptionInput
          value={formData.description}
          onChange={(val: string) => setFormData({ ...formData, description: val })}
        />
      </main>

      <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
        <button
          onClick={handleSend}
          disabled={loading || !formData.location}
          className="w-full max-w-md mx-auto bg-[#296BFF] text-white p-3 rounded-3xl font-semibold text-medium shadow-[0_10px_20px_rgba(41,107,255,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            "Enviando..."
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-send-icon lucide-send"
              >
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                <path d="m21.854 2.147-10.94 10.939"/>
              </svg>
              Enviar reporte
            </>
          )}
        </button>
      </div>
    </div>
  );
}