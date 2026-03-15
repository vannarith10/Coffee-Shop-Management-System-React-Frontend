// src/components/pos/PlaceOrderModal.tsx

import React, { useState } from "react";
import type { CartItem } from "@/types/pos";
import type { CreateOrderRequest } from "@/types/order";

import OrderSummary from "./OrderSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CurrencySelector from "./CurrencySelector";
import OrderNoteInput from "./OrderNoteInput";

interface Props {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onPlaceOrder: (request: CreateOrderRequest) => void;
  isLoading: boolean;
}

export default function PlaceOrderModal({
  isOpen,
  cart,
  onClose,
  onPlaceOrder,
  isLoading,
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QR">("CASH");
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const handlePlaceOrder = () => {
    onPlaceOrder({
      paymentMethod,
      currency,
      note: note || "No note",
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.cartQuantity,
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white dark:bg-[#112115] rounded-2xl shadow-xl border dark:border-white/10 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-4 sm:p-6 border-b dark:border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold">Checkout</h2>
          <p className="text-sm text-gray-400">
            Select payment method and finalize order
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-6">

          <OrderSummary
            totalAmount={totalAmount}
            totalItems={totalItems}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <CurrencySelector
            currency={currency}
            setCurrency={setCurrency}
          />

          <OrderNoteInput
            note={note}
            setNote={setNote}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="flex-1 py-3 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}