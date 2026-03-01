import React from "react";
import { Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  typeFilter: "ALL" | "DRINK" | "FOOD";
  nameFilter: string;
  onAddToCart: (product: Product) => void;
}


export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  typeFilter,
  nameFilter,
  onAddToCart,
}) => {
  // Group by category_name when showing all or specific type
  const groupByCategoryName = (items: Product[]) => {
    const groups: Record<string, Product[]> = {};
    
    items.forEach((item) => {
      const key = item.category_name || "Uncategorized";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    
    return groups;
  };


  // If showing ALL types, group by category_type first, then category_name
  if (typeFilter === "ALL") {
    const drinks = products.filter((p) => p.category_type === "DRINK");
    const foods = products.filter((p) => p.category_type === "FOOD");

    return (
      <div className="space-y-8">
        {/* Drinks Section */}
        {drinks.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-700 mb-4">
              ☕ Drinks ({drinks.length})
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-4 justify-center place-content-start">
              {drinks.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onAddToCart(product)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Food Section */}
        {foods.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-orange-700 mb-4">
              🍽️ Food ({foods.length})
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-4 justify-center place-content-start">
              {foods.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onAddToCart(product)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  const filteredByType = products.filter((p) => p.category_type === typeFilter);

  const filteredByName = nameFilter === "ALL" ? filteredByType : filteredByType.filter((p) => p.category_name === nameFilter);

  const grouped = groupByCategoryName(filteredByName);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([categoryName, items]) => (
        <section key={categoryName}>
          <h2 className={`text-lg font-bold mb-4 ${
            typeFilter === "DRINK" ? "text-blue-700" : "text-orange-700"
          }`}>
            {categoryName} ({items.length})
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-4 justify-center place-content-start">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onAddToCart(product)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};