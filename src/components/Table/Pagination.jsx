import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination — Premium pagination controls for data tables.
 * Highlights current page, handles boundaries gracefully, and supports dark/light transitions.
 */
const Pagination = ({ page = 1, count = 0, pageSize = 25, onPageChange }) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, count);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80">
      {/* Metrics text */}
      <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold select-none">
        Showing <span className="text-slate-850 dark:text-slate-200 font-bold">{startIdx}</span> to{' '}
        <span className="text-slate-850 dark:text-slate-200 font-bold">{endIdx}</span> of{' '}
        <span className="text-slate-850 dark:text-slate-200 font-bold">{count.toLocaleString()}</span> leads
      </span>

      {/* Navigation actions */}
      <div className="flex items-center gap-1.5">
        {/* Previous page btn */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150"
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Numbered buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`dots-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-650 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = p === page;
          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-sm dark:shadow-none'
                  : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
              aria-label={`Go to page ${p}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}

        {/* Next page btn */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150"
          aria-label="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
