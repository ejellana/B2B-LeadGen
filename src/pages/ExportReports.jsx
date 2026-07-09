import { FileDown, FileText, Table2, Info } from 'lucide-react';

const ExportReports = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Page intro */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
            <FileDown size={20} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Export & Reports</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          PapaParse CSV and jsPDF report generation — <span className="text-cyan-650 dark:text-cyan-400 font-medium">Phase 11</span>
        </p>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CSV */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Table2 size={22} className="text-emerald-650 dark:text-emerald-400" />
          </div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">CSV Export</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Export all filtered leads as a CSV file using PapaParse.
          </p>
          <p className="text-slate-400 dark:text-slate-600 text-xs font-mono font-medium">
            philleads_export_YYYY-MM-DD.csv
          </p>
          <div className="mt-4 h-9 w-full bg-emerald-50 dark:bg-emerald-600/20 border border-emerald-200 dark:border-emerald-500/20 rounded-lg animate-pulse" />
        </div>

        {/* PDF */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <FileText size={22} className="text-rose-650 dark:text-rose-400" />
          </div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">PDF Report</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Generate a summary PDF with stats, industry breakdown, and top cities.
          </p>
          <p className="text-slate-400 dark:text-slate-600 text-xs font-mono font-medium">
            philleads_report_YYYY-MM-DD.pdf
          </p>
          <div className="mt-4 h-9 w-full bg-rose-50 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/20 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl">
        <Info size={16} className="text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Export helpers are already wired in <code className="text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">src/utils/exportHelpers.js</code>.
          Phase 11 will connect them to the filtered lead dataset.
        </p>
      </div>
    </div>
  );
};

export default ExportReports;
