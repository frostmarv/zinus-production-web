// src/api/cutting.js
import { apiClient } from "./client";

/**
 * API untuk Cutting History/Data Mentah
 * Base URL: /api/cutting
 * Digunakan oleh: BalokCutting.jsx
 */
export const cuttingAPI = {
  /**
   * GET    /api/cutting
   * Mendapatkan semua data balok cutting
   */
  getAll: async () => {
    return await apiClient.get("/api/cutting");
  },

  /**
   * GET    /api/cutting/:id
   * Mendapatkan detail data berdasarkan ID
   */
  getById: async (id) => {
    return await apiClient.get(`/api/cutting/${id}`);
  },

  /**
   * POST   /api/cutting
   * Membuat data baru
   */
  save: async (data) => {
    return await apiClient.post("/api/cutting", data);
  },

  /**
   * PUT    /api/cutting/:id
   * Memperbarui data berdasarkan ID
   */
  update: async (id, data) => {
    return await apiClient.put(`/api/cutting/${id}`, data);
  },

  /**
   * DELETE /api/cutting/:id
   * Menghapus data berdasarkan ID
   */
  delete: async (id) => {
    return await apiClient.delete(`/api/cutting/${id}`);
  },
};

/**
 * API untuk Cutting Production/Data Final
 * Base URL: /api/cutting/production
 * Digunakan oleh: InputCutting.jsx (atau komponen produksi)
 */
export const cuttingProductionAPI = {
  /**
   * GET    /api/cutting/production
   * Mendapatkan semua data production cutting
   */
  getAll: async () => {
    return await apiClient.get("/api/cutting/production");
  },

  /**
   * GET    /api/cutting/production/:id
   * Mendapatkan detail data produksi berdasarkan ID
   */
  getById: async (id) => {
    return await apiClient.get(`/api/cutting/production/${id}`);
  },

  /**
   * POST   /api/cutting/production
   * Membuat data produksi baru
   */
  save: async (data) => {
    return await apiClient.post("/api/cutting/production", data);
  },

  /**
   * PUT    /api/cutting/production/:id
   * Memperbarui data produksi berdasarkan ID
   */
  update: async (id, data) => {
    return await apiClient.put(`/api/cutting/production/${id}`, data);
  },

  /**
   * DELETE /api/cutting/production/:id
   * Menghapus data produksi berdasarkan ID
   */
  delete: async (id) => {
    return await apiClient.delete(`/api/cutting/production/${id}`);
  },
};
