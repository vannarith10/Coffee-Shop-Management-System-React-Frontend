import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#0a0a0a] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      <p className="text-slate-500 font-medium">Loading orders...</p>
    </div>
  </div>
);