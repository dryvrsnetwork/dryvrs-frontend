import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🔧 Fix for missing Leaflet marker icons in Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function LiveMap({ routeData }: { routeData?: any }) {
  const defaultCenter: [number, number] = [43.0389, -87.9065]; // Default grid: Milwaukee

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={routeData?.start ? [routeData.start.lat, routeData.start.lon] : defaultCenter} 
        zoom={13} 
        className="w-full h-full" 
        zoomControl={false}
      >
        {/* Dark Mode Carto Base Map */}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* 🗺️ THE HOLOGRAM: Draw the route if data exists */}
        {routeData && routeData.routeCoordinates && (
          <>
            <Marker position={[routeData.start.lat, routeData.start.lon]} icon={customIcon}>
              <Popup>Pickup Location</Popup>
            </Marker>
            <Marker position={[routeData.end.lat, routeData.end.lon]} icon={customIcon}>
              <Popup>Dropoff Location</Popup>
            </Marker>
            
            {/* The Cyan Laser Line connecting the dots */}
            <Polyline positions={routeData.routeCoordinates} color="#06b6d4" weight={5} opacity={0.8} />
          </>
        )}
      </MapContainer>
      
      {/* HUD Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
}