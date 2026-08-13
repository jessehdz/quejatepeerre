import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { upvoteReport } from '../lib/api';
import { getCategoryData, getPhotoFallback } from '../lib/categories';
import { translateStatus, statusBackground, daysOpenColor } from '../lib/status';
import { calcDaysOpen, formatDate } from '../lib/dates';
import { buildMapsLink, formatReportNumber } from '../lib/share';
import CategoryPill from './shared/CategoryPill';
import StatusBadge from './shared/StatusBadge';
import ActionButton from './shared/ActionButton';
import UpvoteButton from './shared/UpvoteButton';
import './ReportCard.css';

function ReportCard({ report, onDetails, onVote, onShare, onUpdateStatus }) {
    const {
        id,
        category   = 'infrastructure',
        subcategory,
        title,
        municipality,
        exact_location,
        status     = 'open',
        vote_count = 0,
        image_url,
        created_at,
    } = report;

    /* vote_count is the single source of truth (owned by App.jsx's reports array) — we render it straight from props and push updates back up via onVote so ReportDetail stays in sync instead of drifting apart. */
    const [voted, setVoted] = useState(false);

    // Translate Supabase status → Spanish display label
    const statusLabel = translateStatus(status);
    const statusBg    = statusBackground(statusLabel);
    const resolved    = statusLabel === 'RESUELTO';

    // Calculate days from Supabase created_at timestamp
    const daysOpen = calcDaysOpen(created_at);
    const daysClr = daysOpenColor(daysOpen, resolved);

    const catData = getCategoryData(category);

    const photoBg = image_url
        ? `url(${image_url}) center/cover no-repeat`
        : getPhotoFallback(category);

    const reportNum = formatReportNumber(id);

    // Exact address (or municipality fallback) → opens the device's default maps app
    const mapsUrl = buildMapsLink({ address: exact_location || municipality });

    // Expandable details section
    const [expanded, setExpanded] = useState(false);

    async function handleVote() {
        if (voted) return;
        setVoted(true);
        try {
            const newCount = await upvoteReport(id, vote_count);
            onVote?.({ ...report, vote_count: newCount });
        } catch (err) {
            console.error('Vote error:', err);
            setVoted(false);
        }
    }

    return (
        <article className="rc-article">

            <div className="rc-photo" style={{ background: photoBg }}>
                <div className="rc-scrim" />

                {/* TOP ROW: category pill (left) | status badge (right) */}
                <div className="rc-top-row">
                    <CategoryPill catData={catData} subcategory={subcategory} />

                    <StatusBadge
                        statusLabel={statusLabel}
                        background={statusBg}
                        daysOpen={daysOpen}
                        resolved={resolved}
                        daysColor={daysClr}
                    />
                </div>

                {/* BOTTOM CONTENT */}
                <div className="rc-bottom">

                    <div className="rc-muni-row">
                        <MapPin size={14} />
                        <span className="rc-muni">
                            {municipality ? municipality.toUpperCase() : 'PUERTO RICO'}
                        </span>
                        <div style={{ flex: 1 }} />
                        {/* Disabled for now — voting will require a GPS radius check
                            before it's re-enabled. handleVote/voted stay wired so
                            that check can just remove the `disabled` prop later. */}
                        <UpvoteButton
                            className="rc-upvote-stat"
                            count={vote_count}
                            voted={voted}
                            onClick={handleVote}
                            disabled
                        />
                    </div>
                </div>
                <button
                    className="rc-toggle-tab"
                    
                    onClick={() => setExpanded(v => !v)}
                    aria-expanded={expanded}
                    aria-label={expanded ? 'Ocultar detalles' : 'Ver más detalles'}
                >
                    <span className="rc-toggle-label">{expanded ? 'Ver menos' : 'Ver más'}</span>
                    <ChevronDown size={14} className={expanded ? 'rc-chevron open' : 'rc-chevron'} />
                </button>
            </div>

            {expanded && (
                <div className="rc-dropdown">
                    <div className="rc-dropdown-strip"  />

                    <div className="rc-dropdown-head">
                        <div className="rc-dropdown-title-wrap">
                            <h3 className="rc-dropdown-title">{title || catData.label}</h3>
                            <div className="rc-dropdown-meta">
                                <span>{catData.label}</span>
                                <span className="rc-dropdown-num">· {reportNum}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rc-dropdown-location">
                        <div className="rc-location-row">
                            <span className="rc-location-pin" style={{ borderColor: catData.color }} />
                            <a
                                className="rc-location-text"
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {exact_location || (municipality ? municipality.toUpperCase() : 'PUERTO RICO')}
                            </a>
                        </div>
                        <div className="rc-date-text">{formatDate(created_at, { month: 'short', fallback: '' })}</div>
                    </div>

                    <div className="rc-dropdown-actions">
                        <ActionButton icon={Share2} label="Compartir →" ariaLabel="Compartir" onClick={() => onShare?.(report)} />
                        <ActionButton icon={RefreshCw} label="Actualizar estado →" ariaLabel="Actualizar estado" onClick={() => onUpdateStatus?.(report)} />
                        <ActionButton primary label="Más detalles →" onClick={() => onDetails?.(report)} />
                    </div>
                </div>
            )}
        </article>
    );
}

export default ReportCard;
