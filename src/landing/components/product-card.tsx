// src/components/landing/components/product-card.tsx
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import {toast} from "sonner";
import type { Product } from "@/api/index";

type ProductCardProps = {
  product: Product;
  isWished: boolean;
  toggleWish: (id: string) => void;
  addToCart: (product: Product) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWished,
  toggleWish,
  addToCart,
}) => {
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    const cartIcon = document.getElementById('navbar-cart-icon');
    toast("Added to cart", {
      description: (
        <span className="text-slate-700">{product.name} has been added to your cart.</span>),
      position: "top-right",
      ...(cartIcon ? { anchor: cartIcon } : {}),
    });

  };
  return (
    <motion.article
      key={product._id}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group border border-rose-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Image + Wishlist */}
      <div className="relative w-full aspect-square overflow-hidden">
        <motion.img
          src={
            product.image?.startsWith("http")
              ? product.image
              : `${import.meta.env.VITE_API_URL}${product.image}`
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
        />
        <motion.button
          className="absolute right-3 top-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-rose-100 transition"
          onClick={() => toggleWish(product._id)}
          aria-label="wishlist"
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            size={18}
            className={isWished ? "text-rose-500 fill-rose-500" : "text-slate-600"}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
  <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Price + Cart */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-base font-bold text-rose-600 text-center sm:text-left">
            GHS {product.price.toFixed(2)}
          </div>
          <motion.button
            onClick={() => handleAddToCart(product)}
            className="w-full sm:w-auto px-3 py-2 flex items-center justify-center gap-1 rounded-full bg-rose-500 text-white text-xs sm:text-sm hover:bg-rose-600 transition shadow-md"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={14} /> <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};
