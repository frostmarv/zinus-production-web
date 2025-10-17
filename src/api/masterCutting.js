// src/api/masterCutting.js
import { apiClient } from "./client";

export const masterCuttingAPI = {
  /**
   * Mengambil seluruh data assembly layers dari API
   * @returns {Promise<Array>} Array of assembly layer records
   */
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/assembly-layers");
      return response;
    } catch (error) {
      console.error("Gagal mengambil data Assembly Layers:", error);
      throw error;
    }
  },

  /**
   * Menambahkan data assembly layer baru
   * @param {Object} data - Data yang akan ditambahkan
   * @returns {Promise<Object>} Response dari API
   */
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/assembly-layers", data);
      return response;
    } catch (error) {
      console.error("Gagal menambahkan data Assembly Layer:", error);
      throw error;
    }
  },

  /**
   * Upload massal data assembly layers dari JSON
   * @param {Object} data - Data JSON yang akan diupload
   * @returns {Promise<Object>} Response dari API
   */
  upload: async (data) => {
    try {
      const response = await apiClient.post(
        "/api/assembly-layers/upload",
        data,
      );
      return response;
    } catch (error) {
      console.error("Gagal upload data Assembly Layers:", error);
      throw error;
    }
  },

  /**
   * Upload massal data assembly layers dari file Excel/CSV
   * @param {File} file - File Excel/CSV yang akan diupload
   * @returns {Promise<Object>} Response dari API
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        "/api/assembly-layers/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (error) {
      console.error("Gagal upload file Assembly Layers:", error);
      throw error;
    }
  },

  /**
   * Memperbarui data assembly layer berdasarkan ID
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
        `Gagal memperbarui data Assembly Layer dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Menghapus data assembly layer berdasarkan ID
   * @param {number} id - ID data yang akan dihapus
   * @returns {Promise<Object>} Response dari API
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/assembly-layers/${id}`);
      return response;
    } catch (error) {
      console.error(
        `Gagal menghapus data Assembly Layer dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Mengambil data assembly layer berdasarkan ID
   * @param {number} id - ID data yang akan diambil
   * @returns {Promise<Object>} Response dari API
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/assembly-layers/${id}`);
      return response;
    } catch (error) {
      console.error(
        `Gagal mengambil data Assembly Layer dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },
};
