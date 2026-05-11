import { useState, useEffect } from 'react';
import { ProfileHeader } from '../../components/accessibility/navegation/ProfileHeader';
import { DistanceSelector } from '../../components/accessibility/navegation/DistanceSelector';
import { AlertTypeSelector } from '../../components/accessibility/navegation/AlertTypeSelector';

import { useAuth } from '../../context/AuthContext';

import {
  getAccessibilitySettingsService,
  updateAccessibilitySettingsService
} from '../../services/accessibility-settings.service';

export default function NavegationSettings() {
  const { user } = useAuth();

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

  useEffect(() => {

    const loadSettings = async () => {

      if (!user?.id) return;
      try {
        const settings =
          await getAccessibilitySettingsService(user.id);
        setDistance(settings.alert_distance);
        setAlertType(settings.alert_type);
      } catch (error) {
        console.error(error);
      }
    };
    loadSettings();
  }, [user]);

  const handleDistanceChange = async (val: string) => {
    setDistance(val);
    if (user?.id) {
      await updateAccessibilitySettingsService(user.id, {
        alert_distance: val
      });
    }
    speak(`Distancia de alerta configurada a ${val}`);
  };

  const handleTypeChange = async (val: string) => {
    setAlertType(val);
    if (user?.id) {
      await updateAccessibilitySettingsService(user.id, {
        alert_type: val
      });
    }
    speak(`Tipo de alerta configurado a: ${val}`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header con flecha de regreso */}
      <ProfileHeader title="Navegación" />

      <main className="max-w-md mx-auto px-8 space-y-10 mb-8">

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

        <p className="text-center text-gray-400 text-xs mt-12">
          Estas configuraciones afectan cómo recibes las notificaciones durante tu recorrido por el campus.
        </p>
      </main>
    </div>
  );
}