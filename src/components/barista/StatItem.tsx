import React from 'react';

interface StatItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, highlight = false }) => (
  <div className="flex flex-col items-center">
    <span className={`text-xs font-bold uppercase tracking-widest ${highlight ? 'text-emerald-500/60' : 'text-slate-500'}`}>
      {label}
    </span>
    <span className={`text-2xl font-black mt-1 ${highlight ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
      {value}
    </span>
  </div>
);