import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getIndustryColor } from '../../utils/industryColors';

// Custom tooltip styled for Stripe-like aesthetic
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

// Custom Legend to match light/dark design theme
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
 * IndustryPieChart — Reusable industry breakdown Pie Chart.
 * Displays industry distribution using standard config palette.
 */
const IndustryPieChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 dark:border-t-blue-400 animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-semibold">
        No industry data available
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
            innerRadius={60}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getIndustryColor(entry.name)}
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

export default IndustryPieChart;
