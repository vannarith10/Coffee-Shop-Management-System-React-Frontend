import { EmployeeFormData, WeekDay } from '../types';

export const WEEKDAYS: { id: WeekDay; label: string; isWeekend?: boolean }[] = [
  { id: 'mon', label: 'M' },
  { id: 'tue', label: 'T' },
  { id: 'wed', label: 'W' },
  { id: 'thu', label: 'T' },
  { id: 'fri', label: 'F' },
  { id: 'sat', label: 'S' },
  { id: 'sun', label: 'S', isWeekend: true },
];

export const DEFAULT_FORM: EmployeeFormData = {
  fullName: '',
  email: '',
  phone: '',
  workingDays: [],
  role: 'barista',
  shift: 'morning',
  username: '',
  password: '',
  isActive: true,
};

export const INPUT_CLASS =
  'w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#3c5342] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:text-white outline-none transition-all';

export const LABEL_CLASS =
  'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-1.5';
