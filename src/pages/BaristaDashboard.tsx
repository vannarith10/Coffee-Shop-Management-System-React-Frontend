import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Toaster } from 'sonner';
import { logout } from '../services/authService';
import { useOrders } from '../hooks/useOrders';
import { Order, OrderStatus } from '../types/order';
import { Header } from '../components/barista/Header';
import { StatItem } from '../components/barista/StatItem';
import { EmptyState } from '../components/barista/EmptyState';
import { LoadingState } from '../components/barista/LoadingState';
import { ErrorState } from '../components/barista/ErrorState';
import { OrderGrid } from '../components/barista/OrderGrid';

type TabKey = 'all' | 'preparing' | 'done';

const getLastUpdatedText = (lastUpdated: Date): string => {
  const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 120) return '1m ago';
  return `${Math.floor(seconds / 60)}m ago`;
};

const filterOrders = (orders: Order[], activeTab: TabKey): Order[] => {
  switch (activeTab) {
    case 'all':
      return orders;
    case 'preparing':
      return orders.filter(o => o.status !== 'DONE');
    case 'done':
      return orders.filter(o => o.status === 'DONE');
    default:
      return orders;
  }
};

export default function BaristaScreen() {
  const { 
    orders, 
    loading, 
    error, 
    isSessionExpired, 
    lastUpdated, 
    loadOrders 
  } = useOrders();
  
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [currentTime, setCurrentTime] = useState<string>('09:42 AM');
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  // Sync local orders with fetched orders
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginRedirect = useCallback(() => {
    logout();
  }, []);

  const handleRetry = useCallback(() => {
    if (isSessionExpired) {
      handleLoginRedirect();
    } else {
      loadOrders();
    }
  }, [isSessionExpired, handleLoginRedirect, loadOrders]);

  // NEW: Handle orders update from OrderGrid (optimistic updates)
  const handleOrdersUpdate = useCallback((updater: (prev: Order[]) => Order[]) => {
    setLocalOrders(prev => updater(prev));
  }, []);

  const filteredOrders = filterOrders(localOrders, activeTab);
  const activeCount = localOrders.filter(o => o.status !== 'DONE').length;
  const completedToday = localOrders.filter(o => o.status === 'DONE').length;

  if (loading) return <LoadingState />;
  
  if (error) return (
    <ErrorState 
      error={error} 
      isSessionExpired={isSessionExpired} 
      onRetry={handleRetry} 
      onLoginRedirect={handleLoginRedirect} 
    />
  );

  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30">
      <Toaster position="top-right" richColors />
      
      <Header 
        currentTime={currentTime}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={activeCount}
      />

      <main className="max-w-[1440px] mx-auto p-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Preparation Queue</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>Updated {getLastUpdatedText(lastUpdated)}</span>
              <button 
                onClick={() => loadOrders(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                title="Refresh now"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search orders or items..." 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Order Grid */}
        {filteredOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <OrderGrid 
            orders={filteredOrders} 
            onOrdersUpdate={handleOrdersUpdate}
          />
        )}

        <footer className="mt-12 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-8 items-center justify-around shadow-sm">
          <StatItem label="Avg Prep Time" value="2m 45s" />
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
          <StatItem label="Completed Today" value={completedToday.toString()} />
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
          <StatItem label="Efficiency" value="94%" highlight />
        </footer>

      </main>
    </div>
  );
}