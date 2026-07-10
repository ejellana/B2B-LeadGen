import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Bell, 
  Clock, 
  Building2, 
  Calendar, 
  Globe, 
  Mail, 
  ExternalLink,
  Users, 
  TrendingUp, 
  MapPin, 
  RefreshCw,
  Info
} from 'lucide-react';
import { getLeads } from '../services/api';
import { getIndustryColor } from '../utils/industryColors';
import StatCard from '../components/common/StatCard';
import IndustryBadge from '../components/common/IndustryBadge';
import SizeTierBadge from '../components/common/SizeTierBadge';
import ErrorMessage from '../components/common/ErrorMessage';
import CompanyDrawer from '../components/Company/CompanyDrawer';

// ── CONSTANTS ──
const AUTO_REFRESH_INTERVAL_MS = 60000; // 60 seconds
const FEED_SIZE_LIMIT = 50;

const SUGGESTED_INDUSTRIES = [
  'All', 'BPO', 'FinTech', 'Tech', 'Healthcare', 'Retail', 'Logistics', 'Education', 'Real Estate', 'Manufacturing', 'Other'
];

/**
 * Relative Timestamp Helper
 * Formats a given ISO date string into a relative format.
 */
const getRelativeTimestamp = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  
  const now = new Date();
  const diffMs = now - date;
  
  if (diffMs < 0) return 'Just now'; // handle tiny clock drifts
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Company Initials Helper
 * Returns up to 2 uppercase initials for avatar.
 */
const getCompanyInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const NewLeadsFeed = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // ── Data Fetching ──
  const fetchFeed = useCallback(async (isAutoRefresh = false) => {
    if (isAutoRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Fetch up to 100 leads to guarantee solid statistics coverage
      const data = await getLeads({ size: 100, order_by: '-created_at' });
      
      // Sort descending by created_at / newest first, using id as tie-breaker
      const sorted = [...data.results].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if (dateB - dateA !== 0) {
          return dateB - dateA;
        }
        return b.id - a.id;
      });

      setLeads(sorted);
      setTotalCount(data.count || sorted.length);
    } catch (err) {
      // Don't override main view with error during background updates
      if (!isAutoRefresh) {
        setError(err.message || 'Failed to connect to database. Make sure Baserow is running.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch and Setup Interval
  useEffect(() => {
    fetchFeed(false);

    const interval = setInterval(() => {
      fetchFeed(true);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchFeed]);

  // ── Memoized Stats Calculations ──
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    let todayCount = 0;
    let weekCount = 0;

    leads.forEach((lead) => {
      const created = new Date(lead.created_at);
      if (!isNaN(created.getTime())) {
        if (created >= today) todayCount++;
        if (created >= oneWeekAgo) weekCount++;
      }
    });

    return {
      today: todayCount,
      week: weekCount,
      total: totalCount,
    };
  }, [leads, totalCount]);

  // ── Filtered & Sliced Leads for Feed Card List ──
  const filteredLeads = useMemo(() => {
    let result = leads;
    if (selectedIndustry !== 'All') {
      result = result.filter(
        (lead) => (lead.industry || 'Other').toLowerCase() === selectedIndustry.toLowerCase()
      );
    }
    return result.slice(0, FEED_SIZE_LIMIT);
  }, [leads, selectedIndustry]);

  // Handle retry from error screen
  const handleRetry = () => {
    fetchFeed(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
              <Bell size={20} className="text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Leads Feed</h2>
              {refreshing && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-[10px] font-semibold animate-pulse">
                  <RefreshCw size={10} className="animate-spin" />
                  Refreshing...
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
            Latest companies discovered by the system — sorted by discovery time
          </p>
        </div>

        {/* Counter Pill at Top */}
        {!loading && !error && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20 rounded-xl w-fit ml-[52px] sm:ml-0 shadow-sm">
            <Bell size={13} className="text-pink-600 dark:text-pink-400 animate-bounce" />
            <span className="text-pink-700 dark:text-pink-300 text-xs font-bold">
              {stats.today} new leads today
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
              <Clock size={10} /> Auto-refreshes 60s
            </span>
          </div>
        )}
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Today's Leads"
          value={stats.today}
          icon={Bell}
          description="Discovered in the last 24 hours"
          loading={loading}
          trendText="New Today"
          trendType={stats.today > 0 ? 'positive' : 'neutral'}
        />
        <StatCard
          title="New This Week"
          value={stats.week}
          icon={Calendar}
          description="Registered within 7 days"
          loading={loading}
          trendText="Past 7 Days"
          trendType={stats.week > 0 ? 'positive' : 'neutral'}
        />
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Building2}
          description="Database registry lead count"
          loading={loading}
          trendText="All time"
          trendType="neutral"
        />
      </div>

      {/* ── Error & Content States ── */}
      {error ? (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Industry Filter Pills */}
          {!loading && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
                Filter Feed by Sector
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_INDUSTRIES.map((industry) => {
                  const isActive = selectedIndustry === industry;
                  return (
                    <button
                      key={industry}
                      onClick={() => setSelectedIndustry(industry)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 dark:focus:ring-offset-slate-950 ${
                        isActive
                          ? 'bg-pink-600 border-pink-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {industry}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feed List Container */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex gap-4 p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl animate-pulse shadow-sm"
                  style={{ opacity: 1 - i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="flex gap-2">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 gap-5 shadow-sm dark:shadow-none animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Bell size={32} className="text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">No new companies yet</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                  No company records match the chosen industry sector filter: <span className="font-bold text-pink-600 dark:text-pink-400">"{selectedIndustry}"</span>.
                </p>
                {selectedIndustry !== 'All' && (
                  <button
                    onClick={() => setSelectedIndustry('All')}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 cursor-pointer"
                  >
                    Reset Filter to All
                  </button>
                )}
              </div>
            </div>
          ) : (
            // ── Modern Vertical Timeline Feed ──
            <div className="relative border-l border-slate-200 dark:border-slate-850 ml-5 pl-8 space-y-6 py-2">
              {filteredLeads.map((lead, index) => {
                const industryColor = getIndustryColor(lead.industry);
                const relativeTime = getRelativeTimestamp(lead.created_at);
                const initials = getCompanyInitials(lead.company_name);
                const creationDate = lead.created_at 
                  ? new Date(lead.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '—';

                return (
                  <div
                    key={lead.id}
                    className="relative group transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    {/* Timeline Node Color Indicator Dot */}
                    <div 
                      className="absolute -left-[45px] top-4 w-3.5 h-3.5 rounded-full border-4 border-white dark:border-slate-950 transition-transform duration-300 group-hover:scale-125 shadow-sm"
                      style={{ backgroundColor: industryColor }}
                    />

                    {/* Timeline Card */}
                    <div className="flex flex-col md:flex-row gap-4 p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 hover:-translate-y-0.5 transition-all duration-300">
                      
                      {/* Left: Avatar & Initials */}
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm border"
                        style={{ 
                          backgroundColor: `${industryColor}ef`,
                          borderColor: `${industryColor}40`
                        }}
                      >
                        {initials}
                      </div>

                      {/* Right: Card Details */}
                      <div className="flex-1 min-w-0 space-y-4">
                        {/* Header Details */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                              {lead.company_name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {relativeTime}
                              </span>
                              <span>•</span>
                              <span className="text-slate-400 dark:text-slate-550">
                                Discovered: {creationDate}
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => setSelectedCompany(lead)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:border-pink-300 dark:hover:border-pink-850 hover:text-pink-600 dark:hover:text-pink-400 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
                          >
                            <Info size={12} />
                            View Details
                          </button>
                        </div>

                        {/* Mid-tier Pill Badges & Quick Details */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-850/60">
                          <IndustryBadge industry={lead.industry} />
                          <SizeTierBadge tier={lead.size_tier} />
                          
                          {lead.funding_stage && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 text-slate-650 dark:text-slate-350">
                              <TrendingUp size={11} className="mr-1 text-slate-450" />
                              {lead.funding_stage}
                            </span>
                          )}

                          {lead.city && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80">
                              <MapPin size={11} className="mr-1 text-slate-400" />
                              {lead.city}
                            </span>
                          )}

                          {lead.headcount && lead.headcount > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80">
                              <Users size={11} className="mr-1 text-slate-400" />
                              {lead.headcount.toLocaleString()} employees
                            </span>
                          )}
                        </div>

                        {/* Footer: Contacts Links */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                          {lead.domain ? (
                            <a
                              href={`https://${lead.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              <Globe size={13} className="text-blue-500" />
                              {lead.domain}
                              <ExternalLink size={10} className="text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 flex items-center gap-1 italic">
                              <Globe size={13} />
                              No website available
                            </span>
                          )}

                          {lead.email_contact ? (
                            <a
                              href={`mailto:${lead.email_contact}`}
                              className="inline-flex items-center gap-1.5 text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium"
                            >
                              <Mail size={13} className="text-slate-400 dark:text-slate-550" />
                              {lead.email_contact}
                            </a>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 flex items-center gap-1 italic">
                              <Mail size={13} />
                              No email available
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Shared Company Profile Drawer ── */}
      <CompanyDrawer
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
};

export default NewLeadsFeed;
