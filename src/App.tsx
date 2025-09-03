// src/App.tsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CakeShop from "@/pages/components/home";
import { MenuPage } from "@/pages/menu";
import { CartProvider } from "@/context/CartContext"; // ✅ use same path as in your hook

function App() {
  return (
    <Router>
      {/* Wrap the entire app in CartProvider */}
      <CartProvider>
        <Routes>
          <Route path="/" element={<CakeShop />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
