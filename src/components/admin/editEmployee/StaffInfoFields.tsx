import { EditStaffFormData } from './types';
import { INPUT_CLASS, LABEL_CLASS } from './constants';

interface StaffInfoFieldsProps {
  formData: Pick<EditStaffFormData, 'staffName' | 'username' | 'email' | 'phone'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function StaffInfoFields({ formData, onChange }: StaffInfoFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Staff Name */}
      <div>
        <label className={LABEL_CLASS}>Staff Name</label>
        <input
          type="text"
          name="staffName"
          value={formData.staffName}
          onChange={onChange}
          placeholder="Full Name"
          className={INPUT_CLASS}
        />
      </div>

      {/* Username */}
      <div>
        <label className={LABEL_CLASS}>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder="Enter username"
          className={INPUT_CLASS}
        />
      </div>

      {/* Email & Phone side‑by‑side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Email"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="Phone"
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </div>
  );
}
