// src/api/masterCutting.js
import { apiClient } from "./client";

export const masterCuttingAPI = {
  /**
   * Mengambil seluruh data cutting master dari API
   * @returns {Promise<Array>} Array of cutting master records
   */
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/assembly-layers");
      return response;
    } catch (error) {
      console.error("Gagal mengambil data Cutting Master:", error);
      throw error;
    }
  },

  /**
   * Menambahkan data cutting master baru
   * @param {Object} data - Data yang akan ditambahkan
   * @returns {Promise<Object>} Response dari API
   */
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/assembly-layers", data);
      return response;
    } catch (error) {
      console.error("Gagal menambahkan data Cutting Master:", error);
      throw error;
    }
  },

  /**
   * Memperbarui data cutting master berdasarkan ID
   * @param {number} id - ID data yang akan diupdate
   * @param {Object} data - Data baru
   * @returns {Promise<Object>} Response dari API
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/assembly-layers/${id}`, data);
      return response;
    } catch (error) {
      console.error(
        `Gagal memperbarui data Cutting Master dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Menghapus data cutting master berdasarkan ID
   * @param {number} id - ID data yang akan dihapus
   * @returns {Promise<Object>} Response dari API
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/assembly-layers/${id}`);
      return response;
    } catch (error) {
      console.error(
        `Gagal menghapus data Cutting Master dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },
};
