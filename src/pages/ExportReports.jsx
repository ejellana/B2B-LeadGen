import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FileDown,
  Table2,
  FileText,
  Download,
  Loader2,
  Building2,
  Layers,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import { getAllLeadsForAnalytics } from '../services/api';
import { exportToCSV, exportToPDF } from '../utils/exportHelpers';
import StatCard from '../components/common/StatCard';
import ErrorMessage from '../components/common/ErrorMessage';

// ─── Toast ────────────────────────────────────────────────────────────────────
/**
 * ExportToast — lightweight success/error toast, auto-dismisses in 5s.
 * No external library needed — matches the existing EnrichToast pattern.
 */
const ExportToast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-[80] animate-slide-up">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border max-w-[340px] ${
          isSuccess
            ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50'
            : 'bg-red-50 dark:bg-red-900/25 border-red-200 dark:border-red-700/50'
        }`}
      >
        <div className={`shrink-0 mt-0.5 ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
          {isSuccess ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${isSuccess ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
            {isSuccess ? 'Export Successful' : 'Export Failed'}
          </p>
          <p className={`text-xs mt-0.5 leading-relaxed ${isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {toast.message}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className={`shrink-0 p-1 rounded-lg transition-colors ${
            isSuccess ? 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-800/30' : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30'
          }`}
          aria-label="Dismiss"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ExportReports = () => {
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [csvGenerating, setCsvGenerating] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }

  const showToast = (type, message) => setToast({ type, message });
  const dismissToast = useCallback(() => setToast(null), []);

  // ── Fetch ALL leads (used for stats + exports) ────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const leads = await getAllLeadsForAnalytics();
      setAllLeads(leads);
    } catch (err) {
      setError(err.message || 'Cannot connect to database. Make sure Baserow is running at localhost:85');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Memoised preview stats (same pattern as Dashboard) ───────────────────
  const stats = useMemo(() => {
    if (!allLeads.length) return { total: 0, industries: 0, cities: 0, avgHeadcount: 0 };

    const uniqueIndustries = new Set(allLeads.map(l => l.industry).filter(Boolean)).size;
    const uniqueCities     = new Set(allLeads.map(l => l.city).filter(Boolean)).size;

    const withHc = allLeads.filter(l => l.headcount && l.headcount > 0);
    const avgHeadcount = withHc.length > 0
      ? Math.round(withHc.reduce((s, l) => s + Number(l.headcount), 0) / withHc.length)
      : 0;

    return { total: allLeads.length, industries: uniqueIndustries, cities: uniqueCities, avgHeadcount };
  }, [allLeads]);

  // ── Export handlers ──────────────────────────────────────────────────────
  const handleCSV = async () => {
    if (csvGenerating || !allLeads.length) return;
    setCsvGenerating(true);
    try {
      exportToCSV(allLeads);
      showToast('success', `✓ CSV exported — ${allLeads.length} records downloaded.`);
    } catch (err) {
      showToast('error', err.message || 'CSV export failed. Please try again.');
    } finally {
      setCsvGenerating(false);
    }
  };

  const handlePDF = async () => {
    if (pdfGenerating || !allLeads.length) return;
    setPdfGenerating(true);
    try {
      exportToPDF(allLeads);
      showToast('success', '✓ PDF report generated successfully.');
    } catch (err) {
      showToast('error', err.message || 'PDF generation failed. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  // ── Date for preview filename ─────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl shrink-0">
          <FileDown size={20} className="text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Export &amp; Reports</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Download the full Baserow dataset as CSV or a PDF summary report
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <ErrorMessage message={error} onRetry={fetchAll} />
        </div>
      )}

      {/* Preview Stats */}
      {!error && (loading || allLeads.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Records"
            value={stats.total}
            icon={Building2}
            description="Will be exported"
            loading={loading}
            trendText={loading ? '…' : 'All pages'}
            trendType="neutral"
          />
          <StatCard
            title="Industries"
            value={stats.industries}
            icon={Layers}
            description="Unique sectors"
            loading={loading}
            trendText="Sectors"
            trendType="neutral"
          />
          <StatCard
            title="Cities"
            value={stats.cities}
            icon={MapPin}
            description="Municipalities covered"
            loading={loading}
            trendText="Geographic"
            trendType="neutral"
          />
          <StatCard
            title="Avg Headcount"
            value={stats.avgHeadcount}
            icon={Users}
            description="Average employees"
            loading={loading}
            trendText="Per company"
            trendType="neutral"
          />
        </div>
      )}

      {/* Export Cards */}
      {!error && (loading || allLeads.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* ── CSV Card ── */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Table2 size={22} className="text-emerald-600 dark:text-emerald-400" />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-2">
              <h3 className="text-slate-900 dark:text-white font-bold text-base">CSV Export</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Export all registered companies as a structured CSV file — includes company name, industry, city, size tier, funding stage, website, email, headcount, and discovery date.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Company Name', 'Industry', 'City', 'Size Tier', 'Funding Stage', 'Website', 'Email', 'Headcount', 'Created Date'].map(col => (
                  <span key={col} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Filename preview */}
            <p className="text-slate-400 dark:text-slate-600 text-xs font-mono font-medium">
              philleads_export_{today}.csv
            </p>

            {/* Button */}
            <button
              onClick={handleCSV}
              disabled={csvGenerating || loading || !allLeads.length}
              aria-label="Download CSV"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900"
            >
              {csvGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Preparing CSV…
                </>
              ) : (
                <>
                  <Download size={15} />
                  {loading ? 'Loading data…' : `Download CSV (${allLeads.length} records)`}
                </>
              )}
            </button>
          </div>

          {/* ── PDF Card ── */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <FileText size={22} className="text-rose-600 dark:text-rose-400" />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-2">
              <h3 className="text-slate-900 dark:text-white font-bold text-base">PDF Report</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Generate a structured PDF intelligence summary including key statistics, top industry sectors, and top municipalities — ready for stakeholder sharing.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Total Leads', 'Industries', 'Cities', 'Avg Headcount', 'Largest Sector', 'Largest City', 'Top 5 Industries', 'Top 5 Cities'].map(item => (
                  <span key={item} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Filename preview */}
            <p className="text-slate-400 dark:text-slate-600 text-xs font-mono font-medium">
              philleads_report_{today}.pdf
            </p>

            {/* Button */}
            <button
              onClick={handlePDF}
              disabled={pdfGenerating || loading || !allLeads.length}
              aria-label="Download PDF"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900"
            >
              {pdfGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Generating PDF…
                </>
              ) : (
                <>
                  <FileText size={15} />
                  {loading ? 'Loading data…' : 'Generate PDF Report'}
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Empty state */}
      {!error && !loading && allLeads.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 gap-5 shadow-sm dark:shadow-none animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FileDown size={32} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">No Leads to Export</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              Your database is currently empty. Add lead records to enable CSV and PDF report generation.
            </p>
          </div>
        </div>
      )}

      {/* Toast */}
      <ExportToast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default ExportReports;
