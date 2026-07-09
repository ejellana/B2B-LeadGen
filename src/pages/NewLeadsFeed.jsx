import { Bell, Clock } from 'lucide-react';

const SAMPLE_INDUSTRIES = ['BPO', 'FinTech', 'Tech', 'Healthcare', 'Retail', 'Logistics'];

const NewLeadsFeed = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page intro */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
            <Bell size={20} className="text-pink-600 dark:text-pink-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Leads Feed</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          Auto-refreshing feed sorted by discovery time — <span className="text-pink-600 dark:text-pink-400 font-medium">Phase 10</span>
        </p>
      </div>

      {/* Today counter */}
      <div className="flex items-center gap-3 px-4 py-3 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 rounded-xl w-fit">
        <Bell size={16} className="text-pink-600 dark:text-pink-400" />
        <span className="text-pink-700 dark:text-pink-300 text-sm font-semibold">— new leads today</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 flex items-center gap-1">
          <Clock size={11} /> Auto-refreshes every 60s
        </span>
      </div>

      {/* Feed list placeholder */}
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => {
          const industry = SAMPLE_INDUSTRIES[i % SAMPLE_INDUSTRIES.length];
          return (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none rounded-xl"
              style={{ opacity: 1 - i * 0.06 }}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-1.5" />
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 font-medium">
                    {industry}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs">·</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Makati</span>
                </div>
              </div>
              <span className="text-slate-500 dark:text-slate-550 text-xs font-semibold shrink-0">— ago</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewLeadsFeed;
