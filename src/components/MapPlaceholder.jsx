import './MapPlaceholder.css';

function MapPlaceholder() {
    return (
        <div className="map-placeholder">
            {/* location pin placeholder -- will update dynamically as the user interacts with the map */}
            <div className="map-pin">
                <div>
                    <p className="map-pin-name">San Juan</p>
                    <p className="map-pin-stats">120 CASOS • VER MUNICIPIO</p>
                </div>
                <span className="map-pin-grade">F</span>
            </div>
        </div>
    );
}

export default MapPlaceholder;