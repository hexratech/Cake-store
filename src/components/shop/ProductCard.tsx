import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/api/index";

interface ProductCardProps {
  product: Product;
  isWished: boolean;
  toggleWish: (id: string) => void;
  addToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWished,
  toggleWish,
  addToCart,
}) => {
  return (
    <motion.article
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden group border border-rose-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Image + Wishlist */}
      {/* This div container is the key to consistent image sizing */}
      <div className="relative w-full aspect-square overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          // The object-cover class ensures the image fills the container without stretching
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
        />
        <motion.button
          className="absolute right-3 top-3 bg-white/90 p-2 rounded-full shadow-lg hover:bg-rose-100 transition"
          onClick={() => toggleWish(product._id)}
          aria-label="wishlist"
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            size={20}
            className={
              isWished ? "text-rose-500 fill-rose-500" : "text-slate-500"
            }
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-1">
          {product.name}
        </h3>
        <h3 className="font-bold text-sm sm:text-lg text-slate-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Price + Add to Cart */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-lg font-bold text-rose-600">
            GHS {product.price.toFixed(2)}
          </div>

          <motion.button
            onClick={() => addToCart(product)}
            className="px-3 py-2 flex items-center gap-2 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors shadow-md text-sm"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={16} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};