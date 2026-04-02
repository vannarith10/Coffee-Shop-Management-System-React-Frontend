import { StaffMember } from './types';

const STATUS_STYLES: Record<StaffMember['status'], string> = {
  ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  ON_LEAVE: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  INACTIVE: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
};

const DOT_COLOR: Record<StaffMember['status'], string> = {
  ACTIVE: 'bg-green-500',
  ON_LEAVE: 'bg-orange-500',
  INACTIVE: 'bg-slate-500',
};

interface StaffStatusBadgeProps {
  status: StaffMember['status'];
}

export default function StaffStatusBadge({ status }: StaffStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 ${STATUS_STYLES[status]} text-[11px] font-bold rounded`}
    >
      <span className={`w-1 h-1 rounded-full ${DOT_COLOR[status]}`} />
      {status.replace('_', ' ')}
    </span>
  );
}
