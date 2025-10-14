// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../api/authService";

// HOC: hanya untuk user yang sudah login
export const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// HOC: hanya untuk role tertentu (misal: PEMILIK)
export const RoleProtectedRoute = ({
  children,
  allowedRoles = ["PEMILIK"],
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // atau halaman 403
  }

  return children;
};
