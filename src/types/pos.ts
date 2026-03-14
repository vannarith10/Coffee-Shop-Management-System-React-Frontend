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



export interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  // New props for Create & Confirm Order
  orderState: OrderState;
  onCreateOrder: () => void;
  onConfirmOrder: () => void;
  currentOrder: CreateOrder | null;
  orderError: string | null;
  isProcessing: boolean;
}



export interface CartSummaryProps {
  subtotal: number;
  total: number;
  itemCount: number;
  hasItems: boolean;
  hasUnavailableItems: boolean;
  onCheckout: () => void;
  // New props
  orderState: OrderState;
  onCreateOrder: () => void;
  onConfirmOrder: () => void;
  currentOrder: CreateOrder | null;
  orderError: string | null;
  isProcessing: boolean;
}


export type OrderState = | "CART" | "CREATING" | "CREATED" | "CONFIRMATION" | "CONFIRMING" | "CONFIRMED" | "CHECKOUT" | "COMPLETED";


export interface CreateOrder {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  note: string;
}


// =======================================================




export interface ProductCardProps {
  product: Product;
  onClick: () => void;
}




export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}





export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}




export interface HeaderProps {
  username: string;
  onLogout: () => void;
}