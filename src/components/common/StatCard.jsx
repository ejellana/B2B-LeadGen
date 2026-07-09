import React, { useEffect, useState } from 'react';

/**
 * useCountUp — Hook to smoothly animate a numeric value from 0 to endValue.
 * Uses requestAnimationFrame for a high-performance 60fps transition.
 */
const useCountUp = (endValue, duration = 800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = Number(endValue);
    if (isNaN(end) || end <= 0) {
      setCount(endValue);
      return;
    }

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuad easing function
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [endValue, duration]);

  return count;
};

/**
 * StatCard — Premium KPI card displaying key platform metrics.
 * Features an animated number counter, custom icons, micro-animations, and full theme integration.
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trendText,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  loading = false,
  className = '',
}) => {
  const animatedValue = useCountUp(loading ? 0 : value);

  // Determine trend styling based on positive/negative/neutral types
  const getTrendStyles = () => {
    switch (trendType) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
      case 'negative':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
      default:
        return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-350 ease-out overflow-hidden ${className}`}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none" />

      <div className="flex justify-between items-start min-w-0 z-10">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-650 dark:text-slate-300 group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-300">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="space-y-1.5 z-10">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums">
            {typeof value === 'number' ? animatedValue.toLocaleString() : value}
          </span>
          {trendText && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getTrendStyles()}`}
            >
              {trendText}
            </span>
          )}
        </div>
        {description && (
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
