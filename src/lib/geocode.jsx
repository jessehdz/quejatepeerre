/* getMunicipality - converts map coordinates to municipality name and exact location using MapTiler Geocoding API */

export async function getMunicipality(lng, lat) {
    const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    
    // find the first feature with an id that starts with 'county' - this should correspond to the municipality level in Puerto Rico
    const place = data.features?.find(feature => feature.id.startsWith('county'));

    // return the municipality name if found, otherwise return 'Puerto Rico' as a default fallback
    return place?.text || 'Puerto Rico - MUNI';
}

// get exact location
export async function getExactLocation(lng, lat) {
    const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const address = data.features?.find(
        feature => feature.id.startsWith('address') || feature.id.startsWith('poi')
    );
    console.log(`Reverse geocoding result for (${lat}, ${lng}):`, address);

    return address?.place_name || data.features?.[0]?.place_name || 'Ubicación desconocida';
}