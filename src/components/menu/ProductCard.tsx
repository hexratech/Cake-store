import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../types/data/products";

interface ProductCardProps {
  product: Product;
  isWished: boolean;
  onToggleWish: (id: string) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWished,
  onToggleWish,
  onAddToCart,
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
      <div className="relative aspect-square">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
        />
        <motion.button
          className="absolute right-4 top-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-rose-100 transition"
          onClick={() => onToggleWish(product.id)}
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
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-xl text-slate-800">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mt-2 flex-1">
          {product.description}
        </p>

        {/* Price + Add to Cart */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="text-xl font-bold text-rose-600">
            GHS {product.priceGHS.toFixed(2)}
          </div>

          <motion.button
            onClick={() => onAddToCart(product)}
            className="px-4 py-2 flex items-center gap-2 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors shadow-md"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};