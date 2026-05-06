import { useState } from "react";

type StockStatus = "Normal" | "Low" | "Out";

interface InventoryItem {
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  maxStock: number;
  status: StockStatus;
}

export default function InventoryContent() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const inventoryItems: InventoryItem[] = [
    { name: "Espresso Beans (Premium)", sku: "COF-001", category: "Coffee", unit: "kg", currentStock: 4.5, maxStock: 20.0, status: "Low" },
    { name: "Whole Milk (1L)", sku: "DAI-001", category: "Dairy", unit: "L", currentStock: 0, maxStock: 24.0, status: "Out" },
    { name: "Paper Cups (Medium)", sku: "SUP-001", category: "Supplies", unit: "pcs", currentStock: 450, maxStock: 500, status: "Normal" },
    { name: "Oat Milk (1L)", sku: "DAI-002", category: "Dairy", unit: "L", currentStock: 15, maxStock: 20, status: "Normal" },
    { name: "Sugar Packets", sku: "SUP-002", category: "Supplies", unit: "box", currentStock: 8, maxStock: 10, status: "Normal" },
    { name: "Decaf Espresso", sku: "COF-002", category: "Coffee", unit: "kg", currentStock: 5, maxStock: 5, status: "Normal" },
    { name: "Caramel Syrup (1L)", sku: "SYR-001", category: "Syrups", unit: "btl", currentStock: 2, maxStock: 10, status: "Low" },
    { name: "Vanilla Syrup (1L)", sku: "SYR-002", category: "Syrups", unit: "btl", currentStock: 0, maxStock: 10, status: "Out" },
    { name: "Napkins (Pack of 500)", sku: "SUP-003", category: "Supplies", unit: "pack", currentStock: 20, maxStock: 25, status: "Normal" },
    { name: "Cocoa Powder (2kg)", sku: "ING-001", category: "Ingredients", unit: "kg", currentStock: 4, maxStock: 5, status: "Normal" },
    { name: "Chai Mix (1kg)", sku: "ING-002", category: "Ingredients", unit: "kg", currentStock: 3, maxStock: 3, status: "Normal" },
    { name: "Honey Jar (500g)", sku: "ING-003", category: "Ingredients", unit: "jar", currentStock: 1, maxStock: 5, status: "Low" },
  ];

  const filteredItems = inventoryItems.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "low") return item.status === "Low";
    if (activeFilter === "out") return item.status === "Out";
    return true;
  });

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case "Low": return "orange";
      case "Out": return "red";
      default: return "green";
    }
  };

  const handleUpdateClick = (item: InventoryItem) => {
    setSelectedItem({ ...item });
    setShowUpdateModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowUpdateModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className={`flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ${showAddModal || showUpdateModal ? 'blur-[4px] brightness-50 pointer-events-none' : ''}`}>
        {/* Header */}
        <header className="px-8 pt-8 pb-4 shrink-0">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight dark:text-white">Inventory Management</h2>
              <p className="text-slate-500 dark:text-[#9db8a4] text-base">Monitor and manage your coffee shop supplies.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg text-sm font-bold transition-all shadow-sm hover:border-primary cursor-pointer dark:text-white"
              >
                <span className="material-symbols-outlined text-lg">add_box</span>
                <span>Add New Item</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm border-l-4 border-l-slate-400">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">Total Items</p>
              <span className="material-symbols-outlined text-slate-400">inventory</span>
            </div>
            <p className="text-3xl font-bold tracking-tight dark:text-white">124</p>
            <p className="text-xs text-slate-400">Items in catalog</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">Low Stock</p>
              <span className="material-symbols-outlined text-orange-500">warning</span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-orange-500">8</p>
            <p className="text-xs text-slate-400">Requires attention soon</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] shadow-sm border-l-4 border-l-red-500">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-[#9db8a4] text-sm font-medium">Out of Stock</p>
              <span className="material-symbols-outlined text-red-500">error</span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-red-500">2</p>
            <p className="text-xs text-slate-400">Urgent restock needed</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="px-8 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-all cursor-pointer ${
                activeFilter === "all" ? "bg-[#14b83d] text-white" : "bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#233d28]"
              }`}
            >
              All Items
            </button>
            <button 
              onClick={() => setActiveFilter("low")}
              className={`px-6 py-2 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] hover:border-orange-500 rounded-lg text-sm font-bold text-orange-500 transition-all flex items-center gap-2 cursor-pointer ${
                activeFilter === "low" ? "ring-2 ring-orange-500" : ""
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Low Stock
            </button>
            <button 
              onClick={() => setActiveFilter("out")}
              className={`px-6 py-2 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] hover:border-red-500 rounded-lg text-sm font-bold text-red-500 transition-all flex items-center gap-2 cursor-pointer ${
                activeFilter === "out" ? "ring-2 ring-red-500" : ""
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Out of Stock
            </button>
          </div>
        </section>

        {/* Table Section */}
        <section className="px-8 py-4 flex-1 overflow-hidden flex flex-col mb-4">
          <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto relative no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[#142618] text-xs uppercase text-slate-500 dark:text-[#9db8a4] tracking-wider font-bold shadow-sm">
                  <tr>
                    <th className="px-6 py-4">Inventory Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Unit</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#29382d]">
                  {filteredItems.map((item, idx) => {
                    const stockPercentage = Math.min((item.currentStock / item.maxStock) * 100, 100);
                    const statusColor = getStatusColor(item.status);
                    
                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#1c3022] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold dark:text-white">{item.name}</span>
                            <span className="text-xs text-slate-400">SKU: {item.sku}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium dark:text-slate-300">{item.category}</td>
                        <td className="px-6 py-4 text-sm dark:text-slate-400">{item.unit}</td>
                        <td className="px-6 py-4 text-sm font-semibold dark:text-white">
                          {item.currentStock.toFixed(1)} / {item.maxStock.toFixed(1)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full max-w-[120px] bg-slate-100 dark:bg-[#112115] h-2 rounded-full overflow-hidden mb-1">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                statusColor === 'orange' ? 'bg-orange-500' :
                                statusColor === 'red' ? 'bg-red-500' :
                                'bg-[#14b83d]'
                              }`} 
                              style={{ width: `${stockPercentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-[10px] uppercase font-bold ${
                            statusColor === 'orange' ? 'text-orange-500' :
                            statusColor === 'red' ? 'text-red-500' :
                            'text-[#14b83d]'
                          }`}>
                            {item.status} Stock
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleUpdateClick(item)}
                            className="px-4 py-1.5 bg-[#14b83d] text-white text-xs font-bold rounded shadow-sm hover:brightness-110 cursor-pointer transition-all"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="h-6 bg-gradient-to-t from-slate-50/10 to-transparent dark:from-[#142618]/30 pointer-events-none sticky bottom-0"></div>
          </div>
        </section>
      </div>

      {/* Modals */}
      {(showAddModal || showUpdateModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={handleCloseModals}
          ></div>
          
          {/* Add New Item Modal */}
          {showAddModal && (
            <div className="relative bg-white dark:bg-[#0d1a10] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#29382d] overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-100 dark:border-[#29382d]">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#14b83d]">add_circle</span>
                  Add New Inventory Item
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#9db8a4] mt-1">Provide basic information for the new stock item.</p>
              </div>
              <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); handleCloseModals(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-1.5">Item Name</label>
                    <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg focus:ring-[#14b83d] focus:border-[#14b83d] dark:text-white text-sm outline-none transition-all" placeholder="e.g. Arabica Dark Roast" type="text" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-1.5">Category</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg focus:ring-[#14b83d] focus:border-[#14b83d] dark:text-white text-sm outline-none transition-all">
                      <option>Coffee Beans</option>
                      <option>Dairy</option>
                      <option>Supplies</option>
                      <option>Syrups</option>
                      <option>Ingredients</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-1.5">Status</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg focus:ring-[#14b83d] focus:border-[#14b83d] dark:text-white text-sm outline-none transition-all">
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                      <option value="out">Out</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-[#29382d]">
                  <button className="w-full py-3 bg-[#14b83d] hover:brightness-110 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2" type="submit">
                    <span className="material-symbols-outlined text-xl">add</span>
                    Add Item
                  </button>
                  <button 
                    type="button"
                    onClick={handleCloseModals}
                    className="text-sm font-semibold text-slate-500 dark:text-[#9db8a4] hover:text-slate-700 dark:hover:text-white transition-colors text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Update Stock Modal */}
          {showUpdateModal && selectedItem && (
            <div className="relative bg-white dark:bg-[#1a2e1e] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#3c5342] overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center">
                <h3 className="text-xl font-bold dark:text-white">Update Stock</h3>
                <button 
                  onClick={handleCloseModals}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Stock Status: <span className="text-[#14b83d]">{selectedItem.name}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100 dark:bg-[#112115] rounded-xl border border-slate-200 dark:border-[#29382d]">
                    <button 
                      onClick={() => setSelectedItem({...selectedItem, status: 'Normal'})}
                      className={`flex flex-col items-center justify-center py-5 px-2 rounded-lg transition-all hover:bg-white dark:hover:bg-[#1c3022] cursor-pointer ${selectedItem.status === 'Normal' ? 'bg-white dark:bg-[#1a2e1e] shadow-md border border-slate-100 dark:border-[#3c5342] text-[#14b83d] ring-2 ring-[#14b83d] ring-offset-2 dark:ring-offset-[#1a2e1e]' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      <span className="material-symbols-outlined mb-2 text-2xl">check_circle</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Normal</span>
                    </button>
                    <button 
                      onClick={() => setSelectedItem({...selectedItem, status: 'Low'})}
                      className={`flex flex-col items-center justify-center py-5 px-2 rounded-lg transition-all hover:bg-white dark:hover:bg-[#1c3022] cursor-pointer ${selectedItem.status === 'Low' ? 'bg-white dark:bg-[#1a2e1e] shadow-md border border-slate-100 dark:border-[#3c5342] text-orange-500 ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-[#1a2e1e]' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      <span className="material-symbols-outlined mb-2 text-2xl">warning</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Low</span>
                    </button>
                    <button 
                      onClick={() => setSelectedItem({...selectedItem, status: 'Out'})}
                      className={`flex flex-col items-center justify-center py-5 px-2 rounded-lg transition-all hover:bg-white dark:hover:bg-[#1c3022] cursor-pointer ${selectedItem.status === 'Out' ? 'bg-white dark:bg-[#1a2e1e] shadow-md border border-slate-100 dark:border-[#3c5342] text-red-500 ring-2 ring-red-500 ring-offset-2 dark:ring-offset-[#1a2e1e]' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      <span className="material-symbols-outlined mb-2 text-2xl">error</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Out</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#9db8a4] italic text-center pt-2">Manually override the inventory status for this item.</p>
                </div>
              </div>
              <div className="p-6 bg-slate-50/50 dark:bg-[#142618] border-t border-slate-100 dark:border-[#29382d] flex gap-3">
                <button 
                  onClick={handleCloseModals}
                  className="flex-1 px-6 py-3 border border-slate-200 dark:border-[#3c5342] dark:text-white text-sm font-bold rounded-lg hover:bg-white dark:hover:bg-[#1a2e1e] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCloseModals}
                  className="flex-1 px-6 py-3 bg-[#14b83d] text-white text-sm font-bold rounded-lg shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  Update Status
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
