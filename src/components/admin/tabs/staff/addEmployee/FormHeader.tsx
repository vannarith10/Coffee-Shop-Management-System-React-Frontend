interface FormHeaderProps {
  onClose: () => void;
}

export default function FormHeader({ onClose }: FormHeaderProps) {
  return (
    <div className="px-8 py-6 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person_add</span>
          Add New Employee
        </h3>
        <p className="text-sm text-slate-500 dark:text-[#9db8a4] mt-1">
          Fill in the details to create a new staff account.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#233d28] transition-colors"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
