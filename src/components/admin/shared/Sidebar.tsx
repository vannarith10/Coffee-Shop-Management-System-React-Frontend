import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./constants";
import { useShop } from "../../../context/ShopContext";

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  const { shopName, shopLogo } = useShop();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0d1a10] border-r border-slate-200 dark:border-[#29382d] flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white overflow-hidden">
              {shopLogo ? (
                <img src={shopLogo} alt={shopName} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[#7c2d12]">coffee</span>
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">{shopName}</h1>
              <p className="text-xs text-slate-500 dark:text-[#9db8a4]">
                Management System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1a2e1e] rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.id === 'dashboard' ? '/admin' : `/admin/${item.id}`}
              end={item.id === 'dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#14b83d]/15 text-[#14b83d] border-l-4 border-[#14b83d] font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2e1e]"
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto border-t border-slate-100 dark:border-[#1a2e1e] space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#1a2e1e] hover:bg-slate-200 dark:hover:bg-[#233d28] rounded-lg transition-colors text-sm font-bold text-red-600 dark:text-red-400"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
