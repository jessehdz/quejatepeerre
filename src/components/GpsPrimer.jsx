import { IoLocationSharp } from 'react-icons/io5';
import './GpsPrimer.css';

/*
  GpsPrimer — shown once before the browser's native GPS permission
  prompt, explaining why the app wants location access. Mobile browsers are
  far more likely to grant (and less likely to silently ignore) a permission
  request when the user already understands why it's being asked.
*/
function GpsPrimer({ onAllow, onSkip }) {
    return (
        <div className="gps-primer-backdrop" onClick={onSkip}>
            <div className="gps-primer-sheet" onClick={e => e.stopPropagation()}>
                <div className="gps-primer-icon"><IoLocationSharp size={28} /></div>
                <h3 className="gps-primer-title">Usamos tu ubicación para ubicar el reporte</h3>
                <p className="gps-primer-body">
                    Con tu GPS llenamos automáticamente el municipio y la dirección exacta del
                    problema, para que no tengas que escribirla. Solo se usa para este reporte —
                    tu reporte sigue siendo 100% anónimo.
                </p>
                <button className="gps-primer-allow" onClick={onAllow}>
                    Activar GPS
                </button>
                <button className="gps-primer-skip" onClick={onSkip}>
                    Escribir dirección manualmente
                </button>
            </div>
        </div>
    );
}

export default GpsPrimer;
