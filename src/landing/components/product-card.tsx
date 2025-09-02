import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../types/data/products";

export const ProductsSection: React.FC<{
  products: Product[];
  wishList: Record<string, boolean>;
  addToCart: (p: Product) => void;
  toggleWish: (id: string) => void;
}> = ({ products, wishList, addToCart, toggleWish }) => {
  return (
    <section
      id="products"
      className="mt-12 rounded-[2rem] shadow-2xl p-8 lg:p-12 bg-white"
    >
      {/* Section Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-extrabold text-slate-800">Today's Treats</h2>
        <div className="text-sm text-slate-600">Prices in GHS</div>
      </motion.div>

      {/* Product Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <motion.article
            key={p.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            {/* Image + Wishlist */}
            <div className="relative aspect-square">
              <motion.img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
              />
              <motion.button
                className="absolute right-3 top-3 bg-white/90 p-2 rounded-full shadow hover:bg-rose-100 transition"
                onClick={() => toggleWish(p.id)}
                aria-label="wishlist"
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  size={18}
                  className={`${
                    wishList[p.id]
                      ? "text-rose-500 fill-rose-500"
                      : "text-slate-600"
                  }`}
                />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg text-slate-800">{p.name}</h3>
              <p className="text-sm text-slate-500 mt-1 flex-1">
                {p.description}
              </p>

              {/* Price + Cart */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-lg font-bold text-rose-600">
                  GHS {p.priceGHS}
                </div>
                <motion.button
                  onClick={() => addToCart(p)}
                  className="px-3 py-2 flex items-center gap-2 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600 transition"
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={16} />
                  Add
                </motion.button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
