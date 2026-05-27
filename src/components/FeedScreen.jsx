import ReportCard from "./ReportCard";
import './FeedScreen.css';
import { Icon } from "lucide-react";

const SAMPLE_REPORTS = [
    {
        id: 1,
        category: 'infrastructure',
        label: 'Hoyo',
        icon: <Icon />,
        severity: 'CRISIS',
        title: 'Hoyo en Av. Ponce de León',
        municipality: 'San Juan',
        exactLocation: '235 Av. Ponce de León, San Juan, PR',
        daysOpen: 120,
        voteCount: 34,
    },
    {
        id: 2,
        category: 'power',
        label: 'Apagón',
        icon: <Icon />,
        severity: 'VERGÜENZA',
        title: 'Apagón en Bayamón desde hace 3 días',
        municipality: 'Bayamón',
        exactLocation: 'Calle 3, Bayamón, PR',
        daysOpen: 3,
        voteCount: 12,
    },
    {
        id: 3,
        category: 'water',
        label: 'Agua',
        icon: <Icon />,
        severity: 'IGNORADO',
        title: 'Sin agua en Carolina desde hace semanas',
        municipality: 'Carolina',
        exactLocation: 'Calle 5, Carolina, PR',
        daysOpen: 45,
        voteCount: 5,
    },
    {
        id: 4,
        category: 'light',
        label: 'Alumbrado',
        icon: <Icon />,
        severity: 'IGNORADO',
        title: 'Sin alumbrado en San Juan desde hace meses',
        municipality: 'San Juan',
        exactLocation: 'Calle 10, San Juan, PR',
        daysOpen: 60,
        voteCount: 8,
    },
    {
        id: 5,
        category: 'road',
        label: 'Carretera',
        icon: <Icon />,
        severity: 'NUEVO',
        title: 'Carretera en mal estado en Ponce',
        municipality: 'Ponce',
        exactLocation: 'PR-2, Ponce, PR',
        daysOpen: 1,
        voteCount: 0,
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
                    exactLocation={report.exactLocation}
                    {...report} />
            ))}
        </div>
    );
}

export default FeedScreen;