// src/components/pos/PlaceOrderModal.tsx

import React, {useState} from "react";
import type { CartItem } from "@/types/pos";
import type { CreateOrderRequest } from "../../types/order";



interface PlaceOrderModalProps {
    isOpen: boolean;
    cart: CartItem[];
    onClose: () => void;
    onPlaceOrder: (request: CreateOrderRequest) => void;
    isLoading: boolean;
}


export const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({
    isOpen,
    cart,
    onClose,
    onPlaceOrder,
    isLoading
}) => {
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QR">("CASH");
    const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
    const [note, setNote] = useState("");

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.price * item.cartQuantity, 0
    );

    const handlePlaceOrder = () => {
        const request : CreateOrderRequest = {
            paymentMethod,
            currency,
            note: note || "No note",
            items: cart.map((item) => ({productId: item.id, quantity: item.cartQuantity,})),
        };
        onPlaceOrder(request);
    };

    if (!isOpen) return null;

    


    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#112115] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h2>
            <p className="text-gray-400 text-sm">Select payment method and finalize order</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Order Summary */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-4 block tracking-wider">
              Order Summary
            </label>
            <div className="bg-gray-200 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5">

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">Total Amount Due</span>
                <span className="text-4xl font-black text-[#14b83d]">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">Total Items</span>
                <span className="text-4xl font-black text-[#ff9513]">
                  {cart.reduce((sum, item) => sum + item.cartQuantity, 0)}
                </span>
              </div>

            </div>
          </div>


          {/* Payment Method */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-4 block tracking-wider">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("CASH")}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  paymentMethod === "CASH"
                    ? "border-[#14b83d] bg-[#14b83d]/5 text-[#14b83d]"
                    : "border-gray-200 dark:border-white/5 hover:border-[#14b83d]/50 text-gray-600 dark:text-gray-300"
                }`}
              >
                <span className="font-bold text-2xl">Cash</span>
              </button>

              <button
                onClick={() => setPaymentMethod("QR")}
                disabled
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-gray-200 dark:border-white/5 text-gray-400 cursor-not-allowed opacity-60"
                title="Coming soon"
              >
                <span className="font-bold text-2xl">QR Code</span>
                <span className="text-xs">(Coming soon)</span>
              </button>
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-4 block tracking-wider">
              Currency
            </label>
            <div className="flex gap-3">
                {/* Add new currency here e.g "KHR" */}
              {(["USD",] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-6 py-3 rounded-md cursor-pointer font-semibold transition-all ${
                    currency === curr
                      ? "bg-[#14b83d] text-white"
                      : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-4 block tracking-wider">
              Order Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Take away, No sugar, VIP..."
              className="w-full bg-gray-200 dark:bg-white/5 border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#14b83d] outline-none transition-all placeholder:text-gray-400 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer bg-gray-300 dark:bg-white/5 hover:bg-gray-400 dark:hover:bg-white/10 text-gray-600 dark:text-white rounded-md py-4 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="flex-1 cursor-pointer bg-[#14b83d] hover:bg-[#0f8a2e] text-white rounded-md py-4 font-bold text-lg shadow-lg shadow-[#14b83d]/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}
