import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { upvoteReport } from '../lib/api';
import { generateHashtags } from '../lib/constants';
import { getCategoryData, getPhotoFallback } from '../lib/categories';
import { STATUS_MAP, STATUS_BG, STATUS_OPTIONS, daysOpenColor } from '../lib/status';
import { calcDaysOpen, formatDate } from '../lib/dates';
import { buildMapsLink, buildShareMessage, shareReport, formatReportNumber } from '../lib/share';
import { IoArrowBack, IoLocationSharp, IoCalendarOutline, IoCheckmarkCircle, IoShareSocial } from 'react-icons/io5';
import CategoryPill from './shared/CategoryPill';
import StatusBadge from './shared/StatusBadge';
import ActionButton from './shared/ActionButton';
import UpvoteButton from './shared/UpvoteButton';
import { MetaRow, MetaItem } from './shared/MetaRow';
import './ReportDetail.css';

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

    const catData  = getCategoryData(category);
    const daysOpen = calcDaysOpen(created_at);
    const resolved = STATUS_MAP[status] === 'RESUELTO';
    const dateStr  = formatDate(created_at);
    const reportNum = formatReportNumber(id);

    const hashtags = generateHashtags(category, subcategory, municipality);

    const mapsLink = buildMapsLink({ lat, lng, address: exact_location || municipality });

    const shareMessage = buildShareMessage({
        title, description,
        location: exact_location, municipality, dateStr, mapsLink, hashtags,
    });

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
            const newCount = await upvoteReport(id, vote_count);
            setVoted(true);
            onUpdate?.({ ...report, vote_count: newCount });
        } catch (e) { console.error('Vote error:', e); }
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
        await shareReport({
            title, message: shareMessage, imageUrl: image_url,
            onCopied: () => { setCopied(true); setTimeout(() => setCopied(false), 2500); },
        });
    }

    const photoBg = image_url
        ? `url(${image_url}) center/cover no-repeat`
        : getPhotoFallback(category);

    const daysColorVal = daysOpenColor(daysOpen, resolved);

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
                    <CategoryPill catData={catData} subcategory={subcategory} />

                    <StatusBadge
                        statusLabel={STATUS_MAP[currentStatus] || 'ABIERTO'}
                        background={STATUS_BG[STATUS_MAP[currentStatus]] || STATUS_BG['ABIERTO']}
                        daysOpen={daysOpen}
                        resolved={resolved}
                        daysColor={daysColorVal}
                    />
                </div>
            </div>

            {/* ── BODY ── */}
            <div className="rd-body">

                <h1 className="rd-title">{title}</h1>
                <div className="rd-title-meta">
                    <span>{catData.label}</span>
                    <span className="rd-title-num">· {reportNum}</span>
                </div>

                <MetaRow className="rd-meta-row">
                    {(exact_location || municipality) && (
                        <MetaItem icon={IoLocationSharp} iconColor="var(--cel)">
                            <span>{exact_location || municipality}</span>
                        </MetaItem>
                    )}
                    <MetaItem icon={IoCalendarOutline} iconColor="var(--muted)">
                        <span>Reportado el {dateStr}</span>
                    </MetaItem>
                    {municipality && (
                        <MetaItem label="Municipio">
                            <span className="meta-val">{municipality.toUpperCase()}</span>
                        </MetaItem>
                    )}
                    {updated_at && updated_at !== created_at && (
                        <MetaItem label="Última actualización">
                            <span className="meta-val">{formatDate(updated_at)}</span>
                        </MetaItem>
                    )}
                    {lat && lng && (
                        <MetaItem label="Coordenadas">
                            <span className="meta-val">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                        </MetaItem>
                    )}
                    {/* Google Maps link always visible in the meta row */}
                    <MetaItem label="Ver ubicación">
                        <a className="meta-link" href={mapsLink} target="_blank" rel="noreferrer">
                            Abrir en Google Maps ↗
                        </a>
                    </MetaItem>
                </MetaRow>

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
                    <UpvoteButton
                        className="rd-vote-btn"
                        label={voted ? '¡Contado!' : 'Yo También'}
                        voting={voting}
                        voted={voted}
                        onClick={handleVote}
                        disabled={voted || voting}
                    />
                </div>

                {/* ── STATUS UPDATE ── */}
                <div className="rd-section">
                    <div className="rd-section-label">ACTUALIZAR ESTADO</div>
                    <p className="rd-section-hint">
                        ¿Sabes algo nuevo sobre este reporte? Actualiza el estado para mantener a la comunidad informada.
                    </p>
                    <div className="rd-status-btns">
                        {STATUS_OPTIONS.map(opt => (
                            <ActionButton
                                key={opt.value}
                                activeColor={currentStatus === opt.value ? opt.color : undefined}
                                icon={currentStatus === opt.value ? IoCheckmarkCircle : undefined}
                                iconSize={13}
                                label={opt.label}
                                onClick={() => handleStatusChange(opt.value)}
                                disabled={updatingStatus}
                            />
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
                    <ActionButton
                        primary
                        className="rd-share-btn"
                        icon={!copied ? IoShareSocial : undefined}
                        label={copied
                            ? 'Texto copiado ✓'
                            : image_url
                                ? 'Compartir por mensaje (con foto)'
                                : 'Compartir por mensaje'}
                        onClick={handleShare}
                    />
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
