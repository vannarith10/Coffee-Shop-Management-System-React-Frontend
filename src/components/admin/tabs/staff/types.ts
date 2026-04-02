// ── Shared day type (used by add & edit employee forms) ─────────────────────
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// ── Add-employee form data ───────────────────────────────────────────────────
export type EmployeeFormData = {
  fullName: string;
  email: string;
  phone: string;
  workingDays: WeekDay[];
  role: 'barista' | 'cashier' | 'admin';
  shift: 'morning' | 'afternoon' | 'evening';
  username: string;
  password: string;
  isActive: boolean;
};

// ── Staff member (table row) type ────────────────────────────────────────────
export type StaffMember = {
  id: string;
  staffId: string;
  name: string;
  role: 'BARISTA' | 'CASHIER' | 'ADMIN';
  shiftSchedule: string;
  shiftDays: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  avatar?: string;
  initials: string;
  avatarColor: string;
};
