import { useMemo } from "react";
import { calculateGrade, getGradeColor } from "../lib/grades";
import './Pueblos.css';

function Pueblos({ reports }) {
  const rows = useMemo(() => {
    const by = {};
    reports.forEach(r => { (by[r.municipality || 'Puerto Rico'] ||= []).push(r); });

    return Object.entries(by).map(([name, list]) => ({ name, count: list.length, ...calculateGrade(list) }))
        .sort((a, b) => b.score - a.score);
    }, [reports]);

    return (
        <section className="pueblos">
            <div className="pueblos-frame">FRAME 10 • PUEBLOS</div>
            <h2 className="pueblos-title">¿Cómo va<br />tu pueblo?</h2>
            <ul className="pueblos-list">
                {rows.map(r => (
                    <li key={r.name} className="pueblos-row">
                        <span className="pueblos-grade" style={{ backgroundColor: getGradeColor(r.grade) }}>{r.grade}</span>
                        <div className="pueblos-info">
                            <div className="pueblos-name">{r.name}</div>
                            <div className="pueblos-bar"><span style={{ width: `${r.score}%`, background: getGradeColor(r.grade) }} /></div>
                            <div className="pueblos-meta">
                                {r.count >= 1 ? `${r.count} reporte${r.count > 1 ? 's' : ''} • puntaje ${r.score}` : `0 reportes • puntaje 0`}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Pueblos;