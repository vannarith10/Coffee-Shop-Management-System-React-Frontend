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

// Sort orders by createdAt (older first)
const sortByDateAsc = (a: Order, b: Order) => {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
};

// Helper to determine previous status for revert
const getPreviousStatus = (currentStatus: OrderStatus, attemptedStatus: 'PREPARING' | 'DONE'): OrderStatus => {
  if (attemptedStatus === 'DONE') return 'PREPARING';
  return 'QUEUED';
};

export const OrderGrid: React.FC<OrderGridProps> = ({ orders, onOrdersUpdate }) => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: OrderStatusUpdate) => {
    // ... keep existing logic exactly the same ...
    if (updatingOrderId) return;

    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) {
      toast.error("Order not found");
      return;
    }
    
    const currentStatus = currentOrder?.status ?? 'QUEUED';
    const orderNum = currentOrder?.orderNumber;
    
    setUpdatingOrderId(orderId);

    onOrdersUpdate((prev) => {
      const order = prev.find(o => o.id === orderId);
      if (!order) return prev;

      return prev.map((o) => {
        if (o.id !== orderId) return o;

        return {
          ...o,
          status: newStatus as OrderStatus,
          items: newStatus === 'DONE' ? o.items.map((i) => ({...i, isCompleted: true})) : o.items,
        };
      });
    });

    try {
      const response = await updateOrderStatus(orderId, newStatus);
      
      if (newStatus === 'PREPARING') {
        playSound('start');
        toast.success(`Order #${orderNum} started PREPARING!`);
      } else {
        playSound('complete');
        toast.success(`Order #${orderNum} DONE! 🎉`);
      }
      
      console.log('Status updated:', response);
    } catch (error) {
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
  }, [orders, onOrdersUpdate, updatingOrderId]);

  const sortedOrders = [...orders].sort(sortByDateAsc);
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


  // Masonry Layout using CSS Columns
  const masonryGrid = `
    columns-1 
    sm:columns-2 
    lg:columns-3 
    xl:columns-4 
    2xl:columns-5 
    3xl:columns-6 
    gap-6
    space-y-6
  `;

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

  // Prevent card from breaking across columns
  const masonryItem = "break-inside-avoid mb-6";


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
          <p className="text-xl">No active orders</p>
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




  // return (
  //   <div className="space-y-8 w-full">
  //     {hasActiveOrders ? (
  //       nonEmptyActiveStatuses.map((status) => {
  //         const items = grouped[status];
  //         const config = statusConfig[status];
          
  //         return (
  //           <section key={status} className="w-full">
  //             <h2 className={glassHeader(config.color)}>
  //               <span>{config.emoji}</span>
  //               <span>{config.label} ({items.length})</span>
  //             </h2>
              
  //             {/* Masonry Layout - CSS Columns */}
  //             <div className={masonryGrid}>
  //               {items.map((order) => (
  //                 <div key={order.id} className={masonryItem}>
  //                   <OrderCard
  //                     order={order}
  //                     onUpdateStatus={handleUpdateStatus}
  //                     isUpdating={updatingOrderId === order.id}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //           </section>
  //         );
  //       })
  //     ) : (
  //       <div className="text-center py-20 text-slate-500">
  //         <p className="text-xl">No active orders</p>
  //       </div>
  //     )}

  //     {grouped.DONE.length > 0 && (
  //       <section className="opacity-60 hover:opacity-100 transition-opacity w-full">
  //         <h2 className={glassHeader('blue')}>
  //           <span>{statusConfig.DONE.emoji}</span>
  //           <span>{statusConfig.DONE.label} ({grouped.DONE.length})</span>
  //         </h2>
  //         <div className={masonryGrid}>
  //           {grouped.DONE.map((order) => (
  //             <div key={order.id} className={masonryItem}>
  //               <OrderCard
  //                 order={order}
  //                 onUpdateStatus={handleUpdateStatus}
  //                 isUpdating={updatingOrderId === order.id}
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       </section>
  //     )}
  //   </div>
  // );




  // return (
  //   <div className="space-y-8 w-full">
  //     {hasActiveOrders ? (
  //       nonEmptyActiveStatuses.map((status) => {
  //         const items = grouped[status];
  //         const config = statusConfig[status];
          
  //         return (
  //           <section key={status} className="w-full">
  //             <h2 className={glassHeader(config.color)}>
  //               <span>{config.emoji}</span>
  //               <span>{config.label} ({items.length})</span>
  //             </h2>
              
  //             {/* Responsive Grid - Same pattern as ProductGrid */}
  //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
  //               {items.map((order) => (
  //                 <OrderCard
  //                   key={order.id}
  //                   order={order}
  //                   onUpdateStatus={handleUpdateStatus}
  //                   isUpdating={updatingOrderId === order.id}
  //                 />
  //               ))}
  //             </div>
  //           </section>
  //         );
  //       })
  //     ) : (
  //       <div className="text-center py-20 text-slate-500">
  //         <p className="text-xl">No active orders</p>
  //       </div>
  //     )}

  //     {grouped.DONE.length > 0 && (
  //       <section className="opacity-60 hover:opacity-100 transition-opacity w-full">
  //         <h2 className={glassHeader('blue')}>
  //           <span>{statusConfig.DONE.emoji}</span>
  //           <span>{statusConfig.DONE.label} ({grouped.DONE.length})</span>
  //         </h2>
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
  //           {grouped.DONE.map((order) => (
  //             <OrderCard
  //               key={order.id}
  //               order={order}
  //               onUpdateStatus={handleUpdateStatus}
  //               isUpdating={updatingOrderId === order.id}
  //             />
  //           ))}
  //         </div>
  //       </section>
  //     )}
  //   </div>
  // );
};