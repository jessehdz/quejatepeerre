import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
// import ReportCard from "./components/ReportCard";
// import { Icon, TrafficCone } from "lucide-react";
import FeedScreen from "./components/FeedScreen";
import BottomNav from "./components/BottomNav";
import './App.css';


function App() {
  const [activeTab, setActiveTab] = useState('mapa');

  // pin location state
  const [pinnedLocation, setPinnedLocation] = useState(null);

  return (
    <div className="app">
      <Header />

      <MapView 
        onPinDrop={(lng, lat) => setPinnedLocation({ lng, lat })}
        pinnedLocation={pinnedLocation}
      />

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