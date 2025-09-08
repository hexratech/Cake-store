// src/pages/menu/components/Filters.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

interface FiltersProps {
  onApply: (query: string) => void; // parent passes fetchProducts
}

export const Filters: React.FC<FiltersProps> = ({ onApply }) => {
  const [open, setOpen] = useState(false);

  // Filter state
  const [category, setCategory] = useState("All");
  const [flavor, setFlavor] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sort, setSort] = useState("Newest");

  // Build query string to send to backend
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (category !== "All") params.append("category", category.toLowerCase());
    if (flavor !== "All") params.append("flavor", flavor.toLowerCase());

    if (priceRange === "Under GHS 100") params.append("maxPrice", "100");
    if (priceRange === "GHS 100 – 200") {
      params.append("minPrice", "100");
      params.append("maxPrice", "200");
    }
    if (priceRange === "Above GHS 200") params.append("minPrice", "200");

    if (sort === "Price: Low to High") params.append("sort", "priceAsc");
    if (sort === "Price: High to Low") params.append("sort", "priceDesc");
    if (sort === "Newest") params.append("sort", "newest");
    if (sort === "Popular") params.append("sort", "popular");

    return params.toString();
  };

  const handleApplyFilters = () => {
    const query = buildQuery();
    onApply(query);
    setOpen(false);
  };

  return (
    <div className="mb-6">
      {/* Toggle Button (Mobile Friendly) */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-3 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition lg:hidden"
      >
        <SlidersHorizontal size={20} />
        Filters
      </button>

      {/* Desktop Filters (always visible) */}
      <div className="hidden lg:grid grid-cols-4 gap-6 mt-4">
        <FilterOptions
          category={category}
          setCategory={setCategory}
          flavor={flavor}
          setFlavor={setFlavor}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sort={sort}
          setSort={setSort}
        />
        <button
          onClick={handleApplyFilters}
          className="py-3 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition mt-2"
        >
          Apply Filters
        </button>
      </div>

      {/* Mobile Filters (collapsible) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 bg-white rounded-xl shadow-md p-4 space-y-4"
          >
            <FilterOptions
              category={category}
              setCategory={setCategory}
              flavor={flavor}
              setFlavor={setFlavor}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sort={sort}
              setSort={setSort}
            />
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
  );
};

interface FilterOptionsProps {
  category: string;
  setCategory: (value: string) => void;
  flavor: string;
  setFlavor: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  category,
  setCategory,
  flavor,
  setFlavor,
  priceRange,
  setPriceRange,
  sort,
  setSort,
}) => {
  return (
    <>
      {/* Category */}
      <div>
        <label htmlFor="category" className="font-medium text-slate-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
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
  <label htmlFor="priceRange" className="font-medium text-slate-700">
    Price Range
  </label>
  <select
    id="priceRange"
    value={priceRange}
    onChange={(e) => setPriceRange(e.target.value)}
    className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
  >
    <option>All</option>
    <option>Under GHS 100</option>
    <option>GHS 100 – 200</option>
    <option>Above GHS 200</option>
  </select>
</div>

<div>
  <label htmlFor="sort" className="font-medium text-slate-700">
    Sort By
  </label>
  <select
    id="sort"
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
  >
    <option>Newest</option>
    <option>Price: Low to High</option>
    <option>Price: High to Low</option>
    <option>Popular</option>
  </select>
</div>

    </>
  );
};
