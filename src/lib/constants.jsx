import { FaRoad, FaBolt, FaShieldAlt, FaStore, FaHeartbeat, FaBusAlt, FaSchool, FaTrashAlt, FaLeaf, FaHome, FaBalanceScaleLeft, FaEllipsisH } from 'react-icons/fa';
import { FaDroplet, FaBasketball, FaVolumeHigh, FaRoadCircleExclamation } from "react-icons/fa6";
import { BsFillLightbulbOffFill } from "react-icons/bs";
// import { MdConstruction } from 'react-icons/md'

// App name
export const APP_NAME = "QuéjatePeErre";

// Report categories (add more as needed)
export const CATEGORIES_NoSubs = [
    { key: 'pothole', label: 'Hoyo', icon: FaRoadCircleExclamation, color: '#EF4444' },
    { key: 'power', label: 'Apagón', icon: FaBolt, color: '#FF6B35' },
    { key: 'water', label: 'Agua', icon: FaDroplet, color: '#3B82F6' },
    { key: 'road', label: 'Carretera', icon: FaRoad, color: '#8B5CF6' },
    { key: 'light', label: 'Alumbrado', icon: BsFillLightbulbOffFill, color: '#10B981' },
];

export const CATEGORIES_15 = [
    {
        key: 'road',
        label: 'Carretera',
        icon: FaRoad,
        color: '#8B5CF6',
        subcategories: ['Hoyos', 'Semáforos', 'Derrumbes', 'Alumbrado', 'Otro'],
    },
    {
        key: 'luma_power',
        label: 'LUMA',
        icon: FaBolt,
        color: '#10B981',
        subcategories: ['Apagón', 'Postes', 'Cables', 'Factura', 'Otro'],
    }, 
    {
        key: 'water',
        label: 'Agua',
        icon: FaDroplet,
        color: '#3B82F6',
        subcategories: ['Sin servicio', 'Baja presión', 'Factura', 'Servicio', 'Inundaciones', 'Otro'],
    }, 
    {
        key: 'sports',
        label: 'Deportes',
        icon: FaBasketball,
        color: '#C07818',
        subcategories: ['Instalaciones', 'Ligas', 'Seguridad', 'Cobros', 'Otro'],
    },
    {
        key: 'security',
        label: 'Seguridad',
        icon: FaShieldAlt,
        color: '#C8402A',
        subcategories: ['Robo / Crimen', 'Poca vigilancia', 'Alumbrado / Áreas peligrosas', 'Policía', 'Otro'],
    },
    {
        key: 'businesses',
        label: 'Negocios',
        icon: FaStore,
        color: '#053caa',
        subcategories: ['Mal servicio', 'Cobros incorrectos', 'Producto o comida', 'Otro'],
    },
    {
        key: 'health',
        label: 'Salud',
        icon: FaHeartbeat,
        color: '#8A2A5A',
        subcategories: ['Mal trato', 'Servicio', 'Médicos', 'Citas', 'Facturación', 'Otro'],
    },
    {
        key: 'transit',
        label: 'Tránsito',
        icon: FaBusAlt,
        color: '#2A4A6A',
        subcategories: ['Tapones', 'Conductores irresponsables', 'Accidentes', 'Transporte público', 'Otro'],
    },
    {
        key: 'education',
        label: 'Educación',
        icon: FaSchool,
        color: '#5A3A8A',
        subcategories: ['Malas condiciones', 'Problemas con maestros', 'Seguridad escolar', 'Comida', 'Otro'],
    },
    {
        key: 'trash',
        label: 'Basura',
        icon: FaTrashAlt,
        color: '#4A4A2A',
        subcategories: ['Basura acumulada', 'Recogido atrasado', 'Vertederos ilegales', 'Mal olor', 'Áreas abandonadas', 'Otro'],
    },
    {
        key: 'environment',
        label: 'Ambiente',
        icon: FaLeaf,
        color: '#2A6A3A',
        subcategories: ['Parques', 'Contaminación', 'Árboles peligrosos', 'Maltrato ambiental', 'Playas / Ríos sucios', 'Animales abandonados', 'Otro'],
    },
    {
        key: 'housing',
        label: 'Vivienda',
        icon: FaHome,
        color: '#926130',
        subcategories: ['Casas abandonadas', 'Problemas vecinales', 'Falta de mantenimiento', 'Otro'],
    },
    {
        key: 'noise',
        label: 'Ruido',
        icon: FaVolumeHigh,
        color: '#6A2A6A',
        subcategories: ['Música alta', 'Motoras', 'Boceteo', 'Otro'],
    },
    {
        key: 'injustice',
        label: 'Injusticias',
        icon: FaBalanceScaleLeft,
        color: '#4747b0',
        subcategories: ['Favoritismo', 'Abuso', 'Corrupción', 'Otro'],
    },
    {
        key: 'other',
        label: 'Otros',
        icon: FaEllipsisH,
        color: '#4A4A4A',
        subcategories: [],
    },
]

export const CATEGORIES_6 = [
    {
        key: 'infrastructure',
        label: 'Infraestructura',
        icon: FaRoad,
        color: '#e04129',
        subcategories: [
            'Hoyos', 'Semáforos', 'Derrumbes', 'Alumbrado público', 'Apagón', 'Postes / Cables', 'Factura', 'Sin agua', 'Baja presión', 'Inundaciones', 'Otro',
        ],
    },
    {
        key: 'security',
        label: 'Seguridad',
        icon: FaShieldAlt,
        color: '#992020',
        subcategories: [
        'Poca vigilancia', 'Áreas peligrosas', 'Otro',
        ],
    },
    {
        key: 'environment',
        label: 'Ambiente',
        icon: FaLeaf,
        color: '#2fb350',
        subcategories: [
        'Basura acumulada', 'Recogido atrasado', 'Vertederos ilegales', 'Mal olor',
        'Contaminación', 'Playas / Ríos sucios', 'Árboles peligrosos', 'Áreas abandonadas', 'Animales abandonados', 'Otro',
        ],
    },
    {
        key: 'community',
        label: 'Comunidad',
        icon: FaHome,
        color: '#b8732e',
        subcategories: [
        'Casas abandonadas', 'Falta de mantenimiento', 'Música alta', 'Ruido de motoras', 'Instalaciones deportivas', 'Parques', 'Otro',
        ],
    },
    {
        key: 'services',
        label: 'Servicios',
        icon: FaBusAlt,
        color: '#2b71b8',
        subcategories: ['Tapones', 'Transporte público', 'Médicos - Mal trato', 'Escuelas — Condiciones', 'Escuelas — Maestros', 'Escuelas — Seguridad', 'Otro',
        ],
    },
    {
        key: 'other',
        label: 'Otro',
        icon: FaEllipsisH,
        color: '#4A4A4A',
        subcategories: [],
    },
]

export const CATEGORIES = CATEGORIES_6; // switch between categories

// Severity colors - used for severity badges and indicators
export const SEVERITY_COLORS = {
    crisis: '#C8402A',
    verg: '#C07818',
    ignor: '#7A6A28',
    nuevo: '#2A8A8A',
}