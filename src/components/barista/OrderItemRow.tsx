import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { OrderItem, OrderStatus } from '../../types/order';

interface OrderItemRowProps {
  item: OrderItem;
  orderStatus: OrderStatus;
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({ item, orderStatus }) => {
  const isCompleted = item.isCompleted || orderStatus === 'DONE';
  
  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
      isCompleted ? 'opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
    }`}>
      <ProductImage 
        src={item.image} 
        alt={item.name}
        isCompleted={isCompleted}
        orderStatus={orderStatus}
      />

      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shrink-0 ${
        isCompleted
          ? 'bg-slate-200 text-slate-500 border-slate-300'
          : orderStatus === 'PREPARING'
            ? 'bg-emerald-500 text-white border-emerald-600'
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-slate-300'
      }`}>
        {item.quantity}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm leading-tight truncate ${
          isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'
        }`}>
          {item.name}
        </p>
        <p className={`text-xs mt-0.5 ${
          isCompleted ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {isCompleted ? 'Completed' : 'In progress'}
        </p>
      </div>

      {isCompleted && (
        <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
      )}
    </div>
  );
};