import { DisplayStat } from "./types";

interface StatsGridProps {
  stats: DisplayStat[];
  loading: boolean;
  error: string | null;
}

function StatSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-24"></div>
            <div className="h-6 w-6 bg-slate-200 dark:bg-[#29382d] rounded"></div>
          </div>
          <div className="h-8 bg-slate-200 dark:bg-[#29382d] rounded w-32 mt-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-20 mt-1"></div>
        </div>
      ))}
    </>
  );
}

export default function StatsGrid({ stats, loading, error }: StatsGridProps) {
  return (
    <section className="px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {loading && stats.length === 0 ? (
        <StatSkeleton />
      ) : stats.length > 0 ? (
        stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">{stat.title}</p>
              <span className="material-symbols-outlined text-[#14b83d]">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-bold ${
                  stat.rawGrowth >= 0 ? "text-[#14b83d]" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-slate-400">vs yesterday</span>
            </div>
          </div>
        ))
      ) : !error ? (
        <div className="col-span-3 text-center py-8 text-slate-500">No data available</div>
      ) : null}
    </section>
  );
}
