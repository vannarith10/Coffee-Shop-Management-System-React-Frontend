import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import PlaceholderContent from "../components/admin/shared/PlaceholderContent";
import StaffContent from "../components/admin/tabs/staff/StaffContent";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContent
            stats={getDisplayStats()}
            loading={loading}
            error={error}
            lastUpdated={lastUpdated}
          />
        );
      case "staff":
        return <StaffContent />;
      case "inventory":
        return (
          <PlaceholderContent
            title="Inventory Management"
            description="Track stock levels, suppliers, and orders..."
          />
        );
      case "products":
        return (
          <PlaceholderContent
            title="Product Management"
            description="Manage menu items, pricing, and categories..."
          />
        );
      case "reports":
        return (
          <PlaceholderContent
            title="Sales Reports"
            description="View detailed analytics and export data..."
          />
        );
      case "settings":
        return (
          <PlaceholderContent
            title="System Settings"
            description="Configure POS, notifications, and integrations..."
          />
        );
      default:
        return (
          <DashboardContent
            stats={getDisplayStats()}
            loading={loading}
            error={error}
            lastUpdated={lastUpdated}
          />
        );
    }
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#112115] font-['Inter',sans-serif] text-slate-900 dark:text-slate-100 antialiased">
        <Sidebar
          activeTab={activeTab}
          isDarkMode={isDarkMode}
          onTabChange={setActiveTab}
          onToggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto scroll-smooth">
          <DashboardHeader
            activeTab={activeTab}
            loading={loading}
            onRefresh={fetchDashboardData}
          />

          {error && <ErrorBanner error={error} onRetry={fetchDashboardData} />}

          {renderContent()}
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