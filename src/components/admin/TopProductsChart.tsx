import { useState } from "react";
import { TOP_PRODUCTS } from "./constants";

export default function TopProductsChart() {
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);

  return (
    <section className="px-8 py-4">
      <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Top Selling Products</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#29382d] text-slate-400 hover:text-[#14b83d] transition-all focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                  </button>
                  {showSettingsPopover && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-[#1c3022] border border-slate-200 dark:border-[#3c5342] rounded-lg shadow-xl z-50 p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-3">
                        Chart Reference Points
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-200">
                            Set Target Goal (Units)
                          </label>
                          <input
                            type="number"
                            defaultValue="200"
                            className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#3c5342] rounded text-sm px-3 py-2 focus:ring-2 focus:ring-[#14b83d] focus:border-transparent outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-200">
                            Max Chart Scale
                          </label>
                          <select className="w-full bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#3c5342] rounded text-sm px-3 py-2 focus:ring-2 focus:ring-[#14b83d] focus:border-transparent outline-none text-slate-900 dark:text-white">
                            <option>Auto (Optimized)</option>
                            <option selected>Fixed 500</option>
                            <option>Fixed 1000</option>
                          </select>
                        </div>
                        <button className="w-full py-2 bg-[#14b83d] text-white text-xs font-bold rounded hover:bg-opacity-90 transition-all">
                          Apply Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

        <div className="space-y-6 py-2 pb-8">
          {TOP_PRODUCTS.map((product, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{product.name}</span>
                <span className="text-slate-500 dark:text-[#9db8a4]">{product.units} units</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#112115] h-3 rounded-full overflow-hidden relative">
                <div className="absolute right-[16%] top-0 bottom-0 w-px bg-slate-400/30 z-10"></div>
                <div
                  className={`${product.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${product.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 border-t border-slate-100 dark:border-[#29382d] pt-4">
          <span className="text-[10px] font-bold tracking-widest text-[#7c2d12] dark:text-[#fef3c7] opacity-60 flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c2d12] dark:bg-[#fef3c7]"></span>
            Unit Target: 200
          </span>
        </div>
      </div>
    </section>
  );
}
