import React, { useState, useRef } from 'react';

// ─── Data ────────────────────────────────────────────────────────────

const categories = ['Coffee', 'Tea', 'Pastries', 'Merchandise'];

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [isActive, setIsActive] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ─── Modal Overlay ────────────────────────────────────────── */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-emerald-950/40">
        {/* Modal Content Container */}
        <div className="bg-[#112115] w-full max-w-4xl max-h-[921px] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
          
          {/* Left Side: Image Upload & Preview */}
          <div className="md:w-5/12 bg-[#1c3622] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <div className="w-full mb-6">
              <h3 className="text-[#f6f8f6] font-bold text-xl tracking-tight mb-2">Product Image</h3>
              <p className="text-[#bccbb6] text-sm">Upload a high-resolution 1:1 image for the menu gallery.</p>
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer w-full aspect-square bg-[#224128] rounded-2xl border-2 border-dashed border-[#3d4a3b] flex flex-col items-center justify-center hover:border-[#14b83d] transition-all duration-300 overflow-hidden"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-[#bccbb6] group-hover:text-[#14b83d] transition-colors">
                  <span className="material-symbols-outlined text-5xl mb-4" style={{ fontVariationSettings: "'wght' 200" }}>image</span>
                  <p className="uppercase tracking-widest text-[0.75rem]">Click to upload</p>
                </div>
              )}
              {/* Mock Preview Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-[#14b83d33]"></div>
            </div>
          </div>

          {/* Right Side: Form Fields */}
          <div className="md:w-7/12 p-8 md:p-10 overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-[#f6f8f6] tracking-tight leading-none mb-2">Add Product</h2>
                <span className="uppercase tracking-widest text-[0.7rem] text-[#14b83d] font-bold">New Inventory Item</span>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-[#bccbb6]">close</span>
              </button>
            </div>

            <form className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="uppercase tracking-widest text-[0.75rem] text-[#bccbb6] block ml-1">Product Name</label>
                <input
                  className="w-full bg-white/5 border-none rounded-xl py-4 px-5 text-[#f6f8f6] focus:ring-2 focus:ring-[#14b83d] placeholder:text-[#bccbb6]/40 transition-all outline-none"
                  placeholder="e.g. Ethiopian Yirgacheffe Roast"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Selling Price */}
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-[0.75rem] text-[#bccbb6] block ml-1">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#14b83d] font-bold">$</span>
                    <input
                      className="w-full bg-white/5 border-none rounded-xl py-4 pl-8 pr-5 text-[#f6f8f6] focus:ring-2 focus:ring-[#14b83d] placeholder:text-[#bccbb6]/40 transition-all outline-none"
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                    />
                  </div>
                </div>
                {/* Cost Price */}
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-[0.75rem] text-[#bccbb6] block ml-1">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bccbb6] font-bold">$</span>
                    <input
                      className="w-full bg-white/5 border-none rounded-xl py-4 pl-8 pr-5 text-[#f6f8f6] focus:ring-2 focus:ring-[#14b83d] placeholder:text-[#bccbb6]/40 transition-all outline-none"
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-[0.75rem] text-[#bccbb6] block ml-1">Category</label>
                  <select className="w-full bg-white/5 border-none rounded-xl py-4 px-5 text-[#f6f8f6] focus:ring-2 focus:ring-[#14b83d] appearance-none cursor-pointer outline-none">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="uppercase tracking-widest text-[0.75rem] text-[#bccbb6] block ml-1">Status</label>
                  <div className="flex items-center h-[56px] bg-white/5 rounded-xl px-5 justify-between">
                    <span className="text-[#bccbb6] text-sm">Active on Menu</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-[#224128] peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-[#14b83d]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="uppercase tracking-widest text-[0.75rem] text-[#bccbb6] block ml-1">Notes</label>
                <textarea
                  className="w-full bg-white/5 border-none rounded-xl py-4 px-5 text-[#f6f8f6] focus:ring-2 focus:ring-[#14b83d] placeholder:text-[#bccbb6]/40 transition-all resize-none outline-none"
                  placeholder="Batch details, origin notes, or allergic warnings..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white/5 text-[#f6f8f6] font-bold hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
                  type="button"
                >
                  <span>Cancel</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-[#14b83d] text-white font-bold shadow-[#14b83d]/30 shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  <span>Add Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
