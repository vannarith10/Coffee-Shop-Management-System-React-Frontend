import { DisplayStat } from "./types";
import StatsGrid from "./StatsGrid";
import TopProductsChart from "./TopProductsChart";
import LowStockTable from "./LowStockTable";

interface DashboardContentProps {
  stats: DisplayStat[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export default function DashboardContent({
  stats,
  loading,
  error,
  lastUpdated,
}: DashboardContentProps) {
  return (
    <>
      <StatsGrid stats={stats} loading={loading} error={error} />

      {/* Last Updated Indicator */}
      {lastUpdated && !loading && (
        <div className="px-8 -mt-2 mb-2">
          <p className="text-xs text-slate-400 dark:text-[#9db8a4]">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}

      <TopProductsChart />
      <LowStockTable />
    </>
  );
}
