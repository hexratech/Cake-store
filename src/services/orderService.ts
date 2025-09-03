import type { Order } from "@/types/data/orders";
export const placeOrder = async (order: Order) => {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return res.json();
};
