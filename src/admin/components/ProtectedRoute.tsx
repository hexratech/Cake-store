// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("admin" | "superadmin")[]; // optional roles
}

interface AdminTokenPayload {
  id: string;
  role: "admin" | "superadmin";
  iat: number;
  exp: number;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("adminToken");
  const location = useLocation();

  if (!token) {
    console.warn("No token found. Redirecting to login.");
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode<AdminTokenPayload>(token);
    const userRole = decoded.role;

    if (!userRole) {
      console.warn("Token does not contain role. Redirecting to login.");
      return <Navigate to="/admin/login" replace />;
    }

    // Case-insensitive role check
    if (
      allowedRoles &&
      !allowedRoles.some(
        (role) => role.toLowerCase() === userRole.toLowerCase()
      )
    ) {
      console.warn(`Access denied for role: ${userRole}`);
      return <Navigate to="/admin" replace />;
    }

    // User is allowed
    return <>{children}</>;
  } catch (err) {
    console.error("Invalid or expired token. Redirecting to login.", err);
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;
