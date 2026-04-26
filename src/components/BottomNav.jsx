import './BottomNav.css';
import { Map, Newspaper, Info, Ellipsis, Plus } from 'lucide-react';


function BottomNav({ activeTab, onTabChange }) {
    return (
        <nav className="bottom-nav">
            {/* mapa icon */}
            <button
                className={`nav-item ${activeTab === 'mapa' ? 'active' : ''}`}
                onClick={() => onTabChange('mapa')}>
                <span className="nav-icon"><Map color="#ffffff" /></span>
                <span className="nav-label">MAPA</span>
            </button>

            {/* feed icon */}
            <button
                className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
                onClick={() => onTabChange('feed')}>
                <span className="nav-icon"><Newspaper color="#ffffff" /></span>
                <span className="nav-label">FEED</span>
            </button>

            {/* FAB icon - report button */}
            <button className="nav-fab" onClick={() => onTabChange('report')}>
                <span className="nav-icon"><Plus color="#ffffff" /></span>
            </button>


            {/* datos icon */}
            <button
                className={`nav-item ${activeTab === 'datos' ? 'active' : ''}`}
                onClick={() => onTabChange('datos')}>
                <span className="nav-icon"><Info color="#ffffff" /></span>
                <span className="nav-label">DATOS</span>
            </button>

            {/* mas icon */}
            <button
                className={`nav-item ${activeTab === 'más' ? 'active' : ''}`}
                onClick={() => onTabChange('más')}>
                <span className="nav-icon"><Ellipsis color="#ffffff" /></span>
                <span className="nav-label">MÁS</span>
            </button>
        </nav>
    )
}

export default BottomNav;