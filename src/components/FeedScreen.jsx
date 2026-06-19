import ReportCard from "./ReportCard";
import './FeedScreen.css';

const SAMPLE_REPORTS = [
    {
        id: 1,
        category: 'infrastructure',
        subcategory: 'Hoyos',
        title: 'Hoyo en Av. Ponce de León',
        municipality: 'San Juan',
        exact_location: '235 Av. Ponce de León, San Juan, PR',
        vote_count: 34,
        created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        category: 'luma_power',
        subcategory: 'Apagón',
        title: 'Apagón en Bayamón desde hace 3 días',
        municipality: 'Bayamón',
        exact_location: 'Calle 3, Bayamón, PR',
        vote_count: 12,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        category: 'services',
        subcategory: null,
        title: 'Sin agua en Carolina desde hace semanas',
        municipality: 'Carolina',
        exact_location: 'Calle 5, Carolina, PR',
        vote_count: 5,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        category: 'infrastructure',
        subcategory: 'Alumbrado público',
        title: 'Sin alumbrado en San Juan desde hace meses',
        municipality: 'San Juan',
        exact_location: 'Calle 10, San Juan, PR',
        vote_count: 8,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        category: 'infrastructure',
        subcategory: 'Derrumbes',
        title: 'Carretera en mal estado en Ponce',
        municipality: 'Ponce',
        exact_location: 'PR-2, Ponce, PR',
        vote_count: 0,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

function FeedScreen() {
    return (
        <div className="feed-screen">
            <p className="feed-label">REPORTES RECIENTES</p>
            {/* map loop of ReportCard components */}
            {SAMPLE_REPORTS.map((report) => (
                <ReportCard
                    key={report.id}
                    report={report} />
            ))}
        </div>
    );
}

export default FeedScreen;