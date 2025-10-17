// src/api/masterPlanning.js
import { apiClient } from "../api/client";

export const masterPlanningAPI = {
  /**
   * Mengambil seluruh data production planning dari API (foam)
   * @returns {Promise<Array>} Array of production planning records
   */
  getAllFoam: async () => {
    try {
      const data = await apiClient.get("/api/production-planning/foam");
      return data;
    } catch (error) {
      console.error("Gagal mengambil data foam:", error);
      throw error;
    }
  },

  /**
   * Mengambil seluruh data production planning dari API (spring)
   * @returns {Promise<Array>} Array of production planning records
   */
  getAllSpring: async () => {
    try {
      const data = await apiClient.get("/api/production-planning/spring");
      return data;
    } catch (error) {
      console.error("Gagal mengambil data spring:", error);
      throw error;
    }
  },

  /**
   * Menambahkan data production planning baru (satu item)
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
   * Upload massal data production planning dari file Excel/CSV
   * @param {File} file - File Excel/CSV yang akan diupload
   * @returns {Promise<Object>} Response dari API
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        "/api/production-planning/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (error) {
      console.error("Gagal upload file production planning:", error);
      throw error;
    }
  },

  /**
   * Upload massal data production planning dari JSON
   * @param {Object} data - Data JSON yang akan diupload
   * @returns {Promise<Object>} Response dari API
   */
  upload: async (data) => {
    try {
      const response = await apiClient.post(
        "/api/production-planning/upload",
        data,
      );
      return response;
    } catch (error) {
      console.error("Gagal upload data production planning:", error);
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
      const response = await apiClient.put(
        `/api/production-planning/${id}`,
        data,
      );
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

  /**
   * Mengambil data production planning berdasarkan ID
   * @param {string} id - ID data yang akan diambil
   * @returns {Promise<Object>} Response dari API
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/production-planning/${id}`);
      return response;
    } catch (error) {
      console.error(
        `Gagal mengambil data production planning dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },
};
