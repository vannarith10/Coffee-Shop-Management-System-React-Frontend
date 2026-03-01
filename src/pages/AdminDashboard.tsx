import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/authService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">☕ Admin Dashboard</h1>
            <span className="bg-slate-600 px-3 py-1 rounded-full text-sm">
              {user?.username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="flex gap-1 px-6">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "products", label: "Products", icon: "📦" },
            { id: "users", label: "Users", icon: "👥" },
            { id: "reports", label: "Reports", icon: "📈" },
            { id: "settings", label: "Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Sales" value="$12,450" change="+12%" color="green" />
            <StatCard title="Orders Today" value="156" change="+5%" color="blue" />
            <StatCard title="Active Users" value="23" change="-2%" color="yellow" />
            
            <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-600">Admin overview and system status...</p>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Management</h2>
            <p className="text-gray-600">Manage menu items, prices, inventory...</p>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">User Management</h2>
            <p className="text-gray-600">Manage cashiers, baristas, admin accounts...</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sales Reports</h2>
            <p className="text-gray-600">View detailed sales analytics...</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">System Settings</h2>
            <p className="text-gray-600">Configure POS settings...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, change, color }: { 
  title: string; 
  value: string; 
  change: string;
  color: "green" | "blue" | "yellow";
}) {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`text-sm font-medium ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
}