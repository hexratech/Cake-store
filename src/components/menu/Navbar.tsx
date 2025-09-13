// src/components/menu/Navbar.tsx
import React, { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/types/navs";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, removeFromCart, removeCustomCakeFromCart } = useCart();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    if (item.type === "product") return sum + item.product.price * item.quantity;
    if (item.type === "custom") return sum + item.customCake.totalPrice * item.quantity;
    return sum;
  }, 0);

  return (
    <nav className="bg-white/60 backdrop-blur sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="logo.png" alt="3vivi bakery" className="h-10 w-auto rounded-md" />
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-700">
            {NAV_LINKS.map((link) =>
              link.path.startsWith("/") ? (
                <Link key={link.id} to={link.path} className="hover:underline">
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={link.path} className="hover:underline">
                  {link.label}
                </a>
              )
            )}
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

      {/* Cart Popup */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto relative"
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
                  <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <li
                        key={item.type === "product" ? item.product._id : item.customCake.id}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={
                            item.type === "product"
                              ? item.product.image || "/placeholder.png"
                              : "/custom-placeholder.png"
                          }
                          alt={item.type === "product" ? item.product.name : "Custom Cake"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {item.type === "product"
                              ? item.product.name
                              : `${item.customCake.flavor} Cake`}
                          </h4>
                          <div className="text-sm text-slate-500">
                            GHS{" "}
                            {item.type === "product"
                              ? item.product.price
                              : item.customCake.totalPrice}
                          </div>
                        </div>

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
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>GHS {cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="mt-6">
                    <button
                      className="w-full py-3 rounded-lg bg-rose-500 text-white font-medium shadow-md hover:bg-rose-600 transition-colors"
                      onClick={() => alert("Proceeding to checkout!")}
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
    </nav>
  );
};
