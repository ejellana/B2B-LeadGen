import React, { useState, useMemo } from 'react';
import { Map, MapPin, AlertCircle, Building2 } from 'lucide-react';
import { MapContainer, TileLayer, Tooltip, Marker, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import useAnalytics from '../hooks/useAnalytics';
import CompanyDrawer from '../components/Company/CompanyDrawer';
import IndustryBadge from '../components/common/IndustryBadge';
import SizeTierBadge from '../components/common/SizeTierBadge';
import { CITY_COORDINATES } from '../utils/cityCoordinates';
import { getIndustryColor } from '../utils/industryColors';

// ── Fix Leaflet's broken default icon paths in bundlers ──────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/** Create a circular SVG marker icon colored by industry */
const createMarkerIcon = (industry) => {
  const color = getIndustryColor(industry);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
      </filter>
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    tooltipAnchor: [0, -36],
  });
};

/** Create a cluster icon styled consistently */
const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 36 : count < 50 ? 42 : 50;
  return L.divIcon({
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:linear-gradient(135deg,#3B82F6,#6366F1);
        border:3px solid white;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:700;font-size:${count < 10 ? 13 : 11}px;
        box-shadow:0 4px 12px rgba(99,102,241,0.45);
      ">${count}</div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Philippines center coordinates
const PH_CENTER = [12.8797, 121.7740];
const PH_ZOOM = 6;

const CompanyMap = () => {
  const { allLeads, loading, error, refetch } = useAnalytics();
  const [selectedCompany, setSelectedCompany] = useState(null);

  /** Resolve company → [lat, lng] using city coordinates lookup */
  const mappableLeads = useMemo(() => {
    if (!allLeads || allLeads.length === 0) return [];
    return allLeads
      .map((lead) => {
        const coords = CITY_COORDINATES[lead.city];
        if (!coords) return null;
        // Add slight jitter so overlapping markers in same city don't stack perfectly
        const jitter = () => (Math.random() - 0.5) * 0.025;
        return { ...lead, _lat: coords[0] + jitter(), _lng: coords[1] + jitter() };
      })
      .filter(Boolean);
  }, [allLeads]);

  const unmappedCount = allLeads ? allLeads.length - mappableLeads.length : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
              <Map size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Company Map</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
            Interactive map of Philippine target companies —{' '}
            <span className="text-teal-600 dark:text-teal-400 font-medium">Phase 8A</span>
          </p>
        </div>

        {/* Stats pills */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-2 ml-[52px] sm:ml-0">
            <StatPill
              icon={<MapPin size={12} />}
              label={`${mappableLeads.length} mapped`}
              color="teal"
            />
            {unmappedCount > 0 && (
              <StatPill
                icon={<Building2 size={12} />}
                label={`${unmappedCount} no location`}
                color="slate"
              />
            )}
          </div>
        )}
      </div>

      {/* Map container */}
      <div
        className="relative bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none rounded-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 230px)', minHeight: '480px' }}
      >
        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Loading company data…</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-8 text-center bg-white dark:bg-slate-950">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold mb-1">Failed to load companies</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && mappableLeads.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-8 text-center bg-white dark:bg-slate-950">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
              <MapPin size={22} className="text-teal-500" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold mb-1">No mappable companies</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                None of the loaded companies have a recognised city location.
              </p>
            </div>
          </div>
        )}

        {/* Actual map — always rendered so tiles load in background */}
        {!error && (
          <MapContainer
            center={PH_CENTER}
            zoom={PH_ZOOM}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            {/* OpenStreetMap tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Zoom control bottom-right */}
            <ZoomControl position="bottomright" />

            {/* Clustered markers */}
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterIcon}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom
              maxClusterRadius={60}
            >
              {mappableLeads.map((lead) => (
                <Marker
                  key={lead.id}
                  position={[lead._lat, lead._lng]}
                  icon={createMarkerIcon(lead.industry)}
                  eventHandlers={{ click: () => setSelectedCompany(lead) }}
                >
                  <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent={false}>
                    <MarkerTooltip lead={lead} />
                  </Tooltip>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        )}

        {/* Attribution */}
        <div className="absolute bottom-2 left-2 z-[1000] text-[10px] text-slate-400 dark:text-slate-600 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded select-none">
          © OpenStreetMap contributors
        </div>
      </div>

      {/* Company Profile Drawer */}
      <CompanyDrawer
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────

const MarkerTooltip = ({ lead }) => (
  <div className="min-w-[160px] max-w-[220px]">
    <p className="font-bold text-slate-900 text-[13px] leading-snug mb-2">{lead.company_name}</p>
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <IndustryBadge industry={lead.industry} />
      </div>
      <div className="flex items-center gap-1.5">
        <SizeTierBadge tier={lead.size_tier} />
      </div>
      {lead.city && (
        <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-1">
          <MapPin size={10} />
          {lead.city}
        </div>
      )}
    </div>
    <p className="text-[10px] text-slate-400 mt-2 font-medium">Click to view profile →</p>
  </div>
);

const StatPill = ({ icon, label, color }) => {
  const colors = {
    teal: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-400',
    slate: 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400',
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${colors[color]}`}>
      {icon}
      {label}
    </div>
  );
};

export default CompanyMap;
