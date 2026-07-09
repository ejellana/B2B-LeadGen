import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal, Trash2 } from 'lucide-react';

const INDUSTRIES = [
  'BPO',
  'FinTech',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Tech',
  'Real Estate',
  'Logistics',
  'Education',
  'Other',
];

const CITIES = [
  'Makati',
  'Taguig',
  'Pasig',
  'Quezon City',
  'Mandaluyong',
  'Pasay',
  'Cebu City',
  'Davao City',
];

const SIZE_TIERS = [
  'SMB (<50)',
  'Mid-Market (50–500)',
  'Enterprise (500+)',
];

const FUNDING_STAGES = [
  'Bootstrapped',
  'Seed',
  'Series A/B/C',
  'Public',
  'Unknown',
];

/**
 * LeadTableFilters — Filter control panel for the lead table.
 * Includes a debounced search input, single-select dropdowns, active filter chips,
 * and a clear-all action. Fully integrated with useLeads filters state.
 */
const LeadTableFilters = ({ filters = {}, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce the search term to avoid spamming network requests
  useEffect(() => {
    const handler = setTimeout(() => {
      if (filters.search !== searchTerm) {
        onFilterChange({ ...filters, search: searchTerm });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm, filters, onFilterChange]);

  // Sync search input if filters are reset externally
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleSelectChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const handleRemoveFilter = (key) => {
    if (key === 'search') {
      setSearchTerm('');
    }
    onFilterChange({
      ...filters,
      [key]: undefined,
    });
  };

  const handleClearAll = () => {
    setSearchTerm('');
    onFilterChange({
      search: undefined,
      industry: undefined,
      city: undefined,
      size_tier: undefined,
      funding_stage: undefined,
    });
  };

  // Compute active chips based on filters object
  const activeChips = Object.entries(filters).filter(
    ([key, val]) => val !== undefined && val !== '' && key !== 'page' && key !== 'size'
  );

  const selectClassName = "w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all";

  return (
    <div className="space-y-4">
      {/* Search and Filters Layout */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5 space-y-4 transition-all duration-300">
        
        {/* Search Input Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by company, industry, or city..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
            aria-label="Search leads"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdowns Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Industry Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Industry
            </label>
            <select
              value={filters.industry || ''}
              onChange={(e) => handleSelectChange('industry', e.target.value)}
              className={selectClassName}
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Industries</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* City Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              City
            </label>
            <select
              value={filters.city || ''}
              onChange={(e) => handleSelectChange('city', e.target.value)}
              className={selectClassName}
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Size Tier Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Size Tier
            </label>
            <select
              value={filters.size_tier || ''}
              onChange={(e) => handleSelectChange('size_tier', e.target.value)}
              className={selectClassName}
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Sizes</option>
              {SIZE_TIERS.map((tier) => (
                <option key={tier} value={tier} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {tier}
                </option>
              ))}
            </select>
          </div>

          {/* Funding Stage Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Funding Stage
            </label>
            <select
              value={filters.funding_stage || ''}
              onChange={(e) => handleSelectChange('funding_stage', e.target.value)}
              className={selectClassName}
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Funding rounds</option>
              {FUNDING_STAGES.map((stage) => (
                <option key={stage} value={stage} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {stage}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Active Filter Chips bar */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-1 px-1 select-none animate-slide-up">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold mr-1">
            <SlidersHorizontal size={12} />
            <span>Active filters:</span>
          </div>

          {activeChips.map(([key, val]) => {
            // Friendly label mapping
            const labelKey = key.replace('_', ' ');
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-450 border border-blue-100 dark:border-blue-500/15"
              >
                <span className="opacity-60 capitalize">{labelKey}:</span>
                <span>{val}</span>
                <button
                  onClick={() => handleRemoveFilter(key)}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/50 p-0.5 rounded transition-colors ml-1"
                  aria-label={`Remove filter ${labelKey}`}
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}

          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all ml-auto"
            aria-label="Clear all filters"
          >
            <Trash2 size={12} />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadTableFilters;
