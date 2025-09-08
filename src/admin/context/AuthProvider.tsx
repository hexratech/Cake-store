import { useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import type { RoleType } from "./AuthContext";
import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );
  const [role, setRole] = useState<RoleType | null>(
    (localStorage.getItem("adminRole") as RoleType) || null
  );

  const login = (newToken: string, newRole: RoleType) => {
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminRole", newRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
  };

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ token, role, login, logout }),
        [token, role]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};
