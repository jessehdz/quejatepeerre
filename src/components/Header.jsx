import { Dot, Star } from 'lucide-react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-top">
                <div className="logo">
                    <Star size={14} fill="white" strokeWidth={0} />
                    <span>Quéjate<span className='logo-red'>Pe</span><span className='logo-cel-blue'>Erre</span></span>
                </div>

                {/* Beta badge -- will remove after launch */}
                <div className='beta-badge'>
                    BETA
                </div>
            </div>
            <div className="logo-sub">
                PLATAFORMA CIUDADANA <Dot size={12} /> PR
            </div>
        </header>
    )
}

export default Header;