// src/api/userService.js
import { apiClient } from "../api/client";

/**
 * Ambil semua user
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  try {
    const data = await apiClient.get("/api/users");
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal mengambil daftar user:", error);
    throw error;
  }
};

/**
 * Ambil detail user berdasarkan ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getUserById = async (id) => {
  try {
    const data = await apiClient.get(`/api/users/${id}`);
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal mengambil detail user:", error);
    throw error;
  }
};

/**
 * Buat user baru
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  try {
    const data = await apiClient.post("/api/users", userData);
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal membuat user:", error);
    throw error;
  }
};

/**
 * Update user berdasarkan ID
 * @param {string} id
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, userData) => {
  try {
    const data = await apiClient.put(`/api/users/${id}`, userData);
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal mengupdate user:", error);
    throw error;
  }
};

/**
 * Reset password user berdasarkan ID
 * @param {string} userId
 * @param {string} newPassword
 * @returns {Promise<Object>}
 */
export const resetUserPassword = async (userId, newPassword) => {
  try {
    const data = await apiClient.put(`/api/users/${userId}/reset-password`, {
      newPassword,
    });
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal reset password:", error);
    throw error;
  }
};

/**
 * Hapus user berdasarkan ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteUser = async (id) => {
  try {
    const data = await apiClient.delete(`/api/users/${id}`);
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    throw error;
  }
};

/**
 * Ambil profile user sendiri
 * @returns {Promise<Object>}
 */
export const getProfile = async () => {
  try {
    const data = await apiClient.get("/api/users/profile");
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal mengambil profile:", error);
    throw error;
  }
};

/**
 * Update profile user sendiri
 * @param {Object} profileData
 * @returns {Promise<Object>}
 */
export const updateProfile = async (profileData) => {
  try {
    const data = await apiClient.put("/api/users/profile", profileData);
    return data; // ✅ Kembalikan data langsung
  } catch (error) {
    console.error("Gagal mengupdate profile:", error);
    throw error;
  }
};
