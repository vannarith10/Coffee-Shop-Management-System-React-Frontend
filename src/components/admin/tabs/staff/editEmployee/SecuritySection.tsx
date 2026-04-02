import { EditStaffFormData } from './types';
import { INPUT_CLASS, LABEL_CLASS } from './constants';

interface SecuritySectionProps {
  formData: Pick<EditStaffFormData, 'newPassword' | 'confirmPassword'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function SecuritySection({ formData, onChange }: SecuritySectionProps) {
  return (
    <div className="pt-6 border-t border-slate-100 dark:border-[#29382d]">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-xl">key</span>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-white">
          Security &amp; Password
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={onChange}
            placeholder="••••••••"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="••••••••"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 dark:text-[#9db8a4]">
        Admin override: Leaving these fields blank will keep the current password.
      </p>
    </div>
  );
}
