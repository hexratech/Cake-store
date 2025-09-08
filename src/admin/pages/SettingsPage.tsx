import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import AddAdminModal from "../components/AddAdminModel";
import { jwtDecode } from "jwt-decode";
import {
  Settings as SettingsIcon,
  Store,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  UserPlus,
  Trash2,
  Edit3,
  Wrench,
} from "lucide-react";

interface Settings {
  siteName: string;
  contactEmail: string;
  maintenanceMode: boolean;
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

interface AdminForm {
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
}

interface AlertState {
  message: string;
  type: "success" | "error" | null;
}

interface AdminTokenPayload {
  id: string;
  role: "admin" | "superadmin";
  iat?: number;
  exp?: number;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    contactEmail: "",
    maintenanceMode: false,
  });
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState<AdminForm>({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ message: "", type: null });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const token = localStorage.getItem("adminToken");
let role: "admin" | "superadmin" = "admin"; // default

if (token) {
  try {
    const decoded = jwtDecode<AdminTokenPayload>(token);
    role = decoded.role;
  } catch (err) {
    console.error("Failed to decode token:", err);
  }
}

console.log("Logged in role:", role);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch settings & admins
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to load settings.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to load admins.", type: "error" });
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchSettings();
    fetchAdmins();
  }, [fetchSettings, fetchAdmins]);

  // Save Settings
  const handleSave = async () => {
    setSaving(true);
    setAlert({ message: "", type: null });
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setAlert({ message: "Settings saved successfully!", type: "success" });
    } catch (err: unknown) {
      console.error(err);
      setAlert({ message: (err as Error).message || "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert({ message: "", type: null }), 5000);
    }
  };

  // Admin Handlers
  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password || !newAdmin.role) {
      setAlert({ message: "All fields including role are required.", type: "error" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add admin");
      }

      await fetchAdmins();
      setNewAdmin({ name: "", email: "", password: "", role: "admin" }); // reset form
      setAlert({ message: "Admin added successfully!", type: "success" });
    } catch (err: unknown) {
      console.error(err);
      setAlert({ message: (err as Error).message || "Failed to add admin.", type: "error" });
    }
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;
    if (!editingAdmin.name || !editingAdmin.email || !editingAdmin.role) {
      setAlert({ message: "Name, email, and role are required.", type: "error" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/${editingAdmin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingAdmin.name,
          email: editingAdmin.email,
          role: editingAdmin.role,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update admin");
      }

      await fetchAdmins();
      setEditingAdmin(null);
      setAlert({ message: "Admin updated successfully!", type: "success" });
    } catch (err: unknown) {
      console.error(err);
      setAlert({ message: (err as Error).message || "Failed to update admin.", type: "error" });
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete admin");
      }

      await fetchAdmins();
      setAlert({ message: "Admin removed successfully!", type: "success" });
    } catch (err: unknown) {
      console.error(err);
      setAlert({ message: (err as Error).message || "Failed to remove admin.", type: "error" });
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <p>Loading settings...</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-rose-600" />
          General Settings
        </h1>

        {/* Alert Box */}
        {alert.message && (
          <div
            className={`flex items-center gap-2 p-4 mb-6 rounded-xl ${
              alert.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
            role="alert"
          >
            {alert.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        )}

        <div className="space-y-6 max-w-3xl">
          {/* General Info */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Store className="w-6 h-6 text-gray-600" />
              Bakery Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  id="siteName"
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  placeholder="e.g., The Pastry Palace"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  placeholder="e.g., contact@bakery.com"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-gray-600" />
              Maintenance Mode
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
                className="h-5 w-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
              />
              <span className="text-gray-700">Enable maintenance mode (disable ordering)</span>
            </label>
          </div>

          {/* Admin Management */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-gray-600" />
              Admin Management
            </h2>

            {/* List admins */}
            <ul className="space-y-3 mb-4">
              {admins.map((admin) => (
                <li
                  key={admin._id}
                  className="flex justify-between items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200"
                >
                  <span className="text-gray-800 font-medium">
                    {admin.name} ({admin.email}) [{admin.role}]
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAdmin(admin)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add admin modal */}
            <AddAdminModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              newAdmin={newAdmin}
              setNewAdmin={setNewAdmin}
              onAddAdmin={handleAddAdmin}
            />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700"
            >
              <UserPlus className="w-5 h-5" /> Add Admin
            </button>

            {/* Edit admin modal */}
            {editingAdmin && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">Edit Admin</h3>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editingAdmin.name}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={editingAdmin.email}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
                  />
                  <select
                    value={editingAdmin.role}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, role: e.target.value as "admin" | "superadmin" })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingAdmin(null)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateAdmin}
                      className="px-4 py-2 rounded-lg bg-rose-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full max-w-xs flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-colors duration-200 ${
              saving
                ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                : "bg-rose-600 text-white hover:bg-rose-700"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
