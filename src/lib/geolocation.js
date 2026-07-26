/*
  geolocation.js — cross-browser wrapper around navigator.geolocation.

  Why this exists: on some mobile browsers a plain getCurrentPosition() call
  with no options either hangs forever (no default timeout) or fails outright
  with high-accuracy GPS indoors / on older Android WebViews. We first try a
  fast high-accuracy fix, then fall back once to a network-based (cell/WiFi)
  fix, which is slower to lock on but far more likely to succeed on devices
  where the GPS chip itself struggles.
*/

export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('unsupported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            resolve,
            (err) => {
                if (err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE) {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
                    );
                } else {
                    reject(err);
                }
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    });
}

// gpsErrorMessage — turns a GeolocationPositionError (or our own 'unsupported'
// Error) into a Spanish message that tells the user what to actually do next.
export function gpsErrorMessage(err) {
    if (err?.message === 'unsupported') {
        return 'Tu navegador no soporta GPS. Toca el mapa para seleccionar la ubicación manualmente.';
    }
    switch (err?.code) {
        case 1: // PERMISSION_DENIED
            return 'El permiso de ubicación está bloqueado. Actívalo en la configuración de tu navegador, o toca el mapa para seleccionar la ubicación manualmente.';
        case 2: // POSITION_UNAVAILABLE
            return 'No se pudo determinar tu ubicación. Verifica que el GPS esté activado en tu teléfono, o toca el mapa para seleccionarla manualmente.';
        case 3: // TIMEOUT
            return 'La búsqueda de tu ubicación tardó demasiado. Verifica tu señal GPS, o toca el mapa para seleccionarla manualmente.';
        default:
            return 'No se pudo obtener tu ubicación. Puedes tocar el mapa para seleccionarla manualmente.';
    }
}

// getGeolocationPermissionState — 'granted' | 'denied' | 'prompt' | 'unknown'.
// Falls back to 'unknown' on browsers without the Permissions API (some
// mobile Safari/Firefox versions), so callers should treat 'unknown' like
// 'prompt' — i.e. we haven't confirmed permission yet.
export async function getGeolocationPermissionState() {
    if (!navigator.permissions?.query) return 'unknown';
    try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        return status.state;
    } catch {
        return 'unknown';
    }
}
