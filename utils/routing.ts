// utils/routing.ts

// 1. Translates a street address or landmark into exact GPS coordinates
export async function getCoordinates(address: string) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error("Sat-Link Failed (Geocoding):", error);
    return null;
  }
}

// 2. Calculates the real-world driving route AND pulls the map geometry
export async function getLiveRouteData(origin: string, destination: string) {
  try {
    const start = await getCoordinates(origin);
    const end = await getCoordinates(destination);
    
    if (!start || !end) return null;

    // 🗺️ UPGRADED: Added ?overview=full&geometries=geojson to pull the physical map line
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`);
    const data = await res.json();
    
    if (data.code === 'Ok' && data.routes.length > 0) {
      const distanceMeters = data.routes[0].distance;
      const durationSeconds = data.routes[0].duration;
      
      // Convert European metric to American imperial for the Dryvr HUD
      const distanceMiles = distanceMeters * 0.000621371;
      const durationMinutes = Math.round(durationSeconds / 60);

      // 🗺️ NEW: Extract the route geometry. 
      // OSRM returns [Longitude, Latitude], but Leaflet maps require [Latitude, Longitude]. We flip them here.
      const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

      // Returning the full data payload to the HUD
      return { distanceMiles, durationMinutes, routeCoordinates, start, end };
    }
    return null;
  } catch (error) {
    console.error("Sat-Link Failed (Routing):", error);
    return null;
  }
}