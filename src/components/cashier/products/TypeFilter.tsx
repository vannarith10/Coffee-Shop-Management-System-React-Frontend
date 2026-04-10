import React from "react";

interface TypeFilterProps {
    currentType: "ALL" | "DRINK" | "FOOD";
    onTypeChange: (type: "ALL" | "DRINK" | "FOOD") => void;
    getTypeCount: (type: "ALL" | "DRINK" | "FOOD") => number;
}

const TYPES = [
    {key:"ALL" , icon:"🍽️" , label:"ALL" , color:"bg-gray-800"},
    {key:"DRINK" , icon:"☕" , label:"DRINK" , color:"bg-blue-600"},
    {key:"FOOD" , icon:"🍽️" , label:"FOOD" , color:"bg-orange-600"}
] as const;

export const TypeFilter: React.FC<TypeFilterProps> = ({
    currentType,
    onTypeChange,
    getTypeCount,
}) => {
  return (
    <div className="flex gap-2 mb-3">
      {TYPES.map(({ key, icon, label, color }) => (
        <button
          key={key}
          onClick={() => onTypeChange(key)}
          className={`px-4 py-2 cursor-pointer rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            currentType === key
              ? `${color} text-white`
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {icon}
          {label}
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              currentType === key ? "bg-white text-gray-500 bg-opacity-30" : "bg-gray-200"
            }`}
          >
            {getTypeCount(key)}
          </span>
        </button>
      ))}
    </div>
  );
};