//src/components/barista/OrderCard.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { OrderItemRow } from './OrderItemRow';
import { Order, OrderStatus } from '../../types/order';
import { OrderStatusUpdate } from '../../services/orderService';


interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, newStatus: OrderStatusUpdate) => Promise<void>;
  isUpdating?: boolean;
}

// --- Style Templates (Easy to modify!) ---
const cardStyles = (status: OrderStatus, isLoading: boolean) => `
  break-inside-avoid mb-6 shrink-0
  flex flex-col bg-white dark:bg-slate-900 
  rounded-2xl border-2 shadow-xl overflow-hidden 
  transition-all hover:scale-[1.01]
  ${isLoading ? 'opacity-70' : ''}
  ${{
    QUEUED: 'border-slate-200 dark:border-slate-800',
    PREPARING: 'border-emerald-500',
    DONE: 'border-blue-500/30',
  }[status]}
`;


const headerStyles = (status: OrderStatus) => `
  p-5 border-b border-slate-100 dark:border-slate-800 
  flex justify-between items-start
  ${{
    QUEUED: '',
    PREPARING: 'bg-emerald-500/5',
    DONE: 'bg-blue-500/5',
  }[status]}
`;


const btnStyles = (status: OrderStatus, isLoading: boolean) => `
  w-full h-20 cursor-pointer py-3.5 rounded-xl 
  font-black text-sm uppercase tracking-wider 
  transition-all border flex items-center justify-center gap-2
  ${isLoading ? 'cursor-wait' : ''}
  ${{
    QUEUED: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-700/50',
    PREPARING: 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20',
    DONE: 'hidden', // Hide button when done
  }[status]}
`;


const noteStyles = (status: OrderStatus) => ({
  QUEUED: 'text-slate-500',
  PREPARING: 'text-emerald-600',
  DONE: 'text-blue-600',
}[status]);


const btnText: Record<OrderStatus, string> = {
  QUEUED: 'Start Preparing',
  PREPARING: 'Mark Ready',
  DONE: '', // Not used since button is hidden
};


const loadingText: Record<Exclude<OrderStatus, 'DONE'>, string> = {
  QUEUED: 'Starting...',
  PREPARING: 'Finishing...',
};


// --- Helper Functions ---
const getNextStatus = (current: OrderStatus): 'PREPARING' | 'DONE' | null => {
  if (current === 'QUEUED') return 'PREPARING';
  if (current === 'PREPARING') return 'DONE';
  return null;
};


const formatDateDash = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


// --- Component ---
export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onUpdateStatus,
  isUpdating = false 
}) => {

  const isDone = order.status === 'DONE';


  const handleClick = async () => {
    if (isDone || isUpdating) return;
    
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    // Let parent handle Loading state and API call
    await onUpdateStatus(order.id, nextStatus);
  };


  return (
    <div className={cardStyles(order.status, isUpdating)}>
      
      {/* Header */}
      <div className={headerStyles(order.status)}>
        <div>
          <StatusBadge status={order.status} />
          <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
            #{order.orderNumber}
          </h3>
        </div>
        <div className="text-right">
          <h2 className="text-[14px] text-slate-500 mt-1 uppercase font-bold">
            <span className="text-green-600">Date<br/></span> 
            {formatDateDash(order.createdAt)}
          </h2>
        </div>
      </div>

      {/* Items & Notes */}
      <div className="p-4">
        <div className="space-y-1 overflow-y-auto custom-scrollbar">
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} orderStatus={order.status} />
          ))}
        </div>

        {order.notes && order.notes !== 'No notes provided for this order.' && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-2">
              <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-0.5">
                  Order Notes
                </p>
                <p className={`text-xs font-medium leading-relaxed ${noteStyles(order.status)}`}>
                  {order.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button (Only shows when not DONE) */}
      {!isDone && (
        <div className="p-4 bg-white dark:bg-slate-800/50">
          <button 
            onClick={handleClick}
            disabled={isUpdating}
            className={btnStyles(order.status, isUpdating)}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingText[order.status as Exclude<OrderStatus, 'DONE'>]}
              </>
            ) : (
              btnText[order.status]
            )}
          </button>
        </div>
      )}
      
    </div>
  );
};