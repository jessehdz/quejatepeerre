// Days elapsed since createdAt (ISO timestamp), floored, never negative.
export function calcDaysOpen(createdAt) {
    if (!createdAt) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(createdAt)) / 86400000));
}

// Formats an ISO date string in es-PR. `month`/`fallback` let each call site
// keep its own look (e.g. ReportCard's compact pill uses a short month and
// an empty fallback instead of an em dash).
export function formatDate(iso, { month = 'long', fallback = '—' } = {}) {
    if (!iso) return fallback;
    return new Date(iso).toLocaleDateString('es-PR', { day: 'numeric', month, year: 'numeric' });
}
