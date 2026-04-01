// Working day type
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// Add-employee form data
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

// Navigation item type
export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

// Formatted stat data for display
export type DisplayStat = {
  title: string;
  value: string;
  change: string;
  icon: string;
  rawValue: number;
  rawGrowth: number;
};

// Low stock item type
export type LowStockItem = {
  name: string;
  category: string;
  stock: number;
  status: "critical" | "low";
};

// Top product type
export type TopProduct = {
  name: string;
  units: number;
  percentage: number;
  color: string;
};

// Staff member type
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
