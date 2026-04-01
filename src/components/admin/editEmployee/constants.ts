import { WeekDay } from '../types';

export const WEEKDAYS: { id: WeekDay; label: string }[] = [
  { id: 'mon', label: 'MON' },
  { id: 'tue', label: 'TUE' },
  { id: 'wed', label: 'WED' },
  { id: 'thu', label: 'THU' },
  { id: 'fri', label: 'FRI' },
  { id: 'sat', label: 'SAT' },
  { id: 'sun', label: 'SUN' },
];

export const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-all outline-none';

export const LABEL_CLASS =
  'block text-xs font-bold text-slate-500 dark:text-[#9db8a4] uppercase tracking-wider mb-1.5';
