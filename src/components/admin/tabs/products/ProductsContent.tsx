import React, { useState, useMemo } from 'react';
import UpdateStockModal from './UpdateStockModal';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

// ─── Types ───────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

type FilterType = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';

// ─── Data ────────────────────────────────────────────────────────────

const products: Product[] = [
  {
    id: 1,
    name: 'Espresso',
    category: 'COFFEE',
    price: 2.50,
    status: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSzwW0T-52_IqAheLtAOW87rqwZS9LVb6xnhDKYiD4tLzlos_ks0Da2OZidv-ANyOd_LSQYJ3AxNuSM3JPPokbfXxqmqulPG7-Bl-39tGVJz9byz47ngU37dmh6_SA5ajPT9iO_k5wCRPhj7_DL7RudQExaTc4j-r80XgpNm8-IIoxdxHIQSGMdJ5r2yW62VS86SGRai6Gb2miJzvPFzUKf0LlrvHT_-lyzz7lUtgFy5JyQ7L1leXaJyLFVh-PLZOJsN4uhg1P3DA',
  },
  {
    id: 2,
    name: 'Flat White',
    category: 'COFFEE',
    price: 3.75,
    status: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCONTQ6x_UV8T1-CdStbTjp-WiQwY9CDNBvpsL9QIgsQ8ujvPhwxQs_uIfkhaBivVjs1SdVbPF9Cu-E5LMzx7rU0c2ApaFjgnlMWH-wQQwjj797onjBlnqyl01YYC061EE3RP5xbIiMSU4DKXjSMOsU9keimiO2q1FJLl2ylgPrCdyGdwgFSb9zrSSJu6kCRAFjcoQia2vQWEhaTadcr3hGmweCW2FcbK56KzO71hlwB8cpm2wW9iUI1J7e9INoD9XP8v293sg3Yxs',
  },
  {
    id: 3,
    name: 'Iced Caramel Macchiato',
    category: 'COFFEE',
    price: 4.95,
    status: 'Low Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7HtW3YyaM7bddN8qfz-6PzgxxAOA0j2FvCsCvx66ny-w-ypHGHshnVjT6R2qAE2cyiFn1EOf-N3wsoVKjxFm-905-RwlRc8H9VZJq4joRLW30Q8mJZt23tcFIiWhZhIixmfDvazNQFxvaKmbn7v5wdpgRCUwAznXC2BF1kjPVAxgO6EDkCIjC_EJL5Gn9oA0Y73L0hZuR2Qc4JHIZKHxK9a4mVajqmlWTbmjsUxmCWtN0utheWUoWs0TVwukI-6Zs2NcaRKDi__w',
  },
  {
    id: 4,
    name: 'Butter Croissant',
    category: 'BAKERY',
    price: 3.25,
    status: 'Out of Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy510IrkcpPSOAZ65-A__iCclc2l2HYRJJuwg4Bk2fNX61pePMkSnWQoRC_Xo8kvxu2j739g57vfbuajzLwB7CQP93pmHdEfPVrNSAUaoGq3NR_Ci-sBTGqw8iZT04j5eIAtGBJK1tUYJZDZokc4k5WPikb6647dZWu2uhSFnScohWOfCXoGsBpL6V20W0dYMlrNiCPo2oh80yMhvGpc_K25YKGYYXBxtLWmERa9NszW8BqZkvmhYmtlsZyhIvrcNmwohSFmPw91M',
  },
  {
    id: 5,
    name: 'Blueberry Muffin',
    category: 'BAKERY',
    price: 3.50,
    status: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0oPJ-ByAWeNnj1U_QkEVvaax6E7GXZ02aIg-a7Kx2Afa4e2PpypDxHOg5rZHtgX4B7jmMQtTxs0XAvkEzMsyXRnEDvls0T0CywNRVG4Z3c3YBxyHQ48HtKciFmKc9-K5a-9m9qFp0MHcpl4XBdJmkzlEaY6HmSQItwNreNRCjNeUQg6RY4UE1627aq3hFh21Bc8X_nH38lyufJNtQF1smEYmi6Z1HwIXhIRMl4VJK9qL8mxEr-RvILqG2CSzZTKK1VRdnC-F4zU',
  },
  {
    id: 6,
    name: 'Ceremonial Matcha Latte',
    category: 'TEA',
    price: 4.50,
    status: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7HtW3YyaM7bddN8qfz-6PzgxxAOA0j2FvCsCvx66ny-w-ypHGHshnVjT6R2qAE2cyiFn1EOf-N3wsoVKjxFm-905-RwlRc8H9VZJq4joRLW30Q8mJZt23tcFIiWhZhIixmfDvazNQFxvaKmbn7v5wdpgRCUwAznXC2BF1kjPVAxgO6EDkCIjC_EJL5Gn9oA0Y73L0hZuR2Qc4JHIZKHxK9a4mVajqmlWTbmjsUxmCWtN0utheWUoWs0TVwukI-6Zs2NcaRKDi__w',
  },
  {
    id: 7,
    name: 'Nitro Cold Brew',
    category: 'COFFEE',
    price: 4.25,
    status: 'Low Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSzwW0T-52_IqAheLtAOW87rqwZS9LVb6xnhDKYiD4tLzlos_ks0Da2OZidv-ANyOd_LSQYJ3AxNuSM3JPPokbfXxqmqulPG7-Bl-39tGVJz9byz47ngU37dmh6_SA5ajPT9iO_k5wCRPhj7_DL7RudQExaTc4j-r80XgpNm8-IIoxdxHIQSGMdJ5r2yW62VS86SGRai6Gb2miJzvPFzUKf0LlrvHT_-lyzz7lUtgFy5JyQ7L1leXaJyLFVh-PLZOJsN4uhg1P3DA',
  },
  {
    id: 8,
    name: 'Avocado Toast',
    category: 'FOOD',
    price: 8.50,
    status: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0oPJ-ByAWeNnj1U_QkEVvaax6E7GXZ02aIg-a7Kx2Afa4e2PpypDxHOg5rZHtgX4B7jmMQtTxs0XAvkEzMsyXRnEDvls0T0CywNRVG4Z3c3YBxyHQ48HtKciFmKc9-K5a-9m9qFp0MHcpl4XBdJmkzlEaY6HmSQItwNreNRCjNeUQg6RY4UE1627aq3hFh21Bc8X_nH38lyufJNtQF1smEYmi6Z1HwIXhIRMl4VJK9qL8mxEr-RvILqG2CSzZTKK1VRdnC-F4zU',
  },
  {
    id: 9,
    name: 'Lemon Loaf',
    category: 'BAKERY',
    price: 3.00,
    status: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCONTQ6x_UV8T1-CdStbTjp-WiQwY9CDNBvpsL9QIgsQ8ujvPhwxQs_uIfkhaBivVjs1SdVbPF9Cu-E5LMzx7rU0c2ApaFjgnlMWH-wQQwjj797onjBlnqyl01YYC061EE3RP5xbIiMSU4DKXjSMOsU9keimiO2q1FJLl2ylgPrCdyGdwgFSb9zrSSJu6kCRAFjcoQia2vQWEhaTadcr3hGmweCW2FcbK56KzO71hlwB8cpm2wW9iUI1J7e9INoD9XP8v293sg3Yxs',
  },
  {
    id: 10,
    name: 'Everything Bagel',
    category: 'BAKERY',
    price: 2.75,
    status: 'Out of Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy510IrkcpPSOAZ65-A__iCclc2l2HYRJJuwg4Bk2fNX61pePMkSnWQoRC_Xo8kvxu2j739g57vfbuajzLwB7CQP93pmHdEfPVrNSAUaoGq3NR_Ci-sBTGqw8iZT04j5eIAtGBJK1tUYJZDZokc4k5WPikb6647dZWu2uhSFnScohWOfCXoGsBpL6V20W0dYMlrNiCPo2oh80yMhvGpc_K25YKGYYXBxtLWmERa9NszW8BqZkvmhYmtlsZyhIvrcNmwohSFmPw91M',
  },
  {
    id: 11,
    name: 'Signature Hot Cocoa',
    category: 'NON-COFFEE',
    price: 4.00,
    status: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7HtW3YyaM7bddN8qfz-6PzgxxAOA0j2FvCsCvx66ny-w-ypHGHshnVjT6R2qAE2cyiFn1EOf-N3wsoVKjxFm-905-RwlRc8H9VZJq4joRLW30Q8mJZt23tcFIiWhZhIixmfDvazNQFxvaKmbn7v5wdpgRCUwAznXC2BF1kjPVAxgO6EDkCIjC_EJL5Gn9oA0Y73L0hZuR2Qc4JHIZKHxK9a4mVajqmlWTbmjsUxmCWtN0utheWUoWs0TVwukI-6Zs2NcaRKDi__w',
  },
  {
    id: 12,
    name: 'Spiced Chai Latte',
    category: 'TEA',
    price: 4.25,
    status: 'Low Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0oPJ-ByAWeNnj1U_QkEVvaax6E7GXZ02aIg-a7Kx2Afa4e2PpypDxHOg5rZHtgX4B7jmMQtTxs0XAvkEzMsyXRnEDvls0T0CywNRVG4Z3c3YBxyHQ48HtKciFmKc9-K5a-9m9qFp0MHcpl4XBdJmkzlEaY6HmSQItwNreNRCjNeUQg6RY4UE1627aq3hFh21Bc8X_nH38lyufJNtQF1smEYmi6Z1HwIXhIRMl4VJK9qL8mxEr-RvILqG2CSzZTKK1VRdnC-F4zU',
  },
];

const filters: FilterType[] = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

// ─── Helpers ─────────────────────────────────────────────────────────

const statusBadgeClasses: Record<Product['status'], string> = {
  'In Stock': 'bg-[#14b83d33] text-[#50e161]',
  'Low Stock': 'bg-[#ff7189]/20 text-[#ff7189]',
  'Out of Stock': 'bg-[#ef44441a] text-[#f87171]',
};

// ─── Component ───────────────────────────────────────────────────────

export default function ProductsContent() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') return products;
    return products.filter((p) => p.status === activeFilter);
  }, [activeFilter]);

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
                <p className="text-3xl font-black text-[#f6f8f6]">24</p>
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
                <p className="text-3xl font-black text-[#f6f8f6]">3</p>
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
                <p className="text-3xl font-black text-[#f6f8f6]">1</p>
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
