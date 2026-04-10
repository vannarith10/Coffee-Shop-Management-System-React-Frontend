// src/src/components/cashier/checkout/OrderSummary.tsx

interface Props {
  totalAmount: number;
  totalItems: number;
}

export default function OrderSummary({ totalAmount, totalItems }: Props) {
  return (
    <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
      <div className="flex justify-between">
        <span>Total Amount</span>
        <span className="text-2xl font-bold text-green-500">
          ${totalAmount.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between mt-2">
        <span>Total Items</span>
        <span className="text-xl font-bold text-orange-500">
          {totalItems}
        </span>
      </div>
    </div>
  );
}