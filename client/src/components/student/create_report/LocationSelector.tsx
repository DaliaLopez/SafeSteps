import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationSelectorProps {
    onSelect: (coords: { lat: number; lng: number }) => void;
    locationName: string; 
    onLocationNameChange: (val: string) => void; 
}

export const LocationSelector = ({ onSelect, locationName, onLocationNameChange }: LocationSelectorProps) => {
    const [pos, setPos] = useState<[number, number] | null>(null);

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setPos([e.latlng.lat, e.latlng.lng]);
                onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
            },
        });
        return pos ? <Marker position={pos} icon={customIcon} /> : null;
    };

    return (
        <div className="card bg-white p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-2">
                <h3>Ubicación</h3>
            </div>
            <div className="h-44 rounded-2xl overflow-hidden relative mb-3">
                <MapContainer center={[3.3415, -76.5301]} zoom={17} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEvents />
                </MapContainer>
            </div>
            <input
                type="text"
                placeholder="Ej: Edificio A, Piso 2"
                value={locationName}
                onChange={(e) => onLocationNameChange(e.target.value)}
                className="w-full p-3 bg-[#F7F7F5] rounded-2xl text-xs border-none focus:ring-1 focus:ring-blue-500 outline-none"
            />
        </div>
    );
};