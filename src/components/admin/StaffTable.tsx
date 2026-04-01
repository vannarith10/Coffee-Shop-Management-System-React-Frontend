import { StaffMember } from './types';
import StaffRoleBadge from './StaffRoleBadge';
import StaffStatusBadge from './StaffStatusBadge';

interface StaffRowProps {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
}

function StaffRow({ member, onEdit }: StaffRowProps) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-[#1c3022] transition-colors">
      {/* Staff Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full ${member.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
            >
              {member.initials}
            </div>
          )}
          <div>
            <p className="font-bold">{member.name}</p>
            <p className="text-xs text-slate-500 dark:text-[#9db8a4]">ID: {member.staffId}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <StaffRoleBadge role={member.role} />
      </td>

      {/* Shift Schedule */}
      <td className="px-6 py-4">
        <p className="text-sm">{member.shiftSchedule}</p>
        {member.shiftDays && (
          <p className="text-[11px] text-slate-500 dark:text-[#9db8a4]">{member.shiftDays}</p>
        )}
      </td>

      {/* Contact Info */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{member.email}</span>
          {member.phone && (
            <span className="text-xs text-slate-500 dark:text-[#9db8a4]">{member.phone}</span>
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

interface StaffTableProps {
  members: StaffMember[];
  onEdit: (member: StaffMember) => void;
}

export default function StaffTable({ members, onEdit }: StaffTableProps) {
  return (
    <section className="px-8 py-4 mb-8 flex-1 overflow-hidden">
      <div className="h-full bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl shadow-sm overflow-y-auto relative scroll-smooth">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[#142618] text-xs uppercase text-slate-500 dark:text-[#9db8a4] tracking-wider font-bold shadow-sm">
            <tr>
              <th className="px-6 py-4">Staff Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Shift Schedule</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#29382d]">
            {members.map((member) => (
              <StaffRow key={member.id} member={member} onEdit={onEdit} />
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="flex items-center justify-center h-64 text-slate-500 dark:text-[#9db8a4]">
            No staff members found matching your criteria.
          </div>
        )}
      </div>
    </section>
  );
}
