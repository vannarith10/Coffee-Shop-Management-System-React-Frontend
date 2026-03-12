//src/components/barista/OrderGrid.tsx
import React, { useState, useCallback } from 'react';
import { Order, OrderStatus } from '../../types/order';
import { OrderCard } from './OrderCard';
import { updateOrderStatus, OrderStatusUpdate } from '../../services/orderService';
import { toast } from 'sonner';
import { playSound } from '../../utils/sound';
import Masonry from 'react-masonry-css'


interface OrderGridProps {
  orders: Order[];
  onOrdersUpdate: (updater: (prev: Order[]) => Order[]) => void;
}

// Group orders by status for visual organization
const groupByStatus = (orders: Order[]) => {
  const groups: Record<OrderStatus, Order[]> = {
    QUEUED: [],
    PREPARING: [],
    DONE: [],
  };
  orders.forEach((order) => {
    groups[order.status].push(order);
  });
  return groups;
};


// Sort orders by createdAt (older first) - for acitive orders
const sortByDateAsc = (a: Order, b: Order) => {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
};

// Sort by newest first - for completed orders
const sortByDateDesc = (a: Order, b: Order) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}





export const OrderGrid: React.FC<OrderGridProps> = ({ orders, onOrdersUpdate }) => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: OrderStatusUpdate) => {
    // Prevent double-clicks
    if (updatingOrderId === orderId) return;

    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) {
      toast.error("Order not found");
      return;
    }
    
    const orderNum = currentOrder?.orderNumber;

    // Set loading state BEFORE the API call
    setUpdatingOrderId(orderId);

    try {
      // Call API first - wait for success response
      const response = await updateOrderStatus(orderId, newStatus);

      // ONLY update UI after successful Backend response
      onOrdersUpdate((prev) => {
        const order = prev.find(o => o.id === orderId);

        if (!order) return prev;

        return prev.map((o) => {
          if (o.id !== orderId) return o;
          
          return {
            ...o,
            status: newStatus as OrderStatus,
            items: newStatus === 'DONE' ? o.items.map((i) => ({...i, isComleted: true})) : o.items,
          };
        });
      });

      // Success feedback
      if (newStatus === 'PREPARING') {
        playSound('start');
        toast.success(`Order #${orderNum} started PREPARING!`);
      } else {
        playSound('complete');
        toast.success(`Order #${orderNum} DONE! 🎉`);
      }

      console.log('Status updated: ', response);

    } catch (error) {
      // On error: UI stays at current status (no optimistic update to revert)
      const message = error instanceof Error ? error.message : 'Failed to update status';
      toast.error(message);
      console.error('Failed to update status: ', error);

    } finally {
      // Always clear loading state
      setUpdatingOrderId(null);
    }

  }, [orders, onOrdersUpdate, updatingOrderId]);



  // Sort active orders by oldest first (FIFO)
  const sortedActiveOrders = [...orders].filter(o => o.status !== 'DONE').sort(sortByDateAsc);

  // Sort DONE orders by newest first (LIFO)
  const sortedDoneOrders = [...orders].filter(o => o.status === 'DONE').sort(sortByDateDesc);

  // Combine for grouping
  const sortedOrders = [...sortedActiveOrders , ...sortedDoneOrders];
  const grouped = groupByStatus(sortedOrders);


  const statusConfig: Record<OrderStatus, { label: string; color: string; emoji: string }> = {
    PREPARING: { label: 'Preparing', color: 'emerald', emoji: '⚡' },
    QUEUED: { label: 'Queued', color: 'slate', emoji: '📋' },
    DONE: { label: 'Completed', color: 'blue', emoji: '✅' },
  };


  const glassHeaderColors: Record<string, string> = {
    red: 'text-red-200',
    emerald: 'text-emerald-500',
    amber: 'text-amber-200',
    slate: 'text-slate-500',
    blue: 'text-blue-600',
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
    ${glassHeaderColors[color] || ''}
  `;

  const activeStatuses: OrderStatus[] = ['PREPARING', 'QUEUED'];
  const nonEmptyActiveStatuses = activeStatuses.filter((s) => grouped[s].length > 0);
  const hasActiveOrders = nonEmptyActiveStatuses.length > 0;


  // Responsive column breakpoints
  const breakpointColumns = {
    default: 6,
    1920: 5,  // 3xl
    1536: 4,  // 2xl  
    1280: 3,  // xl
    1024: 3,  // lg
    768: 2,   // md
    640: 1,   // sm
  };


  return (
    <div className="space-y-8 w-full">
      {hasActiveOrders ? (
        nonEmptyActiveStatuses.map((status) => {
          const items = grouped[status];
          const config = statusConfig[status];
          

          return (

            <section key={status} className="w-full">

              <h2 className={glassHeader(config.color)}>
                <span>{config.emoji}</span>
                <span>{config.label} ({items.length})</span>
              </h2>

              
              {/* Masonry Layout - Left to Right flow */}
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex w-auto -ml-6" // negative margin to offset gutter
                columnClassName="pl-6 bg-clip-padding" // gutter spacing
              >
                {items.map((order) => (
                  <div key={order.id} className="mb-6">
                    <OrderCard
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      isUpdating={updatingOrderId === order.id}
                    />
                  </div>
                ))}
              </Masonry>

            </section>


          );
        })
      ) : (
        <div className="text-center py-20 text-slate-500">
          <p className="text-2xl font-bold">No active orders</p>
        </div>
      )}


      {grouped.DONE.length > 0 && (

        <section className="opacity-60 hover:opacity-100 transition-opacity w-full">
          <h2 className={glassHeader('blue')}>
            <span>{statusConfig.DONE.emoji}</span>
            <span>{statusConfig.DONE.label} ({grouped.DONE.length})</span>
          </h2>


          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto -ml-6"
            columnClassName="pl-6 bg-clip-padding"
          >
            {grouped.DONE.map((order) => (
              <div key={order.id} className="mb-6">
                <OrderCard
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={updatingOrderId === order.id}
                />
              </div>
            ))}
          </Masonry>
        </section>


      )}
    </div>
  );

};