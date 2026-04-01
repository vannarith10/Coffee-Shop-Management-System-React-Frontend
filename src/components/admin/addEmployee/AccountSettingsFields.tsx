import { EmployeeFormData } from '../types';
import { INPUT_CLASS, LABEL_CLASS } from './constants';

interface AccountSettingsFieldsProps {
  formData: Pick<EmployeeFormData, 'role' | 'shift' | 'username' | 'password' | 'isActive'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onActiveToggle: (checked: boolean) => void;
}

export default function AccountSettingsFields({
  formData,
  onChange,
  onActiveToggle,
}: AccountSettingsFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Role + Shift */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Staff Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className={INPUT_CLASS + ' appearance-none'}
          >
            <option value="barista">Barista</option>
            <option value="cashier">Cashier</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>Shift</label>
          <select
            name="shift"
            value={formData.shift}
            onChange={onChange}
            className={INPUT_CLASS + ' appearance-none'}
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>
      </div>

      {/* Username */}
      <div>
        <label className={LABEL_CLASS}>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder="j.doe"
          className={INPUT_CLASS}
        />
      </div>

      {/* Temp Password */}
      <div>
        <label className={LABEL_CLASS}>Temporary Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="••••••••"
          className={INPUT_CLASS}
        />
      </div>

      {/* Account Status Toggle */}
      <div>
        <label className={LABEL_CLASS}>Account Status</label>
        <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#3c5342] rounded-lg">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                formData.isActive ? 'bg-primary' : 'bg-slate-400'
              }`}
            />
            <span className="text-sm font-medium dark:text-slate-200">
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => onActiveToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
          </label>
        </div>
      </div>
    </div>
  );
}
