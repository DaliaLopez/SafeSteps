import { useEffect, useState } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import NavbarAlert from '../../components/accessibility/alert/NavbarAlert';
import { getAlertsForAccessibilityService } from '../../services/student.service';

export default function AlertPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const data = await getAlertsForAccessibilityService();
        setAlerts(data);

        if (data && data.length > 0) {
          const main = data[0];
          const distance = main.distance || "pocos metros";
          speak(`¡CUIDADO! Alerta de nivel ${main.dangerLevel} a solo ${distance}. ${main.description}`);
        }
      } catch (error) {
        console.error("Error obteniendo alertas reales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getFullStyles = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'alto':
        return {
          bg: 'bg-red-600',
          iconBg: 'bg-red-700',
          text: 'text-white',
          icon: <ShieldAlert className="text-white" size={120} strokeWidth={2.5} />
        };
      case 'medio':
        return {
          bg: 'bg-orange-500',
          iconBg: 'bg-orange-600',
          text: 'text-white',
          icon: <AlertTriangle className="text-white" size={120} strokeWidth={2.5} />
        };
      default:
        return {
          bg: 'bg-green-600',
          iconBg: 'bg-green-700',
          text: 'text-white',
          icon: <Info className="text-white" size={120} strokeWidth={2.5} />
        };
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <p className="animate-pulse text-gray-400 font-bold"></p>
    </div>
  );

  const mainAlert = alerts[0];

  const repeatCurrentAlert = () => {
    if (mainAlert) {
      speak(`Atención. ${mainAlert.description}. Estás a ${mainAlert.distance || 'pocos metros'}. Nivel de riesgo: ${mainAlert.dangerLevel}.`);
    } else {
      speak("No hay alertas cercanas para repetir.");
    }
  };

  if (!mainAlert) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
      <Info size={80} className="text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-400">No hay alertas cercanas</h2>
      <NavbarAlert onRepeat={repeatCurrentAlert} />
    </div>
  );

  const styles = getFullStyles(mainAlert.dangerLevel);

  return (

    <div className={`h-screen flex flex-col ${styles.bg} transition-colors duration-500`}>

      <main
        className="flex-1 flex flex-col items-center mt-16 px-8 text-center"
        tabIndex={0}
        onFocus={() => speak(`¡Atención! ${mainAlert.description}. Estás a ${mainAlert.distance || 'pocos metros'}. Nivel de riesgo: ${mainAlert.dangerLevel}. Opciones disponibles en la parte inferior: repetir información y continuar.`)}
      >

        <div className={`${styles.iconBg} p-8 rounded-full mb-8`}>
          {styles.icon}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <span className="text-white font-normal text-normal">
              Estás a {mainAlert.distance || 'pocos metros'}
            </span>
          </div>

          <h2 className="text-white text-2xl font-black leading-none">
            {mainAlert.description}
          </h2>

        </div>

      </main>

      <NavbarAlert />

    </div>

  );
  
}
