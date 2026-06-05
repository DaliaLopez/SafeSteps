import { useState, useEffect } from 'react';
import { ProfileHeader } from '../../components/accessibility/audio/ProfileHeader';
import { VolumeControl } from '../../components/accessibility/audio/VolumeControl';
import { SpeedSelector } from '../../components/accessibility/audio/SpeedSelector';
import { ToggleSetting } from '../../components/accessibility/audio/ToggleSetting';
import { useAuth } from '../../context/AuthContext';

import {
  getAccessibilitySettingsService,
  updateAccessibilitySettingsService
} from '../../services/accessibility-settings.service';

export default function AudioSettings() {
  const { user } = useAuth();

  const [volume, setVolume] = useState(50);
  const [speed, setSpeed] = useState('Normal');
  const [autoRepeat, setAutoRepeat] = useState(true);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';

    const rates: Record<string, number> = { 'Lenta': 0.6, 'Normal': 1, 'Rápida': 1.5 };
    utterance.rate = rates[speed] || 1;
    utterance.volume = volume / 100;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {

    const loadSettings = async () => {

      if (!user?.id) return;

      try {

        const settings =
          await getAccessibilitySettingsService(user.id);

        setVolume(settings.volume);
        setSpeed(settings.voice_speed);
        setAutoRepeat(settings.auto_repeat);

      } catch (error) {
        console.error(error);
      }
    };

    loadSettings();

  }, [user]);

  const handleSpeedChange = async (newSpeed: string) => {

    setSpeed(newSpeed);

    if (user?.id) {
      await updateAccessibilitySettingsService(user.id, {
        voice_speed: newSpeed
      });
    }

    speak(`Velocidad de voz cambiada a ${newSpeed}`);
  };

  const handleToggleRepeat = async () => {
    const newState = !autoRepeat;

    setAutoRepeat(newState);

    if (user?.id) {
      await updateAccessibilitySettingsService(user.id, {
        auto_repeat: newState
      });
    }

    speak(
      newState
        ? "Repetición automática activada"
        : "Repetición automática desactivada"
    );
  };

  return (
    <div className="min-h-screen pb-10">

      <ProfileHeader title="Audio" />

      <main className="max-w-md mx-auto px-8 space-y-6">

        <h3 className="ml-2">Configuración de audio</h3>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-5">

          <div
            onMouseUp={async () => { speak(`Volumen al ${volume} por ciento`);
              if (user?.id) {
                try { await updateAccessibilitySettingsService(user.id, {
                    volume
                  });
                } catch (error) {
                  console.error(error);
                }
              }
            }}

            onTouchEnd={async () => { speak(`Volumen al ${volume} por ciento`);
              if (user?.id) {
                try { await updateAccessibilitySettingsService(user.id, {
                    volume
                  });
                } catch (error) {
                  console.error(error);
                }
              }
            }}
          >

            <VolumeControl
              value={volume}
              onChange={(newVolume) => {
                setVolume(newVolume);
              }}
            />
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