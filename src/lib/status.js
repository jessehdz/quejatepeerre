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
    'ABIERTO':        '#FF3D00',
    'EN REPARACIÓN':  '#FF7A00',
    'RESUELTO':       '#00867D',
};

export const STATUS_TEXT = {
    'ABIERTO': '#05110F', 'EN REPARACIÓN': '#05110F', 'RESUELTO': '#FFFFFF',
};

// value/label/color options for ReportDetail's status-picker buttons.
export const STATUS_OPTIONS = [
    { value: 'open',        label: 'ABIERTO',       color: '#05110F' },
    { value: 'in_progress', label: 'EN REPARACIÓN', color: '#05110F' },
    { value: 'resolved',    label: 'RESUELTO',      color: '#FFF' },
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
