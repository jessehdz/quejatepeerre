import { CATEGORIES } from './constants';

// Same category taxonomy lookup used across ReportCard, ReportDetail, and
// ReportForm — falls back to CATEGORIES[0] (infrastructure) when a report's
// category key doesn't match anything (e.g. stale data).
export function getCategoryData(key) {
    return CATEGORIES.find(c => c.key === key) || CATEGORIES[0];
}

// Full-bleed photo fallback gradients, keyed by category, shown when a
// report has no image_url.
export const PHOTO_FALLBACK = {
    infrastructure: 'radial-gradient(ellipse at 40% 50%, #1A1410 0%, #100E0A 55%, #07060A 100%)',
    security:       'radial-gradient(ellipse at 30% 40%, #1A0808 0%, #100404 55%, #080000 100%)',
    environment:    'radial-gradient(ellipse at 55% 65%, #1E2A14 0%, #141C0C 50%, #0A100A 100%)',
    community:      'radial-gradient(ellipse at 45% 55%, #1E1808 0%, #14100A 50%, #0A0806 100%)',
    services:       'radial-gradient(ellipse at 50% 60%, #0E2A38 0%, #071C2A 50%, #030E18 100%)',
    other:          'radial-gradient(ellipse at 50% 50%, #1A1A1A 0%, #0E0E0E 100%)',
};

export function getPhotoFallback(category) {
    return PHOTO_FALLBACK[category] || PHOTO_FALLBACK.other;
}
