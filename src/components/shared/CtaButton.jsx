import './CtaButton.css';

// Full-width solid CTA button. Shared by Onboarding, GpsPrimer, GpsBlocked,
// and ReportForm's submit/success-close/nearby-duplicate buttons.
function CtaButton({ icon: Icon, label, onClick, disabled = false, className = '' }) {
    return (
        <button
            className={`cta-btn${disabled ? ' disabled' : ''}${className ? ` ${className}` : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {Icon && <Icon size={16} />}
            <span>{label}</span>
        </button>
    );
}

export default CtaButton;
