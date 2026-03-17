//src/sevices/orderService.ts
import { authFetch, getAccessToken } from "./authService";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  ConfirmOrderResponse,
  CreatedOrder,
} from "../types/order";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


export type OrderStatusUpdate = "DONE" | "PREPARING";


export interface StatusUpdateResponse {
  order_id: string;
  old_status: string;
  new_status: string;
}


export interface UpdateOrderStatusRequest {
  status: OrderStatusUpdate;
}


export class OrderError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "OrderError";
  }
}



const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};



// =======================
// CASHIER Create Order
// =======================
export const createOrder = async (
  request: CreateOrderRequest,
): Promise<CreatedOrder> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/order/create-order`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorDate = await response.json().catch(() => ({}));
    throw new OrderError(
      errorDate.message || `Failed to create order: ${response.status}`,
      response.status,
    );
  }

  const data: CreateOrderResponse = await response.json();

  return {
    orderId: data.order_id,
    orderNumber: data.order_number,
    totalAmount: data.total_amount,
    paymentMethod: data.payment_method,
    note: data.note,
  };
};



// ========================
// CASHIER Confirm Order
// ========================
export const confirmOrder = async (
  orderId: string,
): Promise<ConfirmOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/confirm`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new OrderError(
      errorData.message || `Failed to confirm order: ${response.status}`,
      response.status,
    );
  }

  return response.json();
};




// ============================
// BARISTA Update Order Status
// ============================
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatusUpdate,
): Promise<StatusUpdateResponse> {
  const response = await authFetch(
    `${API_BASE_URL}/api/v1/order/${orderId}/update-status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("SESSION_EXPIRED");
    }
    if (response.status === 403) {
      throw new Error("FORBIDDEN");
    }
    if (response.status === 404) {
      throw new Error("ORDER_NOT_FOUND");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update status: ${response.statusText}`,
    );
  }

  return response.json();
}
