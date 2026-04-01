export interface EditStaffFormData {
  staffName: string;
  username: string;
  email: string;
  phone: string;
  workingDays: string[];
  role: 'barista' | 'cashier' | 'admin';
  shift: 'morning' | 'afternoon' | 'evening';
  isActive: boolean;
  newPassword: string;
  confirmPassword: string;
}
