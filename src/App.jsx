import { useState, useEffect } from "react";
import { supabase } from './lib/supabase';
import { useLocation } from './hooks/useLocation';
import Header from "./components/Header";
import MapView from "./components/MapView";
import FeedScreen from "./components/FeedScreen";
import ReportForm from "./components/ReportForm";
import BottomNav from "./components/BottomNav";
import ReportDetail from './components/ReportDetail';
import Onboarding, { hasSeenOnboarding } from './components/Onboarding';
import { IoCloseCircle } from "react-icons/io5";
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('mapa');
  const [formOpen, setFormOpen]   = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding());
  const [selectedReport, setSelectedReport] = useState(null);

  // ── LIVE REPORTS FROM SUPABASE ──────────────────────────────────────────────
  const [reports, setReports]           = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState(null);

  useEffect(() => {
    fetchReports();

    // Subscribe to new inserts so the feed updates in real time
    // without the user having to refresh.
    const channel = supabase
      .channel('reports-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, fetchReports)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setReports(data || []);
      setReportsError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReportsError(err.message);
    } finally {
      setLoadingReports(false);
    }
  }

  // Single source of truth for report mutations (votes, status changes, etc.)
  // — keeps ReportCard and ReportDetail showing the same numbers by updating
  // both the reports list and the currently open detail view together.
  function handleReportUpdate(updated) {
    setSelectedReport(prev => (prev && prev.id === updated.id ? updated : prev));
    setReports(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  }

  // ── LOCATION (pin drop + reverse geocoding) ─────────────────────────────────
  // All location state lives in this hook — see src/hooks/useLocation.js
  const {
    pinnedLocation,
    municipality,
    exactLocation,
    loadingLocation,
    resolveCoords,
    clearLocation,
    requestGeolocation,
  } = useLocation();

  // Called when the user taps anywhere on the map
  function handlePinDrop(lng, lat) {
    resolveCoords(lng, lat);
  }

  // Called when the user taps the FAB (report button in the nav)
  function handleFabClick() {
    requestGeolocation(() => setFormOpen(true));
  }

  // ── STATS BANNER (desktop only) ─────────────────────────────────────────────
  const totalOpen     = reports.filter(r => r.status !== 'RESUELTO').length;
  const totalResolved = reports.filter(r => r.status === 'RESUELTO').length;
  const totalVotes    = reports.reduce((sum, r) => sum + (r.vote_count || 0), 0);

  // ── SHARED SUBCOMPONENTS ────────────────────────────────────────────────────

  // muniPinCallout — shown below the map when a pin is active.
  // Defined as a variable so it can be used in both the mobile and desktop layouts
  // without repeating JSX.
  const muniPinCallout = pinnedLocation && (
    <div className="muni-pin">
      <div className="muni-pin-text">
        <span className="muni-text">
          {loadingLocation ? 'Detectando municipio...' : municipality}
        </span>
        <span className="exact-loc-text">
          {loadingLocation ? 'Obteniendo ubicación...' : exactLocation}
        </span>
      </div>
      <button className="remove-pin-btn" onClick={clearLocation} aria-label="Quitar pin">
        <IoCloseCircle size={28} color="var(--cel)" />
      </button>
    </div>
  );

  const mapProps = {
    onPinDrop: handlePinDrop,
    pinnedLocation,
    reports,
    flyToLocation: pinnedLocation,  // triggers street-zoom flyTo on GPS or tap
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* ReportDetail — full-page overlay when Más detalles is tapped */}
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
          onUpdate={handleReportUpdate}
        />
      )}

      {/* Onboarding — shown once on first visit, never again */}
      {showOnboarding && (
        <Onboarding onDone={() => setShowOnboarding(false)} />
      )}
      <Header />

      {/* Stats ticker — desktop only (hidden via CSS on mobile) */}
      <div className="stats-banner">
        <div className="stats-banner-prefix">
          <span className="stats-banner-prefix-text">🇵🇷 Puerto Rico:</span>
        </div>
        <div className="stats-banner-item">
          <span className="stats-banner-label">Reportes activos</span>
          <span className={`stats-banner-value ${totalOpen > 0 ? 'bad' : 'good'}`}>
            {loadingReports ? '—' : totalOpen.toLocaleString()}
          </span>
        </div>
        <div className="stats-banner-item">
          <span className="stats-banner-label">Resueltos</span>
          <span className="stats-banner-value good">
            {loadingReports ? '—' : totalResolved.toLocaleString()}
          </span>
        </div>
        <div className="stats-banner-item">
          <span className="stats-banner-label">Yo También</span>
          <span className="stats-banner-value">
            {loadingReports ? '—' : totalVotes.toLocaleString()}
          </span>
        </div>
        <div className="stats-banner-item">
          <span className="stats-banner-label">Total reportes</span>
          <span className="stats-banner-value">
            {loadingReports ? '—' : reports.length.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ── MOBILE: map stacked above scrollable feed ── */}
      <div className="mobile-map">
        <MapView {...mapProps} />
        {muniPinCallout}
      </div>

      {/* ── DESKTOP: leaderboard left (1/3) | map + feed right (2/3) ── */}
      <div className="desktop-layout">

        <aside className="desktop-left">
          <p className="desktop-panel-label">PEORES MUNICIPIOS · PR</p>
          <p className="desktop-panel-sub">
            {loadingReports ? 'Cargando...' : `${reports.length} reportes activos`}
          </p>
          {/* LeaderboardPanel — coming soon */}
        </aside>

        <div className="desktop-right">
          <div className="desktop-feed">
            <div className="desktop-map-inline">
              <MapView {...mapProps} />
            </div>
            {muniPinCallout}
            <FeedScreen reports={reports} loading={loadingReports} error={reportsError} onDetails={setSelectedReport} onVote={handleReportUpdate} />
          </div>
        </div>

      </div>

      {/* ── MOBILE tab content ── */}
      <div className="content">
        {(activeTab === 'mapa' || activeTab === 'feed') && (
          <FeedScreen reports={reports} loading={loadingReports} error={reportsError} onDetails={setSelectedReport} onVote={handleReportUpdate} />
        )}
        {activeTab === 'datos' && (
          <div className="placeholder-panel">
            <h2>Dashboard de Municipios</h2>
            <p>Próximamente.</p>
          </div>
        )}
        {activeTab === 'más' && (
          <div className="placeholder-panel">
            <h2>Más</h2>
          </div>
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'report') handleFabClick();
          else setActiveTab(tab);
        }}
      />

      <ReportForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        lng={pinnedLocation?.lng}
        lat={pinnedLocation?.lat}
        exactLocation={exactLocation}
        municipality={municipality}
        onRequestGps={requestGeolocation}
        reports={reports}
        onSubmit={() => {
          setFormOpen(false);
          clearLocation();
          fetchReports();
        }}
      />
    </div>
  );
}

export default App;
