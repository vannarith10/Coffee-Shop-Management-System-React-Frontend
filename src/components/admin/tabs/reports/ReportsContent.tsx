import React, { useState, useEffect, useMemo } from 'react';
import { dashboardService } from '../../../../services/adminDashboardService';
import type { ReportsResponse } from './types';

// ─── Helpers ─────────────────────────────────────────────────────────

function getStrokeDasharray(percent: number) {
  return `${percent} ${100 - percent}`;
}

const CATEGORY_COLORS = [
  '#14b83d', // Green
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#7c2d12', // Brown
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const heatmapLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const heatmapHours = ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM', '11PM'];

// ─── Component ───────────────────────────────────────────────────────

export default function ReportsContent() {
  const [data, setData] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  
  // Get current date for defaults
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const handleResetToNow = () => {
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
  };

  const fetchReports = async () => {
    setLoading(true);
    setAnimate(false);
    setError(null);
    try {
      const response = await dashboardService.getReports(selectedYear, selectedMonth);
      console.log('Reports API response:', response);
      if (!response || !response.summary) {
        throw new Error('Invalid response structure: "summary" field is missing.');
      }
      setData(response);
      // Small delay to ensure the DOM is ready for transition
      setTimeout(() => setAnimate(true), 50);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      let errorMsg = 'Failed to fetch reports.';
      if (err.response) {
        // The server responded with a status code that falls out of the range of 2xx
        errorMsg = `Server Error (${err.response.status}): ${err.response.data?.message || err.message}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMsg = 'Network Error: No response received from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedYear, selectedMonth]);

  // Calculations for Revenue Trends Chart
  const maxRevenue = useMemo(() => {
    if (!data?.revenue_trends || !data.revenue_trends.length) return 100;
    const max = Math.max(...data.revenue_trends);
    return max === 0 ? 100 : max * 1.2; // Add 20% headroom
  }, [data]);

  const yAxisTicks = useMemo(() => {
    return [
      Math.round(maxRevenue),
      Math.round(maxRevenue * 0.75),
      Math.round(maxRevenue * 0.5),
      Math.round(maxRevenue * 0.25),
      0
    ];
  }, [maxRevenue]);

  // Calculations for Category Donut
  const categoryOffsets = useMemo(() => {
    if (!data?.sales_by_category) return [];
    let currentOffset = 0;
    return data.sales_by_category.map(cat => {
      const offset = currentOffset;
      currentOffset -= cat.percentage || 0;
      return offset;
    });
  }, [data]);

  // Calculations for Heatmap
  const maxBusyLevel = useMemo(() => {
    if (!data?.busies_hours) return 1;
    let max = 0;
    data.busies_hours.forEach(day => {
      if (Array.isArray(day)) {
        day.forEach(hour => {
          if (hour > max) max = hour;
        });
      }
    });
    return max === 0 ? 1 : max;
  }, [data]);

  const hasCategoryData = useMemo(() => {
    return data?.sales_by_category && data.sales_by_category.length > 0 && (data.summary?.net_revenue?.value || 0) > 0;
  }, [data]);

  const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-[#1a2e1e]/30';
    const intensity = value / maxBusyLevel;
    if (intensity < 0.25) return 'bg-[#14b83d]/20';
    if (intensity < 0.5) return 'bg-[#14b83d]/40';
    if (intensity < 0.75) return 'bg-[#14b83d]/70';
    return 'bg-[#14b83d]';
  };

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#14b83d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
          <span className="material-symbols-outlined text-4xl">error</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Reports Unreachable</h3>
        <p className="text-slate-500 dark:text-[#9db8a4] mb-6 max-w-lg font-mono text-sm bg-slate-100 dark:bg-black/20 p-4 rounded-lg">
          {error}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={fetchReports}
            className="bg-[#14b83d] hover:bg-[#14b83d]/90 text-white rounded-lg px-6 py-2 font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-slate-200 dark:bg-[#3c5342] hover:opacity-80 text-slate-700 dark:text-white rounded-lg px-6 py-2 font-bold transition-all active:scale-95"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className={`flex-1 overflow-x-hidden transition-opacity duration-300 ${
        loading ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Header */}
      <header className="px-4 md:px-8 pt-6 md:pt-8 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight dark:text-white truncate">
              Reports & Analytics
            </h2>
            <p className="text-slate-500 dark:text-[#9db8a4] text-sm md:text-base">
              Monthly performance and store activity analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex-1 sm:flex-none h-10 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg px-3 md:px-4 text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#14b83d] cursor-pointer"
            >
              {MONTHS.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="flex-1 sm:flex-none h-10 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg px-3 md:px-4 text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#14b83d] cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={handleResetToNow}
              className="flex-1 sm:flex-none h-10 bg-[#14b83d] hover:bg-[#14b83d]/90 text-white rounded-lg px-4 text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base md:text-[18px]">
                today
              </span>
              Now
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="px-4 md:px-8 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#14b83d]/10 flex items-center justify-center text-[#14b83d]">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                (data.summary?.gross_profit?.growth_ptc || 0) >= 0
                  ? "text-[#14b83d] bg-[#14b83d]/10"
                  : "text-red-500 bg-red-500/10"
              }`}
            >
              {(data.summary?.gross_profit?.growth_ptc || 0) >= 0 ? "+" : ""}
              {(data.summary?.gross_profit?.growth_ptc || 0).toFixed(1)}%
            </span>
          </div>
          <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">
            Gross Profit
          </p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
            ${(data.summary?.gross_profit?.value || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined">
                account_balance_wallet
              </span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                (data.summary?.net_revenue?.growth_ptc || 0) >= 0
                  ? "text-blue-500 bg-blue-500/10"
                  : "text-red-500 bg-red-500/10"
              }`}
            >
              {(data.summary?.net_revenue?.growth_ptc || 0) >= 0 ? "+" : ""}
              {(data.summary?.net_revenue?.growth_ptc || 0).toFixed(1)}%
            </span>
          </div>
          <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">
            Net Revenue
          </p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
            ${(data.summary?.net_revenue?.value || 0).toLocaleString()}
          </p>
        </div>
      </section>

      {/* Revenue Bar Chart */}
      <section className="px-4 md:px-8 py-4">
        <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold tracking-tight">
                Revenue Trends
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-[#9db8a4]">
                Daily revenue for {MONTHS[selectedMonth - 1]} {selectedYear}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="text-xs font-black text-slate-400 dark:text-[#9db8a4] tracking-widest uppercase">
                {MONTHS[selectedMonth - 1].substring(0, 3)} {selectedYear}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#14b83d] uppercase">
                <span className="w-2 h-2 bg-[#14b83d] rounded-full"></span>
                <span>Daily Sales</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-[500px] flex-1 flex gap-4">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-[10px] text-slate-400 font-bold h-[300px] md:h-[450px] pb-8 pr-2 text-right w-12 sticky left-0 bg-white dark:bg-[#1a2e1e] z-10">
                {yAxisTicks.map((tick) => (
                  <span key={tick}>${tick.toLocaleString()}</span>
                ))}
              </div>

              {/* Chart area */}
              <div className="flex-1 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between h-[300px] md:h-[450px] pointer-events-none pb-8">
                  <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                  <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                  <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                  <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                  <div className="border-t border-slate-200 dark:border-white/10 w-full"></div>
                </div>

                {/* Bars */}
                <div className="relative h-[300px] md:h-[450px] flex flex-col">
                  <div className="flex-1 flex items-end justify-between px-1 gap-[2px]">
                    {data?.revenue_trends?.map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-[1px] bg-[#14b83d] hover:bg-[#14b83d]/80 transition-[height,background-color] duration-[2000ms,200ms] ease-out cursor-help group relative"
                        style={{
                          height: animate
                            ? `${(val / maxRevenue) * 100}%`
                            : "0%",
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">
                          Day {i + 1}: ${val.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* X-axis labels */}
                  <div className="flex justify-between px-1 h-8 pt-2">
                    {data?.revenue_trends?.map((_, i) => (
                      <span
                        key={i}
                        className={`flex-1 text-[9px] text-slate-400 font-bold text-center ${
                          (data?.revenue_trends?.length || 0) > 20 &&
                          i % 2 !== 0
                            ? "hidden md:block"
                            : ""
                        }`}
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Donut + Heatmap */}
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 mb-10">
        {/* Sales by Category */}
        <section>
          <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 md:p-8 shadow-sm">
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold tracking-tight">
                Sales by Category
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-[#9db8a4]">
                Revenue distribution across product lines
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 py-4">
              {/* Donut Chart */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 group cursor-pointer">
                <svg
                  key={`${selectedYear}-${selectedMonth}-${loading}`}
                  className="w-full h-full transform animate-spin-once group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out"
                  viewBox="0 0 36 36"
                >
                  {hasCategoryData ? (
                    data.sales_by_category.map((cat, i) => (
                      <circle
                        key={cat.label}
                        cx="18"
                        cy="18"
                        fill="transparent"
                        r="15.915"
                        stroke={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                        strokeDasharray={getStrokeDasharray(cat.percentage)}
                        strokeDashoffset={categoryOffsets[i]}
                        strokeWidth="4"
                      />
                    ))
                  ) : (
                    <>
                      {/* Placeholder for no data */}
                      <circle
                        cx="18"
                        cy="18"
                        fill="transparent"
                        r="17.8"
                        stroke="currentColor"
                        className="text-slate-200 dark:text-white/10"
                        strokeWidth="0.2"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        fill="transparent"
                        r="14.0"
                        stroke="currentColor"
                        className="text-slate-200 dark:text-white/10"
                        strokeWidth="0.2"
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="text-2xl md:text-4xl font-bold truncate w-full">
                    ${(data.summary?.net_revenue?.value || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] md:text-xs uppercase text-slate-400 font-black tracking-widest mt-1">
                    Total Revenue
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-6 flex-1 w-full max-w-3xl">
                {data?.sales_by_category?.map((cat, i) => (
                  <div key={cat.label} className="flex items-center gap-4 group">
                    <div
                      className="w-1 h-10 md:w-1.5 md:h-12 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      }}
                    ></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">
                        {cat.label}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl md:text-2xl font-black">
                          {cat.percentage}%
                        </span>
                        <span className="text-[10px] md:text-xs text-slate-500 truncate">
                          ${(cat.revenue || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Busiest Hours Heatmap */}
        <section>
          <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight">
                  Busiest Hours
                </h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-[#9db8a4]">
                  Order volume distribution by day and hour
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold self-end md:self-start">
                <span className="hidden sm:inline">Low</span>
                <div className="flex gap-1">
                  <span className="w-3 h-3 md:w-4 md:h-4 bg-[#1a2e1e]/30 rounded-sm"></span>
                  <span className="w-3 h-3 md:w-4 md:h-4 bg-[#14b83d]/20 rounded-sm"></span>
                  <span className="w-3 h-3 md:w-4 md:h-4 bg-[#14b83d]/40 rounded-sm"></span>
                  <span className="w-3 h-3 md:w-4 md:h-4 bg-[#14b83d]/70 rounded-sm"></span>
                  <span className="w-3 h-3 md:w-4 md:h-4 bg-[#14b83d] rounded-sm"></span>
                </div>
                <span className="hidden sm:inline">High</span>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar pb-2">
              <div
                className="grid gap-y-3 gap-x-1 md:gap-x-2 items-center min-w-[700px]"
                style={{ gridTemplateColumns: "60px repeat(24, minmax(0, 1fr))" }}
              >
                {/* Header / Column labels */}
                <div className="col-start-2 col-span-24 flex justify-between mb-2 px-2">
                  {heatmapHours.map((h) => (
                    <span
                      key={h}
                      className="text-[9px] md:text-[11px] font-black text-slate-400 tracking-widest uppercase"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                {data?.busies_hours?.map((row, rowIdx) => (
                  <React.Fragment key={rowIdx}>
                    {/* Day Label */}
                    <span className="text-[10px] md:text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {heatmapLabels[rowIdx]}
                    </span>

                    {/* 24 Hour Cells for this day */}
                    {Array.isArray(row) &&
                      row.map((val, colIdx) => (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className={`rounded-sm md:rounded-md aspect-square transition-all hover:scale-110 hover:z-10 cursor-pointer shadow-sm ${getHeatmapColor(
                            val
                          )}`}
                          title={`${heatmapLabels[rowIdx]} ${colIdx}:00 - ${val} orders`}
                        />
                      ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
