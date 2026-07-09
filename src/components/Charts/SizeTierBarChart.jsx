import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

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

const CustomLabel = (props) => {
  const { x, y, width, value, index, percentage } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      className="fill-slate-600 dark:fill-slate-400 text-[10px] font-bold"
      textAnchor="middle"
    >
      {percentage !== undefined ? `${percentage}%` : value}
    </text>
  );
};

/**
 * SizeTierBarChart — Reusable bar chart showing company counts per size tier.
 * Renders custom percentage values above the bars.
 */
const SizeTierBarChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-semibold">
        No size tier data available
      </div>
    );
  }

  // Size tier specific color scheme matching instructions
  const getBarColor = (name) => {
    if (name.includes('SMB')) return '#10B981'; // Green
    if (name.includes('Mid-Market')) return '#F59E0B'; // Yellow/Amber
    return '#EF4444'; // Red for Enterprise
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            className="stroke-slate-200/40 dark:stroke-slate-800/40"
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            className="fill-slate-500 dark:fill-slate-400"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            className="fill-slate-500 dark:fill-slate-400"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
          <Bar
            dataKey="value"
            name="Size Distribution"
            radius={[4, 4, 0, 0]}
            barSize={32}
            animationDuration={850}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
            <LabelList dataKey="value" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SizeTierBarChart;
