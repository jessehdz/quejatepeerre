/* getMunicipality - converts map coordinates to municipality name using MapTiler Geocoding API */

export async function getMunicipality(lat, lng) {
    const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // find the first feature with an id that starts with 'place' (which represents a municipality) and return its text (name)
    const place = data.features.find(feature => feature.id.startsWith('place'));
    
    // return the municipality name if found, otherwise return 'Puerto Rico' as a default fallback
    return place?.text || 'Puerto Rico';
}