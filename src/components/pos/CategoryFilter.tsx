// import React from "react";
// import { CategoryFilterProps, CategoryFilter as FilterType } from "../../types/pos";

// const CATEGORIES: { key: FilterType; icon: string; color: string }[] = [
//   { key: "ALL", icon: "🍽️", color: "bg-gray-800" },
//   { key: "DRINK", icon: "☕", color: "bg-blue-600" },
//   { key: "FOOD", icon: "🍽️", color: "bg-orange-600" },
//   { key: "TEA", icon: "🍵", color: "bg-green-600"},
//   { key: "COFFEE", icon: "☕", color: "bg-amber-700"}
// ];

// export const CategoryFilter: React.FC<CategoryFilterProps> = ({
//   currentFilter,
//   onFilterChange,
//   getCategoryCount,
// }) => {
//   return (
//     <div className="flex gap-2">
//       {CATEGORIES.map(({ key, icon, color }) => (
//         <button
//           key={key}
//           onClick={() => onFilterChange(key)}
//           className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
//             currentFilter === key
//               ? `${color} text-white`
//               : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//           }`}
//         >
//           {icon}
//           {key}
//           <span
//             className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
//               currentFilter === key ? "bg-amber-500 bg-opacity-30" : "bg-gray-200"
//             }`}
//           >
//             {getCategoryCount(key)}
//           </span>
//         </button>
//       ))}
//     </div>
//   );
// };