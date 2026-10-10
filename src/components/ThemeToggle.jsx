import {useTheme} from '../hooks/useTheme';
import './ThemeToggle.css';

const OPTIONS = [['system', 'Sistema'], ['light', 'Claro'], ['dark', 'Oscuro']];

function ThemeToggle() {
    const [pref, setPref] = useTheme();
    
    return (
        <div className="theme-toggle" role="group" aria-label="Aparencia">
            {OPTIONS.map(([key, label]) => (
                <button
                    key={key}
                    className={pref === key ? 'active' : ''}
                    onClick={() => setPref(key)}
                    aria-pressed={pref === key}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export default ThemeToggle;