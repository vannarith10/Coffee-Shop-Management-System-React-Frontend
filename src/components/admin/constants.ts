import { NavItem, TopProduct, LowStockItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "staff", label: "Staff", icon: "group" },
  { id: "inventory", label: "Inventory", icon: "inventory_2" },
  { id: "products", label: "Products", icon: "coffee_maker" },
  { id: "reports", label: "Reports", icon: "bar_chart" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const TOP_PRODUCTS: TopProduct[] = [
  { name: "Espresso Roast", units: 420, percentage: 84, color: "bg-[#14b83d]" },
  { name: "Oat Milk Latte", units: 315, percentage: 63, color: "bg-[#14b83d]" },
  { name: "Cold Brew Special", units: 240, percentage: 48, color: "bg-[#7c2d12]" },
  { name: "Butter Croissant", units: 188, percentage: 38, color: "bg-[#14b83d]" },
];

export const LOW_STOCK_ITEMS: LowStockItem[] = [
  { name: "Whole Milk 1L", category: "Dairy", stock: 12, status: "critical" },
  { name: "House Blend Beans (5kg)", category: "Coffee", stock: 2, status: "critical" },
  { name: "Paper Cups (Medium)", category: "Supplies", stock: 150, status: "low" },
  { name: "Oat Milk 1L", category: "Dairy Alternative", stock: 8, status: "low" },
];
