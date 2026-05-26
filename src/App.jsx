import { useState } from "react";
import { supabase } from './lib/supabase'
import Header from "./components/Header";
import MapView from "./components/MapView";
import FeedScreen from "./components/FeedScreen";
import { getMunicipality, getExactLocation } from "./lib/geocode";
import { IoCloseCircle } from "react-icons/io5";
import ReportForm from "./components/ReportForm";
import BottomNav from "./components/BottomNav";
import './App.css';


// sample coordinates for testing report markers
const SAMPLE_REPORTS = [
  {
    id: 1,
    category: 'pothole',
    location: { lat: 18.4655, lng: -66.0701 },
    title: 'Hoyo gigante en la calle principal',
    municipality: 'San Juan',
    daysOpen: 5,
  },
  {
    id: 2,
    category: 'power',
    location: { lat: 18.2208, lng: -66.5901 },
    title: 'Apagón desde hace 3 días',
    municipality: 'Ponce',
    daysOpen: 3,
  },
  {
    id: 3,
    category: 'water',
    location: { lat: 18.0000, lng: -66.5000 },
    title: 'Fuga de agua afecta varias casas',
    municipality: 'Mayagüez',
    daysOpen: 7,
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('mapa');

  // pin location state
  const [pinnedLocation, setPinnedLocation] = useState(null);

  // municipality state - will be set after reverse geocoding the pinned location
  const [municipality, setMunicipality] = useState(null);
  const [loadingMunicipality, setLoadingMunicipality] = useState(false);

  const [exactLocation, setExactLocation] = useState(null);

  // state for report form visibility - toggled when form is opened/closed
  const [formOpen, setFormOpen] = useState(false);

  // handle pin drop event from MapView
  async function handlePinDrop(lng, lat) {
    setPinnedLocation({ lng, lat });
    setLoadingMunicipality(true);

    try {
      // waits for getMunicipality to return the municipality name
      // const muniName = await getMunicipality(lng, lat);
      // setMunicipality(muniName);

      const [muniName, exactLoc] = await Promise.all([
        getMunicipality(lng, lat),
        getExactLocation(lng, lat)
      ]);

      setMunicipality(muniName);
      setExactLocation(exactLoc);

      // switch to feed tab to show reports for the new municipality (todo)
      // setActiveTab('feed'); 
    } catch (error) {
      // API fail or error returned - log error and fallback to default 'Puerto Rico'
      console.error("Error fetching municipality:", error);
      setMunicipality('Puerto Rico'); 
      setExactLocation(null);
    } finally {
      setLoadingMunicipality(false);
    }     
  }

  async function handleFabClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { longitude, latitude } = position.coords;
        setPinnedLocation({ lng: longitude, lat: latitude });

        const [muniName, exactLoc] = await Promise.all([
          getMunicipality(longitude, latitude),
          getExactLocation(longitude, latitude)
        ]);
        
        setMunicipality(muniName);
        setExactLocation(exactLoc);
        setFormOpen(true); // open the report form after getting location data
      },
        () => {
          alert("No se pudo obtener la ubicación. Por favor, permita el acceso a la ubicación e intente de nuevo.");
          setFormOpen(true); // open form anyway so user can manually enter location
        }
      );
    } else {
      setFormOpen(true); // open form anyway so user can manually enter location
    }
  }


  return (
    <div className="app">
      <Header />

      <MapView 
        onPinDrop={handlePinDrop}
        pinnedLocation={pinnedLocation}
        reports={SAMPLE_REPORTS} // pass sample reports to MapView for testing
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
        <p style={{ color: 'var(--muted)', padding: 16, fontFamily: 'Electrolize, monospace', fontSize: 11 }}>Component Placeholder -- active tab: {activeTab}</p>
        
        {/* conditional rendering of feed screen */}
        {(activeTab === 'mapa' || activeTab === 'feed') && (<FeedScreen />)}
        
        {/* details page placeholder */}
        {activeTab === 'datos' && (
          <div style={{ color: 'var(--muted)', padding: 16, fontFamily: 'Electrolize, monospace', fontSize: 11 }}>
            <h2>Dashboard de Municipios</h2>
            <p>Aquí se mostrarán los reportes completos del municipio seleccionado.</p>
          </div>
        )}
        
        {/* more/menu page placeholder */}
        {activeTab === 'más' && (
          <div style={{ color: 'var(--muted)', padding: 16, fontFamily: 'Electrolize, monospace', fontSize: 11 }}>
            <h2>Mas Detalles</h2>
            <p>Aquí se mostrarán más información sobre el municipio y sus reportes.</p>
          </div>
        )}

      </div>
      
      {/* nav updates state and button highlight when clicked */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'report') {
            handleFabClick(); // get geolocation, then open the report form
          } else {
            setActiveTab(tab); // switch tabs for other buttons
          }
        }} />
      
      {/* report form - opens when FAB is clicked, receives location and municipality as props */}
      <ReportForm 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        lng={pinnedLocation?.lng}
        lat={pinnedLocation?.lat}
        exactLocation={exactLocation}
        municipality={municipality}
        onSubmit={() => {
          setFormOpen(false);
          setPinnedLocation(null);
          setMunicipality(null);
        }}
      />
    </div>
  );
}

export default App;