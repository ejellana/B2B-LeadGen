import React from 'react';
import { TableProperties } from 'lucide-react';
import useLeads from '../hooks/useLeads';
import LeadTable from '../components/Table/LeadTable';
import Pagination from '../components/Table/Pagination';
import LeadTableFilters from '../components/Table/LeadTableFilters';
import ErrorMessage from '../components/common/ErrorMessage';

const LeadTablePage = () => {
  const {
    leads,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    page,
    setPage,
    refetch,
  } = useLeads();

  // Reset pagination page to 1 whenever filters change to prevent boundary mismatches
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <TableProperties size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lead Table</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
            Browse, sort, and filter all registered target accounts — <span className="text-emerald-650 dark:text-emerald-400 font-medium">Phase 5B</span>
          </p>
        </div>

        {/* Dynamic results counter in header */}
        {!loading && !error && leads.length > 0 && (
          <div className="sm:text-right ml-[52px] sm:ml-0 text-slate-500 dark:text-slate-400 text-xs font-semibold select-none">
            Showing <span className="text-slate-800 dark:text-slate-200 font-bold">{leads.length}</span> of{' '}
            <span className="text-slate-850 dark:text-slate-100 font-bold">{pagination.count.toLocaleString()}</span> companies
          </div>
        )}
      </div>

      {/* Filter and Search Bar Controls */}
      <LeadTableFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Table Results rendering */}
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
              pageSize={pagination.pageSize || 100}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LeadTablePage;
