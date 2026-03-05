import React, { useState } from 'react';
import { Timer, MoreHorizontal, Loader2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { OrderItemRow } from './OrderItemRow';
import { Order, OrderStatus } from '../../types/order';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, newStatus: 'PREPARING' | 'DONE') => Promise<void>;
  isUpdating?: boolean;
}

const borderStyles: Record<OrderStatus, string> = {
  QUEUED: 'border-slate-200 dark:border-slate-800',
  PENDING: 'border-amber-500/30',
  PREPARING: 'border-emerald-500',
  LATE: 'border-red-500',
  DONE: 'border-blue-500/30',
};

const timerStyles: Record<OrderStatus, string> = {
  QUEUED: 'text-slate-400',
  PENDING: 'text-amber-500',
  PREPARING: 'text-emerald-500',
  LATE: 'text-red-500',
  DONE: 'text-blue-500',
};

const btnStyles: Record<OrderStatus, string> = {
  QUEUED: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-700/50',
  PENDING: 'bg-emerald-500/90 hover:bg-emerald-500 text-black shadow-md',
  PREPARING: 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20',
  LATE: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
  DONE: 'bg-blue-500/20 text-blue-600 cursor-not-allowed border-blue-500/30',
};

const btnText: Record<OrderStatus, string> = {
  QUEUED: 'Start Preparing',
  PENDING: 'Start Preparing',
  PREPARING: 'Mark Ready',
  LATE: 'Start Preparing',
  DONE: 'Completed',
};

const headerBgStyles: Record<OrderStatus, string> = {
  QUEUED: '',
  PENDING: 'bg-amber-500/5',
  PREPARING: 'bg-emerald-500/5',
  LATE: 'bg-red-500/5',
  DONE: 'bg-blue-500/5',
};

const noteTextStyles: Record<OrderStatus, string> = {
  QUEUED: 'text-slate-500',
  PENDING: 'text-amber-600',
  PREPARING: 'text-emerald-600',
  LATE: 'text-red-500',
  DONE: 'text-blue-600',
};

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onUpdateStatus,
  isUpdating = false 
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const isDone = order.status === 'DONE';
  const isLoading = isUpdating || localLoading;

  const handleClick = async () => {
    if (isDone || isLoading) return;

    const nextStatus: 'PREPARING' | 'DONE' = 
      order.status === 'PREPARING' ? 'DONE' : 'PREPARING';

    setLocalLoading(true);
    try {
      await onUpdateStatus(order.id, nextStatus);
    } catch (error) {
      // Error is handled by parent (toast shown), just stop loading
      console.error('Failed to update:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="break-inside-avoid mb-6">
      <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border-2 ${borderStyles[order.status]} shadow-xl overflow-hidden transition-all hover:scale-[1.01] ${isLoading ? 'opacity-70' : ''}`}>
        
        <div className={`p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start ${headerBgStyles[order.status]}`}>
          <div>
            <StatusBadge status={order.status} />
            <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">#{order.orderNumber}</h3>
            <p className="text-xs text-slate-500 mt-1">{order.itemCount} items</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${timerStyles[order.status]}`}>
              <Timer className="w-5 h-5" />
              <span className="text-xl font-bold tabular-nums">{order.elapsedTime}</span>
            </div>
            {order.status === 'QUEUED' && (
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-tighter">Elapsed</p>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-1 overflow-y-auto custom-scrollbar">
            {order.items.map((item) => (
              <OrderItemRow 
                key={item.id} 
                item={item} 
                orderStatus={order.status}
              />
            ))}
          </div>

          {order.notes && order.notes !== 'No notes provided for this order.' && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2">
                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 mt-0.5">
                  <MoreHorizontal className="w-3 h-3 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Order Notes</p>
                  <p className={`text-xs font-medium leading-relaxed ${noteTextStyles[order.status]}`}>
                    {order.notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
          <button 
            onClick={handleClick}
            disabled={isDone || isLoading}
            className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${btnStyles[order.status]}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {order.status === 'PREPARING' ? 'Finishing...' : 'Starting...'}
              </>
            ) : (
              btnText[order.status]
            )}
          </button>
        </div>
      </div>
    </div>
  );
};