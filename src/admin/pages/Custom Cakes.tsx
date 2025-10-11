import { useEffect, useState } from "react";
import axios from "axios";
import { Cake } from "lucide-react";
import AdminLayout from "@/admin/components/AdminLayout";
import CustomCakeDetails from "@/admin/components/CustomCakeDetails";
import type { CustomCakeOrder, CustomCakeItem } from "@/types/CustomOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/admin/components/Select";

interface BackendItem {
  name: string;
  qty: number;
  price: number;
  isCustom: boolean;
  customDetails?: CustomCakeItem;
}

interface BackendOrder extends Omit<CustomCakeOrder, "customItems"> {
  items?: BackendItem[];
}

export default function CustomCakes() {
  const [cakes, setCakes] = useState<CustomCakeOrder[]>([]);
  const [filteredCakes, setFilteredCakes] = useState<CustomCakeOrder[]>([]);
  const [selectedCake, setSelectedCake] = useState<CustomCakeOrder | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch custom cakes on mount (type-safe)
  useEffect(() => {
    const fetchCustomCakes = async (): Promise<void> => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get<BackendOrder[]>(
          `${import.meta.env.VITE_API_URL}/api/orders/custom-cakes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ✅ Map backend "items" → frontend "customItems"
        const formatted: CustomCakeOrder[] = data.map((order) => ({
          ...order,
          customItems:
            order.items
              ?.filter((item) => item.isCustom && item.customDetails)
              .map((item) => ({
                flavor: item.customDetails?.flavor,
                icing: item.customDetails?.icing,
                layers: item.customDetails?.layers,
                size: item.customDetails?.size,
                toppings: item.customDetails?.toppings,
                note: item.customDetails?.note,
                design: item.customDetails?.design,
                designImage: item.customDetails?.designImage,
                estimatedPrice: item.customDetails?.estimatedPrice,
              })) ?? [],
        }));

        setCakes(formatted);
        setFilteredCakes(formatted);
      } catch (err) {
        console.error("Failed to fetch custom cakes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomCakes();
  }, []);

  // ✅ Filter logic (still type-safe)
  useEffect(() => {
    let result = [...cakes];

    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.customerName?.toLowerCase().includes(lowerSearch) ||
          c.email?.toLowerCase().includes(lowerSearch) ||
          c.phone?.includes(search)
      );
    }

    if (filterSize !== "all") {
      result = result.filter((c) =>
        c.customItems?.some((item) => item.size === filterSize)
      );
    }

    setFilteredCakes(result);
  }, [search, filterSize, cakes]);

  const handleOpen = (cake: CustomCakeOrder): void => {
    setSelectedCake(cake);
    setOpen(true);
  };

  const SkeletonCard: React.FC = () => (
    <div className="border rounded-xl shadow-md p-5 bg-white animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-full"></div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Cake className="w-8 h-8 text-rose-600" />
          Custom Cake Orders
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-1/3"
          />
          <Select value={filterSize} onValueChange={(val) => setFilterSize(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="6-inch">6-inch</SelectItem>
              <SelectItem value="8-inch">8-inch</SelectItem>
              <SelectItem value="9-inch">9-inch</SelectItem>
              <SelectItem value="10-inch">10-inch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loader / Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : filteredCakes.length === 0 ? (
          <p className="text-gray-500">No custom cakes found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCakes.map((cake) => (
              <div
                key={cake._id}
                className="border rounded-xl shadow-md p-5 bg-white hover:shadow-lg transition"
              >
                <h2 className="font-semibold text-lg">{cake.customerName}</h2>
                <p className="text-sm text-gray-600">{cake.email}</p>
                <p className="text-sm">{cake.phone}</p>
                <p className="text-sm text-gray-500">
                  Status: {cake.status ?? "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Total Price: GHS {cake.totalPrice ?? "N/A"}
                </p>
                <Button
                  onClick={() => handleOpen(cake)}
                  className="mt-4 w-full"
                  variant="outline"
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}

        
        {selectedCake && (
          <CustomCakeDetails
            open={open}
            onOpenChange={setOpen}
            cake={selectedCake}
          />
        )}
      </div>
    </AdminLayout>
  );
}
