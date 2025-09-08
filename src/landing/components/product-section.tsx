// src/components/landing/components/products-section.tsx
import type { Product } from "@/api/index";
import { ProductCard } from "./product-card";

type ProductsSectionProps = {
  products: Product[];
  wishList: Record<string, boolean>;
  addToCart: (p: Product) => void;
  toggleWish: (id: string) => void;
};

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  wishList,
  addToCart,
  toggleWish,
}) => {
  return (
    <section id="products" className="mt-12 rounded-[2rem] shadow-2xl p-8 lg:p-12 bg-white">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">Today's Treats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            isWished={!!wishList[p._id]}
            toggleWish={toggleWish}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
};
