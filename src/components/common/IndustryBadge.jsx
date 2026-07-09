import React from 'react';
import { getIndustryColor } from '../../utils/industryColors';

/**
 * IndustryBadge — Pill badge displaying dynamic industry sectors with color indicator.
 */
const IndustryBadge = ({ industry }) => {
  const color = getIndustryColor(industry);
  const indName = industry || 'Other';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none transition-colors duration-150"
      style={{
        backgroundColor: `${color}15`, // Light transparent background
        borderColor: `${color}35`,     // Translucent border
        color: color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {indName}
    </span>
  );
};

export default IndustryBadge;
