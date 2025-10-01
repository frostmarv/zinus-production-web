// src/api/masterPlanning.js
import { apiClient } from "../api/client";

export const masterPlanningAPI = {
  /**
   * Mengambil seluruh data production planning dari API
   * @param {string} type - Tipe data: 'foam' atau 'spring'
   * @returns {Promise<Array>} Array of production planning records
   */
  getAll: async (type) => {
    try {
      const data = await apiClient.get(`/api/production-planning/${type}`);
      return data;
    } catch (error) {
      console.error(`Gagal mengambil data ${type}:`, error);
      throw error;
    }
  },

  /**
   * Menambahkan data production planning baru
   * @param {string} type - Tipe data: 'foam' atau 'spring'
   * @param {Object} data - Data yang akan ditambahkan
   * @returns {Promise<Object>} Response dari API
   */
  create: async (type, data) => {
    try {
      const response = await apiClient.post(`/api/production-planning/${type}`, data);
      return response;
    } catch (error) {
      console.error(`Gagal menambahkan data ${type}:`, error);
      throw error;
    }
  },

  /**
   * Memperbarui data production planning berdasarkan ID
   * @param {string} type - Tipe data: 'foam' atau 'spring'
   * @param {string} id - ID data yang akan diupdate
   * @param {Object} data - Data baru
   * @returns {Promise<Object>} Response dari API
   */
  update: async (type, id, data) => {
    try {
      const response = await apiClient.put(`/api/production-planning/${type}/${id}`, data);
      return response;
    } catch (error) {
      console.error(
        `Gagal memperbarui data ${type} dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Menghapus data production planning berdasarkan ID
   * @param {string} type - Tipe data: 'foam' atau 'spring'
   * @param {string} id - ID data yang akan dihapus
   * @returns {Promise<Object>} Response dari API
   */
  delete: async (type, id) => {
    try {
      const response = await apiClient.delete(`/api/production-planning/${type}/${id}`);
      return response;
    } catch (error) {
      console.error(
        `Gagal menghapus data ${type} dengan ID ${id}:`,
        error,
      );
      throw error;
    }
  },
};
