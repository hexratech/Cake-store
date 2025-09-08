import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface AdminTokenPayload {
    id: string;
    role: "admin" | "superadmin";
}

const Sidebar = () => {
    let role: "admin" | "superadmin" = "admin";
    const token = localStorage.getItem("adminToken");

if (token) {
    try {
    const decoded = jwtDecode<AdminTokenPayload>(token);
    role = decoded.role;
    } catch (err) {
    console.error("Failed to decode token:", err);
    }
}

return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed">
    <div className="p-4 text-xl font-bold">🍰 Admin Panel</div>
    <nav className="flex flex-col space-y-2 p-4">
        <Link to="/admin/" className="hover:bg-gray-700 p-2 rounded">
        Dashboard
        </Link>
        <Link to="/admin/orders" className="hover:bg-gray-700 p-2 rounded">
        Orders
        </Link>
        <Link to="/admin/custom-cakes" className="hover:bg-gray-700 p-2 rounded">
        Custom Cakes
        </Link>
        <Link to="/admin/products" className="hover:bg-gray-700 p-2 rounded">
        Products
        </Link>
        {role === "superadmin" && (
        <Link to="/admin/settings" className="hover:bg-gray-700 p-2 rounded">
            Settings
        </Link>
        )}
        <Link to="/admin/users" className="hover:bg-gray-700 p-2 rounded">
        Users
        </Link>
        <Link to="/admin/messages" className="hover:bg-gray-700 p-2 rounded">
        Messages
        </Link>
    </nav>
    </aside>
);
};

export default Sidebar;
