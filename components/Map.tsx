'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GpsData {
    id: number;
    latitude: number;
    longitude: number;
    recordedAt: string;
}

interface MapProps {
    data: GpsData[];
    selectedId?: number | null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function Map({ data, selectedId }: MapProps) {
    const defaultCenter: [number, number] = [51.505, -0.09];
    const center = data.length > 0 ? [data[0].latitude, data[0].longitude] as [number, number] : defaultCenter;

    // If a point is selected, center on it
    const selectedPoint = data.find(p => p.id === selectedId);
    const mapCenter = selectedPoint ? [selectedPoint.latitude, selectedPoint.longitude] as [number, number] : center;

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={mapCenter} zoom={13} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((point) => (
                <Marker key={point.id} position={[point.latitude, point.longitude]}>
                    <Popup>
                        <div>
                            <p>Lat: {point.latitude}</p>
                            <p>Lng: {point.longitude}</p>
                            <p>Time: {new Date(point.recordedAt).toLocaleString()}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
