//utils/orderHelpers.ts
import { APIOrder, Order, OrderStatus } from '../types/order';

export const calculateElapsedTime = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }
  return `00:${minutes.toString().padStart(2, '0')}`;
};



export const mapStatus = (apiStatus: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    'DONE': 'DONE',
    'PREPARING': 'PREPARING',
    'QUEUED': 'QUEUED',
    'QUEUEING': 'QUEUED',
  };
  return statusMap[apiStatus] || 'QUEUED';
};





export const transformOrder = (apiOrder: APIOrder): Order => {
  
  return {
    id: apiOrder.order_id,
    orderNumber: apiOrder.order_number,
    status: mapStatus(apiOrder.status),
    notes: apiOrder.note || 'No notes provided for this order.',
    createdAt: apiOrder.create_at,
    items: apiOrder.items.map((item, index) => ({
      id: `item-${index}-${item.name}`,
      name: item.name,
      imageUrl: item.image_url,
      quantity: item.quantity
    })),
  };
};