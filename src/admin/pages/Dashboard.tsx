import AdminLayout from "@/admin/components/AdminLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Cake,
  Users,
  Eye,
  Clock,
  Info,
  Activity,
  X,
} from "lucide-react";
import NextDelivery from "@/admin/components/NextDelivery";

// Types
interface Product {
  _id: string;
  name: string;
  stock: number;
}

interface CustomCake {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  flavor: string;
  size: string;
  message?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  createdAt: string;
  deliveryDate?: string;
  price?: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

// API URL
const API_URL = import.meta.env.VITE_API_URL as string;

const Dashboard = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [customCakes, setCustomCakes] = useState<CustomCake[] | null>(null);
  const [customCakeCount, setCustomCakeCount] = useState<number>(0);
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedCake, setSelectedCake] = useState<CustomCake | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      console.error("No admin token found in localStorage");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    const fetchCustomCakes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/custom-cakes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch custom cakes");
        const data: CustomCake[] = await res.json();
        setCustomCakes(data || []);
      } catch (err) {
        console.error(err);
        setCustomCakes([]);
      }
    };

    const fetchCustomCakeCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/custom-cakes/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch custom cake count");
        const data = await res.json();
        setCustomCakeCount(data.count || 0);
      } catch (err) {
        console.error(err);
        setCustomCakeCount(0);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      }
    };

    Promise.all([
      fetchProducts(),
      fetchCustomCakes(),
      fetchCustomCakeCount(),
      fetchUsers(),
    ]).finally(() => setLoading(false));
  }, []);

  const getStatusClasses = (status: CustomCake["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingCakes = customCakes?.filter(
    (cake) => cake.status === "Pending"
  ).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-10 bg-white min-h-full rounded-2xl shadow-lg">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Activity className="w-8 h-8 text-rose-600" />
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's a quick overview of your bakery's performance.
            
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between border-b-4 border-rose-600 transition hover:shadow-2xl">
            <div>
              <span className="text-gray-500 font-semibold text-sm">
                Products
              </span>
              <p className="text-4xl font-extrabold text-gray-800 mt-1">
                {products?.length ?? 0}
              </p>
            </div>
            <div className="bg-rose-100 p-3 rounded-full text-rose-600">
              <Package className="w-8 h-8" />
            </div>
          </div>

          {/* Custom Cakes */}
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between border-b-4 border-yellow-500 transition hover:shadow-2xl">
            <div>
              <span className="text-gray-500 font-semibold text-sm">
                Custom Cakes
              </span>
              <p className="text-4xl font-extrabold text-gray-800 mt-1">
                {customCakeCount}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
              <Cake className="w-8 h-8" />
            </div>
          </div>

          {/* Users */}
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between border-b-4 border-blue-500 transition hover:shadow-2xl">
            <div>
              <span className="text-gray-500 font-semibold text-sm">Users</span>
              <p className="text-4xl font-extrabold text-gray-800 mt-1">
                {users?.length ?? 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Recent Custom Cakes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">Recent Custom Cakes</h3>
              <Link
                to="/admin/customcakes"
                className="text-rose-600 hover:text-rose-800 text-sm font-semibold"
              >
                View all
              </Link>
            </div>

            {customCakes && customCakes.length > 0 ? (
              <div className="space-y-3">
                {customCakes.slice(0, 4).map((cake) => (
                  <div
                    key={cake._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {cake.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cake.flavor} - {cake.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClasses(
                          cake.status
                        )}`}
                      >
                        {cake.status}
                      </span>
                      <button
                        className="text-gray-500 hover:text-rose-600 transition"
                        onClick={() => {
                          setSelectedCake(cake);
                          setModalOpen(true);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No recent custom cake requests.
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="bg-white p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Custom Cake Status</p>
                <p className="text-sm text-gray-500">
                  {pendingCakes ?? 0} pending requests
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="font-bold">{pendingCakes ?? 0}</span>
                <span className="text-xs">Pending</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-rose-600" />
                Low Stock Alerts
              </h4>
              {products && products.filter((p) => p.stock < 5).length > 0 ? (
                <ul className="space-y-1 text-sm text-gray-600">
                  {products
                    .filter((p) => p.stock < 5)
                    .slice(0, 3)
                    .map((p) => (
                      <li
                        key={p._id}
                        className="flex justify-between items-center"
                      >
                        <span>{p.name}</span>
                        <span className="text-rose-600 font-bold">
                          {p.stock} left
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No products are currently low in stock.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Next Delivery */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
          <NextDelivery />
        </div>

        {/* Modal */}
        {modalOpen && selectedCake && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-rose-600"
                onClick={() => setModalOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold mb-4">
                {selectedCake.customerName}'s Cake
              </h2>
              <p>
                <span className="font-semibold">Flavor:</span>{" "}
                {selectedCake.flavor}
              </p>
              <p>
                <span className="font-semibold">Size:</span> {selectedCake.size}
              </p>
              {selectedCake.message && (
                <p>
                  <span className="font-semibold">Message:</span>{" "}
                  {selectedCake.message}
                </p>
              )}
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full ${getStatusClasses(
                    selectedCake.status
                  )}`}
                >
                  {selectedCake.status}
                </span>
              </p>
              {selectedCake.price && (
                <p>
                  <span className="font-semibold">Price:</span> $
                  {selectedCake.price}
                </p>
              )}
              {selectedCake.deliveryDate && (
                <p>
                  <span className="font-semibold">Delivery Date:</span>{" "}
                  {new Date(selectedCake.deliveryDate).toLocaleDateString()}
                </p>
              )}
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedCake.createdAt).toLocaleString()}
              </p>
              <hr className="my-3" />
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedCake.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {selectedCake.phone}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
