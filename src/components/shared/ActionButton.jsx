import './ActionButton.css';

// Bordered/filled pill button, composed on top of index.css's `.btn` base
// class. `activeColor` (ReportDetail's status picker only) tints the
// button with a per-status color via the --s-color custom property.
function ActionButton({ primary = false, activeColor, icon: Icon, iconSize = 15, label, onClick, disabled = false, ariaLabel, className = '' }) {
    const isActive = !!activeColor;
    return (
        <button
            className={`btn action-btn${primary ? ' primary' : ''}${isActive ? ' active' : ''}${className ? ` ${className}` : ''}`}
            style={isActive ? { '--s-color': activeColor } : undefined}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {Icon && <Icon size={iconSize} className="action-btn-icon" />}
            <span className="action-btn-label">{label}</span>
        </button>
    );
}

export default ActionButton;
