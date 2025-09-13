// src/components/menu/Filters.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import filtersidebar from "../../assets/filtersiderbar.jpg";

interface FiltersProps {
  onApply: (query: string) => void;
}

// Consolidate filter options into a single component
export const Filters: React.FC<FiltersProps> = ({ onApply }) => {
  const [open, setOpen] = useState(true);

  // Use a single state object for all filter selections
  const [filters, setFilters] = useState({
    category: "All",
    flavor: "All",
    priceRange: "All",
    sort: "Newest",
  });

  // A more concise way to handle state changes
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    const { category, flavor, priceRange, sort } = filters;

    if (category !== "All") params.append("category", category.toLowerCase());
    if (flavor !== "All") params.append("flavor", flavor.toLowerCase());

    // Use a map or switch for a cleaner price range logic
    const priceMap: Record<string, { minPrice?: string; maxPrice?: string }> = {
      "Under GHS 100": { maxPrice: "100" },
      "GHS 100 – 200": { minPrice: "100", maxPrice: "200" },
      "Above GHS 200": { minPrice: "200" },
    };

    if (priceMap[priceRange]) {
      const { minPrice, maxPrice } = priceMap[priceRange];
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
    }

    // Use a map for cleaner sort logic
    const sortMap: Record<string, string> = {
      "Price: Low to High": "priceAsc",
      "Price: High to Low": "priceDesc",
      "Newest": "newest",
      "Popular": "popular",
    };
    params.append("sort", sortMap[sort]);

    return params.toString();
  };

  const handleApplyFilters = () => {
    const query = buildQuery();
    onApply(query);
    setOpen(false);
  };

  return (
    <div
      className="mb-6 relative rounded-xl overflow-hidden"
      style={{
        backgroundImage: `url(${filtersidebar})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative p-4">
        {/* Title */}
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Category */}
              <div>
                <label htmlFor="category" className="font-medium text-slate-700">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>All</option>
                  <option>Cakes</option>
                  <option>Cupcakes</option>
                  <option>Pastries</option>
                </select>
              </div>

              {/* Flavor */}
              <div>
                <label htmlFor="flavor" className="font-medium text-slate-700">Flavor</label>
                <select
                  name="flavor"
                  value={filters.flavor}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>All</option>
                  <option>Chocolate</option>
                  <option>Vanilla</option>
                  <option>Red Velvet</option>
                  <option>Strawberry</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label htmlFor="priceRange" className="font-medium text-slate-700">Price Range</label>
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>All</option>
                  <option>Under GHS 100</option>
                  <option>GHS 100 – 200</option>
                  <option>Above GHS 200</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="sort" className="font-medium text-slate-700">Sort By</label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Popular</option>
                </select>
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full py-3 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition"
              >
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};