import React from 'react';
import { Package } from 'lucide-react';

export const EmptyState: React.FC = () => (
  <div className="text-center py-20">
    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
    <h3 className="text-lg font-bold text-slate-500">No orders found</h3>
    <p className="text-slate-400">Check back later or adjust your filters</p>
  </div>
);