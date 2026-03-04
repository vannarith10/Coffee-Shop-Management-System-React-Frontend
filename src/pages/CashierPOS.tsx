import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/authService";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";
import { Header } from "../components/pos/common/Header";
import { SearchBar } from "../components/pos/common/SearchBar";
// import { CategoryFilter } from "../components/pos/CategoryFilter";
import { ProductGrid } from "../components/pos/ProductGrid";
import { CartSidebar } from "../components/pos/CartSidebar";
import { NameFilter } from "../components/pos/NameFilter";
import { TypeFilter } from "../components/pos/TypeFilter";

import {RefreshLoadingScreen} from "../components/LoadingScreen"


export default function CashierPOS() {
  const navigate = useNavigate();
  const user = getUser();
  const { products, loading, error, refetch, isRefreshing } = useProducts();


  const [searchTerm, setSearchTerm] = useState("");
  // const [categoryFilter, setCategoryFilter] = useState<FilterType>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "DRINK" | "FOOD">("ALL");
  const [nameFilter, setNameFilter] = useState<string>("ALL");


  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart(products);


  const handleTypeChange = useCallback((type: "ALL" | "DRINK" | "FOOD") => {
    setTypeFilter(type);
    setNameFilter("ALL");
  }, []);


  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [navigate]);


  const handleCheckout = useCallback(() => {
    // TODO: Implement checkout logic
    console.log("Processing payment...", cart);
  }, [cart]);


  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Type Filter
      const matchType = typeFilter === "ALL" || product.category_type;

      // Name Filter
      const matchName = typeFilter === "ALL" || nameFilter === "ALL" || product.category_name === nameFilter;

      return matchesSearch && matchType && matchName;
    });
  }, [products, searchTerm, typeFilter, nameFilter]);


  const getTypeCount = useCallback(
    (type: "ALL" | "DRINK" | "FOOD") => {
      if (type === "ALL") return products.length;
      return products.filter((p) => p.category_type === type).length
    },
    [products]
  )

  // Loading
  if (isRefreshing) {
    // return <LoadingScreen message="Restoring session, please wait..."/>
    return <RefreshLoadingScreen message="Restoring your session..." minDisplayTime={6000} />;
  }


  if (loading) return <LoadingScreen message="Loading menu..." />;
  if (error) return <ErrorScreen error={error} onRetry={refetch} />;



  return (
    <div className="h-screen flex overflow-hidden " >
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full" >
        {/* Header Section */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex-shrink-0">
          <Header
            username={user?.username || "Cashier"}
            onLogout={handleLogout}
          />
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          <TypeFilter
            currentType={typeFilter}
            onTypeChange={handleTypeChange}
            getTypeCount={getTypeCount}
          />

          <NameFilter
            products={products}
            currentType={typeFilter}
            currentName={nameFilter}
            onNameChange={setNameFilter}
          />

        </header>

        {/* Products Grid */}
        
        <main className="flex-1 p-6 overflow-y-auto bg-cover bg-center bg-no-repeat [&::-webkit-scrollbar]:hidden" 
              style={{ backgroundImage: 'url(https://wallpapercave.com/wp/wp8965797.jpg)' }}>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 ">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              typeFilter={typeFilter}
              nameFilter={nameFilter}
              onAddToCart={addToCart}
            />
          )}
        </main>

        
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
