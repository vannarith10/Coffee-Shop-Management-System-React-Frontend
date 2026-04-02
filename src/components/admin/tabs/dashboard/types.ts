// Formatted stat data for the KPI cards
export type DisplayStat = {
  title: string;
  value: string;
  change: string;
  icon: string;
  rawValue: number;
  rawGrowth: number;
};

// Low stock alert item
export type LowStockItem = {
  name: string;
  category: string;
  stock: number;
  status: 'critical' | 'low';
};

// Top-selling product bar chart item
export type TopProduct = {
  name: string;
  units: number;
  percentage: number;
  color: string;
};
