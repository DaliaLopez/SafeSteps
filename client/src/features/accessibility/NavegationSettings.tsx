import { useState, useEffect } from 'react';
import { ProfileHeader } from '../../components/accessibility/navegation/ProfileHeader';
import { DistanceSelector } from '../../components/accessibility/navegation/DistanceSelector';
import { AlertTypeSelector } from '../../components/accessibility/navegation/AlertTypeSelector';

export default function NavegationSettings() {
  const [distance, setDistance] = useState('5 metros');
  const [alertType, setAlertType] = useState('Solo riesgo');

  // --- LÓGICA DE VOZ ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  // Anuncio inicial
  useEffect(() => {
    speak("Configuración de navegación. Selecciona la distancia y el tipo de alertas.");
  }, []);

  const handleDistanceChange = (val: string) => {
    setDistance(val);
    speak(`Distancia de alerta configurada a ${val}`);
  };

  const handleTypeChange = (val: string) => {
    setAlertType(val);
    speak(`Tipo de alerta configurado a: ${val}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] pb-10">
      {/* Header con flecha de regreso */}
      <ProfileHeader title="Navegación" />

      <main className="max-w-md mx-auto px-6 space-y-10 mt-4">

        {/* Sección de Distancia */}
        <div onFocus={() => speak("Sección distancia de alerta")}>
          <DistanceSelector
            selected={distance}
            onSelect={handleDistanceChange}
          />
        </div>

        {/* Sección de Tipo de Alerta */}
        <div onFocus={() => speak("Sección tipo de alerta")}>
          <AlertTypeSelector
            selected={alertType}
            onSelect={handleTypeChange}
          />
        </div>

        <p className="text-center text-gray-400 text-xs mt-12 px-8">
          Estas configuraciones afectan cómo recibes las notificaciones durante tu recorrido por el campus.
        </p>
      </main>
    </div>
  );
}