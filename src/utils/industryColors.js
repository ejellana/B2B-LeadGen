/**
 * Industry color palette — used consistently across all charts, badges, and map markers.
 * Colors defined in Instructions.md.
 */
export const INDUSTRY_COLORS = {
  'BPO': '#3B82F6',          // blue
  'FinTech': '#10B981',      // green
  'Healthcare': '#EF4444',   // red
  'Real Estate': '#F97316',  // orange
  'Manufacturing': '#6B7280',// gray
  'Tech': '#8B5CF6',         // purple
  'Retail': '#EAB308',       // yellow
  'Logistics': '#14B8A6',    // teal
  'Education': '#EC4899',    // pink
  'Other': '#94A3B8',        // slate
};

/**
 * Size Tier colors for badges
 */
export const SIZE_TIER_COLORS = {
  'SMB (<50)': 'green',
  'Mid-Market (50–500)': 'yellow',
  'Enterprise (500+)': 'red',
};

/**
 * Returns hex color for a given industry string, falling back to 'Other' color.
 * @param {string} industry
 * @returns {string} hex color
 */
export const getIndustryColor = (industry) => {
  return INDUSTRY_COLORS[industry] ?? INDUSTRY_COLORS['Other'];
};
