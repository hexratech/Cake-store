import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import {jwtDecode } from "jwt-decode";

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
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode<AdminTokenPayload>(token);
    const userRole = decoded.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // redirect if user's role is not allowed
      return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;
