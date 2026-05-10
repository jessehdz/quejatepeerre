import { useState } from "react";
import Header from "./components/Header";
import ReportCard from "./components/ReportCard";
import { TrafficCone } from "lucide-react";
import BottomNav from "./components/BottomNav";
import './App.css';


function App() {
  const [activeTab, setActiveTab] = useState('mapa');

  return (
    <div className="app">
      <Header />
      {/* content placeholder */}
      <div className="content">
        <p style={{ color: 'var(--muted)', padding: 16, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>Component Placeholder -- active tab: {activeTab}</p>
        <ReportCard
        category="hoyo"
        icon={TrafficCone}
        label="Hoyo"
        severity="CRISIS"
        title="Calle 123 con bache enorme, lleva meses así y nadie hace nada"
        municipality="San Juan"
        daysOpen={120}
        voteCount={34}
      />
      </div>
      
      {/* nav updates state and button highlight when clicked */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;