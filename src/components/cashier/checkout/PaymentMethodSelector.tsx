// src/src/components/cashier/checkout/PaymentMethodSelector.tsx

interface Props {
  paymentMethod: "CASH" | "QR";
  setPaymentMethod: (method: "CASH" | "QR") => void;
}

export default function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
}: Props) {
  const active =
    "border-green-500 bg-green-50 text-green-600 dark:bg-green-500/10";

  const normal =
    "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300";

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
        Payment Method
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPaymentMethod("CASH")}
          className={`p-4 rounded-xl border ${
            paymentMethod === "CASH" ? active : normal
          }`}
        >
          Cash
        </button>

        <button
          disabled
          className="p-4 rounded-xl border text-gray-400 opacity-60 cursor-not-allowed"
        >
          QR (Soon)
        </button>
      </div>
    </div>
  );
}