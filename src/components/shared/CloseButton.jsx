import { IoCloseCircle } from 'react-icons/io5';
import './CloseButton.css';

// Dismiss control. `variant="plain"` renders a literal × glyph (Onboarding),
// `variant="icon"` (default) renders IoCloseCircle. `filled` gives it a
// dark circular backdrop. Positioning (absolute placement, colors) is left
// to the caller via `className`, since it varies per use site.
function CloseButton({ variant = 'icon', filled = false, size = 28, onClick, ariaLabel, className = '' }) {
    return (
        <button
            className={`close-btn-shared${filled ? ' filled' : ''}${className ? ` ${className}` : ''}`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {variant === 'plain'
                ? <span className="close-btn-glyph" style={{ fontSize: size * 0.78 }}>×</span>
                : <IoCloseCircle size={size} />}
        </button>
    );
}

export default CloseButton;
