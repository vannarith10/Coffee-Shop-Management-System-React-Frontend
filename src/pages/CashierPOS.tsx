//src/pages/CashierPOS.tsx
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/authService";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";
import { Header } from "../components/pos/common/Header";
import { SearchBar } from "../components/pos/common/SearchBar";
import { ProductGrid } from "../components/pos/ProductGrid";
import { CartSidebar } from "../components/pos/CartSidebar";
import { NameFilter } from "../components/pos/NameFilter";
import { TypeFilter } from "../components/pos/TypeFilter";
import {RefreshLoadingScreen} from "../components/LoadingScreen"
import { createOrder, confirmOrder, } from "../services/orderService";
import type { CreateOrderRequest, CreatedOrder, OrderFlowState } from "../types/order";
import { ConfirmationScreen } from "../components/pos/ConfirmationScreen";
// import { PlaceOrderModal } from "../components/pos/PlaceOrderModal";
import PlaceOrderModal from "@/components/pos/PlaceOrderModal";






export default function CashierPOS() {
  const navigate = useNavigate();
  const user = getUser();
  const { products, loading, error, refetch, isRefreshing } = useProducts();


  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "DRINK" | "FOOD">("ALL");
  const [nameFilter, setNameFilter] = useState<string>("ALL");


  // Order flow state
  const [orderFlowState, setOrderFlowState] = useState<OrderFlowState>("CART");
  const [currentOrder, setCurrentOrder] = useState<CreatedOrder | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  // const [isProcessing, setIsProcessing] = useState(false);


  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, } = useCart(products);

  
  const handleTypeChange = useCallback((type: "ALL" | "DRINK" | "FOOD") => {
    setTypeFilter(type);
    setNameFilter("ALL");
  }, []);


    const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [navigate]);




  // Step 1: Open Checkout Modal
  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;

    setOrderFlowState("CHECKOUT");
    setOrderError(null);
  }, [cart.length]);




  // Step 2: Place Order (Create Order API)
  const handlePlaceOrder = useCallback(async (request: CreateOrderRequest) => {
    // setIsProcessing(true);
    setOrderFlowState("CREATING");
    setOrderError(null);

    try {
      const order = await createOrder(request);
      setCurrentOrder(order);
      setOrderFlowState("CONFIRMATION")

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create order";
      setOrderError(errorMessage);
      setOrderFlowState("CHECKOUT");
      console.error("Error to create order ", err);
    }

  }, []);




  // Step 3: Confirm Order (Confirm Order API)
  const handleConfirmOrder = useCallback(async () => {
  console.log("🔵🔵🔵 handleConfirmOrder CALLED in CashierPOS!");
  
  if (!currentOrder) {
    console.log("🔴 No current order, returning early");
    return;
  }

  console.log("🟡 Setting state to CONFIRMING for order:", currentOrder.orderId);
  setOrderFlowState("CONFIRMING");
  setOrderError(null);

  try {
    console.log("🟡 About to call confirmOrder API...");
    const result = await confirmOrder(currentOrder.orderId);
    console.log("🟢 API call successful:", result);
    setOrderFlowState("COMPLETED");
  } catch (err) {
    console.error("🔴 API call failed:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to confirm";
    setOrderError(errorMessage);
    setOrderFlowState("CONFIRMATION");
  }
}, [currentOrder]);



  // Handle completion - reset everything and return to cart/menu
  const handleOrderComplete = useCallback(() => {
    clearCart();
    setOrderFlowState("CART");
    setCurrentOrder(null);
    setOrderError(null);
  }, [clearCart]);



  // Cancel / Back handlers
  const handleCloseCheckout = useCallback(() => {
    setOrderFlowState("CART");
    setOrderError(null);
  }, []);



  const handleCancelConfirmation = useCallback(() => {
    // Optionally cancel the order on backend here
    setOrderFlowState("CART");
    setCurrentOrder(null);
    setOrderError(null);
  }, []);




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

  // Disable product grid when modals are open
  const isProductGridDisabled = orderFlowState !== "CART";


  return (
    <>
      <div className="h-screen flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
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
          <main 
            className={`flex-1 p-6 overflow-y-auto bg-cover bg-center bg-no-repeat [&::-webkit-scrollbar]:hidden ${isProductGridDisabled ? 'pointer-events-none opacity-50' : ''}`}
            style={{ backgroundImage: 'url(https://wallpapercave.com/wp/wp8965797.jpg)' }}
          >
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
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

      {/* Step 1: Place Order Modal */}
      <PlaceOrderModal
        isOpen={orderFlowState === "CHECKOUT" || orderFlowState === "CREATING"}
        cart={cart}
        onClose={handleCloseCheckout}
        onPlaceOrder={handlePlaceOrder}
        isLoading={orderFlowState === "CREATING"}
      />

      {/* Step 2: Confirmation Screen */}
      <ConfirmationScreen
        isOpen={orderFlowState === "CONFIRMATION" || orderFlowState === "CONFIRMING" || orderFlowState === "COMPLETED"}
        order={currentOrder}
        cart={cart}
        orderFlowState={orderFlowState}
        onConfirm={handleConfirmOrder}
        onCancel={handleCancelConfirmation}
        onCompleted={handleOrderComplete}
        error={orderError}
      />
    </>
  );

}
