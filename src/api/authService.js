// src/api/authService.js
import { apiClient } from "../api/client";

export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });

    const { access_token, refresh_token, user } = response; // ✅ ambil refresh_token

    if (!access_token || !refresh_token) {
      throw new Error("Login gagal: token tidak lengkap.");
    }

    // ✅ Simpan KEDUA token
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response;
  } catch (error) {
    console.error("Error saat login:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token"); // ✅
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token"); // ✅
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
