import React from 'react';

// ─── Data ────────────────────────────────────────────────────────────

const dailyRevenue = [
  45, 52, 48, 65, 58, 72, 68, 82, 78, 94, 88, 82, 76, 84, 90, 98, 92, 85, 79, 73, 68, 62, 58, 65, 74, 81, 79, 86, 93, 95, 40,
];

const categoryData = [
  { label: 'Coffee Drinks', percent: 45, color: '#14b83d' },
  { label: 'Whole Beans', percent: 25, color: '#7c2d12' },
  { label: 'Pastries', percent: 20, color: '#3b82f6' },
  { label: 'Merchandise', percent: 10, color: '#f59e0b' },
];

const heatmapLevels = [
  [1, 0, 0, 0, 0, 1, 2, 3, 4, 3, 2, 3, 4, 4, 3, 2, 3, 4, 4, 3, 2, 1, 1, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 3, 4, 4, 3, 2, 3, 4, 4, 3, 2, 1, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 4, 4, 4, 3, 3, 4, 4, 3, 2, 1, 1, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 3, 2, 2, 3, 4, 4, 3, 2, 3, 4, 4, 3, 2, 1, 0, 0],
  [1, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 1],
  [1, 1, 1, 0, 1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1],
  [1, 1, 1, 0, 0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 1, 0],
];

const heatmapLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const heatmapHours = ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM', '11PM'];

const levelClasses: Record<number, string> = {
  0: 'bg-[#1a2e1e]/30',
  1: 'bg-[#14b83d]/20',
  2: 'bg-[#14b83d]/40',
  3: 'bg-[#14b83d]/70',
  4: 'bg-[#14b83d]',
};

// ─── Helpers ─────────────────────────────────────────────────────────

function getStrokeDasharray(percent: number) {
  return `${percent} ${100 - percent}`;
}

// ─── Component ───────────────────────────────────────────────────────

export default function ReportsContent() {
  const donutOffset1 = 0;
  const donutOffset2 = -(categoryData[0].percent);
  const donutOffset3 = -(categoryData[0].percent + categoryData[1].percent);
  const donutOffset4 = -(categoryData[0].percent + categoryData[1].percent + categoryData[2].percent);

  return (
    <div className="flex-1 overflow-x-hidden">
      {/* Header */}
      <header className="p-8 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Revenue Trends</h2>
            <p className="text-slate-500 dark:text-[#9db8a4] text-base">Monthly performance and daily revenue analysis.</p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="px-8 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#14b83d]/10 flex items-center justify-center text-[#14b83d]">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-xs font-bold text-[#14b83d] bg-[#14b83d]/10 px-2 py-0.5 rounded-full">+14.2%</span>
          </div>
          <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">Gross Profit</p>
          <p className="text-3xl font-bold tracking-tight mt-1">$42,892.50</p>
        </div>

        <div className="rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">+8.1%</span>
          </div>
          <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">Net Revenue</p>
          <p className="text-3xl font-bold tracking-tight mt-1">$35,210.80</p>
        </div>
      </section>

      {/* Revenue Bar Chart */}
      <section className="px-8 py-4">
        <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Revenue Trends</h3>
              <p className="text-sm text-slate-500 dark:text-[#9db8a4]">Daily revenue distribution for the current period</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-black text-slate-400 dark:text-[#9db8a4] tracking-widest">MAY 2024</span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#14b83d] uppercase">
                <span className="w-2 h-2 bg-[#14b83d] rounded-full"></span>
                <span>Daily Sales</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[10px] text-slate-400 font-bold h-[300px] pb-8 pr-2">
              <span>$4,000</span>
              <span>$3,000</span>
              <span>$2,000</span>
              <span>$1,000</span>
              <span>$0</span>
            </div>

            {/* Chart area */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between h-[300px] pointer-events-none pb-8">
                <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                <div className="border-t border-slate-200 dark:border-white/5 w-full"></div>
                <div className="border-t border-slate-200 dark:border-white/10 w-full"></div>
              </div>

              {/* Bars */}
              <div className="relative h-[300px] flex flex-col">
                <div className="flex-1 flex items-end justify-between px-1 gap-[2px]">
                  {dailyRevenue.map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-[1px] hover:opacity-80 transition-opacity ${i === 30 ? 'bg-[#14b83d]/40' : 'bg-[#14b83d]'}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between px-1 h-8 pt-2">
                  {Array.from({ length: 31 }, (_, i) => (
                    <span key={i} className="flex-1 text-[9px] text-slate-400 font-bold text-center">
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Donut + Heatmap */}
      {/* Sales by Category */}
      <section className="px-8 py-4">
        <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Sales by Category</h3>
              <p className="text-sm text-slate-500 dark:text-[#9db8a4]">Revenue distribution across product lines</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-16 py-4">
            {/* Donut Chart */}
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#14b83d" strokeDasharray={getStrokeDasharray(categoryData[0].percent)} strokeDashoffset={donutOffset1} strokeWidth="4" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#7c2d12" strokeDasharray={getStrokeDasharray(categoryData[1].percent)} strokeDashoffset={donutOffset2} strokeWidth="4" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#3b82f6" strokeDasharray={getStrokeDasharray(categoryData[2].percent)} strokeDashoffset={donutOffset3} strokeWidth="4" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#f59e0b" strokeDasharray={getStrokeDasharray(categoryData[3].percent)} strokeDashoffset={donutOffset4} strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">$35,210</span>
                <span className="text-xs uppercase text-slate-400 font-black tracking-widest mt-1">Total Revenue</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 max-w-xl">
              {categoryData.map((cat) => (
                <div key={cat.label} className="flex items-center gap-4 group">
                  <div className="w-4 h-12 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">{cat.label}</span>
                    <span className="text-2xl font-black">{cat.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Busiest Hours Heatmap */}
      <section className="px-8 py-4 mb-10">
        <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Busiest Hours</h3>
              <p className="text-sm text-slate-500 dark:text-[#9db8a4]">Average order volume by time & day</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 uppercase font-bold">
              <span>Low</span>
              <div className="flex gap-1">
                <span className="w-4 h-4 bg-[#14b83d]/10 rounded-sm"></span>
                <span className="w-4 h-4 bg-[#14b83d]/40 rounded-sm"></span>
                <span className="w-4 h-4 bg-[#14b83d] rounded-sm"></span>
              </div>
              <span>High</span>
            </div>
          </div>

          <div 
            className="grid gap-y-2 gap-x-4 items-center"
            style={{ gridTemplateColumns: '80px repeat(24, minmax(0, 1fr))' }}
          >
            {/* Header / Column labels */}
            <div className="col-start-2 col-span-24 flex justify-between mb-4 px-2">
              {heatmapHours.map((h) => (
                <span key={h} className="text-[11px] font-black text-slate-400 tracking-tighter uppercase">{h}</span>
              ))}
            </div>
            
            {/* Rows */}
            {heatmapLevels.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {/* Day Label */}
                <span className="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider pr-4">
                  {heatmapLabels[rowIdx]}
                </span>
                
                {/* 24 Hour Cells for this day */}
                {row.map((level, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`rounded-sm aspect-square transition-all hover:scale-125 hover:z-10 cursor-pointer shadow-sm ${levelClasses[level]}`}
                    title={`${heatmapLabels[rowIdx]} ${colIdx}:00 - Level ${level}`}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
