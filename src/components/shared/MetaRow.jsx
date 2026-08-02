import './MetaRow.css';

// Bordered stack of report metadata rows — shared by ReportDetail's meta
// section and ReportForm's post-submit summary. Each row is either an
// icon + text pair or a label + value pair; pass whichever fits as children.
export function MetaRow({ children, className = '' }) {
    return <div className={`meta-row${className ? ` ${className}` : ''}`}>{children}</div>;
}

export function MetaItem({ icon: Icon, iconColor, label, children }) {
    return (
        <div className="meta-item">
            {Icon && <Icon size={13} color={iconColor} />}
            {label && <span className="meta-label">{label}</span>}
            {children}
        </div>
    );
}
