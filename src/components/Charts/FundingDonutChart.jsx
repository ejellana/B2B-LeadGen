import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const FUNDING_COLORS = {
  'Bootstrapped': '#F59E0B', // Amber
  'Seed': '#10B981',         // Emerald
  'Series A/B/C': '#8B5CF6', // Violet
  'Public': '#3B82F6',       // Blue
  'Unknown': '#94A3B8',      // Slate
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-lg p-3 rounded-xl text-xs">
        <p className="font-bold text-slate-900 dark:text-white mb-1">
          {payload[0].name}
        </p>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Companies: <span className="font-bold text-slate-900 dark:text-slate-150">{payload[0].value}</span>
        </p>
        {data.percentage !== undefined && (
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Share: <span className="font-bold text-slate-900 dark:text-slate-150">{data.percentage}%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const RenderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2 text-xs font-semibold text-slate-650 dark:text-slate-400">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

/**
 * FundingDonutChart — Donut chart showing company funding stage distribution.
 */
const FundingDonutChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 dark:border-t-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-semibold">
        No funding data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={FUNDING_COLORS[entry.name] || '#6B7280'}
                className="stroke-white dark:stroke-slate-900/60 focus:outline-none"
                strokeWidth={1.5}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<RenderLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundingDonutChart;
