import { EditStaffFormData } from './types';
import { INPUT_CLASS, LABEL_CLASS } from './constants';

interface RoleShiftStatusFieldsProps {
  formData: Pick<EditStaffFormData, 'role' | 'shift' | 'isActive'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onActiveToggle: (checked: boolean) => void;
}

export default function RoleShiftStatusFields({
  formData,
  onChange,
  onActiveToggle,
}: RoleShiftStatusFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Role & Shift */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className={INPUT_CLASS + ' appearance-none'}
          >
            <option value="staff">Staff</option>
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

      {/* Account Status */}
      <div>
        <label className={LABEL_CLASS}>Account Status</label>
        <div className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300 ${
          formData.isActive 
            ? 'bg-green-50/50 dark:bg-[#14b83d]/5 border-[#14b83d]/30' 
            : 'bg-slate-50 dark:bg-[#112115] border-slate-200 dark:border-[#3c5342]'
        }`}>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                formData.isActive ? 'bg-[#14b83d] shadow-[0_0_8px_rgba(20,184,61,0.5)]' : 'bg-slate-400'
              }`}
            />
            <span className={`text-sm font-bold transition-colors ${
              formData.isActive ? 'text-[#14b83d]' : 'text-slate-500 dark:text-[#9db8a4]'
            }`}>
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
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-[#14b83d] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
          </label>
        </div>
      </div>
    </div>
  );
}
