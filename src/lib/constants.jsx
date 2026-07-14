import { FaRoad, FaBolt, FaShieldAlt, FaStore, FaHeartbeat, FaBusAlt, FaSchool, FaTrashAlt, FaLeaf, FaHome, FaBalanceScaleLeft, FaEllipsisH } from 'react-icons/fa';
import { FaDroplet, FaBasketball, FaVolumeHigh, FaRoadCircleExclamation } from "react-icons/fa6";
import { BsFillLightbulbOffFill } from "react-icons/bs";

export const APP_NAME = "QuéjatePeErre";

export const CATEGORIES_NoSubs = [
    { key: 'pothole', label: 'Hoyo', icon: FaRoadCircleExclamation, color: '#EF4444' },
    { key: 'power', label: 'Apagón', icon: FaBolt, color: '#FF6B35' },
    { key: 'water', label: 'Agua', icon: FaDroplet, color: '#3B82F6' },
    { key: 'road', label: 'Carretera', icon: FaRoad, color: '#8B5CF6' },
    { key: 'light', label: 'Alumbrado', icon: BsFillLightbulbOffFill, color: '#10B981' },
];

export const CATEGORIES_15 = [
    { key: 'road', label: 'Carretera', icon: FaRoad, color: '#8B5CF6', subcategories: ['Hoyos', 'Semáforos', 'Derrumbes', 'Alumbrado', 'Otro'] },
    { key: 'luma_power', label: 'LUMA', icon: FaBolt, color: '#10B981', subcategories: ['Apagón', 'Postes', 'Cables', 'Factura', 'Otro'] },
    { key: 'water', label: 'Agua', icon: FaDroplet, color: '#3B82F6', subcategories: ['Sin servicio', 'Baja presión', 'Factura', 'Servicio', 'Inundaciones', 'Otro'] },
    { key: 'sports', label: 'Deportes', icon: FaBasketball, color: '#C07818', subcategories: ['Instalaciones', 'Ligas', 'Seguridad', 'Cobros', 'Otro'] },
    { key: 'security', label: 'Seguridad', icon: FaShieldAlt, color: '#C8402A', subcategories: ['Robo / Crimen', 'Poca vigilancia', 'Alumbrado / Áreas peligrosas', 'Policía', 'Otro'] },
    { key: 'businesses', label: 'Negocios', icon: FaStore, color: '#053caa', subcategories: ['Mal servicio', 'Cobros incorrectos', 'Producto o comida', 'Otro'] },
    { key: 'health', label: 'Salud', icon: FaHeartbeat, color: '#8A2A5A', subcategories: ['Mal trato', 'Servicio', 'Médicos', 'Citas', 'Facturación', 'Otro'] },
    { key: 'transit', label: 'Tránsito', icon: FaBusAlt, color: '#2A4A6A', subcategories: ['Tapones', 'Conductores irresponsables', 'Accidentes', 'Transporte público', 'Otro'] },
    { key: 'education', label: 'Educación', icon: FaSchool, color: '#5A3A8A', subcategories: ['Malas condiciones', 'Problemas con maestros', 'Seguridad escolar', 'Comida', 'Otro'] },
    { key: 'trash', label: 'Basura', icon: FaTrashAlt, color: '#4A4A2A', subcategories: ['Basura acumulada', 'Recogido atrasado', 'Vertederos ilegales', 'Mal olor', 'Áreas abandonadas', 'Otro'] },
    { key: 'environment', label: 'Ambiente', icon: FaLeaf, color: '#2A6A3A', subcategories: ['Parques', 'Contaminación', 'Árboles peligrosos', 'Maltrato ambiental', 'Playas / Ríos sucios', 'Animales abandonados', 'Otro'] },
    { key: 'housing', label: 'Vivienda', icon: FaHome, color: '#926130', subcategories: ['Casas abandonadas', 'Problemas vecinales', 'Falta de mantenimiento', 'Otro'] },
    { key: 'noise', label: 'Ruido', icon: FaVolumeHigh, color: '#6A2A6A', subcategories: ['Música alta', 'Motoras', 'Boceteo', 'Otro'] },
    { key: 'injustice', label: 'Injusticias', icon: FaBalanceScaleLeft, color: '#4747b0', subcategories: ['Favoritismo', 'Abuso', 'Corrupción', 'Otro'] },
    { key: 'other', label: 'Otros', icon: FaEllipsisH, color: '#4A4A4A', subcategories: [] },
];

export const CATEGORIES_6 = [
    {
        key: 'infrastructure',
        label: 'Infraestructura',
        icon: FaRoad,
        color: '#C23A22',
        subcategories: [
            'Hoyos', 'Semáforos', 'Derrumbes', 'Alumbrado público',
            'Apagón', 'Postes / Cables', 'Sin agua', 'Baja presión', 'Inundaciones',
        ],
    },
    {
        key: 'security',
        label: 'Seguridad',
        icon: FaShieldAlt,
        color: '#8B1C1C',
        subcategories: ['Poca vigilancia', 'Áreas peligrosas', 'Alumbrado peligroso'],
    },
    {
        key: 'environment',
        label: 'Ambiente',
        icon: FaLeaf,
        color: '#2A6B36',
        subcategories: [
            'Basura acumulada', 'Recogido atrasado', 'Vertederos ilegales',
            'Contaminación', 'Playas / Ríos sucios', 'Árboles peligrosos',
            'Áreas abandonadas', 'Animales abandonados',
        ],
    },
    {
        key: 'community',
        label: 'Comunidad',
        icon: FaHome,
        color: '#A0622A',
        subcategories: [
            'Casas abandonadas', 'Falta de mantenimiento', 'Instalaciones deportivas', 'Parques',
        ],
    },
    {
        key: 'services',
        label: 'Servicios',
        icon: FaBusAlt,
        color: '#1D5C9E',
        subcategories: [
            'Tapones', 'Transporte público', 'Médicos - Mal trato',
            'Escuelas — Condiciones', 'Escuelas — Maestros', 'Escuelas — Seguridad',
        ],
    },
    {
        key: 'other',
        label: 'Otro',
        icon: FaEllipsisH,
        color: '#4A4A4A',
        subcategories: ['Problema no listado'],
    },
];

export const CATEGORIES = CATEGORIES_6;

// ── CONTEXT CHIPS ──────────────────────────────────────────────────────────────
// Shown after category + subcategory are selected.
// User picks one or more to describe the situation.
// These get joined into the auto-generated description.
// Shared across all categories — they are all factual observations, no opinions.
export const CONTEXT_CHIPS = [
    { key: 'days_unknown',  label: 'Lleva tiempo así',         text: 'Lleva tiempo sin ser atendido.' },
    { key: 'days_week',     label: 'Más de una semana',        text: 'Lleva más de una semana sin ser atendido.' },
    { key: 'days_month',    label: 'Más de un mes',            text: 'Lleva más de un mes sin ser atendido.' },
    { key: 'days_months',   label: 'Varios meses',             text: 'Lleva varios meses sin ser atendido.' },
    { key: 'danger',        label: 'No se puede usar',         text: 'Muy peligroso para su uso.' },
    { key: 'danger_peds',   label: 'Peligro para peatones',    text: 'Representa un peligro para peatones.' },
    { key: 'danger_cars',   label: 'Peligro para vehículos',   text: 'Representa un peligro para vehículos.' },
    { key: 'danger_kids',   label: 'Peligro para menores',     text: 'Representa un peligro para menores.' },
    { key: 'blocks_road',   label: 'Bloquea el paso',          text: 'Está bloqueando el paso.' },
    { key: 'affects_many',  label: 'Afecta a muchos vecinos',  text: 'Afecta a múltiples vecinos del área.' },
];

// ── AUTO-TITLE GENERATOR ───────────────────────────────────────────────────────
// Builds a factual, neutral title from category + subcategory + municipality.
// No opinions or adjectives — just what + where.
export function generateTitle(categoryKey, subcategory, municipality) {
    const muni = municipality || 'Puerto Rico';

    const templates = {
        // infrastructure
        'infrastructure:Hoyos':              `Hoyo en la vía — ${muni}`,
        'infrastructure:Semáforos':          `Semáforo sin funcionar — ${muni}`,
        'infrastructure:Derrumbes':          `Derrumbe en la vía — ${muni}`,
        'infrastructure:Alumbrado público':  `Sin alumbrado público — ${muni}`,
        'infrastructure:Apagón':             `Apagón sin restaurar — ${muni}`,
        'infrastructure:Postes / Cables':    `Poste o cable caído — ${muni}`,
        'infrastructure:Sin agua':           `Sin servicio de agua — ${muni}`,
        'infrastructure:Baja presión':       `Baja presión de agua — ${muni}`,
        'infrastructure:Inundaciones':       `Inundación sin atender — ${muni}`,
        // security
        'security:Poca vigilancia':          `Área sin vigilancia — ${muni}`,
        'security:Áreas peligrosas':         `Área peligrosa sin atender — ${muni}`,
        'security:Alumbrado peligroso':      `Alumbrado deficiente en área peligrosa — ${muni}`,
        // environment
        'environment:Basura acumulada':      `Basura acumulada sin recoger — ${muni}`,
        'environment:Recogido atrasado':     `Recogido de basura atrasado — ${muni}`,
        'environment:Vertederos ilegales':   `Vertedero ilegal — ${muni}`,
        'environment:Contaminación':         `Contaminación ambiental — ${muni}`,
        'environment:Playas / Ríos sucios':  `Playa o río contaminado — ${muni}`,
        'environment:Árboles peligrosos':    `Árbol peligroso sin atender — ${muni}`,
        'environment:Áreas abandonadas':     `Área abandonada sin mantenimiento — ${muni}`,
        'environment:Animales abandonados':  `Animales abandonados — ${muni}`,
        // community
        'community:Casas abandonadas':       `Casa abandonada — ${muni}`,
        'community:Falta de mantenimiento':  `Falta de mantenimiento en área pública — ${muni}`,
        'community:Música alta':             `Ruido excesivo — ${muni}`,
        'community:Ruido de motoras':        `Ruido de motoras — ${muni}`,
        'community:Instalaciones deportivas':`Instalación deportiva en mal estado — ${muni}`,
        'community:Parques':                 `Parque sin mantenimiento — ${muni}`,
        // services
        'services:Tapones':                  `Tapón sin atender — ${muni}`,
        'services:Transporte público':       `Problema con transporte público — ${muni}`,
        'services:Médicos - Mal trato':      `Mal trato en servicio médico — ${muni}`,
        'services:Escuelas — Condiciones':   `Escuela en malas condiciones — ${muni}`,
        'services:Escuelas — Maestros':      `Problema con personal escolar — ${muni}`,
        'services:Escuelas — Seguridad':     `Problema de seguridad escolar — ${muni}`,
        // other
        'other:Problema no listado':         `Problema ciudadano — ${muni}`,
    };

    const key = `${categoryKey}:${subcategory}`;
    return templates[key] || `${subcategory || 'Problema'} — ${muni}`;
}

// ── HASHTAG GENERATOR ────────────────────────────────────────────────────────
// Builds a full hashtag list from category + subcategory + municipality.
// Used in the success share screen.
export function generateHashtags(categoryKey, subcategory, municipality) {
    const tags = ['#QuéjatePeErre', '#PuertoRico', '#Boricua'];

    // Municipality tag
    if (municipality && municipality !== 'Puerto Rico') {
        const muniTag = '#' + municipality.replace(/\s+/g, '').replace(/[áéíóú]/g, c =>
            ({ á:'a', é:'e', í:'i', ó:'o', ú:'u' }[c])
        ) + 'PR';
        tags.push(muniTag);
    }

    // Category tags
    const catTags = {
        infrastructure: ['#InfraestructuraPR'],
        security:       ['#SeguridadPR'],
        environment:    ['#MedioAmbientePR', '#BasuraPR'],
        community:      ['#ComunidadPR'],
        services:       ['#ServiciosPR'],
        other:          [],
    };
    tags.push(...(catTags[categoryKey] || []));

    // Subcategory tags
    const subTags = {
        'Hoyos':                  ['#HoyosPR'],
        'Apagón':                 ['#ApagonesPR', '#LUMA'],
        'Postes / Cables':        ['#LUMA', '#PostesCaídos'],
        'Sin agua':               ['#AAA', '#AguaPR'],
        'Baja presión':           ['#AAA', '#AguaPR'],
        'Alumbrado público':      ['#AlumbradoPR'],
        'Semáforos':              ['#SemáforosPR'],
        'Derrumbes':              ['#DerrumbesPR'],
        'Inundaciones':           ['#InundacionesPR'],
        'Basura acumulada':       ['#BasuraPR'],
        'Recogido atrasado':      ['#BasuraPR'],
        'Vertederos ilegales':    ['#VertederosPR'],
        'Contaminación':          ['#ContaminaciónPR'],
        'Playas / Ríos sucios':   ['#PlayasPR'],
        'Árboles peligrosos':     ['#ÁrbolesPR'],
        'Tapones':                ['#TaponesPR'],
        'Transporte público':     ['#TransportePR'],
        'Poca vigilancia':        ['#SeguridadPR'],
        'Áreas peligrosas':       ['#SeguridadPR'],
    };
    const extras = subTags[subcategory] || [];
    // Avoid duplicates
    for (const t of extras) {
        if (!tags.includes(t)) tags.push(t);
    }

    return tags;
}

export const SEVERITY_COLORS = {
    verg:   '#C07818',
    ignor:  '#7A6A28',
    nuevo:  '#2A8A8A',
};
