import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./admin/context/AuthProvider";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import { CartProvider } from "./contexts/CartContext";

// Frontend pages
import Home from "./pages/Home";
import { MenuPage } from "./pages/Menu";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/PaymentSuccess";

// Admin pages
import LoginPage from "./admin/pages/LoginPage";
import Dashboard from "./admin/pages/Dashboard";
import OrderPage from "./admin/pages/OrderPage";
import CustomCakesPage from "./admin/pages/CustomCakesPage";
import ProductsPage from "./admin/pages/ProductsPage";
import SettingsPage from "./admin/pages/SettingsPage";
import UsersPage from "./admin/pages/UsersPage";
import MessagesPage from "./admin/pages/MessagesPage";

// ✅ Import the hook
import { useKeepAlive } from "./hooks/useKeepAlive";

function App() {
  // ✅ Activate keep-alive pings
  useKeepAlive();

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
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
              path="/admin/custom-cakes"
              element={
                <ProtectedRoute>
                  <CustomCakesPage />
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
