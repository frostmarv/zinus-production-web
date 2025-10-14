// src/api/userService.js
import { apiClient } from "../api/client";

/**
 * Ambil semua user
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/api/users");
    return response;
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
    const response = await apiClient.get(`/api/users/${id}`);
    return response;
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
    const response = await apiClient.post("/api/users", userData);
    return response;
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
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response;
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
    const response = await apiClient.put(
      `/api/users/${userId}/reset-password`,
      {
        newPassword,
      },
    );
    return response;
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
    const response = await apiClient.delete(`/api/users/${id}`);
    return response;
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
    const response = await apiClient.get("/api/users/profile");
    return response;
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
    const response = await apiClient.put("/api/users/profile", profileData);
    return response;
  } catch (error) {
    console.error("Gagal mengupdate profile:", error);
    throw error;
  }
};
