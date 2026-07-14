// municipality grading system
export function getDaysOpen(createdAt) {
    const ms = Date.now() - new Date(createdAt).getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function getSeverity(createdAt) {
    const days = getDaysOpen(createdAt);
    if (days >= 180) return 'CRISIS';
    if (days >= 90) return 'VERGÜENZA';
    if (days >= 30) return 'IGNORADO';
    return 'NUEVO';
} 

export function getGradeColor(grade) {
    const colors = {
        'A': '#4CAF7D',
        'B': '#F2C94C',
        'C': '#F2994A',
        'D': '#EB5757',
        'F': '#B00020',
    };
    return colors[grade] || '#6A8A8E';
}

export function calculateGrade(reports) {
    if (!reports || reports.length === 0) return { grade: 'N/A', score: 0 };

    const totalReports = reports.length;
    const resolvedReports = reports.filter(r => r.status === 'RESUELTO').length;
    const openReports = reports.filter(r => r.status === 'EN REPARACIÓN' || r.status === 'ABIERTO').length;

    const resolutionRate = (resolvedReports / totalReports) * 100;
    const avgDaysOpen = openReports.length > 0 ? openReports.reduce((sum, r) => sum + getDaysOpen(r.created_at), 0) / openReports.length : 0;
    const crisisPenalty = Math.min(openReports.filter(r => getDaysOpen(r.created_at) >= 180).length * 5, 20); // max 20% penalty

    const daysOpenScore = Math.max(0, 100 - (avgDaysOpen / 365) * 100); // 10% penalty for every 30 days open

    const municipalityScore = Math.round((resolutionRate * 0.5) + (daysOpenScore * 0.3) + ((100 - crisisPenalty) * 0.2));

    const clampedScore = Math.max(0, Math.min(100, municipalityScore));
    const grade =
        clampedScore >= 90 ? 'A' :
        clampedScore >= 80 ? 'B' :
        clampedScore >= 70 ? 'C' :
        clampedScore >= 60 ? 'D' : 'F';
    
    return { grade, score: clampedScore };
}