import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import { Search, Truck, CheckCircle, XCircle, Info } from "lucide-react";

type DeliveryStatus = "Pending" | "Dispatched" | "Delivered";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  isCustom?: boolean;
  customDetails?: {
    base?: string;
    frosting?: string;
    filling?: string;
    size?: string;
    toppings?: string[];
    note?: string;
    design?: string;
    designImage?: string;
    estimatedPrice?: number;
  };
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: "Delivery" | "Pickup";
  deliveryStatus: DeliveryStatus;
  createdAt: string;
  items: OrderItem[];
}

const DELIVERY_OPTIONS: DeliveryStatus[] = ["Pending", "Dispatched", "Delivered"];

const DeliveryStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const API_URL = import.meta.env.VITE_API_URL as string;
  const token = localStorage.getItem("adminToken") ?? "";

  // Fetch all delivery orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders?deliveryMethod=Delivery`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update delivery status
  const updateDeliveryStatus = async (orderId: string, status: DeliveryStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/delivery`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryStatus: status }),
      });
      if (!res.ok) throw new Error("Failed to update delivery status");
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      console.error("Failed to update delivery status", err);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Dispatched":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case "Pending":
        return <Info className="w-5 h-5 text-yellow-500" />;
      case "Dispatched":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <p>Loading delivery orders...</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Truck className="w-8 h-8 text-rose-600" />
            Delivery Status
          </h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No delivery orders found.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-xl rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="text-gray-500 text-sm uppercase tracking-wider text-left">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Delivery Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900">{order.orderId}</td>
                    <td className="p-4 text-gray-700">{order.customerName}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.deliveryStatus)}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            order.deliveryStatus
                          )}`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.deliveryStatus !== "Delivered" && (
                          <select
                            value={order.deliveryStatus}
                            onChange={(e) =>
                              updateDeliveryStatus(order._id, e.target.value as DeliveryStatus)
                            }
                            className="appearance-none bg-white px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                          >
                            {DELIVERY_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 text-sm text-gray-600 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-200 transition"
                        >
                          <Info className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative shadow-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setSelectedOrder(null)}
              >
                <XCircle />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Delivery Order Details
              </h2>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold">Customer:</span> {selectedOrder.customerName}</p>
                <p><span className="font-semibold">Email:</span> {selectedOrder.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedOrder.phone}</p>
                <p><span className="font-semibold">Delivery Method:</span> {selectedOrder.deliveryMethod}</p>
                <p><span className="font-semibold">Delivery Status:</span> {selectedOrder.deliveryStatus}</p>
                <p><span className="font-semibold">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Items</h3>
                <ul className="divide-y divide-gray-200">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} className="py-2">
                      <p className="font-medium text-gray-800">
                        {item.name} × {item.qty}
                      </p>
                      <p className="text-sm text-gray-500">Price: GHS {item.price}</p>
                      {item.isCustom && item.customDetails && (
                        <p className="text-sm text-rose-600 italic">Customized Cake</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeliveryStatusPage;
