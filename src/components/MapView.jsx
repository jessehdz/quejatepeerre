import { useState, useCallback } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { FaExclamation } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { CATEGORIES } from "../lib/constants";
import './MapView.css';

// dark mode - map style from MapTiler URL
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`;

// default map center - centered on Puerto Rico (eventually could be set to user's location if geolocation permission is granted)
const PR_CENTER = {
    longitude: -66.5901,
    latitude: 18.2208,
    zoom: 8.5,
};

const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));

/* interactive map view component 

- onPinDrop: callback function to handle pin drop events, receives { lat, lng } as argument
- pinnedLocation: { lat, lng } object representing the current pinned location (if any), used to display the pin on the map
- reports: array of report objects to display on the map as markers
*/
function MapView({ onPinDrop, pinnedLocation, reports = [] }) {

    // which report's popup is currently open, null if no popup is open
    const [selectedReport, setSelectedReport] = useState(null);

    const handleMapClick = useCallback((event) => {
        setSelectedReport(null); // close any open popup when clicking on the map
        const { lngLat } = event;
        onPinDrop( lngLat.lng, lngLat.lat );
    }, [onPinDrop]);

    return (
    <div className="map-view">
        <Map
            initialViewState={PR_CENTER}
            style={{ width: '100%', height: '100%' }}
            mapStyle={MAP_STYLE}
            onClick={handleMapClick}
        >
                
                {/* render marker for each existing report */}
                {reports.map(report => (
                    <Marker 
                        key={report.id} 
                        longitude={report.location.lng}
                        latitude={report.location.lat}
                        anchor="center"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedReport(report);
                        }}
                    >
                        <FaExclamation className="report-pin" color={CATEGORY_COLORS[report.category]}/>
                    </Marker>
                ))}

                {/* display popup for selected report */}
                {selectedReport && (
                    <Popup
                        color={CATEGORY_COLORS[selectedReport.category]}
                        longitude={selectedReport.location.lng}
                        latitude={selectedReport.location.lat}
                        anchor="bottom"
                        onClose={() => setSelectedReport(null)}
                    >
                        <div className="report-pin-popup">
                            <h4 className="popup-title">{selectedReport.title}</h4>
                            <p className="popup-meta">{selectedReport.municipality} | {selectedReport.daysOpen} DÍAS</p>
                        </div>
                    </Popup>
                )}

            {/* display pin if pinnedLocation is provided */}
            {pinnedLocation && (
                    <Marker
                        longitude={pinnedLocation.lng}
                        latitude={pinnedLocation.lat}
                        anchor="bottom" >
                    <div className="map-pin"><MdLocationOn color="red"/></div>
                </Marker>)}
        </Map>
    </div>
)
}

export default MapView;