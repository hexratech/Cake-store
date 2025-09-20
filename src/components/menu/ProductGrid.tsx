import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/api/index";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  wishList: Record<string, boolean>;
  toggleWish: (product: Product) => void;
  addToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  wishList,
  toggleWish,
  addToCart,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading
        ? // Skeleton loader
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md animate-pulse overflow-hidden"
            >
              <div className="w-full aspect-square bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-5/6" />
                <div className="flex items-center justify-between mt-3">
                  <div className="h-5 bg-slate-200 rounded w-16" />
                  <div className="h-8 bg-slate-300 rounded-lg w-20" />
                </div>
              </div>
            </div>
          ))
        : // Render actual products
          products.map((p, i) => (
            <motion.article
              key={p._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Image + Wishlist */}
              <div className="relative w-full aspect-square overflow-hidden">
                <motion.img
                  src={
                    p.image?.startsWith("http")
                      ? p.image
                      : p.image
                      ? `${import.meta.env.VITE_API_URL}${p.image}`
                      : "/placeholder.png"
                  }
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
                    className={
                      wishList[p._id]
                        ? "text-rose-500 fill-rose-500"
                        : "text-slate-600"
                    }
                  />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1 flex-1 line-clamp-2">
                  {p.description}
                </p>

                {/* Price + Cart */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-lg font-bold text-rose-600 text-center sm:text-left">
                    GHS {p.price.toFixed(2)}
                  </div>
                  <motion.button
                    onClick={() => {
                      addToCart(p);
                      const cartIcon = document.getElementById('navbar-cart-icon');
                      toast("Added to cart", {
                        description: (
                          <span className="text-slate-700">{p.name} has been added to your cart.</span>
                        ),
                        position: "top-right",
                        ...(cartIcon ? { anchor: cartIcon } : {}),
                      });
                    }}
                    className="w-full sm:w-auto px-3 py-2 flex items-center justify-center gap-2 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600 transition"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingCart size={16} />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
    </div>
  );
};
