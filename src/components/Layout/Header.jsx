import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Database, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getLeads } from '../../services/api';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Analytics & company intelligence' },
  '/leads': { title: 'Lead Table', subtitle: 'Browse and filter all companies' },
  '/map': { title: 'Company Map', subtitle: 'Geographic distribution of Philippine companies' },
  '/feed': { title: 'New Leads Feed', subtitle: 'Recently discovered companies' },
  '/export': { title: 'Export & Reports', subtitle: 'Download data as CSV or PDF' },
};

/**
 * useTotalLeads — lightweight hook that fetches only page 1 (size=1)
 * to read the `count` field. This avoids fetching all rows just for the header badge.
 */
const useTotalLeads = () => {
  const [count, setCount] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await getLeads({ size: 1, page: 1 });
      setCount(data.count);
    } catch {
      // Silently ignore — the badge simply stays at its last known value
    } finally {
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { count, refreshing, refresh: () => fetch(true) };
};

const Header = () => {
  const { isDark, toggleTheme, toggleMobileSidebar } = useTheme();
  const location = useLocation();
  const { count, refreshing, refresh } = useTotalLeads();

  const matched = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  );
  const { title, subtitle } = matched?.[1] ?? { title: 'PhilLeads', subtitle: '' };

  return (
    <header className="
      sticky top-0 z-30 flex items-center justify-between
      h-16 px-4 md:px-6
      bg-white/80 dark:bg-slate-950/80
      backdrop-blur-md border-b border-slate-200 dark:border-slate-800
      transition-colors duration-200
    ">
      {/* Left — mobile menu toggle + page title */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={toggleMobileSidebar}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg
            text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white 
            hover:bg-slate-100 dark:hover:bg-slate-800/70
            transition-colors duration-150"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div className="min-w-0">
          <h1 className="text-slate-900 dark:text-white font-semibold text-base leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-tight truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right — stats + controls */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Live leads count pill */}
        <div
          id="leads-count-badge"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5
            bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 
            rounded-full text-sm text-slate-700 dark:text-slate-300"
        >
          <Database size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
          <span className="font-semibold tabular-nums">
            {count !== null ? count.toLocaleString() : '—'}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs">leads</span>
        </div>

        {/* Refresh button — triggers a live re-fetch of the count */}
        <button
          id="refresh-data-btn"
          onClick={refresh}
          disabled={refreshing}
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg
            text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white 
            hover:bg-slate-100 dark:hover:bg-slate-800/70
            transition-colors duration-150 disabled:opacity-40"
          aria-label="Refresh data"
          title="Refresh lead count"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>

        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg
            text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white 
            hover:bg-slate-100 dark:hover:bg-slate-800/70
            transition-all duration-150"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? (
            <Sun size={18} className="text-yellow-500" />
          ) : (
            <Moon size={18} className="text-slate-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
