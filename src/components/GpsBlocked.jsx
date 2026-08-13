import { isIOS, isAndroidChrome, openAndroidAppSettings } from '../lib/geolocation';
import CtaButton from './shared/CtaButton';
import BottomSheet from './shared/BottomSheet';
import './GpsBlocked.css';

/*
  GpsBlocked — shown instead of a plain alert() when the browser reports
  geolocation permission as 'denied' for this site. No website can deep-link
  straight into "unblock this site" — both iOS and Android intentionally
  withhold that (a site being able to jump into system settings would be a
  privacy hole). So this shows only the steps for the visitor's actual
  platform, and on Android Chrome adds a real settings deep link for the one
  case that IS linkable: Chrome's own OS-level location permission.
*/
function GpsBlocked({ onClose }) {
    const ios = isIOS();
    const androidChrome = isAndroidChrome();

    return (
        <BottomSheet onClose={onClose} zIndex={1600} align="left" className="gps-blocked-sheet">
            <h3 className="gps-blocked-title">El permiso de ubicación está bloqueado</h3>
            <p className="gps-blocked-body">
                Ningún sitio web puede abrir esa pantalla de ajustes directamente por tu
                seguridad — pero son solo unos pasos:
            </p>

            {ios ? (
                <ol className="gps-blocked-steps">
                    <li>Abre <strong>Ajustes</strong> → <strong>Privacidad y Seguridad</strong> → <strong>Localización</strong>.</li>
                    <li>Busca tu navegador (Safari o Chrome) y selecciona <strong>"Mientras se usa la app"</strong>.</li>
                    <li>Verifica que Localización esté activada arriba de esa pantalla.</li>
                </ol>
            ) : (
                <>
                    <ol className="gps-blocked-steps">
                        <li>Toca el candado o los tres puntos junto a la dirección del sitio.</li>
                        <li>Entra a <strong>"Permisos del sitio"</strong> → <strong>Ubicación</strong> → <strong>Permitir</strong>.</li>
                        <li>Verifica que la ubicación del teléfono esté activada.</li>
                    </ol>
                    {androidChrome && (
                        <button className="gps-blocked-settings-btn" onClick={openAndroidAppSettings}>
                            Abrir ajustes de Chrome en Android
                        </button>
                    )}
                </>
            )}

            <p className="gps-blocked-note">
                Mientras tanto, toca el mapa para seleccionar tu ubicación manualmente.
            </p>

            <CtaButton className="gps-blocked-close" label="Entendido" onClick={onClose} />
        </BottomSheet>
    );
}

export default GpsBlocked;
