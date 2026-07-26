import { useState } from 'react';
import { CATEGORIES } from '../lib/constants';
import { Megaphone } from "lucide-react";
import { MapPin } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ReportCard.css';

// ── STATUS TRANSLATION ──────────────────────────────────────────────────────
// Supabase stores status in English lowercase ('open', 'in_progress', 'resolved').
// We display them in Spanish uppercase (status pill on report cards).
const STATUS_MAP = {
    'open':           'ABIERTO',
    'in_progress':    'EN REPARACIÓN',
    'resolved':       'RESUELTO',
    // already-translated values pass through unchanged
    'ABIERTO':        'ABIERTO',
    'EN REPARACIÓN':  'EN REPARACIÓN',
    'RESUELTO':       'RESUELTO',
};

const STATUS_BG = {
    'ABIERTO':        'rgba(170,34,20,0.85)',
    'EN REPARACIÓN':  'rgba(176,86,14,0.85)',
    'RESUELTO':       'rgba(42,96,42,0.85)',
};

// ── DAYS CALCULATION ────────────────────────────────────────────────────────
// Supabase stores created_at as an ISO timestamp.
// We calculate days open from that — there is no daysOpen column.
function calcDaysOpen(createdAt) {
    if (!createdAt) return 0;
    const ms = new Date() - new Date(createdAt);
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function formatDate(createdAt) {
    if (!createdAt) return '';
    return new Date(createdAt).toLocaleDateString('es-PR', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

function daysColor(days, resolved) {
    if (resolved) return '#72C472';
    if (days >= 90) return '#FF7A5A';
    if (days >= 30) return '#F0BB5A';
    return '#F0F0E8';
}

// ── PHOTO FALLBACKS ─────────────────────────────────────────────────────────
const PHOTO_FALLBACK = {
    infrastructure: 'radial-gradient(ellipse at 40% 50%, #1A1410 0%, #100E0A 55%, #07060A 100%)',
    security:       'radial-gradient(ellipse at 30% 40%, #1A0808 0%, #100404 55%, #080000 100%)',
    environment:    'radial-gradient(ellipse at 55% 65%, #1E2A14 0%, #141C0C 50%, #0A100A 100%)',
    community:      'radial-gradient(ellipse at 45% 55%, #1E1808 0%, #14100A 50%, #0A0806 100%)',
    services:       'radial-gradient(ellipse at 50% 60%, #0E2A38 0%, #071C2A 50%, #030E18 100%)',
    other:          'radial-gradient(ellipse at 50% 50%, #1A1A1A 0%, #0E0E0E 100%)',
};

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
    const statusLabel = STATUS_MAP[status] || 'ABIERTO';
    const statusBg    = STATUS_BG[statusLabel] || STATUS_BG['ABIERTO'];
    const resolved    = statusLabel === 'RESUELTO';

    // Calculate days from Supabase created_at timestamp
    const daysOpen = calcDaysOpen(created_at);
    const daysNum  = resolved ? '✓' : String(daysOpen);
    const daysWord = resolved
        ? 'RESUELTO'
        : daysOpen === 1
            ? 'DÍA'
            : 'DÍAS';
    const daysClr = daysColor(daysOpen, resolved);

    const catData = CATEGORIES.find(c => c.key === category) || CATEGORIES[0];
    const CatIcon = catData.icon;

    const photoBg = image_url
        ? `url(${image_url}) center/cover no-repeat`
        : (PHOTO_FALLBACK[category] || PHOTO_FALLBACK.other);

    const reportNum = id
        ? `QPR-${String(id).slice(0, 3).toUpperCase()}`
        : 'QPR-YY-???';

    // Exact address (or municipality fallback) → opens the device's default maps app
    const mapsQuery = exact_location || municipality || 'Puerto Rico';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

    // Expandable details section
    const [expanded, setExpanded] = useState(false);

    async function handleVote() {
        if (voted) return;
        setVoted(true);
        try {
            const { data, error } = await supabase.rpc('increment_vote', { report_id: id });
            if (error) {
                // RPC not available — fallback: read fresh count then update
                const { data: fresh } = await supabase
                    .from('reports').select('vote_count').eq('id', id).single();
                const current = fresh?.vote_count ?? vote_count;
                const { error: ue } = await supabase
                    .from('reports').update({ vote_count: current + 1 }).eq('id', id);
                if (!ue) {
                    onVote?.({ ...report, vote_count: current + 1 });
                } else {
                    console.error('Vote error:', ue);
                    setVoted(false);
                }
            } else {
                onVote?.({ ...report, vote_count: typeof data === 'number' ? data : vote_count + 1 });
            }
        } catch (err) {
            console.error(err);
            setVoted(false);
        }
    }

    return (
        <article className="rc-article">

            <div className="rc-photo" style={{ background: photoBg }}>
                <div className="rc-scrim" />

                {/* TOP ROW: category pill (left) | status badge (right) */}
                <div className="rc-top-row">
                    <div className="rc-cat-pill">
                        <span className="rc-cat-left" style={{ background: catData.color }}>
                            <span className="rc-cat-icon">{CatIcon && <CatIcon />}</span>
                        </span>
                        {subcategory && (
                            <span className="rc-cat-right">
                                {subcategory.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <span className="rc-status" style={{ background: statusBg }}>
                        <span className="rc-status-label">{statusLabel}</span>

                        <span className="rc-days-row">
                            <span className="rc-days-num" style={{ color: daysClr }}>
                                {daysNum}
                            </span>
                            <span className="rc-days-word">{daysWord}</span>
                        </span>
                    </span>
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
                        <button
                            className={`rc-upvote ${voted ? 'voted' : ''}`}
                            onClick={handleVote}
                            disabled
                        >
                            <Megaphone size={18} />
                            <span className="rc-vote-count">{vote_count}</span>
                        </button>
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
                        <div className="rc-date-text">{formatDate(created_at)}</div>
                    </div>

                    <div className="rc-dropdown-actions">
                        <button className="btn rc-action-btn" aria-label="Compartir" onClick={() => onShare?.(report)}>
                            <Share2 size={15} className="rc-action-icon" />
                            <span className="rc-action-label">Compartir →</span>
                        </button>
                        <button className="btn rc-action-btn" aria-label="Actualizar estado" onClick={() => onUpdateStatus?.(report)}>
                            <RefreshCw size={15} className="rc-action-icon" />
                            <span className="rc-action-label">Actualizar estado →</span>
                        </button>
                        <button className="btn rc-action-btn primary" onClick={() => onDetails?.(report)}>
                            Más detalles →
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}

export default ReportCard;
