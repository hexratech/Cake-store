import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import { Search, ChevronDown, User, Info, XCircle, Trash2, Edit } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const token = localStorage.getItem("adminToken");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all" || user.role === roleFilter)
  );

  const getStatusBadge = (status: User["status"]) =>
    status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  const getRoleBadge = (role: User["role"]) =>
    role === "admin" ? "bg-rose-100 text-rose-800" : "bg-gray-100 text-gray-800";

  // Update user API
  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${editUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      });
      if (!res.ok) throw new Error("Failed to update user");
      await fetchUsers();
      setEditUser(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  // Delete user API
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${deleteUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
      setDeleteUserId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">Loading users...</div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-red-500">Error: {error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Users</h1>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
            </div>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as "all" | "admin" | "customer")}
                className="w-full md:w-48 appearance-none bg-white px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No users found matching your criteria.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-xl rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="text-gray-500 text-sm uppercase tracking-wider text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900">{user.name}</td>
                    <td className="p-4 text-gray-700">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-gray-600 hover:text-gray-800"
                        title="View Details"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit User"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteUserId(user._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modals */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative shadow-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setSelectedUser(null)}
              >
                <XCircle />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6" /> User Details
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="font-semibold">Name:</span> {selectedUser.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {selectedUser.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {selectedUser.phone || "-"}
                </p>
                <p>
                  <span className="font-semibold">Joined:</span>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Role:</span>{" "}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                      selectedUser.role
                    )}`}
                  >
                    {selectedUser.role}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {editUser && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setEditUser(null)}
              >
                <XCircle />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Edit className="w-6 h-6" /> Edit User
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  placeholder="Email"
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editUser.phone || ""}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                  placeholder="Phone"
                />
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value as "admin" | "customer" })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editUser.status}
                  onChange={(e) =>
                    setEditUser({ ...editUser, status: e.target.value as "active" | "inactive" })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                    onClick={() => setEditUser(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg"
                    onClick={handleUpdateUser}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteUserId && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-sm relative shadow-2xl text-center">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">Are you sure you want to delete this user?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setDeleteUserId(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  onClick={handleDeleteUser}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
