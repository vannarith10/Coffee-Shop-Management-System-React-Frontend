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
        <div className="flex items-center gap-3 py-1">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={formData.isActive}
              onChange={(e) => onActiveToggle(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors" />
            <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
