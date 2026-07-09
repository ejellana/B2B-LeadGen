import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  MapPin,
  Mail,
  Layers,
} from 'lucide-react';

const STAT_PLACEHOLDERS = [
  { label: 'Total Companies', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Cities Covered', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Industries Tracked', icon: Layers, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { label: 'With Email Contact', icon: Mail, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
];

const CHART_PLACEHOLDERS = [
  'Industry Breakdown — Pie Chart',
  'Size Tier Distribution — Bar Chart',
  'Top 10 Cities — Horizontal Bar',
  'Funding Stage — Donut Chart',
  'Headcount by Industry — Grouped Bar',
  'Companies Over Time — Line Chart',
  'Industry × City — Heatmap',
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page intro */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <LayoutDashboard size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          Summary cards, industry charts, and geographic breakdowns — <span className="text-blue-500 dark:text-blue-400 font-medium">Phase 4</span>
        </p>
      </div>

      {/* Summary stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_PLACEHOLDERS.map(({ label, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={`flex items-center gap-4 p-4 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none backdrop-blur-sm`}
          >
            <div className={`p-2.5 rounded-xl border ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-1" />
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {CHART_PLACEHOLDERS.map((label) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-slate-400 dark:text-slate-600" />
              <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{label}</p>
            </div>
            <div className="h-40 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-450 dark:text-slate-600 text-xs">Chart renders in Phase 4</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
