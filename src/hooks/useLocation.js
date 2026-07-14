import { useState, useCallback } from 'react';
import { getMunicipality, getExactLocation } from '../lib/geocode';

/* useLocation — manages all pin/geocoding state in one place.
    
WHAT IT RETURNS:
    pinnedLocation    { lng, lat } | null   — the current dropped pin
    municipality      string | null          — reverse-geocoded municipality name
    exactLocation     string | null          — reverse-geocoded street address
    loadingLocation   boolean                — true while geocoding is in flight
    resolveCoords     (lng, lat) => Promise  — drop a pin and geocode it
    clearLocation     ()                     — remove the pin and reset all state
    requestGeolocation (onReady) => void     — ask the browser for GPS, then resolveCoords
*/

export function useLocation() {
    const [pinnedLocation, setPinnedLocation]   = useState(null);
    const [municipality, setMunicipality]       = useState(null);
    const [exactLocation, setExactLocation]     = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // resolveCoords — drop a pin and reverse-geocode the coordinates.
    // Call this whenever the user taps the map or GPS succeeds.
    const resolveCoords = useCallback(async (lng, lat) => {
        setPinnedLocation({ lng, lat });
        setLoadingLocation(true);

        try {
            const [muniName, exactLoc] = await Promise.all([
                getMunicipality(lng, lat),
                getExactLocation(lng, lat),
            ]);
            setMunicipality(muniName);
            setExactLocation(exactLoc);
        } catch (error) {
            console.error('Error resolving location:', error);
            setMunicipality('Puerto Rico');
            setExactLocation(null);
        } finally {
            setLoadingLocation(false);
        }
    }, []);

    // clearLocation — remove the pin and reset everything back to null.
    const clearLocation = useCallback(() => {
        setPinnedLocation(null);
        setMunicipality(null);
        setExactLocation(null);
    }, []);

    // requestGeolocation — asks the browser for the device's GPS position, then calls resolveCoords with the result.
    // onReady — called once location resolves (success OR failure).
    //   - Use this to open the report form regardless of whether GPS succeeded, so the user is never stuck.
    const requestGeolocation = useCallback((onReady) => {
        if (!navigator.geolocation) {
            onReady?.();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { longitude, latitude } = position.coords;
                try {
                    await resolveCoords(longitude, latitude);
                } catch {
                    // resolveCoords already handles its own errors internally;
                    // this outer catch is just a safety net.
                }
                onReady?.();
            },
            () => {
                // User denied permission or GPS timed out.
                // Open the form anyway — they can still tap the map to pick a location.
                alert('No se pudo obtener la ubicación. Puedes tocar el mapa para seleccionarla manualmente.');
                onReady?.();
            }
        );
    }, [resolveCoords]);

    return {
        pinnedLocation,
        municipality,
        exactLocation,
        loadingLocation,
        resolveCoords,
        clearLocation,
        requestGeolocation,
    };
}
