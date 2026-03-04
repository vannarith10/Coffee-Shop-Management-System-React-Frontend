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


  
  const glassHeader = (color:string) => `
    text-lg font-bold mb-4 
    inline-flex items-center justify-center gap-2
    p-2 px-4
    rounded-[14px]
    backdrop-blur-md
    bg-gradient-to-br from-white/20 via-white/[0.08] to-white/[0.03]
    shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
    active:scale-95
    ${color === 'blue' ? 'text-blue-200' : ''}
    ${color === 'orange' ? 'text-orange-200' : ''}
    ${color === 'red' ? 'text-red-200' : ''}
  `;


  // If showing ALL types, group by category_type first, then category_name
  if (typeFilter === "ALL") {
    const drinks = products.filter((p) => p.category_type === "DRINK");
    const foods = products.filter((p) => p.category_type === "FOOD");

    return (
      <div className="space-y-8">
        {/* Drinks Section */}
        {drinks.length > 0 && (
          <section>
            <h2 className={glassHeader("blue")}>
              ☕ Drinks ({drinks.length})
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-8 justify-center place-content-start ">
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
            <h2
              className={glassHeader("orange")}
            >
              <span className="drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]">🍽️</span>
              <span>Food ({foods.length})</span>
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-8 justify-center place-content-start">
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
        <section key={categoryName} >
          <h2
  className={glassHeader(`${typeFilter === "DRINK" ? "blue" : "orange"}`)}
>
  {categoryName} ({items.length})
</h2>
          <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-8 justify-center place-content-start">
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