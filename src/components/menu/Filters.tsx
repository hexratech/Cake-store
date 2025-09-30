import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// The image import was causing a compilation error, so we'll use a placeholder URL instead.
// import filtersidebar from "../../assets/filtersiderbar.jpg";

// FIX: Removed import.meta.env.VITE_API_URL as it is not supported in the target environment.
// Please manually update this URL if your API is hosted elsewhere.
const API_URL = "http://localhost:8080";

interface FiltersProps {
  onApply: (url: string) => void; // send full API URL
}

interface FilterState {
  category: string;
  flavor: string;
  priceRange: string;
  sort: string;
}

export const Filters: React.FC<FiltersProps> = ({ onApply }) => {
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    flavor: "All",
    priceRange: "All",
    sort: "Newest",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<string[]>([]);

  // ✅ Fetch categories and flavors dynamically from backend
  useEffect(() => {
    // Added the /api prefix to the fetch calls
    fetch(`${API_URL}/api/products/categories`)
      .then((res) => res.json())
      .then((data: string[]) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));

    fetch(`${API_URL}/api/products/flavors`)
      .then((res) => res.json())
      .then((data: string[]) => setFlavors(data))
      .catch((err) => console.error("Failed to fetch flavors:", err));
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Build query params for backend
  const buildQuery = () => {
    const params = new URLSearchParams();
    const { category, flavor, priceRange, sort } = filters;

    if (category !== "All") params.append("category", category.toLowerCase());
    if (flavor !== "All") params.append("flavor", flavor.toLowerCase());

    // Price range mapping
    const priceMap: Record<string, { minPrice?: string; maxPrice?: string }> = {
      "Under GHS 100": { maxPrice: "100" },
      "GHS 100 – 200": { minPrice: "100", maxPrice: "200" },
      "Above GHS 200": { minPrice: "200" },
    };
    if (priceRange !== "All" && priceMap[priceRange]) {
      const { minPrice, maxPrice } = priceMap[priceRange];
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
    }

    // Sort mapping
    const sortMap: Record<string, string> = {
      "Price: Low to High": "priceAsc",
      "Price: High to Low": "priceDesc",
      Newest: "newest",
      Popular: "popular",
    };
    params.append("sort", sortMap[sort]);

    return params.toString();
  };

  const handleApplyFilters = () => {
    const query = buildQuery();
    // Added the /api prefix here as well
    const url = `${API_URL}/api/products?${query}`; // ✅ full backend URL
    console.log("Applying filters with URL:", url); // Add this line for debugging
    onApply(url);
    setOpen(false);
  };

  return (
    <div
      className="mb-6 relative rounded-xl overflow-hidden"
      style={{
        // Using a placeholder image to fix the compilation error
        backgroundImage: `url(https://placehold.co/600x400/fff4f0/222?text=Filters)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      <div className="relative p-4">
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
                <label
                  htmlFor="category"
                  className="font-medium text-slate-700"
                >
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>All</option>
                  {categories.map((cat) => (
                    <option key={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Flavor */}
              <div>
                <label htmlFor="flavor" className="font-medium text-slate-700">
                  Flavor
                </label>
                <select
                  name="flavor"
                  value={filters.flavor}
                  onChange={handleFilterChange}
                  className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                >
                  <option>All</option>
                  {flavors.map((flav) => (
                    <option key={flav}>
                      {flav.charAt(0).toUpperCase() + flav.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label
                  htmlFor="priceRange"
                  className="font-medium text-slate-700"
                >
                  Price Range
                </label>
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
                <label htmlFor="sort" className="font-medium text-slate-700">
                  Sort By
                </label>
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
