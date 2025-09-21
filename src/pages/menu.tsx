// src/pages/menu/MenuPage.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Filters } from "../components/menu/Filters";
import { ProductGrid } from "../components/menu/ProductGrid";
import { CakeCustomizer } from "../components/menu/CakeCustomizer";
import type { CustomCakeData } from "../components/menu/CakeCustomizer";
import { NAV_LINKS } from "../types/navs";
import { useCart } from "../hooks/useCart";
import { FooterSection } from "../landing/components/footer";

import { fetchProducts, addFavorite, removeFavorite } from "../api";
import type { Product } from "@/api/index";

export const MenuPage: React.FC = () => {
  const { cart, addToCart, removeFromCart, cartCount, addCustomCakeToCart, removeCustomCakeFromCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [wishList, setWishList] = useState<Record<string, boolean>>({});

  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Fetch products
  useEffect(() => {
    setLoading(true);
    fetchProducts(query)
      .then((data: Product[]) => {
        // ✅ The fix is to remove this line.
        // const published = data.filter((p) => p.isPublished);
        // setProducts(published);

        // ✅ Instead, directly set the products from the API response.
        setProducts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  // Wishlist toggle
  const toggleWish = async (product: Product) => {
    const id = product._id;
    try {
      if (!wishList[id]) {
        await addFavorite(id, "guest@example.com");
        setWishList((w) => ({ ...w, [id]: true }));
      } else {
        await removeFavorite(id);
        setWishList((w) => ({ ...w, [id]: false }));
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  // Handle custom cake submission
  const handleSubmitCustomCake = (customCake: CustomCakeData) => {
    addCustomCakeToCart(customCake);
    setShowCustomizer(false);
  };

  // The handleApplyFilters function is also correct.
  const handleApplyFilters = (newQuery: string) => {
    setQuery(newQuery);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-slate-800">
      {/* NAV */}
      <nav className="bg-white/60 backdrop-blur sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="logo.png" alt="3vivi bakery" className="h-10 w-auto rounded-md" />
            <div className="hidden md:flex items-center gap-4 text-sm text-slate-700">
              {NAV_LINKS.map((link) => {
                if (link.id === "contact") {
                  return (
                    <Link
                      key={link.id}
                      to="/"
                      className="hover:underline"
                      onClick={e => {
                        e.preventDefault();
                        navigate("/");
                        setTimeout(() => {
                          const section = document.getElementById("contact");
                          if (section) section.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                }
                if (["about", "products"].includes(link.id)) {
                  return (
                    <Link
                      key={link.id}
                      to="/"
                      className="hover:underline"
                      onClick={e => {
                        e.preventDefault();
                        navigate("/");
                        setTimeout(() => {
                          const section = document.getElementById(link.id);
                          if (section) section.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return link.path.startsWith("/") ? (
                  <Link key={link.id} to={link.path} className="hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.id} href={link.path} className="hover:underline">
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen((m) => !m)}
              className="md:hidden p-2 rounded-md"
              aria-label="open menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button
              className="relative p-2 rounded-lg border flex items-center gap-2"
              aria-label="cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={18} />
              <span className="sr-only">Cart</span>
              <span className="text-sm font-medium">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) =>
                  link.path.startsWith("/") ? (
                    <Link
                      key={link.id}
                      to={link.path}
                      className="py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.id}
                      href={link.path}
                      className="py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN CONTENT */}
      <main className="px-6 sm:px-10 lg:px-20 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-slate-800">Sweet Selections</h1>
          <p className="mt-2 text-slate-600">Browse our collection or customize your own cake 🍰</p>
          {cartCount > 0 && (
            <div className="mt-3 inline-block px-4 py-2 rounded-lg bg-rose-100 text-rose-700 font-medium">
              🛒 {cartCount} item{cartCount > 1 ? "s" : ""} in cart
            </div>
          )}
        </motion.div>

        {/* Buttons */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(true)}
            className="px-6 py-3 bg-slate-100 text-slate-800 font-semibold rounded-xl shadow hover:bg-slate-200 transition"
          >
            Filters
          </button>
          <button
            onClick={() => setShowCustomizer(true)}
            className="px-6 py-3 bg-rose-500 text-white font-semibold rounded-xl shadow hover:bg-rose-700 transition"
          >
            Customize Your Cake
          </button>
        </div>

        {/* Product grid */}
        <ProductGrid
          products={products}
          loading={loading}
          wishList={wishList}
          toggleWish={toggleWish}
          addToCart={addToCart}
        />

        {/* Filters sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
                className="bg-white w-80 max-w-full h-full shadow-xl overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <Filters onApply={handleApplyFilters} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cake Customizer */}
        <AnimatePresence>
          {showCustomizer && (
            <CakeCustomizer
              isOpen={showCustomizer}
              onClose={() => setShowCustomizer(false)}
              onSubmit={handleSubmitCustomCake}
            />
          )}
        </AnimatePresence>
      </main>

      <FooterSection />

      {/* CART MODAL */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg md:max-h-[90vh] overflow-y-auto relative"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Your Cart ({cart.length})</h3>
                <button onClick={() => setIsCartOpen(false)} aria-label="close cart">
                  <X size={24} className="text-slate-500 hover:text-slate-800" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <ShoppingCart size={48} className="mx-auto text-slate-300" />
                  <p className="mt-2">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <ul className="space-y-4 pr-2">
                    {cart.map((item) => (
                      <li
                        key={item.type === "product" ? item.product._id : item.customCake.id}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={
                            item.type === "product"
                              ? item.product.image?.trim() || "/placeholder.png"
                              : "/custom-placeholder.png"
                          }
                          alt={item.type === "product" ? item.product.name : "Custom Cake"}
                          className="w-24 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {item.type === "product"
                              ? item.product.name
                              : `${item.customCake.flavor} Cake (${item.customCake.size}, ${item.customCake.layers} layers)`}
                          </h4>
                          <div className="text-sm text-slate-500">
                            GHS{" "}
                            {item.type === "product" ? item.product.price : item.customCake.totalPrice}
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          {item.type === "product" && (
                            <>
                              <button
                                onClick={() => removeFromCart(item.product)}
                                className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                              >
                                -
                              </button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => addToCart(item.product)}
                                className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                              >
                                +
                              </button>
                            </>
                          )}

                          {item.type === "custom" && (
                            <>
                              <button
                                onClick={() => removeCustomCakeFromCart(item.customCake.id)}
                                className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                              >
                                -
                              </button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              {/* NOTE: You probably don't want to increment custom cake quantity */}
                              {/* as a new custom cake has a unique ID and should be added as a new item */}
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>GHS {cart.reduce((total, item) => {
                      if (item.type === "product") return total + (item.product.price || 0) * item.quantity;
                      if (item.type === "custom") return total + (item.customCake.totalPrice || 0) * item.quantity;
                      return total;
                    }, 0).toFixed(2)}</span>
                  </div>

                  {/* Proceed to Checkout */}
                  <div className="mt-6">
                    <button
                      className="w-full py-3 rounded-lg bg-rose-500 text-white font-medium shadow-md hover:bg-rose-600 transition-colors"
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};