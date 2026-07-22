import ReportCard from "./ReportCard";
import './FeedScreen.css';

/*
    FeedScreen — scrollable list of ReportCards.

    Props:
        reports  — array of report objects from Supabase (passed down from App.jsx)
        loading  — boolean, true while first fetch is in flight
        error    — string or null, error message if fetch failed
*/
function FeedScreen({ reports = [], loading = false, error = null, onDetails, onVote }) {

    // Loading state — shown on first mount before data arrives
    if (loading) {
        return (
            <div className="feed-screen">
                <p className="feed-label">REPORTES RECIENTES</p>
                <p className="feed-status">Cargando reportes...</p>
            </div>
        );
    }

    // Error state — shown if Supabase fetch failed
    if (error) {
        return (
            <div className="feed-screen">
                <p className="feed-label">REPORTES RECIENTES</p>
                <p className="feed-status feed-error">
                    Error cargando reportes. Verifica tu conexión.
                </p>
            </div>
        );
    }

    // Empty state — Supabase connected but no reports yet
    if (reports.length === 0) {
        return (
            <div className="feed-screen">
                <p className="feed-label">REPORTES RECIENTES</p>
                <p className="feed-status">
                    No hay reportes todavía. ¡Sé el primero en reportar un problema!
                </p>
            </div>
        );
    }

    // Normal state — render cards from live Supabase data
    return (
        <div className="feed-screen">
            <p className="feed-label">
                REPORTES RECIENTES · {reports.length} activos
            </p>
            {reports.map((report) => (
                <ReportCard
                    key={report.id}
                    report={report}
                    onDetails={onDetails}
                    onVote={onVote}
                />
            ))}
        </div>
    );
}

export default FeedScreen;
