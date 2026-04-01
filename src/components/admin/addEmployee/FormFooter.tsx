interface FormFooterProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormFooter({ onClose, onSubmit }: FormFooterProps) {
  return (
    <>
      {/* Info Banner */}
      <div className="mt-8 flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg">
        <span className="material-symbols-outlined text-blue-500 text-lg">info</span>
        <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-tight">
          New employees will be required to change their password upon first login. Shift times are
          managed in General Settings.
        </p>
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-5 bg-slate-50 dark:bg-[#142618] border-t border-slate-100 dark:border-[#29382d] flex justify-end gap-3 mt-8 -mx-8 -mb-8 rounded-b-2xl">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#233d28] rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          className="px-6 py-2.5 text-sm font-bold bg-primary text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Create Account</span>
        </button>
      </div>
    </>
  );
}
