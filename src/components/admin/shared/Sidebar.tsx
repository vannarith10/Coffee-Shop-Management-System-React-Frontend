import { NAV_ITEMS } from "./constants";

interface SidebarProps {
  activeTab: string;
  isDarkMode: boolean;
  onTabChange: (tab: string) => void;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  isDarkMode,
  onTabChange,
  onToggleDarkMode,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#0d1a10] border-r border-slate-200 dark:border-[#29382d] flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#7c2d12] flex items-center justify-center text-white">
          <span className="material-symbols-outlined">coffee</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">BrewAdmin</h1>
          <p className="text-xs text-slate-500 dark:text-[#9db8a4]">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "bg-[#14b83d]/15 text-[#14b83d] border-l-4 border-[#14b83d] font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2e1e]"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto space-y-2">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#1a2e1e] hover:bg-slate-200 dark:hover:bg-[#233d28] rounded-lg transition-colors text-sm font-bold"
        >
          <span className="material-symbols-outlined text-sm">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#1a2e1e] hover:bg-slate-200 dark:hover:bg-[#233d28] rounded-lg transition-colors text-sm font-bold text-red-600 dark:text-red-400"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
