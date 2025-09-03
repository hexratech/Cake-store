export type Order = {
id?: string;
customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
};
items: {
    productId: string;
    quantity: number;
}[];
total: number;
paymentMethod: "cash" | "card" | "mobile-money";
status?: "pending" | "confirmed" | "completed";
};
