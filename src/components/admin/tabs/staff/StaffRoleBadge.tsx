import { StaffAPI } from './types';

const ROLE_STYLES: Record<StaffAPI['role'], string> = {
  STAFF:   'bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-300',
  BARISTA: 'bg-primary/10 text-primary',
  CASHIER: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  ADMIN: 'bg-coffee-accent/10 text-coffee-accent dark:text-[#d97706]',
};

interface StaffRoleBadgeProps {
  role: StaffAPI['role'];
}

export default function StaffRoleBadge({ role }: StaffRoleBadgeProps) {
  return (
    <span className={`px-2.5 py-1 ${ROLE_STYLES[role]} text-[11px] font-bold rounded-full`}>
      {role}
    </span>
  );
}
