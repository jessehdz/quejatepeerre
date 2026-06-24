import './BottomNav.css';
import { Map, Newspaper, Info, Ellipsis, Megaphone } from 'lucide-react';


function BottomNav({ activeTab, onTabChange }) {
    return (
        <nav className="bottom-nav">
            {/* inner group — buttons stay together, centered on desktop */}
            <div className="bottom-nav-inner">

                <button
                    className={`nav-item ${activeTab === 'mapa' ? 'active' : ''}`}
                    onClick={() => onTabChange('mapa')}>
                    {/* No color prop — icons use currentColor so CSS active styles apply */}
                    <span className="nav-icon"><Map /></span>
                    <span className="nav-label">MAPA</span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => onTabChange('feed')}>
                    <span className="nav-icon"><Newspaper /></span>
                    <span className="nav-label">FEED</span>
                </button>

                <button className="nav-fab" onClick={() => onTabChange('report')}>
                    <span className="nav-icon"><Megaphone /></span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'datos' ? 'active' : ''}`}
                    onClick={() => onTabChange('datos')}>
                    <span className="nav-icon"><Info /></span>
                    <span className="nav-label">DATOS</span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'más' ? 'active' : ''}`}
                    onClick={() => onTabChange('más')}>
                    <span className="nav-icon"><Ellipsis /></span>
                    <span className="nav-label">MÁS</span>
                </button>

            </div>
        </nav>
    )
}

export default BottomNav;