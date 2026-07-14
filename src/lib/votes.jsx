const KEY = 'quejatepeerre_voted';

export function hasVoted(reportId) {
    const voted = JSON.parse(localStorage.getItem(KEY) || '[]');
    return voted.includes(reportId);
}

export function recordVote(reportId) {
    const voted = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!voted.includes(reportId)) {
        voted.push(reportId);
        localStorage.setItem(KEY, JSON.stringify(voted));
    }
}