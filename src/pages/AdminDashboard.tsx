import { useState, useEffect, useMemo } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { logout, getUser } from "../services/authService";
import {
  dashboardService,
  SummaryResponse,
} from "../services/adminDashboardService";

import { DisplayStat } from "../components/admin/tabs/dashboard/types";
import { formatCurrency, formatNumber, formatPercentage } from "../components/admin/tabs/dashboard/formatters";
import Sidebar from "../components/admin/shared/Sidebar";
import DashboardHeader from "../components/admin/shared/DashboardHeader";
import ErrorBanner from "../components/admin/shared/ErrorBanner";
import DashboardContent from "../components/admin/tabs/dashboard/DashboardContent";
import StaffContent from "../components/admin/tabs/staff/StaffContent";
import ProductsContent from "../components/admin/tabs/products/ProductsContent";
import ReportsContent from "../components/admin/tabs/reports/ReportsContent";
import SettingsContent from "../components/admin/tabs/settings/SettingsContent";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive active tab from pathname
  const activeTab = useMemo(() => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    return path === 'admin' ? 'dashboard' : path;
  }, [location.pathname]);

  // API Data State
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch data on mount with auto-refresh every 5 minutes
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getBusinessAnalyticsSummary();
      setSummaryData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to display format
  const getDisplayStats = (): DisplayStat[] => {
    if (!summaryData?.summary) return [];

    const { today_revenue, today_total_orders, today_average_order_value } = summaryData.summary;

    return [
      {
        title: "Today's Revenue",
        value: formatCurrency(today_revenue.value),
        change: formatPercentage(today_revenue.growth_pct),
        icon: "payments",
        rawValue: today_revenue.value,
        rawGrowth: today_revenue.growth_pct,
      },
      {
        title: "Total Orders",
        value: formatNumber(today_total_orders.value),
        change: formatPercentage(today_total_orders.growth_pct),
        icon: "shopping_cart",
        rawValue: today_total_orders.value,
        rawGrowth: today_total_orders.growth_pct,
      },
      {
        title: "Avg. Order Value",
        value: formatCurrency(today_average_order_value.value),
        change: formatPercentage(today_average_order_value.growth_pct),
        icon: "analytics",
        rawValue: today_average_order_value.value,
        rawGrowth: today_average_order_value.growth_pct,
      },
    ];
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#112115] font-['Inter',sans-serif] text-slate-900 dark:text-slate-100 antialiased">
        <Sidebar
          onLogout={handleLogout}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto scroll-smooth relative">
          {/* Mobile Header Toggle */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0d1a10] border-b border-slate-200 dark:border-[#29382d] sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#7c2d12] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">coffee</span>
              </div>
              <span className="font-bold">A5 Coffee</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a2e1e]"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
          
          {activeTab === 'dashboard' && (
            <DashboardHeader
              activeTab={activeTab}
              loading={loading}
              onRefresh={fetchDashboardData}
            />
          )}

          {error && <ErrorBanner error={error} onRetry={fetchDashboardData} />}

          <Routes>
            <Route 
              index 
              element={
                <DashboardContent
                  stats={getDisplayStats()}
                  loading={loading}
                  error={error}
                  lastUpdated={lastUpdated}
                />
              } 
            />
            <Route path="staff" element={<StaffContent />} />
            <Route path="products" element={<ProductsContent />} />
            <Route path="reports" element={<ReportsContent />} />
            <Route path="settings" element={<SettingsContent />} />
            {/* Fallback to dashboard */}
            <Route path="*" element={<DashboardContent stats={getDisplayStats()} loading={loading} error={error} lastUpdated={lastUpdated} />} />
          </Routes>
        </main>
      </div>

      {/* Fonts & Icons */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@20..48,100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}