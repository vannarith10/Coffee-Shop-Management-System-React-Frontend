import { useState } from 'react';
import { EmployeeFormData, WeekDay } from '../types';
import { DEFAULT_FORM } from './constants';
import FormHeader from './FormHeader';
import PersonalInfoFields from './PersonalInfoFields';
import WorkingDaysPicker from './WorkingDaysPicker';
import AccountSettingsFields from './AccountSettingsFields';
import FormFooter from './FormFooter';

interface AddEmployeeFormProps {
  onClose: () => void;
  onSubmit?: (data: EmployeeFormData) => void;
}

export default function AddEmployeeForm({ onClose, onSubmit }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(DEFAULT_FORM);

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

        {/* Footer: info banner + action buttons */}
        <FormFooter onClose={onClose} onSubmit={handleSubmit} />
      </form>
    </div>
  );
}
