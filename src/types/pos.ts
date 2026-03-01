import { Product } from "./index"; // Your existing Product type

export type TypeFilter = "ALL" | "DRINK" | "FOOD";
export type NameFilter = "ALL" | string;

export interface Filters {
  type: TypeFilter;
  name: NameFilter;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

// export interface CategoryFilterProps {
//   currentFilter: CategoryFilter;
//   onFilterChange: (filter: CategoryFilter) => void;
//   getCategoryCount: (type: CategoryFilter) => number;
// }

export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  hasItems: boolean;
  hasUnavailableItems: boolean;
  onCheckout: () => void;
}

export interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

// export interface ProductGridProps {
//   products: Product[];
//   categoryFilter: CategoryFilter;
//   onAddToCart: (product: Product) => void;
// }

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface HeaderProps {
  username: string;
  onLogout: () => void;
}