import { FaBolt, FaDroplet, FaRoad, FaLightbulb } from 'react-icons/fa6';
import { MdConstruction } from 'react-icons/md';

// App name
export const APP_NAME = "QuéjatePeErre";

// Report categories (add more as needed)
export const CATEGORIES = [
    { key: 'pothole', label: 'Hoyo', icon: MdConstruction },
    { key: 'power', label: 'Apagón', icon: FaBolt },
    { key: 'water', label: 'Agua', icon: FaDroplet },
    { key: 'road', label: 'Carretera', icon: FaRoad },
    { key: 'light', label: 'Alumbrado', icon: FaLightbulb },
];

// Category colors - used for map pins, card borders, and badges
export const CATEGORY_COLORS = {
    pothole: '#ef4444',
    power: '#f59e0b',
    water: '#7b9ec7',
    road: '#9b5cf6',
    light: '#5dc8a0',
};