import { useState } from 'react';
import { WeekDay } from '../types';
import { EditStaffFormData } from './types';
import EditFormHeader from './EditFormHeader';
import AvatarSection from './AvatarSection';
import StaffInfoFields from './StaffInfoFields';
import EditWorkingDaysPicker from './EditWorkingDaysPicker';
import RoleShiftStatusFields from './RoleShiftStatusFields';
import SecuritySection from './SecuritySection';
import EditFormFooter from './EditFormFooter';

export interface EditEmployeeFormProps {
  /** Pre-populated read-only display name shown in the header subtitle */
  staffName?: string;
  avatarUrl?: string;
  onClose: () => void;
  onSubmit?: (data: EditStaffFormData) => void;
  initialData?: Partial<EditStaffFormData>;
}

export default function EditEmployeeForm({
  staffName = 'Staff Member',
  avatarUrl,
  onClose,
  onSubmit,
  initialData,
}: EditEmployeeFormProps) {
  const [formData, setFormData] = useState<EditStaffFormData>({
    staffName: initialData?.staffName ?? staffName,
    username: initialData?.username ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    workingDays: initialData?.workingDays ?? [],
    role: initialData?.role ?? 'barista',
    shift: initialData?.shift ?? 'morning',
    isActive: initialData?.isActive ?? true,
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onClose();
  };

  return (
    <div className="w-full max-w-lg bg-white dark:bg-[#112115] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#29382d] flex flex-col max-h-[95vh]">
      {/* Header */}
      <EditFormHeader staffName={formData.staffName} onClose={onClose} />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto edit-form-scrollbar p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AvatarSection staffName={formData.staffName} avatarUrl={avatarUrl} />

          <StaffInfoFields formData={formData} onChange={handleChange} />

          <EditWorkingDaysPicker
            selectedDays={formData.workingDays}
            onToggle={handleDayToggle}
          />

          <RoleShiftStatusFields
            formData={formData}
            onChange={handleChange}
            onActiveToggle={handleActiveToggle}
          />

          <SecuritySection formData={formData} onChange={handleChange} />
        </form>
      </div>

      {/* Footer */}
      <EditFormFooter onClose={onClose} onSubmit={handleSubmit} />

      {/* Scoped scrollbar styles */}
      <style>{`
        .edit-form-scrollbar::-webkit-scrollbar { width: 6px; }
        .edit-form-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .edit-form-scrollbar::-webkit-scrollbar-thumb { background: #3c5342; border-radius: 10px; }
        .edit-form-scrollbar::-webkit-scrollbar-thumb:hover { background: #14b83d; }
      `}</style>
    </div>
  );
}
