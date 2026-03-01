import React, { useMemo } from "react";
import { Product } from "../../types";

interface NameFilterProps {
  products: Product[];
  currentType: "ALL" | "DRINK" | "FOOD";
  currentName: string;
  onNameChange: (name: string) => void;
}

export const NameFilter: React.FC<NameFilterProps> = ({
  products,
  currentType,
  currentName,
  onNameChange,
}) => {
  // Get unique category_names for the selected type
  const availableNames = useMemo(() => {
    if (currentType === "ALL") return [];
    
    const names = products
      .filter((p) => p.category_type === currentType)
      .map((p) => p.category_name)
      .filter((name): name is string => !!name);
    
    return ["ALL", ...Array.from(new Set(names))];
  }, [products, currentType]);

  // Get count for each name
  const getNameCount = (name: string) => {
    if (name === "ALL") {
      return products.filter((p) => p.category_type === currentType).length;
    }
    return products.filter(
      (p) => p.category_type === currentType && p.category_name === name
    ).length;
  };

  // Hide if ALL types selected
  if (currentType === "ALL" || availableNames.length <= 1) return null;

  const getColor = (name: string) => {
    const colors: Record<string, string> = {
      COFFEE: "bg-amber-700",
      TEA: "bg-green-600",
      SMOOTHIE: "bg-purple-600",
      FOOD: "bg-orange-600",
      DESSERT: "bg-pink-500",
    };
    return colors[name] || "bg-gray-600";
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {availableNames.map((name) => (
        <button
          key={name}
          onClick={() => onNameChange(name)}
          className={`px-3 cursor-pointer py-1.5 rounded-full font-medium text-xs transition-all ${
            currentName === name
              ? `${getColor(name)} text-white`
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {name === "ALL" ? "All" : name}
          <span
            className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] text-gray-500 ${
              currentName === name ? "bg-white bg-opacity-30" : "bg-gray-200"
            }`}
          >
            {getNameCount(name)}
          </span>
        </button>
      ))}
    </div>
  );
};