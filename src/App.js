import { useState } from "react";
import Header from "./components/Header";
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('mapa');

  return (
    <div className="app">
      <Header />
      {/* content placeholder */}
      <div className="content">
        <p style={{color: 'var(--muted)', padding: 16, fontFamily: 'DM Mono, monospace', fontSize: 11}}>Component Placeholder -- active tab: {activeTab}</p>
      </div>
    </div>
  );
}

export default App;