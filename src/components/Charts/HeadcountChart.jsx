import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getIndustryColor } from '../../utils/industryColors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-lg p-3 rounded-xl text-xs min-w-[140px]">
        <p className="font-bold text-slate-900 dark:text-white mb-1.5">{label}</p>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Avg headcount:{' '}
          <span className="font-bold text-slate-900 dark:text-white">
            {Math.round(payload[0].value).toLocaleString()}
          </span>
        </p>
        {payload[0].payload.total !== undefined && (
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Companies:{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {payload[0].payload.total}
            </span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * HeadcountChart — Horizontal grouped bar chart showing average headcount per industry.
 * Receives pre-processed data via props; no business logic inside.
 *
 * Props:
 *   data: Array<{ name: string, avgHeadcount: number, total: number }>
 *   loading: boolean
 */
const HeadcountChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="h-72 flex flex-col justify-end gap-2 px-4 pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse shrink-0" />
            <div
              className="h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
              style={{ width: `${30 + Math.random() * 55}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm font-semibold">
        No headcount data available
      </div>
    );
  }

  // Sort descending by average headcount so biggest bars are at top
  const sorted = [...data].sort((a, b) => b.avgHeadcount - a.avgHeadcount);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            vertical={true}
            stroke="rgba(148,163,184,0.12)"
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
            className="fill-slate-500 dark:fill-slate-400"
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            fontWeight={600}
            width={82}
            className="fill-slate-700 dark:fill-slate-300"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
          <Bar
            dataKey="avgHeadcount"
            name="Avg Headcount"
            radius={[0, 4, 4, 0]}
            barSize={14}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {sorted.map((entry) => (
              <Cell
                key={entry.name}
                fill={getIndustryColor(entry.name)}
                fillOpacity={0.88}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeadcountChart;
