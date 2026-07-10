import React from 'react';

/**
 * LoadingSkeleton — reusable loading skeleton behavior for all application pages.
 * Supports multiple structural variants: 'card', 'table', 'list', 'dashboard', and 'text'.
 * Highly customizable with count and className props.
 */
const LoadingSkeleton = ({ variant = 'text', count = 3, className = '' }) => {
  const shimmerClass = 'bg-slate-200 dark:bg-slate-800/85 rounded shimmer-pulse';

  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none"
          >
            <div className={`w-11 h-11 shrink-0 ${shimmerClass}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-4 w-3/4 ${shimmerClass}`} />
              <div className={`h-3 w-1/2 ${shimmerClass}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none ${className}`}>
        {/* Simulated Table Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-4 py-3 flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-4 flex-1 ${shimmerClass}`} />
          ))}
        </div>
        {/* Skeleton rows */}
        <div className="divide-y divide-slate-150 dark:divide-slate-850">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="px-4 py-4 flex gap-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div
                  key={j}
                  className={`h-4 flex-1 ${shimmerClass}`}
                  style={{ width: `${60 + ((j * 17 + i * 29) % 31)}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-sm dark:shadow-none"
          >
            <div className={`w-9 h-9 shrink-0 rounded-xl ${shimmerClass}`} />
            <div className="flex-1 space-y-1.5">
              <div className={`h-4 w-1/3 ${shimmerClass}`} />
              <div className={`h-3 w-1/4 ${shimmerClass}`} />
            </div>
            <div className={`w-12 h-4 ${shimmerClass}`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Card stats simulation */}
        <LoadingSkeleton variant="card" count={4} />
        {/* Double column charts simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none">
            <div className={`h-5 w-1/3 ${shimmerClass}`} />
            <div className="h-60 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <div className={`w-40 h-40 rounded-full ${shimmerClass}`} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none">
            <div className={`h-5 w-1/3 ${shimmerClass}`} />
            <div className="h-60 flex flex-col justify-end gap-2 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex items-end gap-4 h-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${shimmerClass}`}
                    style={{ height: `${30 + ((i * 23) % 61)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant: Text paragraphs
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`h-4 ${shimmerClass}`}
          style={{ width: i === count - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
