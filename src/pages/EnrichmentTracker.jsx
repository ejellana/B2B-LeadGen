import { BarChart3, CheckCircle2, XCircle } from 'lucide-react';

const FIELDS = ['Email Contact', 'LinkedIn URL', 'Phone Number', 'Headcount'];

const EnrichmentTracker = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page intro */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <BarChart3 size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enrichment Tracker</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          Data completeness monitoring with per-field progress — <span className="text-amber-600 dark:text-amber-400 font-medium">Phase 9</span>
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {FIELDS.map((field) => (
          <div key={field} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-4">
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-2" />
            <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold">{field}</p>
            <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-amber-500/40 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Table placeholder */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl overflow-hidden">
        <div className="grid border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-4 py-3"
          style={{ gridTemplateColumns: '2fr repeat(4, 1fr) 120px' }}
        >
          {['Company', 'Email', 'LinkedIn', 'Phone', 'Headcount', 'Action'].map((col) => (
            <span key={col} className="text-slate-550 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              {col}
            </span>
          ))}
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`grid border-b border-slate-150 dark:border-slate-800/50 px-4 py-3 items-center gap-2 ${
              i % 3 === 0 ? 'bg-emerald-500/5' : i % 3 === 1 ? 'bg-amber-500/5' : 'bg-red-500/5'
            }`}
            style={{ gridTemplateColumns: '2fr repeat(4, 1fr) 120px' }}
          >
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="flex items-center">
                {(i + j) % 2 === 0
                  ? <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-500" />
                  : <XCircle size={16} className="text-red-500/50" />
                }
              </div>
            ))}
            <div className="h-7 w-24 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrichmentTracker;
