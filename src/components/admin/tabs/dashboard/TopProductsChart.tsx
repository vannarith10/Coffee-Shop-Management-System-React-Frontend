import { useState } from 'react';
import { TOP_PRODUCTS } from './constants';
import type { TopProduct } from './types';
import ChartSettingsModal from './ChartSettingsModal';

interface ChartSettings {
  targetGoal: number;
  maxScale: 'auto' | '500' | '1000';
}

const DEFAULT_SETTINGS: ChartSettings = {
  targetGoal: 200,
  maxScale: '500',
};

/** Compute bar width % based on the current max-scale setting */
function computeWidth(units: number, maxScale: ChartSettings['maxScale']): number {
  if (maxScale === 'auto') {
    const max = Math.max(...TOP_PRODUCTS.map((p) => p.units));
    return Math.round((units / max) * 100);
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
  if (units >= targetGoal)          return 'bg-[#14b83d]';   // ✅ green — at/above target
  if (units >= targetGoal * 0.5)    return 'bg-amber-400';   // ⚠️ yellow — 50–99% of target
  return 'bg-red-500';                                        // ❌ red  — below 50%
}

export default function TopProductsChart() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChartSettings>(DEFAULT_SETTINGS);

  /** Target line position as % from right edge */
  const targetPct = computeWidth(settings.targetGoal, settings.maxScale);
  const targetRight = `${100 - targetPct}%`;

  return (
    <>
      {/* ── Settings Modal (portal-style, rendered outside the card) ────────── */}
      {showSettings && (
        <ChartSettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onApply={(next) => setSettings(next)}
        />
      )}

      {/* ── Chart Card ──────────────────────────────────────────────────────── */}
      <section className="px-8 py-4">
        <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm">

          {/* Header row */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Top Selling Products</h3>

                  {/* Settings trigger — now opens a proper modal */}
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#29382d] text-slate-400 hover:text-[#14b83d] transition-all focus:outline-none"
                    title="Chart settings"
                    aria-label="Open chart settings"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-[#9db8a4]">
                  Volume distribution by unit sales - Today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-[#14b83d]/10 text-[#14b83d] rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              8.4% growth
            </div>
          </div>

          {/* Bar chart rows */}
          <div className="space-y-6 py-2 pb-8">
            {TOP_PRODUCTS.map((product: TopProduct, index: number) => {
              const width = computeWidth(product.units, settings.maxScale);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-slate-500 dark:text-[#9db8a4]">{product.units} units</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#112115] h-3 rounded-full overflow-hidden relative">
                    {/* Target line */}
                    <div
                      className="absolute top-0 bottom-0 w-px bg-slate-400/40 z-10 transition-all duration-500"
                      style={{ right: targetRight }}
                    />
                    {/* Bar — color driven by units vs target goal */}
                    <div
                      className={`${getBarColor(product.units, settings.targetGoal)} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer: active settings labels */}
          <div className="flex justify-between items-center mt-4 border-t border-slate-100 dark:border-[#29382d] pt-4">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-[#9db8a4] opacity-70 flex items-center gap-1.5 uppercase">
              <span className="material-symbols-outlined text-[12px]">straighten</span>
              Scale:{' '}
              {settings.maxScale === 'auto'
                ? 'Auto'
                : `Fixed ${settings.maxScale}`}
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
