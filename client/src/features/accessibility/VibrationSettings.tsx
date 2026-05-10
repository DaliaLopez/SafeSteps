import { useState, useEffect } from 'react';
import { ProfileHeader } from '../../components/accessibility/vibration/ProfileHeader';
import { VibrationToggle } from '../../components/accessibility/vibration/VibrationToggle';
import { IntensitySelector } from '../../components/accessibility/vibration/IntensitySelector';

export default function VibrationSettings() {
  const [isActive, setIsActive] = useState(true);
  const [intensity, setIntensity] = useState('Media');

  // --- LÓGICA DE VOZ ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  // Anunciar al entrar
  useEffect(() => {
    speak("Configuración de vibración");
  }, []);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    speak(newState ? "Vibración activada" : "Vibración desactivada");

    // Opcional: Feedback físico si el navegador lo permite
    if (newState) window.navigator.vibrate(200);
  };

  const handleIntensityChange = (newIntensity: string) => {
    setIntensity(newIntensity);
    speak(`Intensidad cambiada a ${newIntensity}`);

    // Feedback de vibración según intensidad
    if (isActive) {
      const ms = newIntensity === 'Suave' ? 50 : newIntensity === 'Media' ? 200 : 500;
      window.navigator.vibrate(ms);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] pb-10">
      <ProfileHeader title="Vibración" />

      <main className="max-w-md mx-auto px-6 space-y-10">

        {/* Switch Principal */}
        <div onFocus={() => speak("Opción activar vibración")}>
          <VibrationToggle active={isActive} onToggle={handleToggle} />
        </div>

        {/* Selector de Intensidad */}
        <div onFocus={() => speak("Seleccionar intensidad de vibración")}>
          <IntensitySelector selected={intensity} onSelect={handleIntensityChange} />
        </div>

        <p className="text-center text-gray-400 text-xs mt-10">
          Los cambios se aplican automáticamente al seleccionar.
        </p>
      </main>
    </div>
  );
}