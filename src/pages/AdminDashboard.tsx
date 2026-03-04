
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/authService";
import { 
  dashboardService, 
  SummaryResponse,
  MetricData 
} from "../services/adminDashboardService";


// Navigation item type
type NavItem = {
  id: string;
  label: string;
  icon: string;
};

// Formatted stat data for display
type DisplayStat = {
  title: string;
  value: string;
  change: string;
  icon: string;
  rawValue: number;
  rawGrowth: number;
};

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "staff", label: "Staff", icon: "group" },
  { id: "inventory", label: "Inventory", icon: "inventory_2" },
  { id: "products", label: "Products", icon: "coffee_maker" },
  { id: "reports", label: "Reports", icon: "bar_chart" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const TOP_PRODUCTS = [
  { name: "Espresso Roast", units: 420, percentage: 84, color: "bg-[#14b83d]" },
  { name: "Oat Milk Latte", units: 315, percentage: 63, color: "bg-[#14b83d]" },
  { name: "Cold Brew Special", units: 240, percentage: 48, color: "bg-[#7c2d12]" },
  { name: "Butter Croissant", units: 188, percentage: 38, color: "bg-[#14b83d]" },
];

const LOW_STOCK_ITEMS = [
  { name: "Whole Milk 1L", category: "Dairy", stock: 12, status: "critical" as const },
  { name: "House Blend Beans (5kg)", category: "Coffee", stock: 2, status: "critical" as const },
  { name: "Paper Cups (Medium)", category: "Supplies", stock: 150, status: "low" as const },
  { name: "Oat Milk 1L", category: "Dairy Alternative", stock: 8, status: "low" as const },
];

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format number with commas
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
};

// Format percentage
const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

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

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
    
    // Optional: Auto-refresh every 5 minutes
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
    if (!summaryData?.summary) {
      return [];
    }

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

  const refreshData = () => {
    fetchDashboardData();
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContent 
            stats={getDisplayStats()} 
            loading={loading} 
            error={error}
            lastUpdated={lastUpdated}
            onRefresh={refreshData}
          />
        );
      case "staff":
        return <PlaceholderContent title="Staff Management" description="Manage employees, schedules, and permissions..." />;
      case "inventory":
        return <PlaceholderContent title="Inventory Management" description="Track stock levels, suppliers, and orders..." />;
      case "products":
        return <PlaceholderContent title="Product Management" description="Manage menu items, pricing, and categories..." />;
      case "reports":
        return <PlaceholderContent title="Sales Reports" description="View detailed analytics and export data..." />;
      case "settings":
        return <PlaceholderContent title="System Settings" description="Configure POS, notifications, and integrations..." />;
      default:
        return (
          <DashboardContent 
            stats={getDisplayStats()} 
            loading={loading} 
            error={error}
            lastUpdated={lastUpdated}
            onRefresh={refreshData}
          />
        );
    }
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#112115] font-['Inter',sans-serif] text-slate-900 dark:text-slate-100 antialiased">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#0d1a10] border-r border-slate-200 dark:border-[#29382d] flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7c2d12] flex items-center justify-center text-white">
              <span className="material-symbols-outlined">coffee</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">BrewAdmin</h1>
              <p className="text-xs text-slate-500 dark:text-[#9db8a4]">Management System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 mt-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-[#14b83d]/15 text-[#14b83d] border-l-4 border-[#14b83d] font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2e1e]"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 mt-auto space-y-2">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#1a2e1e] hover:bg-slate-200 dark:hover:bg-[#233d28] rounded-lg transition-colors text-sm font-bold"
            >
              <span className="material-symbols-outlined text-sm">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#1a2e1e] hover:bg-slate-200 dark:hover:bg-[#233d28] rounded-lg transition-colors text-sm font-bold text-red-600 dark:text-red-400"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {/* Header */}
          <header className="p-8 pb-4">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex min-w-72 flex-col gap-1">
                <h2 className="text-3xl font-black tracking-tight dark:text-white">
                  {activeTab === "dashboard" ? "Business Analytics" : NAV_ITEMS.find(n => n.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 dark:text-[#9db8a4] text-base">
                  {activeTab === "dashboard" 
                    ? "Real-time overview of your coffee shop performance." 
                    : `Manage your ${activeTab} settings and data.`}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={refreshData}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>
                    refresh
                  </span>
                  <span>{loading ? "Updating..." : "Refresh"}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#14b83d] text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all">
                  <span className="material-symbols-outlined text-lg">download</span>
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </header>

          {/* Error Banner */}
          {error && (
            <div className="px-8 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined">error</span>
                  <span className="text-sm font-medium">{error}</span>
                </div>
                <button 
                  onClick={refreshData}
                  className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Content */}
          {renderContent()}
        </main>
      </div>

      {/* Material Icons Font */}
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

// Dashboard Content Component
interface DashboardContentProps {
  stats: DisplayStat[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

function DashboardContent({ stats, loading, error, lastUpdated, onRefresh }: DashboardContentProps) {
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);

  // Skeleton loader for stats
  const renderSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm animate-pulse">
          <div className="flex justify-between items-start">
            <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-24"></div>
            <div className="h-6 w-6 bg-slate-200 dark:bg-[#29382d] rounded"></div>
          </div>
          <div className="h-8 bg-slate-200 dark:bg-[#29382d] rounded w-32 mt-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-[#29382d] rounded w-20 mt-1"></div>
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* Stats Grid */}
      <section className="px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading && stats.length === 0 ? (
          renderSkeleton()
        ) : stats.length > 0 ? (
          stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">{stat.title}</p>
                <span className="material-symbols-outlined text-[#14b83d]">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold ${stat.rawGrowth >= 0 ? "text-[#14b83d]" : "text-red-500"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-slate-400">vs yesterday</span>
              </div>
            </div>
          ))
        ) : !error ? (
          <div className="col-span-3 text-center py-8 text-slate-500">
            No data available
          </div>
        ) : null}
      </section>

      {/* Last Updated Indicator */}
      {lastUpdated && !loading && (
        <div className="px-8 -mt-2 mb-2">
          <p className="text-xs text-slate-400 dark:text-[#9db8a4]">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Top Products Chart */}
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
                <p className="text-sm text-slate-500 dark:text-[#9db8a4]">Volume distribution by unit sales - Today</p>
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

      {/* Low Stock Alerts */}
      <section className="px-8 py-4 mb-10">
        <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center">
            <div className="flex items-center gap-2 text-red-500">
              <span className="material-symbols-outlined">warning</span>
              <h3 className="text-lg font-bold">Low Stock Alerts</h3>
            </div>
            <button className="text-sm font-bold text-[#14b83d] hover:underline">View All Inventory</button>
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
    </>
  );
}

// Placeholder for other tabs
function PlaceholderContent({ title, description }: { title: string; description: string }) {
  return (
    <section className="px-8 py-4">
      <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-[#142618] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">construction</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-[#9db8a4] max-w-md mx-auto">{description}</p>
        <button className="mt-6 px-4 py-2 bg-[#14b83d] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all">
          Coming Soon
        </button>
      </div>
    </section>
  );
}