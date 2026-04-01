import { LOW_STOCK_ITEMS } from "./constants";

export default function LowStockTable() {
  return (
    <section className="px-8 py-4 mb-10">
      <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-500">
            <span className="material-symbols-outlined">warning</span>
            <h3 className="text-lg font-bold">Low Stock Alerts</h3>
          </div>
          <button className="text-sm font-bold text-[#14b83d] hover:underline">
            View All Inventory
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-[#142618] text-xs uppercase text-slate-500 dark:text-[#9db8a4] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#29382d]">
              {LOW_STOCK_ITEMS.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-[#1c3022] transition-colors">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-[#9db8a4]">{item.category}</td>
                  <td className="px-6 py-4 text-sm">{item.stock} units</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        item.status === "critical"
                          ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition-all ${
                        item.status === "critical"
                          ? "bg-[#14b83d] text-white hover:bg-opacity-90"
                          : "bg-[#14b83d]/20 text-[#14b83d] hover:bg-[#14b83d]/30"
                      }`}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
