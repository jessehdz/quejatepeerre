import { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import './Faq.css';

/*
  Faq — expandable Q&A list. Lives in the "Más" tab.
*/

const FAQ_ITEMS = [
    {
        q: 'El GPS no funciona o dice que el permiso está bloqueado',
        a: (
            <>
                <p>Esto pasa cuando el navegador ya bloqueó el permiso de ubicación para este sitio. Actívalo así:</p>

                <p className="faq-platform">📱 iPhone</p>
                <ol>
                    <li>Abre Ajustes → Privacidad y Seguridad → Localización.</li>
                    <li>Busca tu navegador (Safari o Chrome) y selecciona "Mientras se usa la app".</li>
                    <li>Verifica que Localización esté activada arriba de esa pantalla.</li>
                </ol>

                <p className="faq-platform">📱 Android</p>
                <ol>
                    <li>Toca el candado o los tres puntos junto a la dirección del sitio.</li>
                    <li>Entra a "Permisos del sitio" → Ubicación → Permitir.</li>
                    <li>Verifica que la ubicación del teléfono esté activada.</li>
                </ol>

                <p>Mientras tanto, puedes tocar el mapa para seleccionar tu ubicación manualmente — el GPS no es obligatorio para reportar.</p>
            </>
        ),
    },
];

function Faq() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="faq">
            <h2 className="faq-title">Preguntas frecuentes</h2>
            <div className="faq-list">
                {FAQ_ITEMS.map((item, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div key={i} className={`faq-item${isOpen ? ' open' : ''}`}>
                            <button className="faq-question" onClick={() => setOpenIndex(isOpen ? null : i)}>
                                <span>{item.q}</span>
                                <IoChevronDown className="faq-chevron" size={18} />
                            </button>
                            {isOpen && <div className="faq-answer">{item.a}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Faq;
