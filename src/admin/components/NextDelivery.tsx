import { useEffect, useState, useCallback } from "react";
import { Truck, Calendar, MapPin } from "lucide-react";

type Status = "Pending" | "In Progress" | "Ready" | "Completed" | "Cancelled";

export interface OrderItem {
  name: string;
  qty: number;
  isCustom?: boolean;
  customDetails?: {
    // Note: The backend uses flavor, icing, layers, size, etc.
    // For simplicity, we keep the original front-end type definition,
    // but ensure we handle potential undefined values.
    base?: string;
    design?: string;
    estimatedPrice?: number;
  };
}

export interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: "Delivery" | "Pickup";
  address?: string;
  status: Status;
  createdAt: string;
  deliveryDate?: string;
  deliveryTime?: string;
  items?: OrderItem[];
}

// Interface for the backend response structure
interface NextDeliveryResponse {
  deliveryDate: string | null;
  orders: Order[];
}

const statusColors: Record<Status, string> = {
  Pending: "bg-yellow-200 text-yellow-800",
  "In Progress": "bg-blue-200 text-blue-800",
  Ready: "bg-purple-200 text-purple-800",
  Completed: "bg-green-200 text-green-800",
  Cancelled: "bg-red-200 text-red-800",
};

const NextDelivery = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryDay, setDeliveryDay] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("adminToken") ?? "";

  const fetchNextDelivery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/next-delivery`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch deliveries");

      // --- FIX APPLIED HERE ---
      // The frontend now expects the exact object structure returned by the backend.
      const result: NextDeliveryResponse = await res.json();

      // The backend guarantees 'orders' is an array, but we check for safety.
      const fetchedOrders = result.orders || [];

      // Log for debugging the 'No deliveries available' issue
      console.log("🚚 Next Delivery API Response:", result);
      console.log("📦 Orders fetched count:", fetchedOrders.length);
      // --- END FIX ---

      // Orders returned by the backend are for a single day, or an empty array.
      setOrders(fetchedOrders);
      setDeliveryDay(result.deliveryDate);

      // If no orders were found, the backend returns { deliveryDate: null, orders: [] }

    } catch (err: unknown) {
      console.error("Fetch next delivery error:", err);
      // Ensure the state is reset on error to prevent displaying stale data
      setOrders([]);
      setDeliveryDay(null);
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNextDelivery();
  }, [fetchNextDelivery]);

  const renderOrder = (order: Order) => (
    <div
      key={order._id}
      className="bg-white p-4 rounded-lg shadow w-full mb-4 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{order.customerName}</h3>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </span>
          <span
            className={`text-sm font-medium mt-1 px-2 py-1 rounded ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-1">Phone: {order.phone}</p>

      {order.deliveryMethod === "Delivery" && order.address && (
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
          <MapPin className="w-4 h-4 text-red-500" /> {order.address}
        </p>
      )}

      {/* Defensive check for array used here */}
      {Array.isArray(order.items) && order.items.length > 0 && (
        <p className="text-sm text-gray-600 mb-1 flex flex-wrap gap-1">
          Items:{" "}
          {order.items
            .map((i) =>
              i.isCustom
                ? `${i.qty} x ${i.customDetails?.base || "Custom Item"}`
                : `${i.qty} x ${i.name}`
            )
            .join(", ")}
        </p>
      )}

      {order.deliveryDate && order.deliveryTime && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {order.deliveryDate} at {order.deliveryTime}
        </p>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" /> Next Deliveries
      </h2>

      {loading && <div>Loading deliveries...</div>}

      {error && (
        <div className="text-red-500 mb-3">
          Error: {error}{" "}
          <button
            onClick={fetchNextDelivery}
            className="text-blue-500 underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && <p>No deliveries available</p>}

      {!loading && !error && orders.length > 0 && (
        <>
          <h3 className="text-gray-600 font-medium mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Deliveries for **{deliveryDay}**
          </h3>
          <div className="flex flex-col w-full">{orders.map(renderOrder)}</div>
        </>
      )}
    </div>
  );
};

export default NextDelivery;