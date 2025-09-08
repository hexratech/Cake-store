import { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Archive,
  Star,
  Package,
  ChevronDown,
} from "lucide-react";
import AdminLayout from "@/admin/components/AdminLayout";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image?: string;
  category?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("cake");
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Page-level state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const productCategories = ["cake", "cupcake", "pastry", "custom"];

  // Fetch products
  const fetchProducts = useCallback(async () => {
    // FIX: Get the token just before the API call
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLoading(false);
      console.error("Admin token not found. Please log in.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies here because the token is read inside the function

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open modal and reset form
  const openModal = (product: Product | null) => {
    setEditingProduct(product);
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setDiscountPrice(product.discountPrice || null);
      setStock(product.stock);
      setCategory(product.category || "cake");
      setIsPublished(product.isPublished || false);
      setIsFeatured(product.isFeatured || false);
      setImageFile(null); // Clear image file on open to prevent stale data
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setDiscountPrice(null);
      setStock(0);
      setCategory("cake");
      setIsPublished(false);
      setIsFeatured(false);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("You are not authorized to perform this action. Please log in.");
      return;
    }

    if (discountPrice && discountPrice >= price) {
      alert("Discount price must be less than regular price");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    if (discountPrice !== null) {
      formData.append("discountPrice", discountPrice.toString());
    }
    formData.append("stock", stock.toString());
    formData.append("category", category);
    formData.append("isPublished", isPublished.toString());
    formData.append("isFeatured", isFeatured.toString());
    if (imageFile) formData.append("image", imageFile);

    try {
      const url = editingProduct
        ? `${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`
        : `${import.meta.env.VITE_API_URL}/api/products`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save product: ${errorText}`);
      }
      await fetchProducts();
      setIsModalOpen(false);
      alert(editingProduct ? "Product updated!" : "Product added!");
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  // Handle product deletion
  const handleDelete = async (id: string) => {
    // FIX: Get the token just before the API call to ensure it's up-to-date
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("You are not authorized to perform this action. Please log in.");
      return;
    }

    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete product: ${errorText}`);
      }
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: "archive" | "delete") => {
    if (
      !confirm(
        `Are you sure you want to ${action} ${selectedProducts.length} products?`
      )
    )
      return;

    console.log(`Performing bulk ${action} on:`, selectedProducts);
    setSelectedProducts([]);
  };

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" && product.isPublished) ||
      (statusFilter === "Draft" && !product.isPublished) ||
      (statusFilter === "Low Stock" &&
        (product.stock || 0) <= 5 &&
        (product.stock || 0) > 0) ||
      (statusFilter === "Out of Stock" && (product.stock || 0) === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <p>Loading products...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Products
          </h1>
          <button
            onClick={() => openModal(null)}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl shadow-lg hover:bg-rose-700 transition transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 appearance-none bg-white px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="All">All Categories</option>
              {productCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 appearance-none bg-white px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-100 rounded-lg shadow-inner">
            <span className="text-sm font-medium text-gray-700">
              {selectedProducts.length} items selected
            </span>
            <button
              onClick={() => handleBulkAction("archive")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-200 transition"
            >
              <Archive className="w-4 h-4" />
              Archive
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-white rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products match your criteria.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="relative bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex flex-col transition-all hover:shadow-xl hover:scale-[1.01]"
              >
                {/* Checkbox for bulk actions */}
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts([...selectedProducts, product._id]);
                    } else {
                      setSelectedProducts(
                        selectedProducts.filter((id) => id !== product._id)
                      );
                    }
                  }}
                  className="absolute top-4 left-4 z-10 w-5 h-5 text-rose-600 bg-white border-gray-300 rounded focus:ring-rose-500"
                />

                {/* Product Image */}
                <img
  src={
    product.image?.startsWith("http")
      ? product.image
      : `${import.meta.env.VITE_API_URL}${product.image}`
  }
  alt={product.name}
  className="w-full h-48 object-cover rounded-lg mb-4"
/>


                {/* Product Status Badges */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  {product.isFeatured && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  {product.isPublished ? (
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="text-lg font-bold text-gray-800 mt-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Package className="w-4 h-4 text-gray-400" />
                  Category:{" "}
                  <span className="font-medium">{product.category}</span>
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-extrabold text-rose-600">
                    GH₵{product.price.toFixed(2)}
                  </span>
                  {(() => {
                    let stockBadgeClass = "bg-green-100 text-green-600";
                    if ((product.stock || 0) <= 5 && (product.stock || 0) > 0) {
                      stockBadgeClass = "bg-orange-100 text-orange-600";
                    } else if ((product.stock || 0) === 0) {
                      stockBadgeClass = "bg-red-100 text-red-600";
                    }
                    return (
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${stockBadgeClass}`}
                      >
                        Stock: {product.stock}
                      </span>
                    );
                  })()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-600 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-200 transition"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm text-red-600 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modern Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative shadow-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setIsModalOpen(false)}
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g., Chocolate Fudge Cake"
                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Write a short description about the product..."
                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Price, Discount, and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-600 mb-1"
                    >
                      Price (GH₵)
                    </label>
                    <input
                      id="price"
                      type="number"
                      placeholder="e.g., 25.00"
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                      value={price || ""}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="discountPrice"
                      className="text-sm font-medium text-gray-600 mb-1"
                    >
                      Discount Price (GH₵)
                    </label>
                    <input
                      id="discountPrice"
                      type="number"
                      placeholder="e.g., 20.00"
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                      value={discountPrice || ""}
                      onChange={(e) =>
                        setDiscountPrice(parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="stock"
                      className="text-sm font-medium text-gray-600 mb-1"
                    >
                      Stock
                    </label>
                    <input
                      id="stock"
                      type="number"
                      placeholder="e.g., 50"
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                      value={stock || ""}
                      onChange={(e) => setStock(parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* Category and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-600 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center space-x-4 h-full">
                      <div className="flex items-center gap-2">
                        <input
                          id="isPublished"
                          type="checkbox"
                          checked={isPublished}
                          onChange={(e) => setIsPublished(e.target.checked)}
                          className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                        />
                        <label
                          htmlFor="isPublished"
                          className="text-sm text-gray-700"
                        >
                          Published
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="isFeatured"
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                        />
                        <label
                          htmlFor="isFeatured"
                          className="text-sm text-gray-700"
                        >
                          Featured
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="flex flex-col">
  <label
    htmlFor="imageFile"
    className="text-sm font-medium text-gray-600 mb-1"
  >
    {editingProduct ? "Change Image" : "Product Image"}
  </label>
  <input
    id="imageFile"
    type="file"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
    className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
  />
  {editingProduct?.image && (
    <img
      src={editingProduct.image}
      alt="Current Product"
      className="mt-4 w-32 h-32 object-cover rounded-lg"
    />
  )}
</div>



                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-rose-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-rose-700 transition"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
