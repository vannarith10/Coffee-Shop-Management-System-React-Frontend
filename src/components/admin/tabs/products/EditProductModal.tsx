import React, { useState, useEffect, useRef } from 'react';
import { dashboardService } from '../../../../services/adminDashboardService';
import { toast } from 'sonner';

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
    if (!editingProduct || !product || isSubmitting) return;

    // Check for changes
    const hasNameChanged = editingProduct.name !== product.name;
    const hasPriceChanged = editingProduct.price !== product.price;
    const hasCostPriceChanged = editingProduct.costPrice !== product.costPrice;
    const hasCategoryChanged = editingProduct.categoryName !== product.categoryName;
    const hasDescriptionChanged = (editingProduct.description || '') !== (product.description || '');
    const hasImageChanged = !!selectedFile;

    // If no changes were made, just close the modal
    if (!hasNameChanged && !hasPriceChanged && !hasCostPriceChanged && !hasCategoryChanged && !hasDescriptionChanged && !hasImageChanged) {
      toast.info("Nothing new to update.");
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      // Construct payload with only changed fields
      const payload: any = {};
      if (hasNameChanged) payload.name = editingProduct.name;
      if (hasPriceChanged) payload.price = editingProduct.price;
      if (hasCostPriceChanged) payload.cost_price = editingProduct.costPrice;
      if (hasCategoryChanged) payload.category_name = editingProduct.categoryName;
      if (hasDescriptionChanged) payload.description = editingProduct.description;
      if (hasImageChanged) payload.image = selectedFile;

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
        <div className="bg-[#1c3622] border border-[#3d4a3b] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col h-[90vh] max-h-[700px]">
          {/* Header */}
          <div className="px-8 py-5 border-b border-[#3d4a3b] flex items-center justify-between shrink-0 bg-[#224128]/50">
            <div>
              <h3 className="text-2xl font-black text-[#f6f8f6] tracking-tight">Edit Product</h3>
              <p className="text-[#bccbb6] text-xs uppercase tracking-widest font-bold mt-0.5">Update item details</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#224128] rounded-full transition-colors group"
            >
              <span className="material-symbols-outlined text-[#bccbb6] group-hover:text-white transition-colors">close</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Side: Image Section */}
            <div className="md:w-5/12 bg-[#0a140c]/20 p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#3d4a3b]">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
              <div 
                className="relative group cursor-pointer w-full aspect-square max-w-[280px]"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  alt="Product Preview"
                  className="w-full h-full rounded-2xl object-cover border-4 border-[#14b83d] ring-8 ring-[#14b83d]/5 shadow-2xl bg-[#0a140c] transition-transform duration-500 group-hover:scale-[1.02]"
                  src={editingProduct.image}
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-white text-4xl mb-2">photo_camera</span>
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Change Photo</span>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-[#bccbb6] text-sm mb-4 max-w-[200px]">Upload a high-quality 1:1 image to represent this product.</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-[#14b83d]/10 border border-[#14b83d]/30 text-[#14b83d] text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#14b83d] hover:text-white transition-all shadow-lg shadow-[#14b83d]/10"
                >
                  Upload New Image
                </button>
              </div>
            </div>

            {/* Right Side: Form Fields */}
            <div className="md:w-7/12 p-10 overflow-y-auto no-scrollbar space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#14b83d] uppercase tracking-[0.2em] px-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-5 py-4 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-bold text-lg placeholder:text-[#3d4a3b]"
                  placeholder="e.g. Caramel Macchiato"
                />
              </div>

              {/* Category Section */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#bccbb6] uppercase tracking-[0.2em] px-1">Category Type</label>
                  <input
                    type="text"
                    value={editingProduct.categoryType}
                    disabled
                    className="w-full bg-[#0a140c]/50 border border-[#3d4a3b] rounded-xl px-5 py-4 text-[#88998a] cursor-not-allowed font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#bccbb6] uppercase tracking-[0.2em] px-1">Category Name</label>
                  <input
                    type="text"
                    value={editingProduct.categoryName}
                    onChange={(e) => handleChange('categoryName', e.target.value)}
                    placeholder={product?.categoryName || "Enter Category Name"}
                    className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-5 py-4 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-bold"
                  />
                </div>
              </div>

              {/* Price Section */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#14b83d] uppercase tracking-[0.2em] px-1">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#14b83d] font-black text-lg">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                      className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl pl-10 pr-5 py-4 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-black text-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#bccbb6] uppercase tracking-[0.2em] px-1">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bccbb6] font-black text-lg">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.costPrice}
                      onChange={(e) => handleChange('costPrice', parseFloat(e.target.value))}
                      className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl pl-10 pr-5 py-4 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all font-black text-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#bccbb6] uppercase tracking-[0.2em] px-1">Product Description</label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter detailed description here..."
                  className="w-full bg-[#0a140c] border border-[#3d4a3b] rounded-xl px-5 py-4 text-[#f6f8f6] focus:border-[#14b83d] focus:ring-1 focus:ring-[#14b83d] outline-none transition-all resize-none font-medium placeholder:text-[#3d4a3b] leading-relaxed"
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
