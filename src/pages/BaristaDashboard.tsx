//src/pages/BaristaDashboard.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Toaster } from 'sonner';
import { logout } from '../services/authService';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';
import { Header } from '../components/barista/Header';
import { StatItem } from '../components/barista/StatItem';
import { EmptyState } from '../components/barista/EmptyState';
import { LoadingState } from '../components/barista/LoadingState';
import { ErrorState } from '../components/barista/ErrorState';
import { OrderGrid } from '../components/barista/OrderGrid';
import {playSound} from '../utils/sound';
import { useNavigate } from 'react-router-dom';

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
    orders: apiOrders, 
    loading, 
    error, 
    isSessionExpired, 
    lastUpdated, 
    loadOrders, 
    updateOrders
  } = useOrders();

  
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [currentTime, setCurrentTime] = useState<string>('09:42 AM');
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const prevOrdersLength = useRef<number>(0);
  const navigate = useNavigate();

  
  // Sync local orders with fetched orders
  useEffect(() => {
    setDisplayOrders(apiOrders);
  }, [apiOrders]);



  // New Order detection - play sound only when orders increase
  useEffect(() => {
    if (displayOrders.length === 0) {
      prevOrdersLength.current = 0;
      return;
    }
      // Only play sound if Orders increase (New Order added via WebSocket)
    if (displayOrders.length > prevOrdersLength.current) {
      const latest = displayOrders[displayOrders.length - 1];
      if (latest.status !== "DONE") {
        playSound("new-order");
      }
    }
    prevOrdersLength.current = displayOrders.length;
  }, [displayOrders]);



  const handleLoginRedirect = useCallback(() => {
    logout();
  }, []);



  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [navigate]);



  const handleRetry = useCallback(() => {
    if (isSessionExpired) {
      handleLoginRedirect();
    } else {
      loadOrders();
    }
  }, [isSessionExpired, handleLoginRedirect, loadOrders]);



  // Handle optimistic updates from OrderGrid
  const handleOrdersUpdate = useCallback((updater: (prev: Order[]) => Order[]) => {
    setDisplayOrders(prev => updater(prev));
  }, []);



  const filteredOrders = filterOrders(displayOrders, activeTab);
  const activeCount = displayOrders.filter(o => o.status !== 'DONE').length;
  const completedToday = displayOrders.filter(o => o.status === 'DONE').length;



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
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 flex flex-col">
  <Toaster position="top-center" richColors />
  
  {/* Header */}
  <Header 
    currentTime={currentTime}
    activeTab={activeTab}
    onTabChange={setActiveTab}
    activeCount={activeCount}
    handleLogout={handleLogout}
  />

  {/* Main Content */}
  <main className="flex-1 w-full mx-auto p-6">
    
    {/* Page Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Preparation Queue</h2>
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
  </main>

  {/* Footer */}
  <footer className="max-w-360 w-full mx-auto p-6">
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-8 items-center justify-around shadow-sm">
      <StatItem label="Avg Prep Time" value="2m 45s" />
      <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
      <StatItem label="Completed Today" value={completedToday.toString()} />
      <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
      <StatItem label="Efficiency" value="82%" highlight />
    </div>
  </footer>
</div>
  );
}