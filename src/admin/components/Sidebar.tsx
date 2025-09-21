import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  const linkClass = (isActive: boolean) =>
    `p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-800" : ""}`;

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed">
      <div className="p-4 text-xl font-bold">🍰 Admin Panel</div>
      <nav className="flex flex-col space-y-2 p-4">
        <NavLink to="/admin/" className={({ isActive }) => linkClass(isActive)}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => linkClass(isActive)}>
          Orders
        </NavLink>
        <NavLink to="/admin/orderstatus" className={({ isActive }) => linkClass(isActive)}>
          Order Status
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => linkClass(isActive)}>
          Products
        </NavLink>
        {role === "superadmin" && (
          <NavLink to="/admin/settings" className={({ isActive }) => linkClass(isActive)}>
            Settings
          </NavLink>
        )}
        <NavLink to="/admin/users" className={({ isActive }) => linkClass(isActive)}>
          Users
        </NavLink>
        <NavLink to="/admin/messages" className={({ isActive }) => linkClass(isActive)}>
          Messages
        </NavLink>
        <NavLink to="/admin/deliverystatus" className={({ isActive }) => linkClass(isActive)}>
          Delivery Status
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
