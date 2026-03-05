import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Clock, 
  Search, 
  Timer, 
  AlertCircle, 
  CheckCircle2,
  MoreHorizontal,
  Package,
  Loader2,
  RefreshCw,
  ImageOff,
  LogOut
} from 'lucide-react';
import { 
  getAccessToken, 
  getRefreshToken, 
  isRefreshTokenExpired, 
  clearAuth,
  logout,
  refreshAccessToken,
  authFetch
} from '../services/authService';

// --- Types ---

type OrderStatus = 'QUEUED' | 'PENDING' | 'PREPARING' | 'LATE' | 'DONE';

interface APIOrderItem {
  name: string;
  image_url: string | null;
  quantity: number;
}

interface APIOrder {
  order_id: string;
  order_number: string;
  status: OrderStatus;
  note: string;
  create_at: string;
  items: APIOrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  image: string | null;
  isCompleted?: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  elapsedTime: string;
  items: OrderItem[];
  notes: string;
  createdAt: string;
  itemCount: number;
}

// --- API Service ---

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Use centralized authFetch from authService
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const response = await authFetch(url, options);
  
  // Handle session expiration from authFetch
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  
  return response;
};

const fetchOrders = async (): Promise<APIOrder[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/order/get-orders`);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('SESSION_EXPIRED');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
};

// --- Utilities ---

const calculateElapsedTime = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }
  return `00:${minutes.toString().padStart(2, '0')}`;
};

const mapStatus = (apiStatus: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    'DONE': 'DONE',
    'PENDING': 'PENDING',
    'PREPARING': 'PREPARING',
    'QUEUED': 'QUEUED',
    'QUEUEING': 'QUEUED',
    'LATE': 'LATE',
  };
  return statusMap[apiStatus] || 'QUEUED';
};

const FALLBACK_IMAGES: Record<string, string> = {
  'Espresso': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=100&h=100&fit=crop ',
  'Coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop ',
  'Latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop ',
  'Tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop ',
  'Strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&h=100&fit=crop ',
  'default': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop ',
};

const getFallbackImage = (itemName: string): string => {
  const lowerName = itemName.toLowerCase();
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (lowerName.includes(key.toLowerCase())) {
      return url;
    }
  }
  return FALLBACK_IMAGES.default;
};

const transformOrder = (apiOrder: APIOrder): Order => {
  const totalItems = apiOrder.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    id: apiOrder.order_id,
    orderNumber: apiOrder.order_number,
    status: mapStatus(apiOrder.status),
    elapsedTime: calculateElapsedTime(apiOrder.create_at),
    notes: apiOrder.note || 'No notes provided for this order.',
    createdAt: apiOrder.create_at,
    itemCount: totalItems,
    items: apiOrder.items.map((item, index) => ({
      id: `${apiOrder.order_id}-${index}`,
      name: item.name,
      quantity: item.quantity,
      image: item.image_url,
      isCompleted: apiOrder.status === 'DONE',
    })),
  };
};

// --- Components ---

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles = {
    QUEUED: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
    PENDING: 'bg-amber-500/10 text-amber-500',
    PREPARING: 'bg-emerald-500/10 text-emerald-500',
    LATE: 'bg-red-500/10 text-red-500',
    DONE: 'bg-blue-500/10 text-blue-500',
  };

  const labels = {
    QUEUED: 'Queued',
    PENDING: 'Pending',
    PREPARING: 'Preparing',
    LATE: 'Late',
    DONE: 'Completed',
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const ProductImage = ({ 
  src, 
  alt, 
  isCompleted, 
  orderStatus 
}: { 
  src: string | null; 
  alt: string; 
  isCompleted: boolean;
  orderStatus: OrderStatus;
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || getFallbackImage(alt));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || getFallbackImage(alt));
    setHasError(false);
  }, [src, alt]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(getFallbackImage(alt));
      setHasError(true);
    }
  };

  return (
    <div className="relative shrink-0">
      <img 
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`w-12 h-12 rounded-lg object-cover border-2 transition-all ${
          isCompleted 
            ? 'border-slate-200 dark:border-slate-700 grayscale' 
            : orderStatus === 'PREPARING' 
              ? 'border-emerald-500/30' 
              : 'border-slate-200 dark:border-slate-700'
        }`}
      />
      {!src && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
          <ImageOff className="w-5 h-5 text-slate-400" />
        </div>
      )}
    </div>
  );
};

const OrderItemRow = ({ item, orderStatus }: { item: OrderItem; orderStatus: OrderStatus }) => {
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

const OrderCard = ({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (id: string) => void }) => {
  const borderStyles = {
    QUEUED: 'border-slate-200 dark:border-slate-800',
    PENDING: 'border-amber-500/30',
    PREPARING: 'border-emerald-500',
    LATE: 'border-red-500',
    DONE: 'border-blue-500/30',
  };

  const timerStyles = {
    QUEUED: 'text-slate-400',
    PENDING: 'text-amber-500',
    PREPARING: 'text-emerald-500',
    LATE: 'text-red-500',
    DONE: 'text-blue-500',
  };

  const btnStyles = {
    QUEUED: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-700/50',
    PENDING: 'bg-emerald-500/90 hover:bg-emerald-500 text-black shadow-md',
    PREPARING: 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20',
    LATE: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
    DONE: 'bg-blue-500/20 text-blue-600 cursor-not-allowed border-blue-500/30',
  };

  const btnText = {
    QUEUED: 'Start Preparing',
    PENDING: 'Start Preparing',
    PREPARING: 'Mark Ready',
    LATE: 'Start Preparing',
    DONE: 'Completed',
  };

  const isDone = order.status === 'DONE';

  return (
    <div className="masonry-item">
      <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border-2 ${borderStyles[order.status]} shadow-xl overflow-hidden transition-all hover:scale-[1.01]`}>
        
        <div className={`p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start ${
          order.status === 'PREPARING' ? 'bg-emerald-500/5' : 
          order.status === 'LATE' ? 'bg-red-500/5' : 
          order.status === 'PENDING' ? 'bg-amber-500/5' :
          order.status === 'DONE' ? 'bg-blue-500/5' : ''
        }`}>
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
          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
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
                  <p className={`text-xs font-medium leading-relaxed ${
                    order.status === 'PENDING' ? 'text-amber-600' : 
                    order.status === 'PREPARING' ? 'text-emerald-600' : 
                    order.status === 'LATE' ? 'text-red-500' : 
                    order.status === 'DONE' ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                    {order.notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
          <button 
            onClick={() => !isDone && onUpdateStatus(order.id)}
            disabled={isDone}
            className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all border ${btnStyles[order.status]}`}
          >
            {btnText[order.status]}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex flex-col items-center">
    <span className={`text-xs font-bold uppercase tracking-widest ${highlight ? 'text-emerald-500/60' : 'text-slate-500'}`}>
      {label}
    </span>
    <span className={`text-2xl font-black mt-1 ${highlight ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
      {value}
    </span>
  </div>
);

// --- Main Screen ---

export default function BaristaScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'preparing' | 'done'>('all');
  const [currentTime, setCurrentTime] = useState<string>('09:42 AM');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Check auth on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token || isRefreshTokenExpired()) {
      setIsSessionExpired(true);
      setError('Your session has expired. Please login again.');
      setLoading(false);
      return;
    }
    
    loadOrders();
    
    const interval = setInterval(() => {
      loadOrders(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const loadOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    setIsSessionExpired(false);
    
    try {
      const apiOrders = await fetchOrders();
      const transformedOrders = apiOrders.map(transformOrder);
      setOrders(transformedOrders);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      
      if (errorMessage === 'SESSION_EXPIRED') {
        setIsSessionExpired(true);
        setError('Your session has expired. Please login again.');
      } else {
        setError(errorMessage);
      }
      
      console.error('Error fetching orders:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    logout(); // This clears auth and redirects to /login
  };

  const handleRetry = () => {
    if (isSessionExpired) {
      handleLoginRedirect();
    } else {
      loadOrders();
    }
  };

  const handleUpdateStatus = async (id: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        if (order.status === 'QUEUED' || order.status === 'PENDING' || order.status === 'LATE') {
          return { ...order, status: 'PREPARING' };
        } else if (order.status === 'PREPARING') {
          return { ...order, status: 'DONE', items: order.items.map(i => ({ ...i, isCompleted: true })) };
        }
      }
      return order;
    }));
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'all') return true;
    if (activeTab === 'preparing') return o.status === 'PREPARING' || o.status === 'QUEUED' || o.status === 'PENDING' || o.status === 'LATE';
    if (activeTab === 'done') return o.status === 'DONE';
    return true;
  });

  const activeCount = orders.filter(o => o.status !== 'DONE').length;
  const completedToday = orders.filter(o => o.status === 'DONE').length;

  const getLastUpdatedText = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 120) return '1m ago';
    return `${Math.floor(seconds / 60)}m ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isSessionExpired ? 'text-amber-500' : 'text-red-500'}`} />
          <h2 className="text-xl font-bold mb-2">
            {isSessionExpired ? 'Session Expired' : 'Failed to Load Orders'}
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleRetry}
              className={`w-full font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                isSessionExpired 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-black'
              }`}
            >
              {isSessionExpired ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Login Again
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </>
              )}
            </button>
            
            {!isSessionExpired && (
              <button 
                onClick={handleLoginRedirect}
                className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-xl transition-colors"
              >
                Logout & Login Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30">
      
      <style>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .masonry-grid { column-count: 2; }
        }
        @media (min-width: 1024px) {
          .masonry-grid { column-count: 3; }
        }
        @media (min-width: 1440px) {
          .masonry-grid { column-count: 4; }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 20px;
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-[#f6f8f6]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg text-black">
                <Coffee className="w-6 h-6 block" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">BARISTA KDS</h1>
            </div>
            <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium tabular-nums">{currentTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'preparing', label: 'Active' },
                { key: 'done', label: 'Completed' }
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                
                return (
                  <button 
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-500 text-sm font-bold tracking-wide">{activeCount} ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Preparation Queue</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>Updated {getLastUpdatedText()}</span>
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-500">No orders found</h3>
            <p className="text-slate-400">Check back later or adjust your filters</p>
          </div>
        )}

        <div className="masonry-grid">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>

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