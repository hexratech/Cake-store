// src/components/landing/components/product-card.tsx
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/api/index";

type ProductCardProps = {
  product: Product;
  isWished: boolean;
  toggleWish: (id: string) => void;
  addToCart: (product: Product) => void; // ✅ add this
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWished,
  toggleWish,
  addToCart,
}) => {
  return (
    <motion.article
      key={product._id}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Image + Wishlist */}
      <div className="relative aspect-square">
        <motion.img
          src={
            product.image.startsWith("http")
              ? product.image
              : `${import.meta.env.VITE_API_URL}${product.image}`
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
        />
        <motion.button
          className="absolute right-3 top-3 bg-white/90 p-2 rounded-full shadow hover:bg-rose-100 transition"
          onClick={() => toggleWish(product._id)}
          aria-label="wishlist"
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            size={18}
            className={`${isWished ? "text-rose-500 fill-rose-500" : "text-slate-600"}`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-slate-800">{product.name}</h3>
        <p className="text-sm text-slate-500 mt-1 flex-1">{product.description}</p>

        {/* Price + Cart */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-bold text-rose-600">GHS {product.price}</div>
          <motion.button
            onClick={() => addToCart(product)}
            className="px-3 py-2 flex items-center gap-2 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600 transition"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={16} /> Add
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};
