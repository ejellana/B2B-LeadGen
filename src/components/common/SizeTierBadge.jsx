import React from 'react';

/**
 * SizeTierBadge — Displays color-coded pills based on company employee counts.
 * SMB = Green, Mid-Market = Amber, Enterprise = Red.
 */
const SizeTierBadge = ({ tier }) => {
  const getStyles = () => {
    const t = String(tier || '').toLowerCase();
    if (t.includes('smb')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    }
    if (t.includes('mid') || t.includes('50–500') || t.includes('50-500')) {
      return 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    }
    if (t.includes('enterprise') || t.includes('500+')) {
      return 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      {tier || 'SMB (<50)'}
    </span>
  );
};

export default SizeTierBadge;
