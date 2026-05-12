import { useState, useCallback } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { MdLocationOn } from "react-icons/md";
import './MapView.css';

// dark mode - map style from MapTiler URL
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`;

const PR_CENTER = {
    longitude: -66.5901,
    latitude: 18.2208,
    zoom: 9,
};

/* interactive map view component 

- onPinDrop: callback function to handle pin drop events, receives { lat, lng } as argument
- pinnedLocation: { lat, lng } object representing the current pinned location (if any), used to display the pin on the map
*/
function MapView({ onPinDrop, pinnedLocation }) {
    
    const handleMapClick = useCallback((event) => {
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
            {/* display pin if pinnedLocation is provided */}
            {pinnedLocation && (
                <Marker longitude={pinnedLocation.lng} latitude={pinnedLocation.lat} anchor="bottom" >
                    <div className="map-pin"><MdLocationOn color="red"/></div>
                </Marker>)}
        </Map>
    </div>
)
}

export default MapView;