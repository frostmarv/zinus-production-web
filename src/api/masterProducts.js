import { apiClient } from "../api/client";

export const masterProductsAPI = {
  /**
   * Mengambil seluruh data products
   * @returns {Promise<Array>} Array of products
   */
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/products");
      return response;
    } catch (error) {
      console.error("Gagal mengambil data products:", error);
      throw error;
    }
  },

  /**
   * Mengambil data product berdasarkan ID
   * @param {number} id - ID product
   * @returns {Promise<Object>} Response dari API
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Gagal mengambil data product dengan ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Menambahkan data product baru
   * @param {Object} data - Data product yang akan ditambahkan
   * @returns {Promise<Object>} Response dari API
   */
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/products", data);
      return response;
    } catch (error) {
      console.error("Gagal menambahkan data product:", error);
      throw error;
    }
  },

  /**
   * Memperbarui data product berdasarkan ID
   * @param {number} id - ID product
   * @param {Object} data - Data baru
   * @returns {Promise<Object>} Response dari API
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/products/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Gagal memperbarui data product dengan ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Menghapus data product berdasarkan ID
   * @param {number} id - ID product
   * @returns {Promise<Object>} Response dari API
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Gagal menghapus data product dengan ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload massal data products dari JSON
   * @param {Object} data - Data JSON yang akan diupload
   * @returns {Promise<Object>} Response dari API
   */
  upload: async (data) => {
    try {
      const response = await apiClient.post("/api/products/upload", data);
      return response;
    } catch (error) {
      console.error("Gagal upload data products:", error);
      throw error;
    }
  },

  /**
   * Upload massal data products dari file Excel/CSV
   * @param {File} file - File Excel/CSV yang akan diupload
   * @returns {Promise<Object>} Response dari API
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/api/products/upload-file", formData);
      return response;
    } catch (error) {
      console.error("Gagal upload file products:", error);
      throw error;
    }
  },
};