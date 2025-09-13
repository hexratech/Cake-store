// src/pages/components/home.tsx
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import type { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../types/navs";
import type { Product } from "@/api/index";
import { HeroSection } from "../landing/components/hero";
import { ProductsSection } from "../landing/components/product-section";
import { AboutSection } from "../landing/components/about";
import { ContactSection } from "../landing/components/contact";
import { FooterSection } from "../landing/components/footer";
import { ServicesSection } from "../landing/components/services";
import { FaqSection } from "../landing/components/fqs";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";

export default function CakeShop(): JSX.Element {
  const { cart, addToCart, removeFromCart, cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>("birthday");
  const [wishList, setWishList] = useState<Record<string, boolean>>({});
  const [rating] = useState(4.6);
  const [reviews] = useState([
    { id: "1", name: "Newton", text: "Delicious cake and friendly service!", stars: 5 },
    { id: "2", name: "May", text: "Custom wedding cake was stunning.", stars: 5 },
    { id: "3", name: "Spenzy", text: "Quick delivery but would like more flavor options.", stars: 4 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data: Product[] = await res.json();
        setProducts(data.filter((p) => p.isPublished));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const toggleWish = (_id: string) => {
    setWishList((w) => ({ ...w, [_id]: !w[_id] }));
  };

  // Calculate total
  const cartTotal = cart.reduce((total, item) => {
    if (item.type === "product") return total + (item.product.price || 0) * item.quantity;
    if (item.type === "custom") return total + (item.customCake.totalPrice || 0) * item.quantity;
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-slate-800">
      {/* NAV */}
      <nav className="bg-white/60 backdrop-blur sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="logo.png" alt="3vivi bakery" className="h-10 w-auto rounded-md" />
            <div className="hidden md:flex items-center gap-4 text-sm text-slate-700">
              {NAV_LINKS.map((link) =>
                link.id === "menu" ? (
                  <Link key={link.id} to="/menu" className="hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.id} href={`#${link.id}`} className="hover:underline">
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
                  link.id === "menu" ? (
                    <Link key={link.id} to="/menu" className="py-2" onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.id} href={`#${link.id}`} className="py-2" onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </a>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <AboutSection selectedType={selectedType} setSelectedType={setSelectedType} />
          <ProductsSection products={products} wishList={wishList} addToCart={addToCart} toggleWish={toggleWish} />
          <ServicesSection />
          <FaqSection />
          <ContactSection rating={rating} reviews={reviews} />
        </div>
      </main>

      <FooterSection />

      {/* Cart Dialog */}
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

              {cart.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <ShoppingCart size={48} className="mx-auto text-slate-300" />
                  <p className="mt-2">Your cart is empty.</p>
                </div>
              ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {cart.map((item) => {
                    const name = item.type === "product" ? item.product.name : `${item.customCake.flavor} Cake`;
                    const price = item.type === "product" ? item.product.price : item.customCake.totalPrice;
                    const image = item.type === "product" ? item.product.image || "/placeholder.png" : "/custom-placeholder.png";

                    return (
                      <li key={item.type === "product" ? item.product._id : item.customCake.id} className="flex items-center gap-4">
                        <img src={image} alt={name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{name}</h4>
                          <div className="text-sm text-slate-500">GHS {price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (item.type === "product") removeFromCart(item.product);
                              else removeFromCart(item.customCake as unknown as Product);
                            }}
                            className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (item.type === "product") addToCart(item.product);
                              else addToCart(item.customCake as unknown as Product);
                            }}
                            className="px-2 py-1 border rounded-lg hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {cart.length > 0 && (
                <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>GHS {cartTotal.toFixed(2)}</span>
                  <button
                    className="w-full mt-4 py-3 rounded-lg bg-rose-500 text-white font-medium shadow-md hover:bg-rose-600 transition-colors"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
