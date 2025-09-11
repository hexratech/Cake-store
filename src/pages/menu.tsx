import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Filters } from "../components/menu/Filters";
import { CakeCustomizer } from "../components/menu/CakeCustomizer";
import { NAV_LINKS } from "../types/navs";
import { useCart } from "../hooks/useCart";
import { FooterSection } from "../landing/components/footer";

import {
  fetchProducts,
  addFavorite,
  removeFavorite,
  requestCustomCake,
} from "../api";

import type { Product, CustomCakeData } from "@/api/index";

export const MenuPage: React.FC = () => {
  const { cart, addToCart, removeFromCart, cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishList, setWishList] = useState<Record<string, boolean>>({});
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch products and filter for published ones
  useEffect(() => {
    fetchProducts()
      .then((data: Product[]) => {
        const publishedProducts = data.filter((p) => p.isPublished);
        setProducts(publishedProducts);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const toggleWish = async (product: Product) => {
    const productId = product._id;
    setWishList((w) => ({ ...w, [productId]: !w[productId] }));

    try {
      if (!wishList[productId]) {
        await addFavorite(productId, "guest@example.com");
      } else {
        await removeFavorite(productId);
      }
    } catch (err) {
      console.error("Favorite API error:", err);
    }
  };

  const cartItems = cart.map((i) => ({
    product: i.product,
    quantity: i.quantity,
  }));

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleSubmitCustomCake = async (customCakeData: CustomCakeData) => {
    try {
      const res = await requestCustomCake(customCakeData);
      if (res?.id) {
        alert("Custom cake request submitted successfully!");
        setShowCustomizer(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        alert(`Failed to submit custom cake request: ${err.message}`);
      } else {
        console.error(err);
        alert("Failed to submit custom cake request.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-slate-800">
      {/* NAV */}
      <nav className="bg-white/60 backdrop-blur sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="logo.png"
              alt="3vivi bakery"
              className="h-10 w-auto rounded-md"
            />
            <div className="hidden md:flex items-center gap-4 text-sm text-slate-700">
              {NAV_LINKS.map((link) => {
                let to = link.path;
                if (link.id === "products") to = "/#products";
                if (link.id === "about") to = "/#about";
                if (link.id === "contact") to = "/#contact";
                if (["products", "about", "contact"].includes(link.id)) {
                  return (
                    <a key={link.id} href={to} className="hover:underline">
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link key={link.id} to={link.path} className="hover:underline">
                    {link.label}
                  </Link>
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
              <span className="text-sm font-medium">{cartCount}</span>
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
                {NAV_LINKS.map((link) => {
                  let to = link.path;
                  if (link.id === "products") to = "/#products";
                  if (link.id === "about") to = "/#about";
                  if (link.id === "contact") to = "/#contact";
                  if (["products", "about", "contact"].includes(link.id)) {
                    return (
                      <a
                        key={link.id}
                        href={to}
                        className="py-2"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={link.id}
                      to={link.path}
                      className="py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN CONTENT */}
      <main className="px-6 sm:px-10 lg:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-slate-800">Our Menu</h1>
          <p className="mt-2 text-slate-600">
            Browse our collection or customize your own cake 🍰
          </p>
          {cartCount > 0 && (
            <div className="mt-3 inline-block px-4 py-2 rounded-lg bg-rose-100 text-rose-700 font-medium">
              🛒 {cartCount} item{cartCount > 1 ? "s" : ""} in cart
            </div>
          )}
        </motion.div>

        <Filters
          onApply={(query: string) => {
            setProducts((prevProducts) =>
              prevProducts.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
              )
            );
          }}
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.article
              key={p._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="relative aspect-square">



                <motion.img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  whileHover={{ scale: 1.05 }}
                />
                <motion.button
                  className="absolute right-3 top-3 bg-white/90 p-2 rounded-full shadow hover:bg-rose-100 transition"
                  onClick={() => toggleWish(p)}
                  aria-label="wishlist"
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    size={18}
                    className={`${
                      wishList[p._id] ? "text-rose-500 fill-rose-500" : "text-slate-600"
                    }`}
                  />
                </motion.button>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg text-slate-800">{p.name}</h3>
                <p className="text-sm text-slate-500 mt-1 flex-1">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-lg font-bold text-rose-600">
                    GHS {p.price}
                  </div>
                  <motion.button
                    onClick={() => addToCart(p)}
                    className="px-3 py-2 flex items-center justify-center gap-2 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600 transition"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Customizer Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowCustomizer(true)}
            className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl shadow hover:bg-rose-700 transition"
          >
            Customize Your Cake
          </button>
        </div>

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
                <h3 className="text-xl font-bold">Your Cart ({cartCount})</h3>
                <button onClick={() => setIsCartOpen(false)} aria-label="close cart">
                  <X size={24} className="text-slate-500 hover:text-slate-800" />
                </button>
              </div>

              {cartCount === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <ShoppingCart size={48} className="mx-auto text-slate-300" />
                  <p className="mt-2">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <ul className="space-y-4 pr-2">
                    {cartItems.map(({ product, quantity }) => {
                      if (!product) return null; // FIX: Ensure product exists
                      return (
                        <li key={product._id} className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            <div className="text-sm text-slate-500">
                              GHS {product.price}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(product)}
                              className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{quantity}</span>
                            <button
                              onClick={() => addToCart(product)}
                              className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Total & Checkout */}
                  <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>GHS {cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="mt-6">
                    <button
                      className="w-full py-3 rounded-lg bg-rose-500 text-white font-medium shadow-md hover:bg-rose-600 transition-colors"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/checkout");
                      }}
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