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

const FALLBACK_IMAGES: Record<string, string> = {
  'Espresso': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=100&h=100&fit=crop',
  'Coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
  'Latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop',
  'Tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
  'Strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&h=100&fit=crop',
  'default': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
};

export const getFallbackImage = (itemName: string): string => {
  const lowerName = itemName.toLowerCase();
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (lowerName.includes(key.toLowerCase())) {
      return url;
    }
  }
  return FALLBACK_IMAGES.default;
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