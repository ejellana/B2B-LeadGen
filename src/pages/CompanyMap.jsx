import { Map } from 'lucide-react';

const CompanyMap = () => {
  return (
    <div className="space-y-4 animate-fade-in h-full">
      {/* Page intro */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
            <Map size={20} className="text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Company Map</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          Interactive Leaflet.js map with clustered markers — <span className="text-teal-600 dark:text-teal-400 font-medium">Phase 8</span>
        </p>
      </div>

      {/* Map placeholder */}
      <div className="relative bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none rounded-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}
      >
        {/* Simulated map grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(#334155 1px, transparent 1px),
              linear-gradient(90deg, #334155 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Map size={32} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">Philippine Company Map</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Interactive react-leaflet map with OpenStreetMap tiles, clustered industry markers, and filter panel
            </p>
          </div>
          <span className="text-xs text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full font-medium">
            Implements in Phase 8
          </span>
        </div>

        {/* Filter panel placeholder (left) */}
        <div className="absolute top-4 left-4 w-52 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-md dark:shadow-none">
          <p className="text-slate-700 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Filters</p>
          <div className="space-y-2">
            {['Industry', 'Size Tier'].map((f) => (
              <div key={f} className="h-7 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse" title={f} />
            ))}
          </div>
        </div>

        {/* Legend placeholder (bottom-right) */}
        <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-md dark:shadow-none">
          <p className="text-slate-600 dark:text-slate-400 text-xs mb-2 font-semibold">Industry Colors</p>
          {['BPO', 'FinTech', 'Tech', 'Healthcare'].map((ind) => (
            <div key={ind} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-slate-700 dark:text-slate-400 text-xs font-medium">{ind}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyMap;
