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
            title: '"Yo también"',
            body: `Si ya existe un reporte en tu área, vota "Yo también" para amplificarlo.\nCuantos más votos, más presión al municipio.`,
            sub: 'Tu nombre nunca aparece.',
            cta: '¡Vamos!',
        },
    ];

    const current = slides[slide];
    const isLast = slide === slides.length - 1;

    function handleCta() {
        if (isLast) {
            localStorage.setItem('qpr_onboarded', '1');
            onDone();
        } else {
            setSlide(s => s + 1);
        }
    }

    function handleSkip() {
        localStorage.setItem('qpr_onboarded', '1');
        onDone();
    }

    return (
        <div className="ob-backdrop">
            <div className="ob-sheet">

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

                {/* CTA button */}
                <button className="ob-cta" onClick={handleCta}>
                    {current.cta}
                </button>

                {/* Skip — only on slides 1 and 2 */}
                {!isLast && (
                    <button className="ob-skip" onClick={handleSkip}>
                        Saltar
                    </button>
                )}

            </div>
        </div>
    );
}

export default Onboarding;
