import React from "react";


interface SimplifiedCartSummaryProps {
  subtotal: number;
  total: number;
  hasItems: boolean;
  hasUnavailableItems: boolean;
  onCheckout: () => void;
  itemCount: number;
}



export const CartSummary: React.FC<SimplifiedCartSummaryProps> = ({
  subtotal,
  total,
  hasItems,
  hasUnavailableItems,
  onCheckout,
  itemCount,
}) => {

  const getButtonText = () => {
    if (hasUnavailableItems) return "Remove unavailable items";
    if (!hasItems) return "Add items to checkout";
    return "Checkout";
  }

  const isDisabled = !hasItems || hasUnavailableItems;

  return (
    <div className="border-t p-4 bg-gray-50 flex-shrink-0">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-600">Items</span>
        <span className="font-medium">{itemCount}</span>
      </div>

      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-300">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-blue-600">
          ${total.toFixed(2)}
        </span>
      </div>
      
      <button
        onClick={onCheckout}
        disabled={isDisabled}
        className={`w-full mb-2 py-3 cursor-pointer rounded-lg font-semibold transition-colors shadow-lg ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {getButtonText()}
      </button>
    </div>
  );


};