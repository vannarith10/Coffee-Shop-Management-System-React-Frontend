import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierPOS from "./pages/CashierPOS";
import BaristaKitchen from "./pages/BaristaKitchen";
import Unauthorized from "./pages/Unauthorized";
import { getAccessToken, getUserRole } from "./services/authService";

// Protected route with role check
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const token = getAccessToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Auto-redirect based on role
function RoleRedirect() {
  const role = getUserRole();

  switch (role) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    case "CASHIER":
      return <Navigate to="/cashier" replace />;
    case "BARISTA":
      return <Navigate to="/barista" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Auto-redirect root to role-specific page */}
        <Route path="/" element={<RoleRedirect />} />
        
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