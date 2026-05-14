import { useState } from 'react';
import { EditStaffFormData } from './types';
import { INPUT_CLASS, LABEL_CLASS } from './constants';

interface SecuritySectionProps {
  formData: Pick<EditStaffFormData, 'newPassword' | 'confirmPassword'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function SecuritySection({ formData, onChange }: SecuritySectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
  const isStrong = passwordRegex.test(formData.newPassword);

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
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={onChange}
              placeholder="Leave blank to keep current"
              autoComplete="new-password"
              className={`${INPUT_CLASS} pr-10 transition-all duration-300 ${
                formData.newPassword && isStrong 
                  ? 'border-[#14b83d] dark:border-[#14b83d] ring-2 ring-[#14b83d]/10' 
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                formData.newPassword && isStrong ? 'text-[#14b83d]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
          {formData.newPassword && isStrong && (
            <p className="mt-1.5 text-[10px] font-bold text-[#14b83d] animate-in fade-in slide-in-from-top-1 duration-300 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Password is now strong
            </p>
          )}
        </div>
        <div>
          <label className={LABEL_CLASS}>Confirm New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="Confirm new password"
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
