// src/api/masterPlanning.js
import { apiClient } from "../api/client";

export const masterPlanningAPI = {
  /**
   * Mengambil seluruh data production planning dari API
   * @returns {Promise<Array>} Array of production planning records
   */
  getAll: async () => {
    try {
      const data = await apiClient.get("/api/production-planning");
      return data;
    } catch (error) {
      console.error("Gagal mengambil data production planning:", error);
      throw error;
    }
  },

  /**
   * Menambahkan data production planning baru
   * @param {Object} data - Data yang akan ditambahkan
   * @returns {Promise<Object>} Response dari API
   */
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/production-planning", data);
      return response;
    } catch (error) {
      console.error("Gagal menambahkan data production planning:", error);
      throw error;
    }
  },

  /**
   * Memperbarui data production planning berdasarkan ID
   * @param {string} id - ID data yang akan diupdate
   * @param {Object} data - Data baru
   * @returns {Promise<Object>} Response dari API
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/production-planning/${id}`, data);
      return response;
    } catch (error) {
      console.error(
        `Gagal memperbarui data production planning dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Menghapus data production planning berdasarkan ID
   * @param {string} id - ID data yang akan dihapus
   * @returns {Promise<Object>} Response dari API
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/production-planning/${id}`);
      return response;
    } catch (error) {
      console.error(
        `Gagal menghapus data production planning dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },
};
