// src/pages/MenuPage.tsx
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicMenu } from "../hooks/usePublicMenu";
import { getUser, getUserRole, logout } from "../services/authService";
import LoginModal from "../components/LoginModal";
import { TypeFilter } from "../components/pos/TypeFilter";
import { NameFilter } from "../components/pos/NameFilter";
import { ProductGrid } from "../components/pos/ProductGrid";


// ─── Main MenuPage ────────────────────────────────────────────────────────────
export default function MenuPage() {
  const navigate = useNavigate();
  const user = getUser();
  const role = getUserRole();

  const [showLogin, setShowLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "DRINK" | "FOOD">("ALL");
  const [nameFilter, setNameFilter] = useState<string>("ALL");

  const { products, loading, loadingMore, error, hasMore, totalElements, fetchNextPage, refetch } =
    usePublicMenu();

  // ── Infinite scroll sentinel ───────────────────────────────────────────────
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" } // start loading 200px before the sentinel is visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, fetchNextPage]);

  // Listen for auth:session-expired event (fired by api.ts interceptor)
  useEffect(() => {
    const handler = () => setShowLogin(true);
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, []);

  const handleTypeChange = useCallback((type: "ALL" | "DRINK" | "FOOD") => {
    setTypeFilter(type);
    setNameFilter("ALL");
  }, []);

  const getTypeCount = useCallback(
    (type: "ALL" | "DRINK" | "FOOD") => {
      if (type === "ALL") return products.length;
      return products.filter((p) => p.category_type === type).length;
    },
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q);
      const matchType = typeFilter === "ALL" || p.category_type === typeFilter;
      const matchName =
        typeFilter === "ALL" || nameFilter === "ALL" || p.category_name === nameFilter;
      return matchSearch && matchType && matchName;
    });
  }, [products, searchTerm, typeFilter, nameFilter]);

  const handleDashboard = () => {
    switch (role) {
      case "ADMIN":   navigate("/admin");   break;
      case "CASHIER": navigate("/cashier"); break;
      case "BARISTA": navigate("/barista"); break;
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* ── Login Modal ─────────────────────────────────────────────────────── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* ── Full page ───────────────────────────────────────────────────────── */}
      <div
        className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url(https://wallpapercave.com/wp/wp8965797.jpg)" }}
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-black/50 border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14b83d]/20 border border-[#14b83d]/40 flex items-center justify-center shrink-0">
              <span className="text-lg">☕</span>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg leading-tight tracking-tight">
                Coffee Shop
              </h1>
              <p className="text-[#9db8a4] text-[11px] font-medium">
                {totalElements > 0 ? `${totalElements} items on our menu` : "Our Menu"}
              </p>
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={handleDashboard}
                  className="flex items-center gap-2 px-4 py-2 bg-[#14b83d]/20 hover:bg-[#14b83d]/30 border border-[#14b83d]/40 text-[#14b83d] rounded-xl text-sm font-bold transition-all"
                >
                  <span className="material-symbols-outlined text-base">dashboard</span>
                  <span className="hidden sm:inline">My Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-medium transition-all"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                id="menu-staff-login-btn"
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#14b83d] hover:bg-[#11a035] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#14b83d]/30 transition-all hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-base">login</span>
                Staff Login
              </button>
            )}
          </div>
        </header>

        {/* ── Filter bar ────────────────────────────────────────────────────── */}
        <div className="sticky top-[73px] z-30 backdrop-blur-md bg-black/40 border-b border-white/10 px-6 py-3 space-y-2">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search our menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b83d]/60 focus:border-[#14b83d]/60 transition-all"
            />
          </div>

          {/* Type + name filters */}
          <div className="flex flex-wrap items-center gap-2">
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
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <main className="flex-1 px-6 py-8">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/10 animate-pulse h-72"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="material-symbols-outlined text-5xl text-red-400">
                wifi_off
              </span>
              <p className="text-white/70 text-lg font-medium">{error}</p>
              <button
                onClick={refetch}
                className="px-5 py-2 bg-[#14b83d] text-white rounded-xl text-sm font-bold hover:bg-[#11a035] transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products */}
          {!loading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <span className="text-5xl">🔍</span>
                  <p className="text-white/70 text-lg font-medium">
                    No items match your search
                  </p>
                  <button
                    onClick={() => { setSearchTerm(""); setTypeFilter("ALL"); setNameFilter("ALL"); }}
                    className="text-sm text-[#14b83d] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  typeFilter={typeFilter}
                  nameFilter={nameFilter}
                  onAddToCart={() => {}} // read-only — no cart on public menu
                />
              )}

              {/* Infinite scroll sentinel + loading indicator */}
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center mt-10 py-4">
                  {loadingMore && (
                    <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                </div>
              )}
            </>
          )}
        </main>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <footer className="text-center py-4 text-white/30 text-xs border-t border-white/10 backdrop-blur-sm bg-black/30">
          © {new Date().getFullYear()} Coffee Shop · Digital Menu
        </footer>
      </div>
    </>
  );
}
