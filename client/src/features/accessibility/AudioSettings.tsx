import { useState, useEffect } from 'react';
import { ProfileHeader } from '../../components/accessibility/audio/ProfileHeader';
import { VolumeControl } from '../../components/accessibility/audio/VolumeControl';
import { SpeedSelector } from '../../components/accessibility/audio/SpeedSelector';
import { ToggleSetting } from '../../components/accessibility/audio/ToggleSetting';

export default function AudioSettings() {
  const [volume, setVolume] = useState(50);
  const [speed, setSpeed] = useState('Normal');
  const [autoRepeat, setAutoRepeat] = useState(true);

  // --- FUNCIÓN PARA LEER TEXTO ---
  const speak = (text: string) => {
    // Cancelar cualquier lectura previa para que no se amontonen
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Idioma español

    // Mapeamos tu estado de "speed" a valores numéricos que entiende el navegador
    const rates: Record<string, number> = { 'Lenta': 0.6, 'Normal': 1, 'Rápida': 1.5 };
    utterance.rate = rates[speed] || 1;
    utterance.volume = volume / 100;

    window.speechSynthesis.speak(utterance);
  };

  // --- EFECTOS PARA REACCIONAR A CAMBIOS ---
  // Cuando el usuario cambie la velocidad o el auto-repeat, la app le avisará por voz
  useEffect(() => {
    // El volumen no lo leemos constantemente al mover el slider para no aturdir, 
    // solo cuando se suelta (podrías activarlo si prefieres)
  }, [volume]);

  const handleSpeedChange = (newSpeed: string) => {
    setSpeed(newSpeed);
    speak(`Velocidad de voz cambiada a ${newSpeed}`);
  };

  const handleToggleRepeat = () => {
    const newState = !autoRepeat;
    setAutoRepeat(newState);
    speak(newState ? "Repetición automática activada" : "Repetición automática desactivada");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10">
      <ProfileHeader title="Audio" />

      <main className="max-w-md mx-auto px-6 space-y-6">
        <h3 className="text-[#364153] font-bold ml-2">Configuración de Audio</h3>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-10">
          {/* Al terminar de mover el slider de volumen, lee el porcentaje */}
          <div
            onMouseUp={() => speak(`Volumen al ${volume} por ciento`)}
            onTouchEnd={() => speak(`Volumen al ${volume} por ciento`)}
          >
            <VolumeControl value={volume} onChange={setVolume} />
          </div>

          <SpeedSelector selected={speed} onSelect={handleSpeedChange} />
        </div>

        <ToggleSetting
          label="Repetición automática"
          active={autoRepeat}
          onToggle={handleToggleRepeat}
        />

        <p className="text-center text-gray-400 text-xs px-4">
          Toca las opciones para escuchar su estado actual.
        </p>
      </main>
    </div>
  );
}