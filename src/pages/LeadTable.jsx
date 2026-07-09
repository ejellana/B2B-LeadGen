import { TableProperties, Filter } from 'lucide-react';

const COLUMNS = [
  'Company Name', 'Domain', 'Industry', 'Size Tier',
  'City', 'Headcount', 'Funding Stage', 'Email', 'Source', 'Created At',
];

const LeadTablePage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page intro */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <TableProperties size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lead Table</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          Paginated, sortable, filterable table with Company Profile modal — <span className="text-emerald-650 dark:text-emerald-400 font-medium">Phase 5</span>
        </p>
      </div>

      {/* Filter bar placeholder */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-slate-450 dark:text-slate-550" />
          <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Industry', 'City', 'Size Tier', 'Funding Stage', 'Search'].map((f) => (
            <div
              key={f}
              className="h-9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse"
              title={f}
            />
          ))}
        </div>
      </div>

      {/* Table placeholder */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-4 py-3"
          style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(100px, 1fr))` }}
        >
          {COLUMNS.map((col) => (
            <span key={col} className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider truncate">
              {col}
            </span>
          ))}
        </div>

        {/* Skeleton rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid border-b border-slate-150 dark:border-slate-800/50 px-4 py-3 gap-2"
            style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(100px, 1fr))` }}
          >
            {COLUMNS.map((col) => (
              <div
                key={col}
                className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
                style={{ width: `${50 + Math.random() * 40}%`, opacity: 1 - i * 0.07 }}
              />
            ))}
          </div>
        ))}

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Showing — of — leads</span>
          <div className="flex gap-2">
            {[1, 2, 3, '...', 12].map((p, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                  p === 1
                    ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadTablePage;
