// Single canonical Google Maps link builder — accepts either exact
// coordinates or an address string, both via the same ?q= scheme.
export function buildMapsLink({ lat, lng, address } = {}) {
    if (lat && lng) return `https://maps.google.com/?q=${lat},${lng}`;
    return `https://maps.google.com/?q=${encodeURIComponent(address || 'Puerto Rico')}`;
}

// Multi-line share message shared by ReportDetail and ReportForm's success screen.
// Uppercased end-to-end to match the app's all-caps UI language.
export function buildShareMessage({ title, description, location, municipality, dateStr, mapsLink, hashtags }) {
    return [
        `🚨 ${title}`,
        description || null,
        ``,
        `📍 ${location || municipality || 'Puerto Rico'}`,
        `🏛 Municipio: ${municipality || 'Puerto Rico'}`,
        `📅 Reportado: ${dateStr}`,
        `🗺 Ver en el mapa: ${mapsLink}`,
        ``,
        hashtags.join(' '),
        `quejatepeerre.com`,
    ].filter(l => l !== null).join('\n').toUpperCase();
}

// Native share (with optional photo attachment) → clipboard fallback.
// Mobile: opens the native share sheet (iMessage, WhatsApp, Signal, etc.),
// attaching the photo as a file when the report has one and the browser
// supports it. Desktop: copies the text to the clipboard and calls onCopied
// so the caller can flip its own "copied" confirmation state.
export async function shareReport({ title, message, imageUrl, onCopied }) {
    if (navigator.share) {
        try {
            if (imageUrl && navigator.canShare) {
                try {
                    const res  = await fetch(imageUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'reporte-qpr.jpg', { type: blob.type });
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file], text: message });
                        return;
                    }
                } catch (_) { /* photo fetch failed — fall through to text-only */ }
            }
            await navigator.share({ title, text: message });
        } catch (_) { /* user cancelled — not an error */ }
    } else {
        navigator.clipboard.writeText(message).catch(() => {});
        onCopied?.();
    }
}

// Standardized "QPR-XXXXXX" report number, 6 chars everywhere.
export function formatReportNumber(id, length = 6) {
    return id ? `QPR-${String(id).slice(0, length).toUpperCase()}` : `QPR-${'?'.repeat(length)}`;
}
