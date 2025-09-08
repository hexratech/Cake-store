import { createContext } from "react";

export type RoleType = "admin" | "superadmin";

export interface AuthContextType {
    token: string | null;
    role: RoleType | null;
    login: (token: string, role: RoleType) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
