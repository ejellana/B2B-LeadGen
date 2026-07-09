import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Map, MapPin, AlertCircle, Building2, RefreshCw, RotateCcw, Layers } from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Tooltip,
  Marker,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import useAnalytics from '../hooks/useAnalytics';
import CompanyDrawer from '../components/Company/CompanyDrawer';
import { CITY_COORDINATES } from '../utils/cityCoordinates';
import { INDUSTRY_COLORS, getIndustryColor } from '../utils/industryColors';

// ── Fix Leaflet's broken default icon paths in bundlers ──────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Philippines default view
const PH_CENTER = [12.8797, 121.774];
const PH_ZOOM = 6;

// ── Icon factories (defined at module level — never re-created on render) ────

/** Polished teardrop SVG marker colored by industry */
const createMarkerIcon = (industry) => {
  const color = getIndustryColor(industry);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="ms" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="rgba(0,0,0,0.28)"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.667 16 26 16 26S32 26.667 32 16C32 7.163 24.837 0 16 0z"
            fill="${color}" filter="url(#ms)"/>
      <circle cx="16" cy="16" r="7" fill="white" opacity="0.95"/>
      <circle cx="16" cy="16" r="4" fill="${color}" opacity="0.7"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'philleads-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    tooltipAnchor: [0, -44],
  });
};

/** Modern pill-style cluster icon */
const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 38 : count < 50 ? 46 : 54;
  const fontSize = count < 10 ? 14 : count < 100 ? 12 : 10;
  return L.divIcon({
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:linear-gradient(135deg,#3B82F6 0%,#6366F1 100%);
        border:3px solid rgba(255,255,255,0.9);
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:700;font-size:${fontSize}px;
        box-shadow:0 4px 16px rgba(99,102,241,0.5),0 2px 6px rgba(0,0,0,0.15);
        font-family:Inter,system-ui,-apple-system,sans-serif;
        letter-spacing:-0.3px;
        position:relative;
      ">
        <div style="
          position:absolute;inset:-4px;border-radius:50%;
          border:2px solid rgba(99,102,241,0.25);
        "></div>
        ${count}
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ── ResetViewControl — uses useMap() so must be a child of MapContainer ──────
const ResetViewControl = () => {
  const map = useMap();
  const handleReset = useCallback(() => {
    map.flyTo(PH_CENTER, PH_ZOOM, { duration: 1.2 });
  }, [map]);

  return (
    <div
      className="leaflet-top leaflet-right"
      style={{ marginTop: 80 }} // below ZoomControl
    >
      <div className="leaflet-control">
        <button
          onClick={handleReset}
          title="Reset to Philippines view"
          aria-label="Reset map to Philippines overview"
          style={{
            width: 34,
            height: 34,
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(51,65,85,0.7)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94a3b8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30,41,59,0.95)';
            e.currentTarget.style.color = '#f1f5f9';
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15,23,42,0.92)';
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = 'rgba(51,65,85,0.7)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// ── Industry counts for legend display ───────────────────────────────────────
const computeIndustryCounts = (leads) => {
  const counts = {};
  for (const lead of leads) {
    const ind = lead.industry || 'Other';
    counts[ind] = (counts[ind] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8); // top 8 to keep legend compact
};

// ─────────────────────────────────────────────────────────────────────────────
const CompanyMap = () => {
  const { allLeads, loading, error, refetch } = useAnalytics();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [legendOpen, setLegendOpen] = useState(true);

  /** Resolve company → [lat, lng] — memoized, stable jitter per lead id */
  const mappableLeads = useMemo(() => {
    if (!allLeads || allLeads.length === 0) return [];
    // Deterministic jitter based on id to avoid re-randomizing on re-render
    const seededJitter = (id, axis) => {
      const seed = (id * (axis === 0 ? 9301 : 6271) + 49297) % 233280;
      return (seed / 233280 - 0.5) * 0.025;
    };
    return allLeads
      .map((lead) => {
        const coords = CITY_COORDINATES[lead.city];
        if (!coords) return null;
        return {
          ...lead,
          _lat: coords[0] + seededJitter(lead.id, 0),
          _lng: coords[1] + seededJitter(lead.id, 1),
        };
      })
      .filter(Boolean);
  }, [allLeads]);

  const unmappedCount = allLeads ? allLeads.length - mappableLeads.length : 0;

  const industryCounts = useMemo(
    () => computeIndustryCounts(mappableLeads),
    [mappableLeads]
  );

  // Stable click handler — avoids re-creating on each render
  const handleMarkerClick = useCallback((lead) => {
    setSelectedCompany(lead);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedCompany(null);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl shrink-0">
            <Map size={20} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              Company Map
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-tight">
              Geographic distribution of Philippine target companies
            </p>
          </div>
        </div>

        {/* Stat pills — right side */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <StatCard
              icon={<MapPin size={13} className="text-teal-500" />}
              value={mappableLeads.length.toLocaleString()}
              label="on map"
              accent="teal"
            />
            {unmappedCount > 0 && (
              <StatCard
                icon={<Building2 size={13} className="text-slate-400" />}
                value={unmappedCount.toLocaleString()}
                label="unmapped"
                accent="slate"
              />
            )}
            <StatCard
              icon={<Layers size={13} className="text-indigo-400" />}
              value={industryCounts.length}
              label="industries"
              accent="indigo"
            />
          </div>
        )}
      </div>

      {/* ── Map wrapper ──────────────────────────────────────────────────── */}
      {/*  isolation: isolate contains Leaflet's high internal z-indexes     */}
      {/*  so the CompanyDrawer (z-40/z-50) always renders above the map.   */}
      <div
        className="relative rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none bg-slate-100 dark:bg-slate-900/60"
        style={{
          height: 'calc(100vh - 310px)',
          minHeight: 400,
          isolation: 'isolate',
        }}
      >

        {/* ── Loading state ── */}
        {loading && (
          <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-4 bg-white/85 dark:bg-slate-950/85 backdrop-blur-sm rounded-2xl">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-teal-500/10 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold">Loading map data</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Fetching company locations…</p>
            </div>
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-5 p-8 text-center bg-white dark:bg-slate-950 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-base mb-1">
                Could not load companies
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                {error}
              </p>
            </div>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && mappableLeads.length === 0 && (
          <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-5 p-8 text-center bg-white dark:bg-slate-950 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center">
              <MapPin size={24} className="text-teal-500" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-base mb-1">
                No companies on map
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                None of your current leads have a recognised city location.
              </p>
            </div>
          </div>
        )}

        {/* ── Actual Leaflet map ── */}
        {!error && (
          <MapContainer
            center={PH_CENTER}
            zoom={PH_ZOOM}
            style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Native Leaflet zoom control */}
            <ZoomControl position="bottomright" />

            {/* Reset view button — inside map so it can call useMap() */}
            <ResetViewControl />

            {/* Clustered markers */}
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterIcon}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom
              maxClusterRadius={60}
              animate
            >
              {mappableLeads.map((lead) => (
                <Marker
                  key={lead.id}
                  position={[lead._lat, lead._lng]}
                  icon={createMarkerIcon(lead.industry)}
                  eventHandlers={{ click: () => handleMarkerClick(lead) }}
                >
                  {/*
                    IMPORTANT: All <Tooltip> children use INLINE styles only.
                    Leaflet renders tooltip nodes outside the React root, so
                    Tailwind utility classes are not scoped here.
                  */}
                  <Tooltip
                    direction="top"
                    offset={[0, -6]}
                    opacity={1}
                    permanent={false}
                    sticky={false}
                  >
                    <MarkerTooltip lead={lead} />
                  </Tooltip>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        )}

        {/* ── Industry Legend (overlay, bottom-left) ── */}
        {!loading && !error && mappableLeads.length > 0 && (
          <div
            className="absolute bottom-3 left-3 z-[400]"
            style={{ maxWidth: 200 }}
          >
            <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-lg backdrop-blur-md overflow-hidden">
              {/* Legend header */}
              <button
                onClick={() => setLegendOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50"
                aria-expanded={legendOpen}
                aria-label={legendOpen ? 'Collapse industry legend' : 'Expand industry legend'}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Industries
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${legendOpen ? '' : '-rotate-90'}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Legend items */}
              {legendOpen && (
                <div className="px-3 pb-2.5 space-y-1.5">
                  {industryCounts.map(([industry, count]) => {
                    const color = getIndustryColor(industry);
                    return (
                      <div key={industry} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">
                            {industry}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Attribution ── */}
        <div className="absolute bottom-2 right-16 z-[400] text-[10px] text-slate-400/70 dark:text-slate-600/70 select-none pointer-events-none">
          © OpenStreetMap contributors
        </div>
      </div>

      {/* Company Profile Drawer */}
      <CompanyDrawer
        company={selectedCompany}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

/**
 * StatCard — compact metric pill, consistent with Dashboard design system.
 */
const StatCard = ({ icon, value, label, accent }) => {
  const accentMap = {
    teal:   'bg-teal-50  dark:bg-teal-900/20   border-teal-200  dark:border-teal-800/50  text-teal-700  dark:text-teal-400',
    slate:  'bg-slate-100 dark:bg-slate-800/60  border-slate-200 dark:border-slate-700    text-slate-600 dark:text-slate-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400',
  };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${accentMap[accent] ?? accentMap.slate}`}>
      {icon}
      <span className="font-bold text-sm tabular-nums">{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  );
};

/**
 * MarkerTooltip — ALL styles must be inline.
 * This component renders inside a Leaflet tooltip DOM node that lives
 * OUTSIDE the React root. Tailwind utility classes are NOT available.
 */
const MarkerTooltip = ({ lead }) => {
  const color = getIndustryColor(lead.industry);
  const industry = lead.industry || 'Other';

  return (
    <div style={{
      minWidth: 170,
      maxWidth: 230,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>
      {/* Company name */}
      <p style={{
        fontWeight: 700,
        fontSize: 13,
        lineHeight: 1.35,
        marginBottom: 10,
        color: 'inherit',
        letterSpacing: '-0.1px',
      }}>
        {lead.company_name}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

        {/* Industry pill */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 9px',
          borderRadius: 9999,
          fontSize: 11,
          fontWeight: 600,
          backgroundColor: `${color}22`,
          color: color,
          border: `1px solid ${color}44`,
          width: 'fit-content',
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'inline-block',
            flexShrink: 0,
          }} />
          {industry}
        </span>

        {/* Size tier */}
        {lead.size_tier && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 9px',
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: 'rgba(100,116,139,0.12)',
            color: 'rgba(148,163,184,0.95)',
            border: '1px solid rgba(100,116,139,0.2)',
            width: 'fit-content',
          }}>
            {lead.size_tier}
          </span>
        )}

        {/* Headcount */}
        {lead.headcount > 0 && (
          <span style={{
            fontSize: 11,
            color: 'rgba(148,163,184,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            👥 {lead.headcount.toLocaleString()} employees
          </span>
        )}

        {/* City */}
        {lead.city && (
          <span style={{
            fontSize: 11,
            color: 'rgba(148,163,184,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            📍 {lead.city}
          </span>
        )}
      </div>

      {/* CTA hint */}
      <div style={{
        marginTop: 10,
        paddingTop: 8,
        borderTop: '1px solid rgba(51,65,85,0.4)',
        fontSize: 10,
        color: 'rgba(148,163,184,0.6)',
        fontWeight: 500,
        letterSpacing: '0.2px',
      }}>
        Click to view full profile →
      </div>
    </div>
  );
};

export default CompanyMap;
