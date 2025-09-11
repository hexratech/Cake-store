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
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group border border-rose-100 h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Image + Wishlist */}
      <div className="relative w-full h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 flex-shrink-0">
        <motion.img
          src={
            product.image.startsWith("http")
              ? product.image
              : `${import.meta.env.VITE_API_URL}${product.image}`
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
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
      <div className="p-4 flex-1 flex flex-col min-h-0">
        <h3 className="font-semibold text-lg text-slate-800 truncate">{product.name}</h3>
        <p className="text-sm text-slate-500 mt-1 flex-1 overflow-hidden text-ellipsis line-clamp-2">{product.description}</p>

        {/* Price + Cart - stacked on very small screens */}
        <div className="mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
          <div className="text-base font-semibold text-rose-600 whitespace-nowrap">GHS {product.price}</div>
          <motion.button
            onClick={() => addToCart(product)}
            className="w-full xs:w-auto px-2 py-2 flex items-center justify-center gap-1 rounded-md bg-rose-500 text-white text-xs hover:bg-rose-600 transition min-w-0"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={13} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};
