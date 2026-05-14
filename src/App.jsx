import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import FeedScreen from "./components/FeedScreen";
import { getMunicipality } from "./lib/geocode";
import { IoCloseCircle } from "react-icons/io5";
import BottomNav from "./components/BottomNav";
import './App.css';


function App() {
  const [activeTab, setActiveTab] = useState('mapa');

  // pin location state
  const [pinnedLocation, setPinnedLocation] = useState(null);

  // municipality state - will be set after reverse geocoding the pinned location
  const [municipality, setMunicipality] = useState(null);
  const [loadingMunicipality, setLoadingMunicipality] = useState(false);

  // handle pin drop event from MapView
  async function handlePinDrop(lng, lat) {
    setPinnedLocation({ lng, lat });
    setLoadingMunicipality(true);

    try {
      // waits for getMunicipality to return the municipality name
      const muniName = await getMunicipality(lat, lng);
      setMunicipality(muniName);

      // switch to feed tab to show reports for the new municipality (todo)
      // setActiveTab('feed'); 
    } catch (error) {
      // API fail or error returned - log error and fallback to default 'Puerto Rico'
      console.error("Error fetching municipality:", error);
      setMunicipality('Puerto Rico'); 
    } finally {
      setLoadingMunicipality(false);
    }     
  }

  return (
    <div className="app">
      <Header />

      <MapView 
        onPinDrop={handlePinDrop}
        pinnedLocation={pinnedLocation}
      />

      {/* municipality name when pin is dropped */}
      {pinnedLocation && (
        <div className="muni-pin">
          {loadingMunicipality ? (
            <span className="muni-pin-text" style={{ color: 'var(--muted)' }}>
              Detectando municipio...
            </span>
          ) : (
            <span className="muni-pin-text">
              {municipality}
            </span>
          )}
          {/* button to remove pin and reset states */}
          <button 
            className="remove-pin-btn"
            onClick={() => {
              setPinnedLocation(null);
              setMunicipality(null);
            }}
          >
            <IoCloseCircle size={28} color="var(--cel)" />
          </button>
        </div>
          )}

      {/* content placeholder */}
      <div className="content">
        <p style={{ color: 'var(--muted)', padding: 16, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>Component Placeholder -- active tab: {activeTab}</p>
        
        {/* conditional rendering of feed screen */}
        {(activeTab === 'mapa' || activeTab === 'feed') && (<FeedScreen />)}
        
        {/* details page placeholder */}
        {activeTab === 'datos' && (
          <div style={{ color: 'var(--muted)', padding: 16, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
            <h2>Dashboard de Municipios</h2>
            <p>Aquí se mostrarán los reportes completos del municipio seleccionado.</p>
          </div>
        )}
        
        {/* more/menu page placeholder */}
        {activeTab === 'más' && (
          <div style={{ color: 'var(--muted)', padding: 16, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
            <h2>Mas Detalles</h2>
            <p>Aquí se mostrarán más información sobre el municipio y sus reportes.</p>
          </div>
        )}

      </div>
      
      {/* nav updates state and button highlight when clicked */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;