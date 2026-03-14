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



// export interface Order {
//   id: string;
//   orderNumber: string;
//   status: OrderStatus;
//   notes: string;
//   createdAt: string;
//   items: OrderItem[];
// }


// export interface OrderItem {
//   id: string;
//   name: string;
//   imageUrl: string | null;
//   quantity: number;
// }


export type OrderUpdateEvent = {
  event: "new.order";
  payload: APIOrder;
}


export interface OrderItem {
  productId: string;
  quantity: number;
}


export interface CreateOrderRequest {
  paymentMethod: "QR" | "CASH";
  currency: "USD" | "KHR";
  note: string;
  items: OrderItem[];
}


export interface CreateOrderResponse {
  order_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  note: string;
  payment_method: string;
}

export interface ConfirmOrderResponse {
  status: string;
  message: string;
  orderId: string;
  orderStatus: string;
}

export interface CreatedOrder {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  note: string;
}

export type OrderFlowState = 
  | "CART"           // Shopping
  | "CHECKOUT"       // Place Order Modal open
  | "CREATING"       // Creating order API call
  | "CONFIRMATION"   // Confirmation screen open
  | "CONFIRMING"     // Confirming order API call
  | "COMPLETED";     // Order sent to barista