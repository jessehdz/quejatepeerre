import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { FaExclamation } from "react-icons/fa";

import './Onboarding.css';

/*
  Onboarding — 3-slide intro shown on first visit only.
  Dismissed state is stored in localStorage so it never shows again.
  Call hasSeenOnboarding() before rendering to check.
*/

export function hasSeenOnboarding() {
    return localStorage.getItem('qpr_onboarded') === '1';
}

export function markOnboardingSeen() {
    localStorage.setItem('qpr_onboarded', '1');
}

function Onboarding({ onDone }) {
    const [slide, setSlide] = useState(0);

    const slides = [
        {
            emoji: '',
            title: 'QuéjatePeErre',
            body: 'La plataforma ciudadana donde los problemas de Puerto Rico no se pueden ignorar.',
            sub: 'Anónimo · Gratis · Sin cuenta',
            cta: 'Empezar',
        },
        {
            emoji: <FaExclamation size={48} color="var(--cream)" strokeWidth={2.5} />,
            title: 'Reporta en segundos',
            body: 'Toca el mapa o usa GPS. Elige la categoría y descripción. Listo.\nTú no escribes nada — nosotros generamos el reporte por ti.',
            sub: '',
            cta: 'Siguiente',
        },
        {
            emoji: <Megaphone size={48} color="var(--cream)" strokeWidth={2.5} />,
            title: 'Empieza aquí',
            body: `Toca el botón rojo abajo para reportar un problema en tu área.\nAsí de fácil.`,
            sub: '',
        },
    ];

    const current = slides[slide];
    const isLast = slide === slides.length - 1;

    function handleCta() {
        setSlide(s => s + 1);
    }

    function handleSkip() {
        markOnboardingSeen();
        onDone();
    }

    return (
        <div className={`ob-backdrop ${isLast ? 'ob-backdrop-final' : ''}`}>
            <div className="ob-sheet">

                {/* Close — always available, exits onboarding entirely */}
                <button className="ob-close" onClick={handleSkip} aria-label="Cerrar">×</button>

                {/* Progress dots */}
                <div className="ob-dots">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`ob-dot ${i === slide ? 'active' : ''} ${i < slide ? 'done' : ''}`}
                        />
                    ))}
                </div>

                {/* Slide icon — slide 0 uses the logo + Megaphone, others use emoji */}
                {slide === 0 ? (
                    <div className="ob-logo-icon">
                        <div className="ob-logo-text">
                            <Megaphone size={18} fill="white" strokeWidth={0} />
                            <span>Quéjate<span className='logo-red'>Pe</span><span className='logo-cel-blue'>Erre</span></span>
                        </div>
                    </div>
                ) : (
                    <div className="ob-emoji">{current.emoji}</div>
                )}
                <p className="ob-body">
                    {current.body.split('\n').map((line, i) => (
                        <span key={i}>{line}{i < current.body.split('\n').length - 1 && <br />}</span>
                    ))}
                </p>
                <p className="ob-sub">{current.sub}</p>

                {/* CTA button — last slide has no CTA, the real FAB below is the CTA */}
                {!isLast && (
                    <button className="ob-cta" onClick={handleCta}>
                        {current.cta}
                    </button>
                )}

                {/* "Start here" pointer to the real FAB, revealed above the dimmed backdrop */}
                {isLast && (
                    <div className="ob-fab-pointer">
                        <span className="ob-fab-label">Empieza aquí</span>
                        <span className="ob-fab-arrow">↓</span>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Onboarding;
