// Navigation item type
export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

// Formatted stat data for display
export type DisplayStat = {
  title: string;
  value: string;
  change: string;
  icon: string;
  rawValue: number;
  rawGrowth: number;
};

// Low stock item type
export type LowStockItem = {
  name: string;
  category: string;
  stock: number;
  status: "critical" | "low";
};

// Top product type
export type TopProduct = {
  name: string;
  units: number;
  percentage: number;
  color: string;
};
