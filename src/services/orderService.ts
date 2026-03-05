import { authFetch } from './authService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export type OrderStatusUpdate = 'DONE' | 'PREPARING';

export interface StatusUpdateResponse {
  order_id: string;
  old_status: string;
  new_status: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatusUpdate;
}

/**
 * Update order status via API
 */
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatusUpdate
): Promise<StatusUpdateResponse> {
  const response = await authFetch(
    `${API_BASE_URL}/order/${orderId}/update-status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('SESSION_EXPIRED');
    }
    if (response.status === 403) {
      throw new Error('FORBIDDEN');
    }
    if (response.status === 404) {
      throw new Error('ORDER_NOT_FOUND');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update status: ${response.statusText}`);
  }

  return response.json();
}