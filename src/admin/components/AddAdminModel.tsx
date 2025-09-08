import type { Dispatch, SetStateAction } from "react";
import { XCircle, UserPlus } from "lucide-react";

export interface AdminForm {
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
}

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  newAdmin: AdminForm;
  setNewAdmin: Dispatch<SetStateAction<AdminForm>>;
  onAddAdmin: () => Promise<void>;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  newAdmin,
  setNewAdmin,
  onAddAdmin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Add Admin</h3>
          <button onClick={onClose}>
            <XCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Name"
          value={newAdmin.name}
          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
        />
        <input
          type="email"
          placeholder="Email"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={newAdmin.password}
          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
        />

        <select
          value={newAdmin.role}
          onChange={(e) =>
            setNewAdmin({ ...newAdmin, role: e.target.value as "admin" | "superadmin" })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <button
          onClick={onAddAdmin}
          className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          <UserPlus className="w-5 h-5" />
          Add Admin
        </button>
      </div>
    </div>
  );
};

export default AddAdminModal;
