import { useEffect, useRef, useState } from 'react';

interface ChartSettings {
  targetGoal: number;
  maxScale: 'auto' | '500' | '1000';
}

interface ChartSettingsModalProps {
  settings: ChartSettings;
  onClose: () => void;
  onApply: (settings: ChartSettings) => void;
}

const INPUT_CLASS =
  'w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#3c5342] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] dark:text-white outline-none transition-all';

const LABEL_CLASS =
  'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-1.5';

export default function ChartSettingsModal({ settings, onClose, onApply }: ChartSettingsModalProps) {
  const [local, setLocal] = useState<ChartSettings>(settings);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Trap body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Auto-focus first input
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chart-settings-title"
    >
      {/* Blurred overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center bg-slate-50 dark:bg-[#0d1a10]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#14b83d]/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#14b83d] text-xl">bar_chart</span>
            </div>
            <div>
              <h3
                id="chart-settings-title"
                className="text-base font-bold dark:text-white leading-tight"
              >
                Chart Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#9db8a4]">
                Top Selling Products reference points
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#233d28] transition-colors"
            aria-label="Close settings"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────────── */}
        <div className="p-6 space-y-5">

          {/* Target Goal */}
          <div>
            <label htmlFor="target-goal" className={LABEL_CLASS}>
              Target Goal (Units)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                flag
              </span>
              <input
                ref={firstInputRef}
                id="target-goal"
                type="number"
                min={1}
                value={local.targetGoal}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, targetGoal: Number(e.target.value) }))
                }
                className={INPUT_CLASS + ' pl-10'}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400 dark:text-[#9db8a4]">
              The dashed target line shown on the bar chart.
            </p>
          </div>

          {/* Max Chart Scale */}
          <div>
            <label htmlFor="max-scale" className={LABEL_CLASS}>
              Max Chart Scale
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                straighten
              </span>
              <select
                id="max-scale"
                value={local.maxScale}
                onChange={(e) =>
                  setLocal((p) => ({
                    ...p,
                    maxScale: e.target.value as ChartSettings['maxScale'],
                  }))
                }
                className={INPUT_CLASS + ' pl-10 appearance-none'}
              >
                <option value="auto">Auto (Optimized)</option>
                <option value="500">Fixed 500</option>
                <option value="1000">Fixed 1000</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2 p-3 bg-[#14b83d]/5 dark:bg-[#14b83d]/10 border border-[#14b83d]/20 rounded-lg">
            <span className="material-symbols-outlined text-[#14b83d] text-lg mt-0.5">info</span>
            <p className="text-[11px] text-slate-600 dark:text-[#9db8a4] leading-relaxed">
              Changes apply to the current session only. These settings do not persist after a page refresh.
            </p>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#142618] border-t border-slate-100 dark:border-[#29382d] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#233d28] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 text-sm font-bold bg-[#14b83d] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
