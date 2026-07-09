import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-lg p-3 rounded-xl text-xs min-w-[140px]">
        <p className="font-bold text-slate-900 dark:text-white mb-1.5">{label}</p>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Total companies:{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {payload[0].value.toLocaleString()}
          </span>
        </p>
        {payload[0].payload.added !== undefined && (
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Added this month:{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {payload[0].payload.added}
            </span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * GrowthLineChart — Area/line chart showing cumulative company count over time.
 * Uses created_at month buckets for the X axis.
 *
 * Props:
 *   data: Array<{ month: string, cumulative: number, added: number }>
 *   loading: boolean
 */
const GrowthLineChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="h-56 flex items-end gap-1 px-4 pb-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t animate-pulse"
            style={{ height: `${20 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm font-semibold">
        No timeline data available
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(148,163,184,0.12)"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            interval="preserveStartEnd"
            className="fill-slate-500 dark:fill-slate-400"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            className="fill-slate-500 dark:fill-slate-400"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(148,163,184,0.3)', strokeWidth: 1, strokeDasharray: '4 2' }} />
          <Area
            type="monotone"
            dataKey="cumulative"
            name="Total Companies"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="url(#growthGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthLineChart;
