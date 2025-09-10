// src/components/landing/components/products-section.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  // Use useMemo to prevent recalculating the daily products on every render
  const dailyProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    // Get the current day of the year (0-365) to create a daily rotation
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Calculate the start index for the slice
    const startIndex = (dayOfYear * 4) % products.length;

    // Slice the products array to get 4 products
    let selectedProducts = products.slice(startIndex, startIndex + 4);

    // If there aren't enough products to fill the slice, wrap around
    if (selectedProducts.length < 4) {
      const remaining = 4 - selectedProducts.length;
      selectedProducts = selectedProducts.concat(products.slice(0, remaining));
    }

    return selectedProducts;
  }, [products]);

  return (
    <section id="products" className="mt-12 rounded-[2rem] shadow-2xl p-8 lg:p-12 bg-white">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">Today's Treats</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dailyProducts.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            isWished={!!wishList[p._id]}
            toggleWish={toggleWish}
            addToCart={addToCart}
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/menu"
          className="inline-block bg-rose-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-rose-600 transition-colors duration-300"
        >
          View More Products
        </Link>
      </div>
    </section>
  );
};