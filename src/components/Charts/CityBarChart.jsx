import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-lg p-3 rounded-xl text-xs">
        <p className="font-bold text-slate-900 dark:text-white mb-1">
          {payload[0].payload.name}
        </p>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Companies: <span className="font-bold text-slate-900 dark:text-slate-150">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * CityBarChart — Reusable top 10 cities horizontal Bar Chart.
 * Displays city distribution in vertical orientation for readability.
 */
const CityBarChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-teal-500 dark:border-t-teal-400 animate-spin rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-semibold">
        No city data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="var(--color-grid, rgba(148, 163, 184, 0.1))"
            className="stroke-slate-200/40 dark:stroke-slate-800/40"
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            className="fill-slate-500 dark:fill-slate-400"
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            width={75}
            className="fill-slate-650 dark:fill-slate-350"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            animationDuration={850}
            animationEasing="ease-out"
            barSize={12}
          >
            {data.map((entry, index) => (
              // Use a gradient-like blue-to-indigo color palette for premium design
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? '#3B82F6' : '#6366F1'}
                className="opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CityBarChart;
