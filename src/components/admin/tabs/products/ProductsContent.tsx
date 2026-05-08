import React, { useState, useMemo, useEffect, useCallback } from 'react';
import UpdateStockModal from './UpdateStockModal';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { dashboardService, AllProductsResponse, ProductItem } from '../../../../services/adminDashboardService';

// ─── Types ───────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

type FilterType = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';

const filters: FilterType[] = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

// ─── Helpers ─────────────────────────────────────────────────────────

const statusBadgeClasses: Record<Product['status'], string> = {
  'In Stock': 'bg-[#14b83d33] text-[#50e161]',
  'Low Stock': 'bg-[#ff7189]/20 text-[#ff7189]',
  'Out of Stock': 'bg-[#ef44441a] text-[#f87171]',
};

const mapStockStatus = (status: string): Product['status'] => {
  switch (status) {
    case 'IN_STOCK': return 'In Stock';
    case 'LOW_STOCK': return 'Low Stock';
    case 'OUT_OF_STOCK': return 'Out of Stock';
    default: return 'In Stock';
  }
};

// ─── Component ───────────────────────────────────────────────────────

export default function ProductsContent() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchAllProducts = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let currentPage = 1;
      let totalPages = 1;
      const allFetchedProducts: Product[] = [];

      // Loop until all pages are fetched
      while (currentPage <= totalPages) {
        const response: AllProductsResponse = await dashboardService.getAllProducts(currentPage, 10);
        
        const mappedProducts: Product[] = response.product_items.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category_name,
          price: item.price,
          description: item.description || '',
          status: mapStockStatus(item.stock_status),
          image: item.image_url
        }));

        allFetchedProducts.push(...mappedProducts);
        
        // Update product list incrementally so user sees data appearing
        setProductList([...allFetchedProducts]);
        
        totalPages = response.pagination.total_pages;
        currentPage++;
      }

      // Update stats based on the full list
      const lowStock = allFetchedProducts.filter(p => p.status === 'Low Stock').length;
      const outOfStock = allFetchedProducts.filter(p => p.status === 'Out of Stock').length;
      setStats({
        total: allFetchedProducts.length,
        lowStock,
        outOfStock
      });

    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') return productList;
    return productList.filter((p) => p.status === activeFilter);
  }, [activeFilter, productList]);

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Main Content Wrapper - Removed Sidebar and h-screen constraint */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#112115] text-[#f6f8f6] h-full">
        {/* Header */}
        <header className="p-8 pb-4 shrink-0">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight text-[#f6f8f6]">
                Product Management
              </h2>
              <p className="text-[#bccbb6] text-base">
                Create and manage your coffee shop menu items.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#14b83d] text-white rounded-lg text-sm font-bold shadow-md hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-lg">add_box</span>
                <span>Add New Product</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="px-8 py-4 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#112115] border border-[#3d4a3b] p-6 rounded-xl flex items-center gap-4 shadow-sm transition-all hover:border-[#14b83d]/50">
              <div className="w-12 h-12 rounded-lg bg-[#14b83d]/10 flex items-center justify-center text-[#14b83d]">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider mb-1">
                  Total Products
                </p>
                <p className="text-3xl font-black text-[#f6f8f6]">{stats.total}</p>
              </div>
            </div>

            <div className="bg-[#112115] border border-[#3d4a3b] p-6 rounded-xl flex items-center gap-4 shadow-sm transition-all hover:border-[#ff7189]/50">
              <div className="w-12 h-12 rounded-lg bg-[#ff7189]/10 flex items-center justify-center text-[#ff7189]">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider mb-1">
                  Low Stock
                </p>
                <p className="text-3xl font-black text-[#f6f8f6]">{stats.lowStock}</p>
              </div>
            </div>

            <div className="bg-[#112115] border border-[#3d4a3b] p-6 rounded-xl flex items-center gap-4 shadow-sm transition-all hover:border-[#ef4444]/50">
              <div className="w-12 h-12 rounded-lg bg-[#ef4444]/20 flex items-center justify-center text-[#ef4444]">
                <span className="material-symbols-outlined">error_outline</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider mb-1">
                  Out of Stock
                </p>
                <p className="text-3xl font-black text-[#f6f8f6]">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="px-8 py-2 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={
                    'px-6 py-2 rounded-lg text-sm font-bold transition-all ' +
                    (isActive
                      ? 'bg-[#14b83d] text-white shadow-md hover:brightness-110'
                      : 'bg-[#1c3622] border border-[#3d4a3b] hover:border-[#14b83d] text-[#bccbb6]')
                  }
                >
                  {filter === 'All' ? 'All Products' : filter}
                </button>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 ml-4">
                <div className="w-4 h-4 border-2 border-[#14b83d] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-[#bccbb6] font-medium">Fetching more products...</span>
              </div>
            )}
          </div>
        </section>

        {/* Products Table */}
        <section className="px-8 py-4 flex-1 overflow-hidden flex flex-col mb-4">
          <div className="bg-[#112115] border border-[#3d4a3b] rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto relative no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-[#224128] text-xs uppercase text-[#bccbb6] tracking-wider font-bold shadow-sm">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-center">Price</th>
                    <th className="px-6 py-4 text-center">Stock Status</th>
                    <th className="px-6 py-4 text-center">Stock Action</th>
                    <th className="px-6 py-4 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3d4a3b]">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#1c3622] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#1c3622] shadow-sm"
                            src={product.image}
                          />
                          <span className="font-bold text-[#f6f8f6]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#bccbb6]">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-[#14b83d]">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ' +
                            statusBadgeClasses[product.status]
                          }
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setIsStockModalOpen(true)}
                          className="px-4 py-1.5 bg-[#14b83d] text-white text-xs font-bold rounded shadow-sm hover:brightness-110"
                        >
                          Update Stock
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#12551c] text-[#85c882] text-xs font-bold rounded shadow-sm hover:brightness-110 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-6 bg-gradient-to-t from-[#112115] to-transparent pointer-events-none sticky bottom-0" />
          </div>
        </section>
      </div>

      <UpdateStockModal 
        isOpen={isStockModalOpen} 
        onClose={() => setIsStockModalOpen(false)} 
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
      />
    </>
  );
}
