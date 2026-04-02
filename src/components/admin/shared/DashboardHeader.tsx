import { NAV_ITEMS } from "./constants";

interface DashboardHeaderProps {
  activeTab: string;
  loading: boolean;
  onRefresh: () => void;
}

export default function DashboardHeader({ activeTab, loading, onRefresh }: DashboardHeaderProps) {
  const title =
    activeTab === "dashboard"
      ? "Business Analytics"
      : NAV_ITEMS.find((n) => n.id === activeTab)?.label;

  const subtitle =
    activeTab === "dashboard"
      ? "Real-time overview of your coffee shop performance."
      : `Manage your ${activeTab} settings and data.`;

  return (
    <header className="p-8 pb-4">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex min-w-72 flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tight dark:text-white">{title}</h2>
          <p className="text-slate-500 dark:text-[#9db8a4] text-base">{subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>
              refresh
            </span>
            <span>{loading ? "Updating..." : "Refresh"}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#14b83d] text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all">
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
