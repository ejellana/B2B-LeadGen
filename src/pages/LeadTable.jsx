import React from 'react';
import { TableProperties, Filter } from 'lucide-react';
import useLeads from '../hooks/useLeads';
import LeadTable from '../components/Table/LeadTable';
import Pagination from '../components/Table/Pagination';
import ErrorMessage from '../components/common/ErrorMessage';

const LeadTablePage = () => {
  const { leads, loading, error, pagination, page, setPage, refetch } = useLeads();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <TableProperties size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lead Table</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
          Paginated, sortable directory of Philippine target accounts — <span className="text-emerald-650 dark:text-emerald-400 font-medium">Phase 5A</span>
        </p>
      </div>

      {/* Filter Bar Placeholder — Wired in Phase 5B */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-slate-400 dark:text-slate-500" />
          <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Filters</span>
          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            Coming in 5B
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 opacity-60">
          {['Industry', 'City', 'Size Tier', 'Funding Stage', 'Search'].map((f) => (
            <div
              key={f}
              className="h-9 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-750/60 rounded-lg flex items-center px-3 text-xs text-slate-400 select-none cursor-not-allowed"
            >
              Filter by {f}...
            </div>
          ))}
        </div>
      </div>

      {/* Main Datatable Container */}
      {error ? (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <LeadTable data={leads} loading={loading} />
          {!loading && leads.length > 0 && (
            <Pagination
              page={page}
              count={pagination.count}
              pageSize={25}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LeadTablePage;
