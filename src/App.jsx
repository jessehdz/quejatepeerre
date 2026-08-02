import { useState, useEffect } from "react";
import { supabase } from './lib/supabase';
import { useLocation } from './hooks/useLocation';
import { getGeolocationPermissionState } from './lib/geolocation';
import Header from "./components/Header";
import MapView from "./components/MapView";
import FeedScreen from "./components/FeedScreen";
import ReportForm from "./components/ReportForm";
import BottomNav from "./components/BottomNav";
import ReportDetail from './components/ReportDetail';
import Onboarding, { hasSeenOnboarding, markOnboardingSeen } from './components/Onboarding';
import GpsPrimer from './components/GpsPrimer';
import GpsBlocked from './components/GpsBlocked';
import Faq from './components/Faq';
import CloseButton from './components/shared/CloseButton';
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

  // ── GPS PRIMER ────────────────────────────────────────────────────────────
  // Before triggering the browser's native GPS permission prompt, we show our
  // own explanation of why the app wants location — this measurably improves
  // grant rates on mobile browsers, where a bare permission popup with no
  // context is a common reason users just tap "Block". We skip the primer
  // when permission has already been granted (or previously denied, where
  // showing "why" again won't help — we go straight to the clear error
  // message instead).
  const [gpsPrimerOnReady, setGpsPrimerOnReady]   = useState(null);
  const [gpsBlockedOnReady, setGpsBlockedOnReady] = useState(null);

  async function requestGpsFlow(onReady) {
    const state = await getGeolocationPermissionState();
    if (state === 'granted') {
      requestGeolocation(onReady);
    } else if (state === 'denied') {
      setGpsBlockedOnReady(() => onReady);
    } else {
      setGpsPrimerOnReady(() => onReady);
    }
  }

  function handleGpsPrimerAllow() {
    const onReady = gpsPrimerOnReady;
    setGpsPrimerOnReady(null);
    requestGeolocation(onReady);
  }

  function handleGpsPrimerSkip() {
    const onReady = gpsPrimerOnReady;
    setGpsPrimerOnReady(null);
    onReady?.();
  }

  function handleGpsBlockedClose() {
    const onReady = gpsBlockedOnReady;
    setGpsBlockedOnReady(null);
    onReady?.();
  }

  // Called when the user taps the FAB (report button in the nav)
  function handleFabClick() {
    requestGpsFlow(() => setFormOpen(true));
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
      <CloseButton className="remove-pin-btn" size={28} onClick={clearLocation} ariaLabel="Quitar pin" />
    </div>
  );

  const mapProps = {
    onPinDrop: handlePinDrop,
    pinnedLocation,
    reports,
    flyToLocation: pinnedLocation,  // triggers street-zoom flyTo on GPS or tap
  };

  // otherTabContent — the 'datos' and 'más' panels, shared between the mobile
  // .content wrapper and desktop's right column (see .content { display: none }
  // on desktop — without this, tapping those tabs did nothing on desktop since
  // the right column always rendered the map + feed regardless of activeTab).
  const otherTabContent = (
    <>
      {activeTab === 'datos' && (
        <div className="placeholder-panel">
          <h2>Dashboard de Municipios</h2>
          <p>Próximamente.</p>
        </div>
      )}
      {activeTab === 'más' && <Faq />}
    </>
  );

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

      {/* GpsPrimer — shown before the native GPS prompt when permission isn't decided yet */}
      {gpsPrimerOnReady && (
        <GpsPrimer onAllow={handleGpsPrimerAllow} onSkip={handleGpsPrimerSkip} />
      )}

      {/* GpsBlocked — shown instead of the primer when permission is already denied */}
      {gpsBlockedOnReady && (
        <GpsBlocked onClose={handleGpsBlockedClose} />
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
            {(activeTab === 'datos' || activeTab === 'más') ? otherTabContent : (
              <>
                <div className="desktop-map-inline">
                  <MapView {...mapProps} />
                </div>
                {muniPinCallout}
                <FeedScreen reports={reports} loading={loadingReports} error={reportsError} onDetails={setSelectedReport} onVote={handleReportUpdate} />
              </>
            )}
          </div>
        </div>

      </div>

      {/* ── MOBILE tab content ── */}
      <div className="content">
        {(activeTab === 'mapa' || activeTab === 'feed') && (
          <FeedScreen reports={reports} loading={loadingReports} error={reportsError} onDetails={setSelectedReport} onVote={handleReportUpdate} />
        )}
        {otherTabContent}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          // The real nav only becomes reachable once onboarding is on its
          // last slide (backdrop drops below it) — tapping it there stands
          // in for the removed CTA, so dismiss onboarding for good.
          if (showOnboarding) {
            markOnboardingSeen();
            setShowOnboarding(false);
          }
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
        onRequestGps={requestGpsFlow}
        reports={reports}
        onVote={handleReportUpdate}
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
