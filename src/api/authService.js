// src/api/authService.js
import { apiClient } from "../api/client";

/**
 * Login ke sistem
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ access_token: string, user: object }>}
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });

    const { access_token, user } = response;

    if (!access_token) {
      throw new Error("Login gagal: token tidak ditemukan dalam respons.");
    }

    // ✅ Simpan token BARU (token lama otomatis tergantikan)
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response;
  } catch (error) {
    console.error("Error saat login:", error);
    if (error.message?.startsWith("HTTP ")) {
      throw new Error("Login gagal: " + error.message.replace("HTTP ", ""));
    }
    throw error;
  }
};

/**
 * Logout manual: hapus token & data user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Tidak perlu panggil API — JWT stateless
};

/**
 * Cek apakah user sudah login DAN token belum expired
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // ✅ Cek masa berlaku token
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

/**
 * Dapatkan data user dari localStorage (jika ada)
 * @returns {object | null}
 */
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
