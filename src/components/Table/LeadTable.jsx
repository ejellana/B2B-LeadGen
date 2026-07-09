import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Mail,
  Calendar,
  Globe,
} from 'lucide-react';
import IndustryBadge from '../common/IndustryBadge';
import SizeTierBadge from '../common/SizeTierBadge';

/**
 * LeadTable — Interactive datatable displaying lead information from Baserow.
 * Supports sticky header, column sorting, alternating row hovers, website and email link renderers.
 * Calls onRowClick(lead) when a row is selected.
 */
const LeadTable = ({ data = [], loading = false, onRowClick }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field, e) => {
    // Prevent sort when user clicks on a link inside the header
    e.stopPropagation();
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedLeads = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [data, sortField, sortOrder]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="text-slate-400 dark:text-slate-500 ml-1.5 shrink-0" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="text-blue-600 dark:text-blue-400 ml-1.5 shrink-0" />
    ) : (
      <ArrowDown size={12} className="text-blue-600 dark:text-blue-400 ml-1.5 shrink-0" />
    );
  };

  const columnsConfig = [
    { key: 'company_name', label: 'Company Name', sortable: true },
    { key: 'industry', label: 'Industry', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'size_tier', label: 'Size Tier', sortable: true },
    { key: 'funding_stage', label: 'Funding Stage', sortable: true },
    { key: 'domain', label: 'Website', sortable: true },
    { key: 'email_contact', label: 'Contact Email', sortable: true },
    { key: 'last_updated', label: 'Last Updated', sortable: true },
  ];

  if (loading) {
    return (
      <div className="border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-900/80 px-6 py-4 flex border-b border-slate-200 dark:border-slate-800">
          {columnsConfig.map((col) => (
            <div key={col.key} className="flex-1 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mr-4" />
          ))}
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              {columnsConfig.map((col) => (
                <div
                  key={col.key}
                  className="flex-1 h-4 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse"
                  style={{ opacity: 1 - i * 0.09 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
        <p className="text-slate-900 dark:text-white font-bold text-base mb-1">No Leads Found</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
          No lead records match the current search and filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 select-none">
            <tr>
              {columnsConfig.map((col) => (
                <th
                  key={col.key}
                  onClick={(e) => col.sortable && handleSort(col.key, e)}
                  className={`py-3.5 px-6 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap
                    ${col.sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors' : ''}`}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/65 text-slate-700 dark:text-slate-250">
            {sortedLeads.map((lead) => {
              const formattedDate = lead.last_updated
                ? new Date(lead.last_updated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—';

              return (
                <tr
                  key={lead.id}
                  onClick={() => onRowClick && onRowClick(lead)}
                  className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all duration-150 group cursor-pointer"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onRowClick && onRowClick(lead)}
                  aria-label={`View profile for ${lead.company_name}`}
                >
                  <td className="py-3 px-6 font-semibold text-slate-900 dark:text-white max-w-[180px]">
                    <span className="truncate block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {lead.company_name}
                    </span>
                  </td>

                  <td className="py-3 px-6 whitespace-nowrap">
                    <IndustryBadge industry={lead.industry} />
                  </td>

                  <td className="py-3 px-6 font-medium text-slate-650 dark:text-slate-300 max-w-[120px] truncate">
                    {lead.city || '—'}
                  </td>

                  <td className="py-3 px-6 whitespace-nowrap">
                    <SizeTierBadge tier={lead.size_tier} />
                  </td>

                  <td className="py-3 px-6 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-250/20 dark:border-slate-700/40">
                      {lead.funding_stage || 'Unknown'}
                    </span>
                  </td>

                  <td className="py-3 px-6 whitespace-nowrap max-w-[140px] truncate">
                    {lead.domain ? (
                      <a
                        href={`https://${lead.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-xs font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe size={12} className="shrink-0 text-blue-500" />
                        {lead.domain}
                        <ExternalLink size={10} className="shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-3 px-6 whitespace-nowrap max-w-[180px] truncate">
                    {lead.email_contact ? (
                      <a
                        href={`mailto:${lead.email_contact}`}
                        className="inline-flex items-center gap-1 text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-xs font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail size={12} className="shrink-0 text-slate-400 dark:text-slate-500" />
                        {lead.email_contact}
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-3 px-6 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400 shrink-0" />
                      {formattedDate}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
