interface EditFormFooterProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditFormFooter({ onClose, onSubmit }: EditFormFooterProps) {
  return (
    <div className="px-6 py-4 bg-slate-50 dark:bg-[#0d1a10] border-t border-slate-100 dark:border-[#29382d] flex justify-end gap-3 shrink-0">
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 text-slate-600 dark:text-slate-400 text-sm font-bold hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-base">save</span>
        Save Changes
      </button>
    </div>
  );
}
