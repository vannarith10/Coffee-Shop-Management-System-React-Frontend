import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────

type StatusType = 'NORMAL' | 'LOW' | 'OUT';

interface StatusOption {
  value: StatusType;
  label: string;
  sublabel: string;
  description: string;
  icon: string;
  iconBg: string;
  iconText: string;
}

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Data ────────────────────────────────────────────────────────────

const statusOptions: StatusOption[] = [
  {
    value: 'NORMAL',
    label: 'NORMAL',
    sublabel: 'In Stock',
    description: 'Item is available for all orders and displays as active in the customer app.',
    icon: 'check_circle',
    iconBg: 'bg-[#14b83d]',
    iconText: 'text-white',
  },
  {
    value: 'LOW',
    label: 'LOW',
    sublabel: 'Low Stock',
    description: 'Warns staff that replenishment is needed soon. Visible to customers with limited label.',
    icon: 'warning',
    iconBg: 'bg-orange-500/20',
    iconText: 'text-orange-400',
  },
  {
    value: 'OUT',
    label: 'OUT',
    sublabel: 'Out of Stock',
    description: 'Item is hidden from the menu or marked as unavailable. Cannot be ordered.',
    icon: 'block',
    iconBg: 'bg-[#ef4444]/20',
    iconText: 'text-[#ef4444]',
  },
];

export default function UpdateStockModal({ isOpen, onClose }: UpdateStockModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('NORMAL');

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .glass-panel {
          background: rgba(22, 43, 27, 0.8);
          backdrop-filter: blur(16px);
        }
      `}</style>

      {/* ─── Modal Overlay ────────────────────────────────────────── */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a140c]/80 backdrop-blur-sm p-4">
        {/* Modal Content */}
        <div className="w-full max-w-lg glass-panel rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden relative">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#14b83d33] text-[#14b83d] mb-4">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#f6f8f6] mb-1">Update Stock Status</h2>
            <p className="text-[#bccbb6] text-sm font-medium">Dark Roast Espresso Blend (500g)</p>
          </div>

          {/* Status Options */}
          <div className="px-8 py-4 space-y-4">
            {statusOptions.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={
                    'w-full text-left p-4 rounded-2xl border-2 flex items-center gap-4 transition-all group ' +
                    (isSelected
                      ? 'border-[#14b83d] bg-[#14b83d]/10 hover:bg-[#14b83d]/20'
                      : 'border-white/5 bg-[#1c3622] hover:bg-[#224128]')
                  }
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${option.iconBg} flex items-center justify-center ${option.iconText}`}>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{option.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-bold tracking-tight text-[#f6f8f6]">{option.label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#14b83d]' : 'border-[#3d4a3b]'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#14b83d]"></div>}
                      </div>
                    </div>
                    <p className="text-xs text-[#bccbb6]/80 uppercase tracking-widest font-semibold mt-0.5">{option.sublabel}</p>
                    <p className="text-xs text-[#bccbb6] mt-1">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8 pt-4 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl bg-white/5 text-[#bccbb6] font-bold tracking-tight hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="flex-[2] py-4 px-6 rounded-2xl bg-[#14b83d] text-white font-black tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
