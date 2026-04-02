import { EmployeeFormData } from '../types';
import { INPUT_CLASS, LABEL_CLASS } from './constants';

interface PersonalInfoFieldsProps {
  formData: Pick<EmployeeFormData, 'fullName' | 'email' | 'phone'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PersonalInfoFields({ formData, onChange }: PersonalInfoFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className={LABEL_CLASS}>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          placeholder="e.g. John Doe"
          className={INPUT_CLASS}
        />
      </div>

      {/* Email */}
      <div>
        <label className={LABEL_CLASS}>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="john@brewadmin.com"
          className={INPUT_CLASS}
        />
      </div>

      {/* Phone */}
      <div>
        <label className={LABEL_CLASS}>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="+1 (555) 000-0000"
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );
}
