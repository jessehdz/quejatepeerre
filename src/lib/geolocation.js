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

export function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

// isAndroidChrome — the only browser where the App Info deep link below is
// known to work. Samsung Internet, Firefox, and in-app webviews all include
// "Android" in their UA but ignore intent: links differently or not at all.
export function isAndroidChrome() {
    return isAndroid() && /Chrome\//.test(navigator.userAgent) && !/SamsungBrowser|Firefox|EdgA|OPR/.test(navigator.userAgent);
}

// openAndroidAppSettings — deep-links into Android's own Settings app, to
// Chrome's App Info > Permissions screen. This is NOT the same thing as
// Chrome's per-site "blocked" memory (that lives inside Chrome itself, and
// no website can link to it — browsers deliberately don't expose that).
// It only helps the narrower case where Chrome itself lacks OS-level
// location access. Only call this when isAndroidChrome() is true.
export function openAndroidAppSettings() {
    window.location.href = 'intent://#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=com.android.chrome;end';
}

// gpsDeniedMessage — "denied" means the browser itself is refusing, so a
// generic "check your settings" is too vague to act on. On iOS the toggle
// lives in the Settings app (not Safari), which trips people up, so we give
// platform-specific steps.
export function gpsDeniedMessage() {
    if (isIOS()) {
        return 'El permiso de ubicación está bloqueado. Ve a Ajustes → Privacidad y Seguridad → Localización → (tu navegador, ej. Safari o Chrome) y selecciona "Mientras se usa la app". Verifica también que la Localización esté activada arriba, en esa misma pantalla. Mientras tanto, toca el mapa para seleccionar la ubicación manualmente.';
    }
    return 'El permiso de ubicación está bloqueado para este sitio. Toca el candado o los tres puntos junto a la dirección del sitio, entra a "Permisos del sitio" → Ubicación, y selecciona "Permitir". Verifica también que la ubicación de tu teléfono esté activada. Mientras tanto, toca el mapa para seleccionar la ubicación manualmente.';
}

// gpsErrorMessage — turns a GeolocationPositionError (or our own 'unsupported'
// Error) into a Spanish message that tells the user what to actually do next.
export function gpsErrorMessage(err) {
    if (err?.message === 'unsupported') {
        return 'Tu navegador no soporta GPS. Toca el mapa para seleccionar la ubicación manualmente.';
    }
    switch (err?.code) {
        case 1: // PERMISSION_DENIED
            return gpsDeniedMessage();
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
