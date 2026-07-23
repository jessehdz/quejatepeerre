import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CATEGORIES, generateHashtags } from '../lib/constants';
import { IoArrowBack, IoLocationSharp, IoCalendarOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { TiArrowSortedUp } from 'react-icons/ti';
import './ReportDetail.css';

// ── HELPERS ────────────────────────────────────────────────────────
const STATUS_MAP = {
    'open':           'ABIERTO',
    'in_progress':    'EN REPARACIÓN',
    'resolved':       'RESUELTO',
    'ABIERTO':        'ABIERTO',
    'EN REPARACIÓN':  'EN REPARACIÓN',
    'RESUELTO':       'RESUELTO',
};

const STATUS_OPTIONS = [
    { value: 'open',        label: 'ABIERTO',       color: '#AA2214' },
    { value: 'in_progress', label: 'EN REPARACIÓN', color: '#B05610' },
    { value: 'resolved',    label: 'RESUELTO',      color: '#2A602A' },
];

const STATUS_BG = {
    'ABIERTO':        '#AA2214',
    'EN REPARACIÓN':  '#B05610',
    'RESUELTO':       '#2A602A',
};

const PHOTO_FALLBACK = {
    infrastructure: 'radial-gradient(ellipse at 40% 50%, #1A1410 0%, #100E0A 55%, #07060A 100%)',
    security:       'radial-gradient(ellipse at 30% 40%, #1A0808 0%, #100404 55%, #080000 100%)',
    environment:    'radial-gradient(ellipse at 55% 65%, #1E2A14 0%, #141C0C 50%, #0A100A 100%)',
    community:      'radial-gradient(ellipse at 45% 55%, #1E1808 0%, #14100A 50%, #0A0806 100%)',
    services:       'radial-gradient(ellipse at 50% 60%, #0E2A38 0%, #071C2A 50%, #030E18 100%)',
    other:          'radial-gradient(ellipse at 50% 50%, #1A1A1A 0%, #0E0E0E 100%)',
};

function calcDaysOpen(createdAt) {
    if (!createdAt) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(createdAt)) / 86400000));
}

function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-PR', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

function ReportDetail({ report, onBack, onUpdate }) {
    const {
        id,
        category      = 'infrastructure',
        subcategory,
        title,
        description,
        municipality,
        exact_location,
        status        = 'open',
        vote_count    = 0,
        image_url,
        created_at,
        updated_at,
        lat,
        lng,
    } = report;

    const catData  = CATEGORIES.find(c => c.key === category) || CATEGORIES[0];
    const CatIcon  = catData.icon;
    const daysOpen = calcDaysOpen(created_at);
    const resolved = STATUS_MAP[status] === 'RESUELTO';
    const dateStr  = formatDate(created_at);
    const reportNum = id ? `QPR-${String(id).slice(0, 6).toUpperCase()}` : 'QPR-??????';

    const hashtags = generateHashtags(category, subcategory, municipality);
    const hashStr  = hashtags.join(' ');

    // Google Maps link — exact coords if available, address string otherwise
    const mapsLink = (lat && lng)
        ? `https://maps.google.com/?q=${lat},${lng}`
        : `https://maps.google.com/?q=${encodeURIComponent(exact_location || municipality || 'Puerto Rico')}`;

    // Full share message — title, description, location, municipality, date,
    // Google Maps link, hashtags, site URL
    const shareMessage = [
        `🚨 ${title}`,
        description || null,
        ``,
        `📍 ${exact_location || municipality || 'Puerto Rico'}`,
        `🏛 Municipio: ${municipality || 'Puerto Rico'}`,
        `📅 Reportado: ${dateStr}`,
        `🗺 Ver en el mapa: ${mapsLink}`,
        ``,
        hashStr,
        `quejatepeerre.com`,
    ].filter(l => l !== null).join('\n');

    // ── YO TAMBIÉN ────────────────────────────────────────────────
    // vote_count is the single source of truth (owned by App.jsx's reports
    // array) — we render it straight from props and push updates back up
    // via onUpdate so ReportCard stays in sync instead of drifting apart.
    const [voted, setVoted]   = useState(false);
    const [voting, setVoting] = useState(false);

    async function handleVote() {
        if (voted || voting) return;
        setVoting(true);
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
                    setVoted(true);
                    onUpdate?.({ ...report, vote_count: current + 1 });
                } else console.error('Vote error:', ue);
            } else {
                setVoted(true);
                onUpdate?.({ ...report, vote_count: typeof data === 'number' ? data : vote_count + 1 });
            }
        } catch (e) { console.error(e); }
        finally { setVoting(false); }
    }

    // ── STATUS UPDATE ─────────────────────────────────────────────
    const [currentStatus, setCurrentStatus]   = useState(status);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusUpdated, setStatusUpdated]   = useState(false);

    async function handleStatusChange(newStatus) {
        if (newStatus === currentStatus || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('reports').update({ status: newStatus }).eq('id', id);
            if (!error) {
                setCurrentStatus(newStatus);
                setStatusUpdated(true);
                onUpdate?.({ ...report, status: newStatus });
                setTimeout(() => setStatusUpdated(false), 2500);
            }
        } catch (e) { console.error(e); }
        finally { setUpdatingStatus(false); }
    }

    // ── SHARE ─────────────────────────────────────────────────────
    const [copied, setCopied] = useState(false);

    async function handleShare() {
        // Mobile: opens native share sheet (iMessage, WhatsApp, Signal, etc.)
        // Attaches the photo as a file if the report has one and the browser supports it.
        // Desktop: copies the text to clipboard.
        if (navigator.share) {
            try {
                if (image_url && navigator.canShare) {
                    try {
                        const res  = await fetch(image_url);
                        const blob = await res.blob();
                        const file = new File([blob], 'reporte-qpr.jpg', { type: blob.type });
                        if (navigator.canShare({ files: [file] })) {
                            await navigator.share({ files: [file], text: shareMessage });
                            return;
                        }
                    } catch (_) { /* photo fetch failed — fall through to text-only */ }
                }
                await navigator.share({ title, text: shareMessage });
            } catch (_) { /* user cancelled — not an error */ }
        } else {
            navigator.clipboard.writeText(shareMessage).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    }

    const photoBg = image_url
        ? `url(${image_url}) center/cover no-repeat`
        : (PHOTO_FALLBACK[category] || PHOTO_FALLBACK.other);

    const daysColor = resolved ? '#72C472'
        : daysOpen >= 90 ? '#FF7A5A'
        : daysOpen >= 30 ? '#F0BB5A'
        : '#F0F0E8';

    return (
        <div className="rd-page">

            {/* ── HERO ── */}
            <div className="rd-hero" style={{ background: photoBg }}>
                <div className="rd-hero-scrim" />

                <button className="rd-back" onClick={onBack}>
                    <IoArrowBack size={20} />
                    <span>Volver</span>
                </button>

                <div className="rd-hero-top">
                    <div className="rd-cat-pill">
                        <span className="rd-cat-left" style={{ background: catData.color }}>
                            <span className="rd-cat-icon">{CatIcon && <CatIcon />}</span>
                            {catData.label.toUpperCase()}
                        </span>
                        {subcategory && (
                            <span className="rd-cat-right">{subcategory.toUpperCase()}</span>
                        )}
                    </div>
                    <span className="rd-status-badge"
                        style={{ background: STATUS_BG[STATUS_MAP[currentStatus]] || STATUS_BG['ABIERTO'] }}>
                        <span className="rd-status-dot" />
                        {STATUS_MAP[currentStatus] || 'ABIERTO'}
                    </span>
                </div>

                <div className="rd-hero-bottom">
                    <div className="rd-report-num">{reportNum}</div>
                    <div className="rd-days-hero">
                        <span className="rd-days-num" style={{ color: daysColor }}>
                            {resolved ? '✓' : daysOpen}
                        </span>
                        <span className="rd-days-word">
                            {resolved ? 'RESUELTO' : daysOpen === 1 ? 'DÍA ABIERTO' : 'DÍAS ABIERTO'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── BODY ── */}
            <div className="rd-body">

                <h1 className="rd-title">{title}</h1>

                <div className="rd-meta-row">
                    {(exact_location || municipality) && (
                        <div className="rd-meta-item">
                            <IoLocationSharp size={13} color="var(--cel)" />
                            <span>{exact_location || municipality}</span>
                        </div>
                    )}
                    <div className="rd-meta-item">
                        <IoCalendarOutline size={13} color="var(--muted)" />
                        <span>Reportado el {dateStr}</span>
                    </div>
                    {municipality && (
                        <div className="rd-meta-item">
                            <span className="rd-meta-label">Municipio</span>
                            <span className="rd-meta-val">{municipality.toUpperCase()}</span>
                        </div>
                    )}
                    {updated_at && updated_at !== created_at && (
                        <div className="rd-meta-item">
                            <span className="rd-meta-label">Última actualización</span>
                            <span className="rd-meta-val">{formatDate(updated_at)}</span>
                        </div>
                    )}
                    {lat && lng && (
                        <div className="rd-meta-item">
                            <span className="rd-meta-label">Coordenadas</span>
                            <span className="rd-meta-val">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                        </div>
                    )}
                    {/* Google Maps link always visible in the meta row */}
                    <div className="rd-meta-item">
                        <span className="rd-meta-label">Ver ubicación</span>
                        <a className="rd-maps-link" href={mapsLink} target="_blank" rel="noreferrer">
                            Abrir en Google Maps ↗
                        </a>
                    </div>
                </div>

                {description && (
                    <div className="rd-section">
                        <div className="rd-section-label">DESCRIPCIÓN</div>
                        <p className="rd-description">{description}</p>
                    </div>
                )}

                {/* ── YO TAMBIÉN ── */}
                <div className="rd-vote-block">
                    <div className="rd-vote-left">
                        <div className="rd-vote-num">{vote_count}</div>
                        <div className="rd-vote-label">VECINOS DICEN<br />YO TAMBIÉN</div>
                    </div>
                    <button
                        className={`rd-vote-btn${voted ? ' voted' : ''}`}
                        onClick={handleVote}
                        disabled={voted || voting}
                    >
                        <TiArrowSortedUp size={20} />
                        {voted ? '¡Contado!' : voting ? '...' : 'Yo También'}
                    </button>
                </div>

                {/* ── STATUS UPDATE ── */}
                <div className="rd-section">
                    <div className="rd-section-label">ACTUALIZAR ESTADO</div>
                    <p className="rd-section-hint">
                        ¿Sabes algo nuevo sobre este reporte? Actualiza el estado para mantener a la comunidad informada.
                    </p>
                    <div className="rd-status-btns">
                        {STATUS_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                className={`rd-status-btn${currentStatus === opt.value ? ' active' : ''}`}
                                style={{ '--s-color': opt.color }}
                                onClick={() => handleStatusChange(opt.value)}
                                disabled={updatingStatus}
                            >
                                {currentStatus === opt.value && <IoCheckmarkCircle size={13} />}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {statusUpdated && <p className="rd-status-confirm">✓ Estado actualizado</p>}
                </div>

                {/* ── HASHTAGS ── */}
                <div className="rd-section">
                    <div className="rd-section-label">HASHTAGS</div>
                    <div className="rd-hashtags">
                        {hashtags.map(tag => (
                            <span key={tag} className="rd-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                {/* ── SHARE — one button, native sheet, with photo + maps link ── */}
                <div className="rd-section">
                    <div className="rd-section-label">COMPARTIR REPORTE</div>
                    <div className="rd-share-preview">
                        <p className="rd-share-text">{shareMessage}</p>
                    </div>
                    <button className="rd-share-main-btn" onClick={handleShare}>
                        {copied
                            ? '✓ Texto copiado'
                            : image_url
                                ? '📱 Compartir por mensaje (con foto)'
                                : '📱 Compartir por mensaje'}
                    </button>
                    {!navigator.share && !copied && (
                        <p className="rd-share-hint">
                            En tu celular, este botón abre el menú de mensajes directo.
                        </p>
                    )}
                </div>

                <div style={{ height: 32 }} />
            </div>
        </div>
    );
}

export default ReportDetail;
