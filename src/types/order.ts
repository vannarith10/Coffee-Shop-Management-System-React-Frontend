export type OrderStatus = 'QUEUED' | 'PENDING' | 'PREPARING' | 'LATE' | 'DONE';

export interface APIOrderItem {
  name: string;
  image_url: string | null;
  quantity: number;
}

export interface APIOrder {
  order_id: string;
  order_number: string;
  status: OrderStatus;
  note: string;
  create_at: string;
  items: APIOrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  image: string | null;
  isCompleted?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  elapsedTime: string;
  items: OrderItem[];
  notes: string;
  createdAt: string;
  itemCount: number;
}