// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format number with commas
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
};

// Format percentage with sign
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};
