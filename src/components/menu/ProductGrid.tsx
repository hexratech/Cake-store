import { motion } from "framer-motion";
import type { Product } from "@/api/index";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  wishList: Record<string, boolean>;
  onToggleWish: (id: string) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  wishList,
  onToggleWish,
  onAddToCart,
}) => {
  return (
    <section className="mt-10 px-4 sm:px-8 lg:px-12">
      {/* Section Heading */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Our Menu
        </h2>
        <div className="mt-2 sm:mt-0 text-sm font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
          Freshly baked, daily delights ✨
        </div>
      </motion.div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isWished={!!wishList[product._id]}
            onToggleWish={onToggleWish}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};