// src/components/pos/CurrencySelector.tsx

interface Props {
  currency: "USD" | "KHR";
  setCurrency: (currency: "USD" | "KHR") => void;
}

export default function CurrencySelector({ currency, setCurrency }: Props) {
  const currencies: ("USD" | "KHR")[] = ["USD", "KHR"];

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
        Currency
      </p>

      <div className="flex gap-2">
        {currencies.map((curr) => (
          <button
            key={curr}
            onClick={() => setCurrency(curr)}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              currency === curr
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-white/5"
            }`}
          >
            {curr}
          </button>
        ))}
      </div>
    </div>
  );
}