import React from 'react';
import { OrderStatus } from '../../types/order';

interface StatusBadgeProps {
  status: OrderStatus;
}

const styles: Record<OrderStatus, string> = {
  QUEUED: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
  PENDING: 'bg-amber-500/10 text-amber-500',
  PREPARING: 'bg-emerald-500/10 text-emerald-500',
  LATE: 'bg-red-500/10 text-red-500',
  DONE: 'bg-blue-500/10 text-blue-500',
};

const labels: Record<OrderStatus, string> = {
  QUEUED: 'Queued',
  PENDING: 'Pending',
  PREPARING: 'Preparing',
  LATE: 'Late',
  DONE: 'Completed',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${styles[status]}`}>
    {labels[status]}
  </span>
);