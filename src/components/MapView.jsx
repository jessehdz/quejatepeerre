import { useState, useCallback, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { FaExclamation } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { CATEGORIES } from "../lib/constants";
import './MapView.css';

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`;

// Island-wide view — shown on first load
const PR_CENTER = {
    longitude: -66.45,
    latitude:  18.22,
    zoom:      8.35,
};

// Street-level zoom used when GPS resolves or user drops a pin
const STREET_ZOOM = 15;

const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));

/*
  MapView

  Props:
    onPinDrop:       (lng, lat) => void
    pinnedLocation:  { lng, lat } | null
    reports:         report[]
    flyToLocation:   { lng, lat } | null  — when set, map animates to this point
                     at street zoom. Passed from App when GPS resolves.
*/
function MapView({ onPinDrop, pinnedLocation, reports = [], flyToLocation }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const mapRef = useRef(null);

    // Fly to GPS/pin location at street zoom when flyToLocation changes
    const prevFlyTo = useRef(null);
    if (
        flyToLocation &&
        mapRef.current &&
        (
            !prevFlyTo.current ||
            prevFlyTo.current.lng !== flyToLocation.lng ||
            prevFlyTo.current.lat !== flyToLocation.lat
        )
    ) {
        prevFlyTo.current = flyToLocation;
        mapRef.current.flyTo({
            center: [flyToLocation.lng, flyToLocation.lat],
            zoom:   STREET_ZOOM,
            speed:  1.4,
            curve:  1.4,
        });
    }

    // Fly back to island view when pin is cleared (flyToLocation becomes null)
    const wasActive = useRef(false);
    if (!flyToLocation && wasActive.current && mapRef.current) {
        wasActive.current = false;
        mapRef.current.flyTo({
            center: [PR_CENTER.longitude, PR_CENTER.latitude],
            zoom:   PR_CENTER.zoom,
            speed:  1.2,
            curve:  1.4,
        });
    }
    if (flyToLocation) wasActive.current = true;

    // Also fly to pin when user taps the map manually
    const handleMapClick = useCallback((event) => {
        setSelectedReport(null);
        const { lngLat } = event;
        onPinDrop(lngLat.lng, lngLat.lat);

        // Zoom in to the tapped point
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [lngLat.lng, lngLat.lat],
                zoom:   STREET_ZOOM,
                speed:  1.2,
                curve:  1.2,
            });
        }
    }, [onPinDrop]);

    const mappableReports = reports.filter(r => r.lat != null && r.lng != null);

    return (
        <div className="map-view">
            <Map
                ref={mapRef}
                initialViewState={PR_CENTER}
                style={{ width: '100%', height: '100%' }}
                mapStyle={MAP_STYLE}
                onClick={handleMapClick}
            >
                {/* Report markers */}
                {mappableReports.map(report => (
                    <Marker
                        key={report.id}
                        longitude={report.lng}
                        latitude={report.lat}
                        anchor="center"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedReport(report);
                        }}
                    >
                        <FaExclamation
                            className="report-pin"
                            color={CATEGORY_COLORS[report.category] || '#7BAFD4'}
                        />
                    </Marker>
                ))}

                {/* Popup for tapped report */}
                {selectedReport && (
                    <Popup
                        longitude={selectedReport.lng}
                        latitude={selectedReport.lat}
                        anchor="bottom"
                        onClose={() => setSelectedReport(null)}
                    >
                        <div className="report-pin-popup">
                            <h4 className="popup-title">{selectedReport.title}</h4>
                            <p className="popup-meta">
                                {selectedReport.municipality?.toUpperCase()} · {selectedReport.municipality}
                            </p>
                        </div>
                    </Popup>
                )}

                {/* Drop pin */}
                {pinnedLocation && (
                    <Marker
                        longitude={pinnedLocation.lng}
                        latitude={pinnedLocation.lat}
                        anchor="bottom"
                    >
                        <div className="map-pin">
                            <MdLocationOn color="red" size={32} />
                        </div>
                    </Marker>
                )}
            </Map>
        </div>
    );
}

export default MapView;
