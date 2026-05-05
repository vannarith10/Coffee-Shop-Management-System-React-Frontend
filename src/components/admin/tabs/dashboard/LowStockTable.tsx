import { useEffect, useState, useCallback } from "react";
import { dashboardService } from "../../../../services/adminDashboardService";
import type { ProductStatusItem, ProductStock, ProductsStatusesPagination } from "./types";

// ── Status badge config ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProductStock,
  { label: string; icon: string; className: string }
> = {
  IN_STOCK: {
    label: "In Stock",
    icon: "check_circle",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  LOW_STOCK: {
    label: "Low Stock",
    icon: "warning",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    icon: "cancel",
    className:
      "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  },
};

// ── Loading skeleton row ──────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-32" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-20" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-16" />
      </td>
      <td className="px-6 py-4">
        <div className="h-5 bg-slate-200 dark:bg-[#29382d] rounded-full w-24" />
      </td>
    </tr>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function LowStockTable() {
  const [products, setProducts] = useState<ProductStatusItem[]>([]);
  const [pagination, setPagination] = useState<ProductsStatusesPagination>({
    page: 1,
    size: PAGE_SIZE,
    total_pages: 1,
    total_items: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getProductsStatuses(page, PAGE_SIZE);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setError("Failed to load product statuses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handlePrev = () => {
    if (pagination.page > 1) fetchPage(pagination.page - 1);
  };

  const handleNext = () => {
    if (pagination.page < pagination.total_pages) fetchPage(pagination.page + 1);
  };

  return (
    <section className="px-8 py-4 mb-10">
      <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl shadow-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="p-6 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center">
          <div className="flex items-center gap-2 text-[#14b83d]">
            <span className="material-symbols-outlined">inventory_2</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Stock Status
            </h3>
          </div>

          {/* Pagination info */}
          {!loading && !error && (
            <span className="text-xs text-slate-500 dark:text-[#9db8a4] font-medium">
              {pagination.total_items} products &nbsp;·&nbsp; Page{" "}
              {pagination.page} of {pagination.total_pages}
            </span>
          )}
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-[#142618] text-xs uppercase text-slate-500 dark:text-[#9db8a4] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#29382d]">

              {/* Loading */}
              {loading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}

              {/* Error */}
              {!loading && error && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-red-500"
                  >
                    <span className="material-symbols-outlined align-middle mr-1 text-base">
                      error
                    </span>
                    {error}
                    <button
                      onClick={() => fetchPage(pagination.page)}
                      className="ml-2 underline hover:text-red-700 font-semibold"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && !error && products.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-slate-400 dark:text-[#9db8a4]"
                  >
                    No products found.
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                !error &&
                products.map((item) => {
                  const cfg = STATUS_CONFIG[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#1c3022] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-[#9db8a4]">
                        {item.category_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-[#9db8a4]">
                        {item.category_type}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${cfg.className}`}
                        >
                          <span className="material-symbols-outlined text-[13px] leading-none">
                            {cfg.icon}
                          </span>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination controls ── */}
        {!error && (
          <div className="p-4 border-t border-slate-100 dark:border-[#29382d] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={loading || pagination.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg
                         text-slate-600 dark:text-[#9db8a4] bg-slate-100 dark:bg-[#142618]
                         hover:bg-slate-200 dark:hover:bg-[#1c3022] transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
              Prev
            </button>

            {/* Page dots */}
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.total_pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchPage(i + 1)}
                  disabled={loading}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-colors disabled:cursor-not-allowed ${
                    pagination.page === i + 1
                      ? "bg-[#14b83d] text-white"
                      : "text-slate-500 dark:text-[#9db8a4] hover:bg-slate-100 dark:hover:bg-[#1c3022]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={loading || pagination.page >= pagination.total_pages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg
                         text-slate-600 dark:text-[#9db8a4] bg-slate-100 dark:bg-[#142618]
                         hover:bg-slate-200 dark:hover:bg-[#1c3022] transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
