import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Layers,
  Mail,
  Search,
} from 'lucide-react';
import useAnalytics from '../hooks/useAnalytics';
import StatCard from '../components/common/StatCard';
import ErrorMessage from '../components/common/ErrorMessage';

// Core Recharts Components
import IndustryPieChart from '../components/Charts/IndustryPieChart';
import CityBarChart from '../components/Charts/CityBarChart';
import SizeTierBarChart from '../components/Charts/SizeTierBarChart';
import FundingDonutChart from '../components/Charts/FundingDonutChart';

const Dashboard = () => {
  const { allLeads, loading, error, refetch } = useAnalytics();

  // Memoize KPI calculations
  const stats = useMemo(() => {
    if (!allLeads || allLeads.length === 0) {
      return {
        totalCompanies: 0,
        totalCities: 0,
        totalIndustries: 0,
        companiesWithEmail: 0,
        emailPercentage: 0,
      };
    }

    const totalCompanies = allLeads.length;

    const cities = new Set(
      allLeads
        .map((lead) => lead.city)
        .filter((city) => city && typeof city === 'string' && city.trim() !== '')
    );
    const totalCities = cities.size;

    const industries = new Set(
      allLeads
        .map((lead) => lead.industry)
        .filter((ind) => ind && typeof ind === 'string' && ind.trim() !== '')
    );
    const totalIndustries = industries.size;

    const companiesWithEmail = allLeads.filter(
      (lead) => lead.email_contact && typeof lead.email_contact === 'string' && lead.email_contact.trim() !== ''
    ).length;

    const emailPercentage = totalCompanies > 0
      ? Math.round((companiesWithEmail / totalCompanies) * 100)
      : 0;

    return {
      totalCompanies,
      totalCities,
      totalIndustries,
      companiesWithEmail,
      emailPercentage,
    };
  }, [allLeads]);

  // Memoize dataset formatting for core charts
  const chartData = useMemo(() => {
    if (!allLeads || allLeads.length === 0) {
      return {
        industryData: [],
        cityData: [],
        sizeData: [],
        fundingData: [],
      };
    }

    const total = allLeads.length;

    // 1. Industry breakdown counts
    const industryCounts = {};
    allLeads.forEach((lead) => {
      const ind = lead.industry || 'Other';
      industryCounts[ind] = (industryCounts[ind] || 0) + 1;
    });
    const industryData = Object.entries(industryCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / total) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    // 2. Top 10 Cities vertical counts
    const cityCounts = {};
    allLeads.forEach((lead) => {
      const city = lead.city;
      if (city && typeof city === 'string' && city.trim() !== '') {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });
    const cityData = Object.entries(cityCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // 3. Size Tier logical order counts
    const sizeCounts = {
      'SMB (<50)': 0,
      'Mid-Market (50–500)': 0,
      'Enterprise (500+)': 0,
    };
    allLeads.forEach((lead) => {
      const tier = lead.size_tier;
      if (sizeCounts[tier] !== undefined) {
        sizeCounts[tier]++;
      } else {
        // Fallback for case variation or mismatch
        const matched = Object.keys(sizeCounts).find(
          (k) => k.toLowerCase() === (tier || '').toLowerCase()
        ) || 'SMB (<50)';
        sizeCounts[matched]++;
      }
    });
    const sizeData = Object.keys(sizeCounts).map((name) => {
      const value = sizeCounts[name];
      return {
        name,
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      };
    });

    // 4. Funding Stage distribution counts
    const fundingCounts = {};
    allLeads.forEach((lead) => {
      const stage = lead.funding_stage || 'Unknown';
      fundingCounts[stage] = (fundingCounts[stage] || 0) + 1;
    });
    const fundingData = Object.entries(fundingCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / total) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    return {
      industryData,
      cityData,
      sizeData,
      fundingData,
    };
  }, [allLeads]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  const showEmptyState = !loading && allLeads.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <LayoutDashboard size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-[52px]">
            Comprehensive insights and geographic distributions — <span className="text-blue-600 dark:text-blue-400 font-medium font-semibold">Phase 4B.1</span>
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={Building2}
          description="Total active leads registered"
          loading={loading}
          trendText="PH Database"
          trendType="neutral"
        />
        <StatCard
          title="Cities Covered"
          value={stats.totalCities}
          icon={MapPin}
          description="Geographic municipal range"
          loading={loading}
          trendText="National"
          trendType="neutral"
        />
        <StatCard
          title="Industries Tracked"
          value={stats.totalIndustries}
          icon={Layers}
          description="Categorized sector counts"
          loading={loading}
          trendText="Diverse"
          trendType="neutral"
        />
        <StatCard
          title="With Email Contact"
          value={stats.companiesWithEmail}
          icon={Mail}
          description="Ready for email campaigns"
          loading={loading}
          trendText={`${stats.emailPercentage}% Coverage`}
          trendType={stats.emailPercentage > 50 ? 'positive' : 'neutral'}
        />
      </div>

      {/* Empty State vs Charts Grid */}
      {showEmptyState ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 gap-5 shadow-sm dark:shadow-none animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Building2 size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">No Lead Records Available</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Your Philippine lead database is currently empty. Run a lead discovery process to fetch companies.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-md dark:shadow-none hover:shadow-lg transition-all duration-150"
          >
            <Search size={16} />
            Start Discovering Leads
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Industry Breakdown Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Industry Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Lead counts and sector shares across major categories
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[260px]">
              <IndustryPieChart data={chartData.industryData} loading={loading} />
            </div>
          </div>

          {/* Top 10 Cities Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Top 10 Cities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Locations with the highest concentration of registered companies
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[260px]">
              <CityBarChart data={chartData.cityData} loading={loading} />
            </div>
          </div>

          {/* Size Tier Distribution Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Size Tier Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Breakdown of companies categorized by employee headcount tiers
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[260px]">
              <SizeTierBarChart data={chartData.sizeData} loading={loading} />
            </div>
          </div>

          {/* Funding Stage Distribution Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none rounded-2xl p-5 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Funding Stage Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Share of companies in each funding round or operating stage
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[260px]">
              <FundingDonutChart data={chartData.fundingData} loading={loading} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
