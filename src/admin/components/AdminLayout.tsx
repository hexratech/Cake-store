import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Settings,
  Users,
  BarChart,
  ShoppingCart,
  Cake,
  Package,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  onLogout?: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/admin", icon: BarChart },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Custom Cakes", path: "/admin/custom-cakes", icon: Cake },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Messages", path: "/admin/messages", icon: Mail },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
  onLogout,
}: Readonly<AdminLayoutProps>) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentPage =
    navItems.find((item) => item.path === location.pathname)?.name ||
    "Dashboard";

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
    setShowLogoutModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased text-gray-800">
      {/* Sidebar Overlay - Mobile */}
      <button
        type="button"
        aria-label="Close sidebar overlay"
        tabIndex={isSidebarOpen ? 0 : -1}
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
        style={{ border: "none", padding: 0, margin: 0 }}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <div className="font-extrabold text-2xl tracking-wide text-rose-600">
            3Vivi Admin
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-gray-500 hover:text-rose-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ name, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-rose-100 text-rose-600 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-rose-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-4 px-5 py-3 text-red-600 rounded-lg
                          hover:bg-red-50 active:bg-red-100 transition
                          focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between bg-white px-6 md:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1 text-gray-600 hover:text-rose-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">
              {currentPage}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden md:block">
              Welcome, Admin
            </span>
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=rose&color=fff"
              alt="Admin"
              className="w-9 h-9 rounded-full shadow-sm ring-2 ring-rose-500"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-sm transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
