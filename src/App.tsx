// src/App.tsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CakeShop from "@/pages/home";
import { MenuPage } from "@/pages/menu";
import { CartProvider } from "@/context/CartContext";
import CheckoutPage from "@/pages/CheckoutPage";

function App() {
  return (
    <Router>
      {/* Wrap the entire app in CartProvider */}
      <CartProvider>
        <Routes>
          <Route path="/" element={<CakeShop />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
