import { useState, useEffect } from 'react';
import { ProfileHeader } from '../../components/accessibility/vibration/ProfileHeader';
import { VibrationToggle } from '../../components/accessibility/vibration/VibrationToggle';
import { IntensitySelector } from '../../components/accessibility/vibration/IntensitySelector';

import { useAuth } from '../../context/AuthContext';

import {
  getAccessibilitySettingsService,
  updateAccessibilitySettingsService
} from '../../services/accessibility-settings.service';

export default function VibrationSettings() {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(true);
  const [intensity, setIntensity] = useState('Media');

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speak("Configuración de vibración");
  }, []);

  useEffect(() => {

    const loadSettings = async () => {

      if (!user?.id) return;

      try {

        const settings =
          await getAccessibilitySettingsService(user.id);

        setIsActive(settings.vibration_active);
        setIntensity(settings.vibration_intensity);

      } catch (error) {
        console.error(error);
      }
    };

    loadSettings();

  }, [user]);

  const handleToggle = async () => {
    const newState = !isActive;
    setIsActive(newState);

    if (user?.id) {
      await updateAccessibilitySettingsService(user.id, {
        vibration_active: newState
      });
    }
    speak(newState ? "Vibración activada" : "Vibración desactivada");

    if (newState) window.navigator.vibrate(200);
  };

  const handleIntensityChange = async (newIntensity: string) => {
    setIntensity(newIntensity);
    
    if (user?.id) {
      await updateAccessibilitySettingsService(user.id, {
        vibration_intensity: newIntensity
      });
    }

    speak(`Intensidad cambiada a ${newIntensity}`);

    if (isActive) {
      const ms = newIntensity === 'Suave' ? 50 : newIntensity === 'Media' ? 200 : 500;
      window.navigator.vibrate(ms);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <ProfileHeader title="Vibración" />

      <main className="max-w-md mx-auto px-8 space-y-6">

        <div onFocus={() => speak("Opción activar vibración")}>
          <VibrationToggle active={isActive} onToggle={handleToggle} />
        </div>

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