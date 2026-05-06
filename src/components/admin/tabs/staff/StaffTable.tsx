import { StaffAPI } from './types';
import StaffRoleBadge from './StaffRoleBadge';
import StaffStatusBadge from './StaffStatusBadge';

// ── Helpers ───────────────────────────────────────────────────────────────────

const SHIFT_LABEL: Record<StaffAPI['shift'], string> = {
  MORNING:   'Morning',
  AFTERNOON: 'Afternoon',
  FULL_DAY:  'Full Day',
};

const SHIFT_COLOR: Record<StaffAPI['shift'], string> = {
  MORNING:   'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  AFTERNOON: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  FULL_DAY:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
};

// Short day names for the chips
const DAY_SHORT: Record<string, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu',
  FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
};

// Deterministic avatar colour from name
const AVATAR_COLORS = [
  'bg-[#14b83d]', 'bg-amber-600', 'bg-blue-600',
  'bg-violet-600', 'bg-rose-600', 'bg-teal-600',
];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ── Skeleton row ──────────────────────────────────────────────────────────────

export function StaffSkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#29382d]" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-slate-200 dark:bg-[#29382d] rounded w-28" />
            <div className="h-3 bg-slate-200 dark:bg-[#29382d] rounded w-16" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-[#29382d] rounded-full w-16" /></td>
      <td className="px-6 py-4 space-y-1.5">
        <div className="h-5 bg-slate-200 dark:bg-[#29382d] rounded-full w-20" />
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-8" />)}
        </div>
      </td>
      <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 dark:bg-[#29382d] rounded w-36" /></td>
      <td className="px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-[#29382d] rounded w-14" /></td>
      <td className="px-6 py-4 text-right"><div className="h-6 bg-slate-200 dark:bg-[#29382d] rounded w-12 ml-auto" /></td>
    </tr>
  );
}

// ── Staff row ─────────────────────────────────────────────────────────────────

interface StaffRowProps {
  member: StaffAPI;
  onEdit: (member: StaffAPI) => void;
}

function StaffRow({ member, onEdit }: StaffRowProps) {
  const color = avatarColor(member.name);
  const inits = initials(member.name);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-[#1c3022] transition-colors">
      {/* Staff Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {member.image_url ? (
            <img
              src={member.image_url}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {inits}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-800 dark:text-white">{member.name}</p>
            <p className="text-xs text-slate-400 dark:text-[#9db8a4] font-mono">
              @{member.username}
            </p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <StaffRoleBadge role={member.role} />
      </td>

      {/* Shift + Schedule */}
      <td className="px-6 py-4">
        <span className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full mb-1.5 ${SHIFT_COLOR[member.shift]}`}>
          {SHIFT_LABEL[member.shift]}
        </span>
        <div className="flex flex-wrap gap-1">
          {member.schedules.map((day) => (
            <span
              key={day}
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-[#142618] text-slate-600 dark:text-[#9db8a4]"
            >
              {DAY_SHORT[day]}
            </span>
          ))}
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-slate-700 dark:text-white">
            {member.email || <span className="text-slate-400 dark:text-[#9db8a4] italic text-xs">No email</span>}
          </span>
          {member.phone_number && (
            <span className="text-xs text-slate-500 dark:text-[#9db8a4]">{member.phone_number}</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StaffStatusBadge status={member.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onEdit(member)}
          className="p-1.5 text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
          <span className="text-xs font-semibold">Edit</span>
        </button>
      </td>
    </tr>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

interface StaffTableProps {
  members: StaffAPI[];
  onEdit: (member: StaffAPI) => void;
  loadingMore?: boolean;
  skeletonRows?: number;
}

export default function StaffTable({
  members,
  onEdit,
  loadingMore = false,
  skeletonRows = 5,
}: StaffTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[#142618] text-xs uppercase text-slate-500 dark:text-[#9db8a4] tracking-wider font-bold shadow-sm">
          <tr>
            <th className="px-6 py-4">Staff Name</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Shift & Schedule</th>
            <th className="px-6 py-4">Contact Info</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-[#29382d]">
          {members.map((member) => (
            <StaffRow key={member.id} member={member} onEdit={onEdit} />
          ))}
          {loadingMore &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <StaffSkeletonRow key={`skel-${i}`} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
