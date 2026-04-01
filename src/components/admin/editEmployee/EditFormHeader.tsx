interface EditFormHeaderProps {
  staffName: string;
  onClose: () => void;
}

export default function EditFormHeader({ staffName, onClose }: EditFormHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center bg-slate-50 dark:bg-[#0d1a10] shrink-0">
      <div>
        <h3 className="text-xl font-bold dark:text-white">Edit Staff Details</h3>
        <p className="text-xs text-slate-500 dark:text-[#9db8a4]">
          Update information for {staffName}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a2e1e]"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
