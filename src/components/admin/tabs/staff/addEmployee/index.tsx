import { useState } from 'react';
import axios from 'axios';
import { EmployeeFormData, WeekDay, CreateEmployeeRequest, StaffRole, StaffShift, StaffScheduleDay } from '../types';
import { DEFAULT_FORM } from './constants';
import FormHeader from './FormHeader';
import PersonalInfoFields from './PersonalInfoFields';
import WorkingDaysPicker from './WorkingDaysPicker';
import AccountSettingsFields from './AccountSettingsFields';
import FormFooter from './FormFooter';
import { dashboardService } from '../../../../../services/adminDashboardService';

interface AddEmployeeFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// ── Mapping helpers ────────────────────────────────────────────────────────────
const DAY_MAP: Record<WeekDay, StaffScheduleDay> = {
  mon: 'MONDAY',
  tue: 'TUESDAY',
  wed: 'WEDNESDAY',
  thu: 'THURSDAY',
  fri: 'FRIDAY',
  sat: 'SATURDAY',
  sun: 'SUNDAY',
};

const ROLE_MAP: Record<EmployeeFormData['role'], StaffRole> = {
  staff:   'STAFF',
  barista: 'BARISTA',
  cashier: 'CASHIER',
  admin:   'ADMIN',
};

const SHIFT_MAP: Record<EmployeeFormData['shift'], StaffShift> = {
  morning:   'MORNING',
  afternoon: 'AFTERNOON',
  full_day:  'FULL_DAY',
};

function buildPayload(formData: EmployeeFormData): CreateEmployeeRequest {
  return {
    full_name: formData.fullName.trim(),
    username:  formData.username.trim(),
    password:  formData.password,
    role:      ROLE_MAP[formData.role],
    shift:     SHIFT_MAP[formData.shift],
    schedules: formData.workingDays.map((d) => DAY_MAP[d]),
    status:    formData.isActive ? 'ACTIVE' : 'INACTIVE',
  };
}

function parseApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail: string = err.response?.data?.detail ?? '';
    const status: number = err.response?.status ?? 0;

    if (status === 409 || detail.toLowerCase().includes('username'))
      return 'Username is already taken. Please choose a different one.';

    if (status === 400 || detail.toLowerCase().includes('weak password') || detail.toLowerCase().includes('password'))
      return 'Weak password. Must contain uppercase, lowercase, a number, and a special character (e.g. Password@1).';

    if (detail) return detail;
  }
  return 'Failed to create employee. Please try again.';
}

export default function AddEmployeeForm({ onClose, onSuccess }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // clear error on any change
  };

  const handleDayToggle = (day: WeekDay) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleActiveToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Basic client-side validation
    if (!formData.fullName.trim()) { setError('Full name is required.'); return; }
    if (!formData.username.trim()) { setError('Username is required.'); return; }
    if (!formData.password)        { setError('Password is required.'); return; }

    setIsLoading(true);
    setError(null);
    try {
      await dashboardService.createEmployee(buildPayload(formData));
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
      {/* Header */}
      <FormHeader onClose={onClose} />

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Left Column */}
          <div className="space-y-4">
            <PersonalInfoFields formData={formData} onChange={handleChange} />
            <WorkingDaysPicker
              selectedDays={formData.workingDays}
              onToggle={handleDayToggle}
            />
          </div>

          {/* Right Column */}
          <AccountSettingsFields
            formData={formData}
            onChange={handleChange}
            onActiveToggle={handleActiveToggle}
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-5 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40 rounded-lg">
            <span className="material-symbols-outlined text-red-500 text-lg flex-shrink-0 mt-0.5">error</span>
            <p className="text-xs text-red-700 dark:text-red-300 leading-snug">{error}</p>
          </div>
        )}

        {/* Footer: info banner + action buttons */}
        <FormFooter onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} />
      </form>
    </div>
  );
}
