import { useState } from "react";
import { CATEGORIES } from "../lib/constants";
import { ChevronUp, Icon, TrafficCone } from 'lucide-react';
import { FaMapPin } from "react-icons/fa6";
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
    category
    subcategory
    icon
    label 
    severity — 'CRISIS' | 'VERGÜENZA' | 'IGNORADO' | 'NUEVO'
    title — the report title text
    municipality — 'San Juan', 'Bayamón', etc.
    daysOpen — how many days since this was reported
    voteCount — how many "Yo También" votes
    onClick — optional: function called when the card is tapped
*/

function ReportCard() {
   
    return (
        <div className="report-card-wrap">

      {/* THE CARD — clip-path cuts the folder tab shape */}
        <div className="report-card-shape">

            {/* TAB — sits at the very top */}
                <div className="card-tab-space">
                    <TrafficCone size={14} />
                <span className="tab-label">INFRAESTRUCTURA</span>
            </div>

            {/* BODY — photo left, data right */}
            <div className="card-body">
                <div className="card-photo">
                    {/* {image_url
                        ? <img src={image_url} alt="Evidencia" className="photo-img" />
                        : <div className="photo-placeholder">🚧</div>
                    } */}
                    <div className="photo-overlay">
                        <p className="overlay-label">DÍAS SIN REPARAR</p>
                        <p className="overlay-days">214</p>
                    </div>
                </div>
                    
                <div className="card-divider"></div>
                
                    <div className="card-data">
                        <h3 className="card-title">Título del Reporte</h3>
                        <p className="card-subcategory" style={{ color: CATEGORIES.color}}>HOYO</p>
                        <p className="card-meta">San Juan • 5 días</p>
                        <p className="card-exact-loc">Ubicación exacta</p>
                    </div>
            </div>

        </div>

        {/* SEV PILL — outside the clipped shape so it's visible */}
        <span className="sev-pill">VERGÜENZA</span>

    </div>
    )
}

export default ReportCard;