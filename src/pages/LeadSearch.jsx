import { Search, Zap, Clock, Database } from 'lucide-react';

const SUGGESTED_KEYWORDS = [
  'BPO', 'FinTech', 'Healthcare', 'Real Estate', 'Manufacturing',
  'Retail', 'Logistics', 'Education', 'Tech', 'Banking',
  'Pharmaceutical', 'Insurance', 'Construction', 'Energy', 'Food',
];

const LeadSearch = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Page intro */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
            <Search size={20} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lead Search & Discovery</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          N8N webhook integration — <span className="text-violet-500 dark:text-violet-400 font-medium">Phase 7</span>
        </p>
      </div>

      {/* Search form placeholder */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-violet-600 dark:text-violet-400" />
          <span className="text-slate-900 dark:text-white font-semibold text-sm">Discover New Leads</span>
        </div>

        {/* Keyword input placeholder */}
        <div className="flex gap-3">
          <div className="flex-1 h-11 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl animate-pulse" />
          <div className="w-36 h-11 bg-violet-600/20 dark:bg-violet-600/30 border border-violet-300 dark:border-violet-500/30 rounded-xl animate-pulse" />
        </div>

        {/* Keyword badges */}
        <div>
          <p className="text-slate-500 dark:text-slate-600 text-xs mb-3 font-medium">Suggested keywords</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_KEYWORDS.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent searches + status placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-slate-400 dark:text-slate-500" />
            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Recent Searches</span>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-xs">Stored in localStorage — Phase 7</p>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database size={15} className="text-slate-400 dark:text-slate-500" />
            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Discovery Status</span>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-xs">N8N webhook status — Phase 7</p>
        </div>
      </div>
    </div>
  );
};

export default LeadSearch;
