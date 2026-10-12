import './StatusBadge.css';
import { STATUS_TEXT } from '../../lib/status';

// Status badge — label on top, days-open number + word stacked underneath,
// all in one colored box. Shared by ReportCard and ReportDetail.
function StatusBadge({ statusLabel, background, daysOpen, resolved, ink }) {
    const daysNum  = resolved ? '✓' : String(daysOpen);
    const daysWord = resolved ? 'RESUELTO' : daysOpen === 1 ? 'DÍA' : 'DÍAS';
    const ink = STATUS_TEXT[statusLabel] || '#05110F';
    return (
        <span className="status-badge" style={{ background }}>
            <span className="status-badge-label">{statusLabel}</span>
            <span className="status-badge-days">
                <span className="status-badge-days-num" style={{ color: ink }}>{daysNum}</span>
                <span className="status-badge-days-word">{daysWord}</span>
            </span>
        </span>
    );
}

export default StatusBadge;
