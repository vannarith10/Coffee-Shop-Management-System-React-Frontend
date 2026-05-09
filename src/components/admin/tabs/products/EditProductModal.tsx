import React, { useState, useEffect, useRef } from 'react';
import { dashboardService } from '../../../../services/adminDashboardService';

// ─── Types ───────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  categoryName: string;
  categoryType: string;
  price: number;
  costPrice: number;
  description?: string;
  image: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

// ─── Component ───────────────────────────────────────────────────────

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await dashboardService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setEditingProduct({
        ...product,
        description: product.description || '',
      });
      setSelectedFile(null);
    } else {
      setEditingProduct(null);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      setSelectedFile(file);
      setEditingProduct({ ...editingProduct, image: URL.createObjectURL(file) });
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!editingProduct) return;
    setEditingProduct((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = async () => {
    if (!editingProduct || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: editingProduct.name,
        price: editingProduct.price,
        cost_price: editingProduct.costPrice,
        category_name: editingProduct.categoryName,
        category_type: editingProduct.categoryType,
        description: editingProduct.description || '', // send empty string if null/undefined
      };

      if (selectedFile) {
        payload.image = selectedFile;
      }

      await dashboardService.updateProduct(editingProduct.id, payload);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to update product:", error);
      alert(`Failed to update product: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="bg-[#1c3622] border border-[#3d4a3b] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#3d4a3b] flex items-center justify-between shrink-0">
            <h3 className="text-xl font-bold text-[#f6f8f6]">Edit Product</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#224128] rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[#bccbb6]">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
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
                  className="w-32 h-32 rounded-xl object-cover border-2 border-[#14b83d] ring-4 ring-[#14b83d]/10 shadow-lg bg-[#0a140c]"
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
                Change Product Image
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-4 py-3 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-medium"
                />
              </div>

              {/* Category Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Category Type</label>
                  <select
                    value={editingProduct.categoryType}
                    onChange={(e) => handleChange('categoryType', e.target.value)}
                    className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-4 py-3 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-medium appearance-none"
                  >
                    <option value="FOOD">FOOD</option>
                    <option value="DRINK">DRINK</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Category Name</label>
                  <input
                    type="text"
                    value={editingProduct.categoryName}
                    onChange={(e) => handleChange('categoryName', e.target.value)}
                    placeholder={product?.categoryName || "Enter Category Name"}
                    className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-4 py-3 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Price Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#14b83d] font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                      className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl pl-8 pr-4 py-3 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bccbb6] font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.costPrice}
                      onChange={(e) => handleChange('costPrice', parseFloat(e.target.value))}
                      className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl pl-8 pr-4 py-3 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#bccbb6] uppercase tracking-wider px-1">Description (Optional)</label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter product description here..."
                  className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-4 py-3 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all resize-none font-medium placeholder:text-[#3d4a3b]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-6 bg-[#224128]/30 flex gap-3 shrink-0">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-[#162b1b] border border-[#3d4a3b] text-[#f6f8f6] font-bold rounded-xl hover:bg-[#1c3622] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-[2] px-4 py-3 bg-[#14b83d] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  <span>Confirm Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
