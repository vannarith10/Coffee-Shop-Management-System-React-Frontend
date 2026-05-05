import { useState, useEffect } from 'react';
import { useTopProducts } from '../../../../hooks/useTopProducts';
import type { TopProductsRange } from './types';
import ChartSettingsModal from './ChartSettingsModal';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChartSettings {
  targetGoal: number;
  maxScale: 'auto' | '500' | '1000';
}

// ── Range config ──────────────────────────────────────────────────────────────
const RANGE_OPTIONS: { label: string; value: TopProductsRange }[] = [
  { label: 'Today',      value: 'TODAY'      },
  { label: 'This Week',  value: 'THIS_WEEK'  },
  { label: 'This Month', value: 'THIS_MONTH' },
  { label: 'This Year',  value: 'THIS_YEAR'  },
  { label: 'All Time',   value: 'ALL'        },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function computeWidth(
  units: number,
  maxScale: ChartSettings['maxScale'],
  maxUnits: number,
): number {
  if (maxScale === 'auto') {
    if (maxUnits === 0) return 0;
    return Math.round((units / maxUnits) * 100);
  }
  const cap = maxScale === '1000' ? 1000 : 500;
  return Math.min(Math.round((units / cap) * 100), 100);
}

/**
 * Color tiers relative to targetGoal:
 *   < 50%  of target → red
 *   ≥ 50%  of target → yellow
 *   ≥ 100% of target → green
 */
function getBarColor(units: number, targetGoal: number): string {
  if (units >= targetGoal)        return 'bg-[#14b83d]'; // ✅ green
  if (units >= targetGoal * 0.5)  return 'bg-amber-400'; // ⚠️ yellow
  return 'bg-red-500';                                    // ❌ red
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TopProductsChart() {
  const [range, setRange]               = useState<TopProductsRange>('ALL');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings]         = useState<ChartSettings>({ targetGoal: 200, maxScale: 'auto' });

  const { products, unitsTarget, loading, error, refetch } = useTopProducts(range, 10);

  // Sync targetGoal from the API the first time (or when range changes)
  useEffect(() => {
    if (unitsTarget > 0) {
      setSettings((prev) => ({ ...prev, targetGoal: unitsTarget }));
    }
  }, [unitsTarget]);

  const maxUnits = products.length > 0 ? Math.max(...products.map((p) => p.units_sold)) : 1;
  const targetPct   = computeWidth(settings.targetGoal, settings.maxScale, maxUnits);
  const targetRight = `${100 - targetPct}%`;

  return (
    <>
      {/* ── Settings Modal ───────────────────────────────────────────────── */}
      {showSettings && (
        <ChartSettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onApply={(next) => setSettings(next)}
        />
      )}

      {/* ── Chart Card ───────────────────────────────────────────────────── */}
      <section className="px-8 py-4">
        <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm">

          {/* Header row */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Top Selling Products</h3>

                  {/* Settings trigger */}
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#29382d] text-slate-400 hover:text-[#14b83d] transition-all focus:outline-none"
                    title="Chart settings"
                    aria-label="Open chart settings"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                  </button>

                  {/* Refresh */}
                  <button
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#29382d] text-slate-400 hover:text-[#14b83d] transition-all focus:outline-none disabled:opacity-40"
                    title="Refresh"
                    aria-label="Refresh chart"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
                      refresh
                    </span>
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-[#9db8a4]">
                  Volume distribution by unit sales
                </p>
              </div>
            </div>

            {/* Range selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    range === opt.value
                      ? 'bg-[#14b83d] text-white shadow-sm shadow-[#14b83d]/40'
                      : 'bg-slate-100 dark:bg-[#112115] text-slate-500 dark:text-[#9db8a4] hover:bg-slate-200 dark:hover:bg-[#29382d]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Loading skeleton ─────────────────────────────────────────── */}
          {loading && (
            <div className="space-y-6 py-2 pb-8 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-32" />
                    <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-16" />
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#112115] h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-200 dark:bg-[#29382d] h-full rounded-full"
                      style={{ width: `${30 + i * 15}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Error state ──────────────────────────────────────────────── */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="material-symbols-outlined text-4xl text-red-400">error</span>
              <p className="text-sm text-slate-500 dark:text-[#9db8a4]">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-1.5 bg-[#14b83d] text-white rounded-lg text-xs font-bold hover:bg-[#11a035] transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ── Empty state ───────────────────────────────────────────────── */}
          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-[#3c5342]">
                bar_chart
              </span>
              <p className="text-sm text-slate-400 dark:text-[#9db8a4]">
                No sales data for this period
              </p>
            </div>
          )}

          {/* ── Bar chart rows ────────────────────────────────────────────── */}
          {!loading && !error && products.length > 0 && (
            <div className="space-y-6 py-2 pb-8">
              {products.map((product) => {
                const width = computeWidth(product.units_sold, settings.maxScale, maxUnits);
                return (
                  <div key={product.product_id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      {/* Product thumbnail + name */}
                      <div className="flex items-center gap-2 min-w-0">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-[#3c5342]"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <span className="font-semibold truncate">{product.product_name}</span>
                      </div>
                      <span className="text-slate-500 dark:text-[#9db8a4] shrink-0 ml-2">
                        {product.units_sold} units
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-[#112115] h-3 rounded-full overflow-hidden relative">
                      {/* Target line */}
                      <div
                        className="absolute top-0 bottom-0 w-px bg-slate-400/40 z-10 transition-all duration-500"
                        style={{ right: targetRight }}
                      />
                      {/* Bar */}
                      <div
                        className={`${getBarColor(product.units_sold, settings.targetGoal)} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer: active settings labels */}
          <div className="flex justify-between items-center mt-4 border-t border-slate-100 dark:border-[#29382d] pt-4">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-[#9db8a4] opacity-70 flex items-center gap-1.5 uppercase">
              <span className="material-symbols-outlined text-[12px]">straighten</span>
              Scale:{' '}
              {settings.maxScale === 'auto' ? 'Auto' : `Fixed ${settings.maxScale}`}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#7c2d12] dark:text-[#fef3c7] opacity-60 flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c2d12] dark:bg-[#fef3c7]" />
              Unit Target: {settings.targetGoal}
            </span>
          </div>

        </div>
      </section>
    </>
  );
}
