// Formatted stat data for the KPI cards
export type DisplayStat = {
  title: string;
  value: string;
  change: string;
  icon: string;
  rawValue: number;
  rawGrowth: number;
};

// Low stock alert item (legacy mock shape - no longer used)
export type LowStockItem = {
  name: string;
  category: string;
  stock: number;
  status: 'critical' | 'low';
};

// Product stock status from the API
export type ProductStock = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export type ProductStatusItem = {
  id: string;
  name: string;
  category_name: string;
  category_type: string;
  status: ProductStock;
};

export type ProductsStatusesPagination = {
  page: number;
  size: number;
  total_pages: number;
  total_items: number;
};

export type ProductsStatusesResponse = {
  message: string;
  pagination: ProductsStatusesPagination;
  products: ProductStatusItem[];
};

// Top-selling product bar chart item (local display shape)
export type TopProduct = {
  name: string;
  units: number;
  percentage: number;
  color: string;
};

// Range filter options for the top-selling products API
export type TopProductsRange = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR' | 'ALL';

// Single product from the API response
export type TopProductAPI = {
  product_id: string;
  product_name: string;
  image_url: string;
  units_sold: number;
};

// Full API response shape
export type TopSellingProductsResponse = {
  units_target: number;
  top_products: TopProductAPI[];
};
