import './BottomSheet.css';

// Fixed backdrop + slide-up rounded-top sheet. Shared by Onboarding,
// GpsPrimer, GpsBlocked, and ReportForm's three screens (main form, nearby,
// success). `zIndex` stays per-caller since stacking order differs (and
// Onboarding drops its backdrop below the bottom nav on its last slide).
// `className`/`backdropClassName` are escape hatches for the handful of
// visual deltas (background, radius, padding) each caller still needs.
function BottomSheet({
    onClose, children, zIndex, align = 'center', scrollable = false,
    className = '', backdropClassName = '',
}) {
    return (
        <div
            className={`sheet-backdrop${backdropClassName ? ` ${backdropClassName}` : ''}`}
            style={{ zIndex }}
            onClick={onClose}
        >
            <div
                className={`sheet-panel sheet-align-${align}${scrollable ? ' sheet-scrollable' : ''}${className ? ` ${className}` : ''}`}
                style={{ zIndex: zIndex + 1 }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default BottomSheet;
