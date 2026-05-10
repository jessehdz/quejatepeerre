import { useState } from "react";
import { CATEGORIES } from "../lib/constants";
import { ChevronUp, TrafficCone } from 'lucide-react';
import './ReportCard.css';

/*
  ReportCard — the core visual unit of QuéjatePeErre.

  Every report in the app is displayed using this component.
  It takes data as props and renders a card with:
  - A colored tile at the top (based on category — what kind of problem)
  - A severity pill in the top-right corner (how neglected is it)
  - The title and municipality in the card body
  - An upvote button that increments once per session
  
  PROPS:
    category — 'hoyo' | 'apagon' | 'agua' | 'carret' | 'alumb'
    icon — emoji: 'MdConstruction' 'FaBolt' 'FaDroplet' 'FaRoad' 'FaLightbulb'
    label — display name: 'Hoyo', 'Apagón', etc.
    severity — 'CRISIS' | 'VERGÜENZA' | 'IGNORADO' | 'NUEVO'
    title — the report title text
    municipality — 'San Juan', 'Bayamón', etc.
    daysOpen — how many days since this was reported
    voteCount — how many "Yo También" votes
    onClick — optional: function called when the card is tapped
*/

function ReportCard({
    category = 'hoyo',
    icon = 'TrafficCone',
    label = 'hoyo',
    severity = 'CRISIS',
    title = 'Título del reporte va aquí',
    municipality = 'Municipio',
    daysOpen = 0,
    voteCount = 0,
    onClick,
}) {
    const [votes, setVotes] = useState(voteCount);
    const [voted, setVoted] = useState(false);

    function handleUpVote(e) {
        e.stopPropagation(); // prevent card click
        
        // check for existing vote
        if (!voted) {
            setVotes(votes + 1);
            setVoted(true); /* toggle to "voted" state to prevent multiple votes in same session */
        }
    }

    const severityClass = severity.toLowerCase().replace('ü', 'u'); // convert "VERGÜENZA" to "vergüenza" for CSS class
    
    // find the icon for the category called
    const categoryData = CATEGORIES.find(cat => cat.key === category) || {};
    const Icon = categoryData.icon || TrafficCone; // default icon if category not found


    return (
        <div className="report-card" onClick={onClick}>
            {/* category tile */}
            <div className={`card-tile cat-${category}`}>
                <span className="tile-icon"><Icon size={20}/></span>
                <span className="tile-label">{label}</span>

                {/* severity badge */}
                <span className={`sev-pill sev-${severityClass}`}>
                    {severity}
                </span>
            </div>

            {/* card body */}
            <div className="card-body">
                {/* report title */}
                <p className="card-title">{title}</p>

                {/* municipality and days open */}
                <p className="card-meta">{municipality} • {daysOpen} DÍAS</p>

                {/* footer */}
                <div className="card-footer">
                    <button className={`upvote-btn ${voted ? 'voted' : ''}`} onClick={handleUpVote} aria-label={`Yo También: ${votes} votos`}>
                        <ChevronUp color="#fff" /> {votes}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReportCard;