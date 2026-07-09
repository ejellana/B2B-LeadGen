import { useMemo } from 'react';
import { getIndustryColor } from '../../utils/industryColors';

/**
 * Returns a CSS background color with variable opacity based on the cell value
 * relative to the max value in the matrix — creates the heat effect.
 */
const getHeatStyle = (value, maxValue) => {
  if (!value || maxValue === 0) return {};
  const intensity = value / maxValue;
  // Scale from 12% → 85% opacity for a readable gradient
  const opacity = 0.12 + intensity * 0.73;
  return { backgroundColor: `rgba(59, 130, 246, ${opacity})` };
};

/**
 * IndustryCityHeatmap — Table-style heatmap showing company counts per industry × city.
 * Rows = industries, Columns = top cities, Cell = count, colored by intensity.
 *
 * Props:
 *   data: { industries: string[], cities: string[], matrix: Record<industry, Record<city, number>> }
 *   loading: boolean
 */
const IndustryCityHeatmap = ({ data, loading = false }) => {
  const { industries = [], cities = [], matrix = {} } = data || {};

  // Pre-compute the global max for heat scaling
  const maxValue = useMemo(() => {
    let max = 0;
    industries.forEach((ind) => {
      cities.forEach((city) => {
        const v = matrix[ind]?.[city] ?? 0;
        if (v > max) max = v;
      });
    });
    return max;
  }, [industries, cities, matrix]);

  if (loading) {
    return (
      <div className="space-y-2 px-1 py-2">
        <div className="flex gap-2 mb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-1 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-24 h-7 bg-slate-200 dark:bg-slate-800 rounded animate-pulse shrink-0" />
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="flex-1 h-7 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!industries.length || !cities.length) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm font-semibold">
        No data available for heatmap
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs border-collapse min-w-[480px]">
        <thead>
          <tr>
            {/* Top-left corner label */}
            <th className="text-left pb-2 pr-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap w-28 sticky left-0 bg-white dark:bg-slate-900/60">
              Industry ↓ City →
            </th>
            {cities.map((city) => (
              <th
                key={city}
                className="pb-2 px-1 font-semibold text-slate-600 dark:text-slate-300 text-center whitespace-nowrap"
                title={city}
              >
                {/* Truncate long city names to keep table compact */}
                {city.length > 9 ? city.slice(0, 8) + '…' : city}
              </th>
            ))}
            <th className="pb-2 px-1 font-semibold text-slate-500 dark:text-slate-400 text-center">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {industries.map((industry) => {
            const rowTotal = cities.reduce(
              (sum, city) => sum + (matrix[industry]?.[city] ?? 0),
              0
            );
            return (
              <tr key={industry} className="group">
                {/* Industry label — sticky so it stays visible on horizontal scroll */}
                <td className="py-1 pr-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap sticky left-0 bg-white dark:bg-slate-900/60 group-hover:bg-slate-50 dark:group-hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getIndustryColor(industry) }}
                    />
                    <span className="truncate max-w-[80px]">{industry}</span>
                  </div>
                </td>

                {cities.map((city) => {
                  const value = matrix[industry]?.[city] ?? 0;
                  return (
                    <td
                      key={city}
                      className="py-1 px-1 text-center font-semibold rounded transition-all duration-150"
                      title={`${industry} in ${city}: ${value} companies`}
                    >
                      {value > 0 ? (
                        <span
                          className="inline-flex items-center justify-center w-full py-1 rounded text-white text-[10px] font-bold"
                          style={getHeatStyle(value, maxValue)}
                        >
                          {value}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-full py-1 text-slate-200 dark:text-slate-800">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}

                {/* Row total */}
                <td className="py-1 px-1 text-center font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                  {rowTotal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IndustryCityHeatmap;
