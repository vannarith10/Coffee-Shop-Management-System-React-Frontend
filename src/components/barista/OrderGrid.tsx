import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../../types/order';
import { OrderCard } from './OrderCard';
import { updateOrderStatus, OrderStatusUpdate } from '../../services/orderService';
import { toast } from 'sonner';
import { playSound } from '../../utils/sound';

interface OrderGridProps {
  orders: Order[];
  onOrdersUpdate: (updater: (prev: Order[]) => Order[]) => void;
}

// Group orders by status for visual organization
const groupByStatus = (orders: Order[]) => {
  const groups: Record<OrderStatus, Order[]> = {
    QUEUED: [],
    PENDING: [],
    PREPARING: [],
    LATE: [],
    DONE: [],
  };

  orders.forEach((order) => {
    groups[order.status].push(order);
  });

  return groups;
};

// Sort orders by createdAt (older first)
const sortByDateAsc = (a: Order, b: Order) => {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
};

// Helper to determine next status based on current status
const getNextStatus = (currentStatus: OrderStatus): 'PREPARING' | 'DONE' => {
  if (currentStatus === 'PREPARING') return 'DONE';
  return 'PREPARING';
};

// Helper to determine previous status for revert
const getPreviousStatus = (currentStatus: OrderStatus, attemptedStatus: 'PREPARING' | 'DONE'): OrderStatus => {
  if (attemptedStatus === 'DONE') return 'PREPARING';
  return 'QUEUED';
};

export const OrderGrid: React.FC<OrderGridProps> = ({ orders, onOrdersUpdate }) => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  // Track previous orders to detect new ones
  const prevOrdersRef = useRef<Order[]>([]);
  const hasInitializedRef = useRef(false);

  // 🔔 Detect new orders and play sound
  useEffect(() => {
    // Skip on first render (initial load)
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      prevOrdersRef.current = orders;
      return;
    }

    // Find new orders (exist in current but not in previous)
    const currentIds = new Set(orders.map(o => o.id));
    const prevIds = new Set(prevOrdersRef.current.map(o => o.id));
    
    const newOrders = orders.filter(o => !prevIds.has(o.id));
    
    // Play sound and toast for each new order
    newOrders.forEach(order => {
      playSound('new-order');
      toast.info(`New order #${order.orderNumber} arrived!`, {
        icon: '🔔',
        duration: 5000,
      });
    });

    // Update ref for next comparison
    prevOrdersRef.current = orders;
  }, [orders]);

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: OrderStatusUpdate) => {
    setUpdatingOrderId(orderId);

    const currentOrder = orders.find(o => o.id === orderId);
    const currentStatus = currentOrder?.status ?? 'QUEUED';

    // Optimistic update
    onOrdersUpdate((prev) => prev.map((order) => {
      if (order.id !== orderId) return order;
      
      const nextStatus = newStatus as OrderStatus;
      return {
        ...order,
        status: nextStatus,
        items: nextStatus === 'DONE' 
          ? order.items.map((i) => ({ ...i, isCompleted: true }))
          : order.items,
      };
    }));

    try {
      const response = await updateOrderStatus(orderId, newStatus);
      
      const orderNum = orders.find(o => o.id === orderId)?.orderNumber;
      
      if (newStatus === 'PREPARING') {
        playSound('start');
        toast.success(`Order #${orderNum} started preparing!`);
      } else {
        playSound('complete');
        toast.success(`Order #${orderNum} completed! 🎉`);
      }
      
      console.log('Status updated:', response);
    } catch (error) {
      // Revert on error
      const revertedStatus = getPreviousStatus(currentStatus, newStatus);
      
      onOrdersUpdate((prev) => prev.map((order) => {
        if (order.id !== orderId) return order;
        
        return {
          ...order,
          status: revertedStatus,
          items: revertedStatus === 'DONE' 
            ? order.items.map((i) => ({ ...i, isCompleted: true }))
            : order.items.map((i) => ({ ...i, isCompleted: false })),
        };
      }));

      const message = error instanceof Error ? error.message : 'Failed to update';
      toast.error(message);
      console.error('Failed to update status:', error);
      throw error;
    } finally {
      setUpdatingOrderId(null);
    }
  }, [orders, onOrdersUpdate]);

  // Sort all orders by date (oldest first)
  const sortedOrders = [...orders].sort(sortByDateAsc);
  const grouped = groupByStatus(sortedOrders);

  const statusConfig: Record<OrderStatus, { label: string; color: string; emoji: string }> = {
    LATE: { label: 'Late Orders', color: 'red', emoji: '🔥' },
    PREPARING: { label: 'Preparing', color: 'emerald', emoji: '⚡' },
    PENDING: { label: 'Pending', color: 'amber', emoji: '⏳' },
    QUEUED: { label: 'Queued', color: 'slate', emoji: '📋' },
    DONE: { label: 'Completed', color: 'blue', emoji: '✅' },
  };

  const glassHeader = (color: string) => `
    text-lg font-bold mb-4 
    inline-flex items-center justify-center gap-2
    p-2 px-4
    rounded-[14px]
    backdrop-blur-md
    bg-gradient-to-br from-white/20 via-white/[0.08] to-white/[0.03]
    shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
    active:scale-95
    ${color === 'red' ? 'text-red-200' : ''}
    ${color === 'emerald' ? 'text-emerald-200' : ''}
    ${color === 'amber' ? 'text-amber-200' : ''}
    ${color === 'slate' ? 'text-slate-200' : ''}
    ${color === 'blue' ? 'text-blue-200' : ''}
  `;

  const activeStatuses: OrderStatus[] = ['LATE', 'PREPARING', 'PENDING', 'QUEUED'];
  const hasActiveOrders = activeStatuses.some((s) => grouped[s].length > 0);

  return (
    <div className="space-y-8">
      {hasActiveOrders ? (
        activeStatuses.map((status) => {
          const items = grouped[status];
          if (items.length === 0) return null;
          
          const config = statusConfig[status];
          
          return (
            <section key={status}>
              <h2 className={glassHeader(config.color)}>
                <span>{config.emoji}</span>
                <span>{config.label} ({items.length})</span>
              </h2>
              
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 justify-start place-content-start">
                {items.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    isUpdating={updatingOrderId === order.id}
                  />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl">No active orders</p>
        </div>
      )}

      {grouped.DONE.length > 0 && (
        <section className="opacity-60 hover:opacity-100 transition-opacity">
          <h2 className={glassHeader('blue')}>
            <span>{statusConfig.DONE.emoji}</span>
            <span>{statusConfig.DONE.label} ({grouped.DONE.length})</span>
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 justify-start place-content-start">
            {grouped.DONE.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updatingOrderId === order.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};