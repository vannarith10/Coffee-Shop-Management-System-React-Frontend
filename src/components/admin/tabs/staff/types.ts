// ── Shared day type (used by add & edit employee forms) ─────────────────────
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// ── Staff API types ──────────────────────────────────────────────────────────
export type StaffShift = 'MORNING' | 'AFTERNOON' | 'FULL_DAY';
export type StaffRole = 'STAFF' | 'BARISTA' | 'CASHIER' | 'ADMIN';
export type StaffScheduleDay =
  | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
  | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type StaffAPI = {
  id: string;
  name: string;
  username: string;
  role: StaffRole;
  shift: StaffShift;
  schedules: StaffScheduleDay[];
  email: string;
  phone_number: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  image_url: string;
};

export type StaffProfilesPagination = {
  page: number;
  size: number;
  total_pages: number;
  total_items: number;
};

export type StaffProfilesResponse = {
  message: string;
  pagination: StaffProfilesPagination;
  staffs: StaffAPI[];
};

// ── Add-employee form data ───────────────────────────────────────────────────
export type EmployeeFormData = {
  fullName: string;
  email: string;
  phone: string;
  workingDays: WeekDay[];
  role: 'staff' | 'barista' | 'cashier' | 'admin';
  shift: 'morning' | 'afternoon' | 'full_day';
  username: string;
  password: string;
  isActive: boolean;
};

// ── Create-employee API types ────────────────────────────────────────────────
export type CreateEmployeeRequest = {
  full_name: string;
  username: string;
  password: string;
  role: StaffRole;
  shift: StaffShift;
  schedules: StaffScheduleDay[];
  status: 'ACTIVE' | 'INACTIVE';
};

export type CreateEmployeeResponse = {
  id: string;
  name: string;
  username: string;
  role: StaffRole;
  shift: StaffShift;
  schedules: StaffScheduleDay[];
  email: string;
  phone_number: string;
  status: 'ACTIVE' | 'INACTIVE';
  image_url: string;
};

// ── Staff member (table row) type ────────────────────────────────────────────
export type StaffMember = {
  id: string;
  staffId: string;
  name: string;
  role: StaffRole;
  shiftSchedule: string;
  shiftDays: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  avatar?: string;
  initials: string;
  avatarColor: string;
};
