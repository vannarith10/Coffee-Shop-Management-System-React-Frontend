//src/types/order.ts


export const OrderStatus = {
  QUEUED: 'QUEUED',
  PREPARING: 'PREPARING',
  DONE: 'DONE',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];


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



export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  items: OrderItem[];
}


export interface OrderItem {
  id: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
}


export type OrderUpdateEvent = {
  event: "new.order";
  payload: APIOrder;
}