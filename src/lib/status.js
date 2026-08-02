// ── STATUS TRANSLATION ──────────────────────────────────────────────────────
// Supabase stores status in English lowercase ('open', 'in_progress', 'resolved').
// We display them in Spanish uppercase everywhere (status pill, status picker).
export const STATUS_MAP = {
    'open':           'ABIERTO',
    'in_progress':    'EN REPARACIÓN',
    'resolved':       'RESUELTO',
    // already-translated values pass through unchanged
    'ABIERTO':        'ABIERTO',
    'EN REPARACIÓN':  'EN REPARACIÓN',
    'RESUELTO':       'RESUELTO',
};

export const STATUS_BG = {
    'ABIERTO':        'rgba(170,34,20,0.85)',
    'EN REPARACIÓN':  'rgba(176,86,14,0.85)',
    'RESUELTO':       'rgba(42,96,42,0.85)',
};

// value/label/color options for ReportDetail's status-picker buttons.
export const STATUS_OPTIONS = [
    { value: 'open',        label: 'ABIERTO',       color: '#AA2214' },
    { value: 'in_progress', label: 'EN REPARACIÓN', color: '#B05610' },
    { value: 'resolved',    label: 'RESUELTO',      color: '#2A602A' },
];

export function translateStatus(status) {
    return STATUS_MAP[status] || 'ABIERTO';
}

export function statusBackground(statusLabel) {
    return STATUS_BG[statusLabel] || STATUS_BG['ABIERTO'];
}

// Day-count → badge-number color ladder.
export function daysOpenColor(days, resolved) {
    if (resolved) return '#72C472';
    if (days >= 90) return '#FF7A5A';
    if (days >= 30) return '#F0BB5A';
    return '#F0F0E8';
}
