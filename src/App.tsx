import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import AdminDashboard from "./pages/AdminDashboard";
import CashierPOS from "./pages/CashierPOS";
import BaristaKitchen from "./pages/BaristaDashboard";
import Unauthorized from "./pages/Unauthorized";
import {
  getAccessToken,
  getRefreshToken,
  isRefreshTokenExpired,
  getUserRole,
} from "./services/authService";

/**
 * Returns true when the user has any valid session:
 *  - They have a live access token, OR
 *  - They have a non-expired refresh token (axios interceptor will silently
 *    get a new access token on the first API call that returns 401).
 *
 * Redirecting to /login solely because the SHORT-LIVED access token is missing
 * from localStorage (e.g. it expired between renders) causes the bug where
 * the user gets kicked out while the token refresh is in-flight.
 */
function isSessionAlive(): boolean {
  if (getAccessToken()) return true;                       // access token present
  const rt = getRefreshToken();
  return !!rt && !isRefreshTokenExpired();                 // refresh token still valid
}

// Protected route with role check
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  if (!isSessionAlive()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();
  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Root route: authenticated → role dashboard, guest → public menu
function RootRoute() {
  const role = getUserRole();

  if (!isSessionAlive()) {
    // Public guest — show the menu page
    return <MenuPage />;
  }

  switch (role) {
    case "ADMIN":   return <Navigate to="/admin"   replace />;
    case "CASHIER": return <Navigate to="/cashier" replace />;
    case "BARISTA": return <Navigate to="/barista" replace />;
    default:        return <MenuPage />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /login is gone — redirect anyone visiting it to the menu */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Root: guests see the public menu, staff get role-redirected */}
        <Route path="/" element={<RootRoute />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Cashier Routes */}
        <Route
          path="/cashier/*"
          element={
            <ProtectedRoute allowedRoles={["CASHIER"]}>
              <CashierPOS />
            </ProtectedRoute>
          }
        />

        {/* Barista Routes */}
        <Route
          path="/barista/*"
          element={
            <ProtectedRoute allowedRoles={["BARISTA"]}>
              <BaristaKitchen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}