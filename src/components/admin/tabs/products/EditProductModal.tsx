import React, { useState, useEffect, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

// ─── Component ───────────────────────────────────────────────────────

export default function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      setEditingProduct({ ...editingProduct, image: URL.createObjectURL(file) });
    }
  };

  useEffect(() => {
    if (product) {
      setEditingProduct({
        ...product,
        description: product.description || 'Our signature dark roast espresso with a smooth, rich crema. Perfect for a quick caffeine boost.',
      });
    } else {
      setEditingProduct(null);
    }
  }, [product]);

  const handleChange = (field: keyof Product, value: string | number) => {
    if (!editingProduct) return;
    setEditingProduct((prev) => prev ? { ...prev, [field]: value } : null);
  };

  if (!isOpen || !editingProduct) return null;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ─── Edit Product Modal ─────────────────────────────────── */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
        <div className="bg-[#1c3622] border border-[#3d4a3b] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#3d4a3b] flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#f6f8f6]">Edit Product</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#224128] rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[#bccbb6]">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
            {/* Image Section */}
            <div className="flex flex-col items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
              <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  alt="Product Preview"
                  className="w-32 h-32 rounded-xl object-cover border-2 border-[#14b83d] ring-4 ring-[#14b83d]/10 shadow-lg"
                  src={editingProduct.image}
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[#14b83d] text-sm font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">upload</span>
                Change Image
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-4 py-2.5 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    disabled
                    className="w-full bg-[#162b1b] border border-[#3d4a3b] rounded-xl px-4 py-2.5 text-[#bccbb6] cursor-not-allowed opacity-70 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#14b83d] font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                      className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl pl-8 pr-4 py-2.5 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-4 py-2.5 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-6 bg-[#224128]/30 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#162b1b] border border-[#3d4a3b] text-[#f6f8f6] font-bold rounded-xl hover:bg-[#1c3622] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#14b83d] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all"
            >
              Confirm Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
