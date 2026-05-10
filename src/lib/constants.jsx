import { FaBolt, FaDroplet, FaRoad, FaRoadCircleExclamation } from 'react-icons/fa6';
import { BsFillLightbulbOffFill } from "react-icons/bs";
// import { MdConstruction } from 'react-icons/md'

// App name
export const APP_NAME = "QuéjatePeErre";

// Report categories (add more as needed)
export const CATEGORIES = [
    { key: 'pothole', label: 'Hoyo', icon: FaRoadCircleExclamation, color: '#EF4444' },
    { key: 'power', label: 'Apagón', icon: FaBolt, color: '#FF6B35' },
    { key: 'water', label: 'Agua', icon: FaDroplet, color: '#7bafd4' },
    { key: 'road', label: 'Carretera', icon: FaRoad, color: '#9B5CF6' },
    { key: 'light', label: 'Alumbrado', icon: BsFillLightbulbOffFill, color: '#00d4a8' },
];

// Category colors - used for map pins, card borders, and badges
export const CATEGORY_COLORS = {
    pothole: '#EF4444',
    power: '#FF6B35',
    water: '#7bafd4',
    road: '#9B5CF6',
    light: '#00d4a8',
};

// Severity colors - used for severity badges and indicators
export const SEVERITY_COLORS = {
    crisis: '#C8402A',
    verg: '#C07818',
    ignor: '#7A6A28',
    nuevo: '#2A8A8A',
}