//src/pages/BaristaDashboard.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
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
import { PerformanceMetricsPayload } from '@/types/metrics';

type TabKey = 'all' | 'preparing' | 'done';


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

  
    // Working on footer data that I just completed at the backend side
    // Performance Metrics
    const [metrics, setMetrics] = useState<{
    avgPrepTime: string | null;
    completedToday: number | null;
    efficiencyPercentage: number | null;
  }>({
    avgPrepTime: null,
    completedToday: null,
    efficiencyPercentage: null
  });

  const handleMetricsUpdate = useCallback((payload: PerformanceMetricsPayload) => {
    const avg = payload.avg_prep_time ?? null;
    setMetrics({
      avgPrepTime: avg,
      completedToday: typeof payload.completed_today === 'number' ? payload.completed_today : null,
      efficiencyPercentage: typeof payload.efficiency_percentage === 'number' ? payload.efficiency_percentage : null,
    });
  }, []);



  const { 
    orders: apiOrders, 
    loading, 
    error, 
    isSessionExpired, 
    lastUpdated, 
    loadOrders, 
    updateOrders
  } = useOrders({onMetricsUpdate: handleMetricsUpdate});

  
  const [activeTab, setActiveTab] = useState<TabKey>('all');
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
  // const completedToday = displayOrders.filter(o => o.status === 'DONE').length;


  // Footer display values
  const footerAvgPrep = metrics.avgPrepTime ?? '_';
  const footerCompleted = metrics.completedToday ?? '_';
  const footerEfficiency = metrics.efficiencyPercentage != null ? `${metrics.efficiencyPercentage}%` : '_';



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


  <footer className="fixed bottom-0 left-0 right-0 z-50 p-6">
    <div className="max-w-360 mx-auto flex justify-center">
      <div className="
        relative flex items-center justify-around flex-wrap gap-8
        w-1/2 min-w-fit rounded-xl overflow-hidden
        font-semibold text-white
        cursor-pointer
        transition-all duration-[400ms]
        ease
        shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]
        hover:shadow-[0_8px_12px_rgba(0,0,0,0.3),0_0_30px_rgba(255,255,255,0.1)]
      ">
        
        {/* Glass Filter Layer */}
        <div 
          className="absolute inset-0 z-0 backdrop-blur-0"
          style={{ filter: 'url(#lg-dist)', isolation: 'isolate' }}
        />
        
        {/* Glass Overlay Layer */}
        <div 
          className="absolute inset-0 z-[1] backdrop-blur-md"
          style={{ background: 'rgba(255, 255, 255, 0.25)' }}
        />
        
        {/* Glass Specular Layer */}
        <div 
          className="absolute inset-0 z-[2] rounded-[inherit] overflow-hidden"
          style={{ 
            boxShadow: 'inset 1px 1px 0 rgba(255, 255, 255, 0.75), inset 0 0 5px rgba(255, 255, 255, 0.75)'
          }}
        />
        
        {/* Content Layer */}
        <div className="relative z-[3] flex items-center gap-5 px-6 py-4 flex-1 justify-between">
          <StatItem label="Avg Prep Time" value={footerAvgPrep} />
          
          <div 
            className="h-10 w-px hidden md:block" 
            style={{ background: 'rgba(255, 255, 255, 0.3)' }}
          />
          
          <StatItem label="Completed Today" value={footerCompleted.toString()} />
          
          <div 
            className="h-10 w-px hidden md:block" 
            style={{ background: 'rgba(255, 255, 255, 0.3)' }}
          />
          
          <StatItem label="Efficiency" value={footerEfficiency} highlight />
        </div>
        
        {/* SVG Filter */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      </div>
    </div>
 </footer>

</div>
  );
}