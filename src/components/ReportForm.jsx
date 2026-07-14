import { useState, useMemo } from 'react';
import { CATEGORIES, CONTEXT_CHIPS, generateTitle, generateHashtags } from '../lib/constants';
import { submitReport, uploadImage, validatePhoto } from '../lib/api';
import { getMunicipality, getExactLocation, forwardGeocode } from '../lib/geocode';
import './ReportForm.css';
import { IoCloseCircle, IoCamera, IoImagesOutline, IoLocationSharp } from 'react-icons/io5';

function distanceMetres(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
const NEARBY_METRES = 30;

function ReportForm({ isOpen, onClose, lng, lat, municipality, exactLocation, onSubmit, onRequestGps, reports = [] }) {

    // ── LOCATION ───────────────────────────────────────────────────
    const [editingLoc, setEditingLoc]       = useState(false);
    const [locQuery, setLocQuery]           = useState('');
    const [locLoading, setLocLoading]       = useState(false);
    const [locError, setLocError]           = useState(null);
    const [gpsLoading, setGpsLoading]       = useState(false);
    const [overrideLng, setOverrideLng]     = useState(null);
    const [overrideLat, setOverrideLat]     = useState(null);
    const [overrideMuni, setOverrideMuni]   = useState(null);
    const [overrideExact, setOverrideExact] = useState(null);

    const resolvedLng   = overrideLng   ?? lng;
    const resolvedLat   = overrideLat   ?? lat;
    const resolvedMuni  = overrideMuni  ?? municipality;
    const resolvedExact = overrideExact ?? exactLocation;

    const nearbyReports = useMemo(() => {
        if (!resolvedLat || !resolvedLng) return [];
        return reports.filter(r => r.lat && r.lng && distanceMetres(resolvedLat, resolvedLng, r.lat, r.lng) <= NEARBY_METRES);
    }, [resolvedLat, resolvedLng, reports]);

    const [nearbyDismissed, setNearbyDismissed] = useState(false);
    const showNearby = nearbyReports.length > 0 && !nearbyDismissed;

    async function handleGpsInForm() {
        if (!navigator.geolocation) { alert('GPS no disponible.'); return; }
        setGpsLoading(true);
        setNearbyDismissed(false);
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { longitude, latitude } }) => {
                try {
                    const [muni, exact] = await Promise.all([getMunicipality(longitude, latitude), getExactLocation(longitude, latitude)]);
                    setOverrideLng(longitude); setOverrideLat(latitude);
                    setOverrideMuni(muni); setOverrideExact(exact);
                } catch (e) { console.error(e); }
                setGpsLoading(false);
            },
            () => { alert('No se pudo obtener la ubicaci\u00f3n. Verifica los permisos de GPS.'); setGpsLoading(false); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    async function handleLocSearch() {
        if (!locQuery.trim()) return;
        setLocLoading(true); setLocError(null); setNearbyDismissed(false);
        try {
            const result = await forwardGeocode(locQuery.trim());
            if (!result) { setLocError('No encontramos esa direcci\u00f3n. Intenta con la calle, barrio, o municipio.'); return; }
            setOverrideLng(result.lng); setOverrideLat(result.lat);
            setOverrideMuni(result.municipality); setOverrideExact(result.exactLocation);
            setEditingLoc(false); setLocQuery('');
        } catch (e) {
            setLocError('Error buscando la direcci\u00f3n. Verifica tu conexi\u00f3n e intenta de nuevo.');
        } finally { setLocLoading(false); }
    }

    // ── CATEGORY + SUBCATEGORY ─────────────────────────────────────
    const [category, setCategory]       = useState(null);
    const [subcategory, setSubcategory] = useState(null);
    const selectedCat = CATEGORIES.find(c => c.key === category);
    function handleCategorySelect(key) { setCategory(key); setSubcategory(null); setSelectedChips([]); }

    // ── CONTEXT CHIPS ──────────────────────────────────────────────
    const [selectedChips, setSelectedChips] = useState([]);
    function toggleChip(key) {
        setSelectedChips(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    }

    // ── AUTO TITLE + DESCRIPTION ───────────────────────────────────
    const autoTitle = useMemo(() => generateTitle(category, subcategory, resolvedMuni), [category, subcategory, resolvedMuni]);
    const autoDescription = useMemo(() => {
        if (!category || !subcategory) return '';
        return selectedChips.map(k => CONTEXT_CHIPS.find(c => c.key === k)?.text).filter(Boolean).join(' ');
    }, [category, subcategory, selectedChips]);

    // ── PHOTO ──────────────────────────────────────────────────────
    const [photo, setPhoto]                   = useState(null);
    const [photoPreview, setPhotoPreview]     = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoError, setPhotoError]         = useState(null);

    function handlePhotoChange(e) {
        const file = e.target.files[0]; if (!file) return;
        const err = validatePhoto(file); if (err) { setPhotoError(err); e.target.value = ''; return; }
        setPhotoError(null); setPhoto(file);
        const reader = new FileReader(); reader.onloadend = () => setPhotoPreview(reader.result); reader.readAsDataURL(file);
    }
    function handleRemovePhoto() { setPhoto(null); setPhotoPreview(null); setPhotoError(null); }

    // ── SUBMISSION ─────────────────────────────────────────────────
    const [submitting, setSubmitting]         = useState(false);
    const [submitError, setSubmitError]       = useState(null);
    const [success, setSuccess]               = useState(false);
    const [savedImageURL, setSavedImageURL]   = useState(null);
    const [errors, setErrors]                 = useState({});

    const isValid = resolvedLat && category && subcategory && selectedChips.length > 0;

    function validate() {
        const e = {};
        if (!resolvedLat)          e.location    = 'Selecciona una ubicaci\u00f3n.';
        if (!category)             e.category    = 'Selecciona una categor\u00eda.';
        if (!subcategory)          e.subcategory = 'Selecciona una subcategor\u00eda.';
        if (!selectedChips.length) e.chips       = 'Selecciona al menos una descripci\u00f3n.';
        setErrors(e); return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setSubmitting(true); setSubmitError(null);
        try {
            let imageURL = null;
            if (photo) { setUploadingPhoto(true); imageURL = await uploadImage(photo); setUploadingPhoto(false); }
            await submitReport({ category, subcategory, title: autoTitle, description: autoDescription,
                lng: resolvedLng, lat: resolvedLat, municipality: resolvedMuni || 'Puerto Rico',
                exact_location: resolvedExact || null, image_url: imageURL,
                draft: false, status: 'open', vote_count: 0 });
            setSavedImageURL(imageURL);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            if (err.source === 'photo') setPhotoError(err.userMessage ?? 'Error al subir la foto.');
            else setSubmitError(err.userMessage ?? 'Error al enviar el reporte. Intenta de nuevo.');
        } finally { setSubmitting(false); setUploadingPhoto(false); }
    }

    if (!isOpen) return null;

    // ── SUCCESS SCREEN ─────────────────────────────────────────────
    if (success) {
        const hashtags   = generateHashtags(category, subcategory, resolvedMuni);
        const hashStr    = hashtags.join(' ');
        const dateStr    = new Date().toLocaleDateString('es-PR', { day: 'numeric', month: 'long', year: 'numeric' });
        const mapsLink   = (resolvedLat && resolvedLng)
            ? `https://maps.google.com/?q=${resolvedLat},${resolvedLng}`
            : `https://maps.google.com/?q=${encodeURIComponent(resolvedExact || resolvedMuni || 'Puerto Rico')}`;

        const shareMessage = [
            `\uD83D\uDEA8 ${autoTitle}`,
            autoDescription || null,
            ``,
            `\uD83D\uDCCD ${resolvedExact || resolvedMuni || 'Puerto Rico'}`,
            `\uD83C\uDFDB Municipio: ${resolvedMuni || 'Puerto Rico'}`,
            `\uD83D\uDCC5 Reportado: ${dateStr}`,
            `\uD83D\uDDFA Ver en el mapa: ${mapsLink}`,
            ``,
            hashStr,
            `quejatepeerre.com`,
        ].filter(l => l !== null).join('\n');

        function handleClose() { onSubmit(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [copied, setCopied] = useState(false);

        async function handleShare() {
            if (navigator.share) {
                try {
                    if (savedImageURL && navigator.canShare) {
                        try {
                            const res  = await fetch(savedImageURL);
                            const blob = await res.blob();
                            const file = new File([blob], 'reporte-qpr.jpg', { type: blob.type });
                            if (navigator.canShare({ files: [file] })) {
                                await navigator.share({ files: [file], text: shareMessage });
                                return;
                            }
                        } catch (_) { /* photo fetch failed — fall through */ }
                    }
                    await navigator.share({ title: autoTitle, text: shareMessage });
                } catch (_) { /* user cancelled */ }
            } else {
                navigator.clipboard.writeText(shareMessage).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            }
        }

        return (
            <>
                <div className="form-backdrop" onClick={handleClose} />
                <div className="form-panel success-panel">
                    <div className="form-handle" />

                    <div className="success-logo">
                        <span className="success-logo-red">Qu\u00e9jate</span>
                        <span className="success-logo-blue">PeErre</span>
                    </div>

                    <div className="success-check">\u2713</div>
                    <h3 className="success-title">Tu reporte fue enviado</h3>
                    <p className="success-sub">An\u00f3nimo \u00b7 Visible para todos \u00b7 Gratis</p>

                    {savedImageURL && <img src={savedImageURL} alt="Evidencia" className="success-photo" />}

                    <div className="success-summary">
                        <div className="success-summary-title">{autoTitle}</div>
                        {autoDescription && <div className="success-summary-desc">{autoDescription}</div>}
                        <div className="success-summary-meta">
                            {resolvedExact && <span>\uD83D\uDCCD {resolvedExact}</span>}
                            <span>\uD83C\uDFDB {resolvedMuni || 'Puerto Rico'}</span>
                            <span>\uD83D\uDCC5 {dateStr}</span>
                            <a className="success-maps-link" href={mapsLink} target="_blank" rel="noreferrer">
                                \uD83D\uDDFA Abrir en Google Maps \u2197
                            </a>
                        </div>
                    </div>

                    <div className="success-hashtags">
                        {hashtags.map(tag => <span key={tag} className="success-tag">{tag}</span>)}
                    </div>

                    <p className="success-share-label">COMPARTE PARA AMPLIFICAR</p>

                    <button className="success-share-main-btn" onClick={handleShare}>
                        {copied ? '\u2713 Texto copiado' : savedImageURL ? '\uD83D\uDCF1 Compartir por mensaje (con foto)' : '\uD83D\uDCF1 Compartir por mensaje'}
                    </button>
                    {!navigator.share && !copied && (
                        <p className="success-share-hint">En tu celular este bot\u00f3n abre el men\u00fa de mensajes directo.</p>
                    )}

                    <button className="success-close-btn" onClick={handleClose}>
                        Ver mi reporte en el feed \u2192
                    </button>
                </div>
            </>
        );
    }

    // ── NEARBY SCREEN ──────────────────────────────────────────────
    if (showNearby) {
        return (
            <>
                <div className="form-backdrop" onClick={onClose} />
                <div className="form-panel">
                    <div className="form-handle" />
                    <div className="form-header">
                        <h2 className="form-title">Ya hay reportes aqu\u00ed</h2>
                        <button className="close-btn" onClick={onClose}><IoCloseCircle size={28} /></button>
                    </div>
                    <p className="nearby-intro">
                        Encontramos {nearbyReports.length} reporte{nearbyReports.length !== 1 ? 's' : ''} a menos de 100 pies de tu ubicaci\u00f3n.
                        \u00bfEs el mismo problema? Vota "Yo Tambi\u00e9n" para amplificarlo en vez de crear un duplicado.
                    </p>
                    <div className="nearby-list">
                        {nearbyReports.map(r => {
                            const catData = CATEGORIES.find(c => c.key === r.category) || CATEGORIES[0];
                            const daysOpen = r.created_at ? Math.floor((Date.now() - new Date(r.created_at)) / 86400000) : 0;
                            return (
                                <div key={r.id} className="nearby-card">
                                    {r.image_url && <img src={r.image_url} alt="" className="nearby-card-photo" />}
                                    <div className="nearby-card-body">
                                        <div className="nearby-card-cat" style={{ background: catData.color }}>
                                            {catData.label.toUpperCase()} \u00b7 {r.subcategory?.toUpperCase()}
                                        </div>
                                        <div className="nearby-card-title">{r.title}</div>
                                        <div className="nearby-card-meta">
                                            {daysOpen === 0 ? 'Hoy' : `${daysOpen} d\u00edas abierto`} \u00b7 {r.vote_count || 0} votos
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="nearby-actions">
                        <button className="nearby-btn-new" onClick={() => setNearbyDismissed(true)}>
                            No es el mismo \u2014 crear nuevo reporte
                        </button>
                    </div>
                    <p className="nearby-note">
                        Para votar "Yo Tambi\u00e9n" en un reporte existente, cierra este formulario y toca la tarjeta en el feed.
                    </p>
                </div>
            </>
        );
    }

    // ── MAIN FORM ──────────────────────────────────────────────────
    return (
        <>
            <div className="form-backdrop" onClick={onClose} />
            <div className="form-panel">
                <div className="form-handle" />
                <div className="form-header">
                    <h2 className="form-title">Nuevo Reporte</h2>
                    <button className="close-btn" onClick={onClose}><IoCloseCircle size={28} /></button>
                </div>

                {/* LOCATION */}
                <div className={`loc-block${editingLoc ? ' loc-editing' : ''}`}>
                    <div className="loc-label"><IoLocationSharp size={12} />UBICACI\u00d3N</div>
                    {!editingLoc ? (
                        <>
                            <div className="loc-muni">{resolvedMuni || <span className="loc-empty">Sin ubicaci\u00f3n</span>}</div>
                            {resolvedExact && <div className="loc-exact">{resolvedExact}</div>}
                            {errors.location && <p className="form-error">{errors.location}</p>}
                            <div className="loc-footer">
                                <button className={`loc-gps-btn${gpsLoading ? ' loading' : ''}`} onClick={handleGpsInForm} disabled={gpsLoading}>
                                    {gpsLoading ? 'Obteniendo GPS...' : '\uD83D\uDCCD GPS'}
                                </button>
                                <button className="loc-change-btn" onClick={() => { setLocQuery(''); setLocError(null); setEditingLoc(true); }}>
                                    Corregir direcci\u00f3n
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="loc-edit-wrap">
                            <p className="loc-edit-hint">Calle, barrio, o municipio en Puerto Rico.</p>
                            <input className="loc-search-input" type="text"
                                placeholder="Ej: Av. Ponce de Le\u00f3n 1042, San Juan"
                                value={locQuery}
                                onChange={e => { setLocQuery(e.target.value); setLocError(null); }}
                                onKeyDown={e => e.key === 'Enter' && handleLocSearch()}
                                autoFocus />
                            {locError && <p className="loc-error">{locError}</p>}
                            <div className="loc-edit-actions">
                                <button className="loc-cancel-btn" onClick={() => { setEditingLoc(false); setLocQuery(''); setLocError(null); }}>Cancelar</button>
                                <button className="loc-search-btn" onClick={handleLocSearch} disabled={locLoading || !locQuery.trim()}>
                                    {locLoading ? 'Buscando...' : 'Buscar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* CATEGORY */}
                <div className="form-field">
                    <label className="form-label">CATEGOR\u00cdA</label>
                    <div className="cat-grid-main">
                        {CATEGORIES.map(cat => (
                            <button key={cat.key} className={`cat-btn-main${category === cat.key ? ' selected' : ''}`}
                                style={{ '--cat-color': cat.color }} onClick={() => handleCategorySelect(cat.key)}>
                                <span className="cat-btn-icon"><cat.icon /></span>
                                <span className="cat-btn-label">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                    {errors.category && <p className="form-error">{errors.category}</p>}
                </div>

                {/* SUBCATEGORY */}
                {selectedCat && selectedCat.subcategories.length > 0 && (
                    <div className="form-field">
                        <label className="form-label">\u00bfQU\u00c9 EST\u00c1 PASANDO?</label>
                        <div className="sub-cat-grid">
                            {selectedCat.subcategories.map(sub => (
                                <button key={sub} className={`sub-cat-btn${subcategory === sub ? ' selected' : ''}`}
                                    style={{ '--cat-color': selectedCat.color }}
                                    onClick={() => { setSubcategory(sub); setSelectedChips([]); }}>
                                    {sub}
                                </button>
                            ))}
                        </div>
                        {errors.subcategory && <p className="form-error">{errors.subcategory}</p>}
                    </div>
                )}

                {/* CONTEXT CHIPS */}
                {subcategory && (
                    <div className="form-field">
                        <label className="form-label">DESCRIBE LA SITUACI\u00d3N</label>
                        <p className="chips-hint">Selecciona todo lo que aplique.</p>
                        <div className="chips-grid">
                            {CONTEXT_CHIPS.map(chip => (
                                <button key={chip.key} className={`chip-btn${selectedChips.includes(chip.key) ? ' selected' : ''}`}
                                    onClick={() => toggleChip(chip.key)}>
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                        {errors.chips && <p className="form-error">{errors.chips}</p>}
                    </div>
                )}

                {/* AUTO TITLE PREVIEW */}
                {category && subcategory && (
                    <div className="auto-title-block">
                        <div className="auto-title-label">T\u00cdTULO DEL REPORTE</div>
                        <div className="auto-title-text">{autoTitle}</div>
                        {autoDescription && <div className="auto-desc-text">{autoDescription}</div>}
                    </div>
                )}

                {/* PHOTO */}
                <div className="form-field">
                    <label className="form-label">FOTO DE EVIDENCIA <span className="form-label-opt">(opcional)</span></label>
                    {photoPreview ? (
                        <div className="photo-preview-wrap">
                            <img src={photoPreview} alt="Evidencia" className="photo-preview" />
                            <button className="remove-photo-btn" onClick={handleRemovePhoto}><IoCloseCircle size={28} /></button>
                        </div>
                    ) : (
                        <div className="photo-upload-group">
                            <label className="photo-upload-btn camera-btn">
                                <IoCamera size={20} /><span className="photo-upload-label">Tomar foto</span>
                                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} style={{ display: 'none' }} />
                            </label>
                            <label className="photo-upload-btn gallery-btn">
                                <IoImagesOutline size={18} /><span className="photo-upload-label">Galer\u00eda</span>
                                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                    )}
                    {photoError && <p className="form-error photo-field-error">{photoError}</p>}
                    <p className="photo-note">No subas fotos de personas o informaci\u00f3n privada.</p>
                </div>

                <p className="anon-notice">Este reporte es 100% an\u00f3nimo. No se requiere cuenta.</p>
                {submitError && <p className="form-error" style={{ marginBottom: 12 }}>{submitError}</p>}

                <button className={`submit-btn${!isValid || submitting ? ' disabled' : ''}`}
                    onClick={handleSubmit} disabled={!isValid || submitting}>
                    {uploadingPhoto ? 'Subiendo foto...' : submitting ? 'Enviando...' : 'Enviar reporte'}
                </button>
            </div>
        </>
    );
}

export default ReportForm;
