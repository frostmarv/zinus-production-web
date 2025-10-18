// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../api/authService";

/**
 * 🔒 ProtectedRoute
 * - Hanya untuk user yang sudah login
 * - Kecuali jika route saat ini ada di daftar `publicPaths`
 */
export const ProtectedRoute = ({ children, publicPaths = [] }) => {
  const currentPath = window.location.pathname;

  // ✅ Jika path saat ini termasuk route publik → lewati proteksi
  if (publicPaths.includes(currentPath)) {
    return children;
  }

  // 🚫 Kalau belum login → redirect ke login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Sudah login → izinkan akses
  return children;
};

/**
 * 🧑‍💼 RoleProtectedRoute
 * - Hanya untuk user dengan role tertentu
 * - Tetap bisa diakses publik jika path ada di `publicPaths`
 */
export const RoleProtectedRoute = ({
  children,
  allowedRoles = ["PEMILIK"],
  publicPaths = [],
}) => {
  const currentPath = window.location.pathname;

  // ✅ Jika path publik → lewati proteksi
  if (publicPaths.includes(currentPath)) {
    return children;
  }

  // 🚫 Kalau belum login → redirect ke login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  // 🚫 Kalau user tidak punya role yang diizinkan → redirect ke dashboard
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Role cocok → izinkan akses
  return children;
};

/**
 * 🌐 PublicRoute
 * - Untuk halaman publik seperti /login, /tos, /privacy_policy, /workable-live
 * - Jika `onlyForGuest` = true, user yang sudah login akan di-redirect ke "/"
 *   (misal untuk halaman login, biar user login gak bisa buka lagi)
 */
export const PublicRoute = ({ children, onlyForGuest = false }) => {
  if (onlyForGuest && isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};
