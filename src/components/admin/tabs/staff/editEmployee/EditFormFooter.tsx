interface EditFormFooterProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditFormFooter({ onClose, onSubmit }: EditFormFooterProps) {
  return (
    <div className="px-5 sm:px-8 py-5 bg-slate-50 dark:bg-[#142618] border-t border-slate-100 dark:border-[#29382d] flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
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
        className="px-6 py-2.5 bg-[#14b83d] text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">save</span>
        Save Changes
      </button>
    </div>
  );
}
