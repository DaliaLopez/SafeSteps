import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoBlanco from "../assets/LogoBlanco.png";
import axios from 'axios';

interface LocationResponse {
    name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function Header() {
    const { user } = useAuth();

    const [currentLocation, setCurrentLocation] = useState<string>(
        !("geolocation" in navigator) ? 'GPS no soportado' : 'Buscando ubicación...'
    );

    const updateLocation = async (lat: number, lng: number) => {
        try {
            const { data } = await axios.get<LocationResponse>(`${API_URL}/locations/check`, {
                params: { latitude: lat, longitude: lng }
            });

            if (data) {
                setCurrentLocation(data.name);
            } else {
                setCurrentLocation('Zona no identificada');
            }
        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            setCurrentLocation('Error de conexión');
        }
    };

    useEffect(() => {
        if (!("geolocation" in navigator)) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateLocation(latitude, longitude);
            },
            (error) => {
                console.error('Error de GPS:', error);
                setCurrentLocation('GPS desactivado');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (

        <header className="bg-blue-600 text-white p-8 pb-8 pt-12 rounded-b-[40px] shadow-md relative overflow-hidden">
            <div className="absolute right-1 top-2 w-40 h-40">
                <img
                    src={logoBlanco}
                    alt="SafeSteps Logo Decorative"
                    className="w-full h-full object-contain opacity-15"
                />
            </div>

            <div className="relative z-10 flex items-start gap-4">

                {user?.role === 'accessibility' && (
                    <div className="mt-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </div>
                )}

                <div className="flex flex-col items-start text-left gap-2">
                    <h2 className="text-2xl font-bold">
                        ¡Bienvenido/a, {user?.name || 'usuario/a'}!
                    </h2>

                    <div className="flex flex-col items-start">
                        {user?.role === 'admin' && (
                            <p className="text-white text-xs font-normal">
                                Estás en el panel de administrador.
                            </p>
                        )}
                        {(user?.role === 'accessibility' || user?.role === 'student') && (<>
                            <p className="text-white text-xs font-normal">
                                Tu ubicación actual:
                            </p>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0"></div>
                                <p className="text-xs font-normal">
                                    {currentLocation}
                                </p>
                            </div>
                        </>
                        )}

                    </div>

                </div>

            </div>

        </header>

    );
    
}