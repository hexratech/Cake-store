// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./admin/context/AuthProvider";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import { CartProvider } from "./contexts/CartProvider";
import { Toaster } from "./components/ui/sonner";

// Frontend pages
import Home from "./pages/home";
import { MenuPage } from "./pages/menu";
import { CheckoutPage } from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/PaymentSuccess";

// Admin pages
import LoginPage from "./admin/pages/LoginPage";
import Dashboard from "./admin/pages/Dashboard";
import OrderPage from "./admin/pages/OrderPage";
import OrderStatusPage from "./admin/pages/OrderStatusPage";
import ProductsPage from "./admin/pages/ProductsPage";
import SettingsPage from "./admin/pages/SettingsPage";
import UsersPage from "./admin/pages/UsersPage";
import MessagesPage from "./admin/pages/MessagesPage";
import DeliveryStatusPage from "./admin/pages/DeliveryStatus";
import CustomCakes from "./admin/pages/Custom Cakes";

// ✅ Import the hook
import { useKeepAlive } from "./hooks/useKeepAlive";

// ✅ ScrollToTop component
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  // ✅ Activate keep-alive pings
  useKeepAlive();

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* ✅ Scroll to top on every route change */}
          <ScrollToTop />
          <Toaster />
          <Routes>
            {/* Customer Site */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orderstatus"
              element={
                <ProtectedRoute>
                  <OrderStatusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/deliverystatus"
              element={
                <ProtectedRoute>
                  <DeliveryStatusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customcakes"
              element={
                <ProtectedRoute>
                  <CustomCakes />
                </ProtectedRoute>
              }
            />

            {/* Settings page only for superadmin */}
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
