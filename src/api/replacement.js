// src/api/replacement.js
import { apiClient } from "./client";

// ✅ API untuk Replacement Module (digunakan oleh Cutting Dashboard)
export const replacementAPI = {
  // Digunakan untuk Cutting Dashboard: filter targetDept=CUTTING
  getAllForCutting: async (params = {}) => {
    // Biarkan apiClient menangani query params
    return await apiClient.get("/api/replacement", {
      ...params,
      targetDept: "CUTTING",
    });
  },

  getStatisticsForCutting: async () => {
    return await apiClient.get("/api/replacement/statistics", {
      targetDept: "CUTTING",
    });
  },

  getById: async (id) => {
    return await apiClient.get(`/api/replacement/${id}`);
  },

  // ❌ SALAH: /replacement/request
  // ✅ BENAR: /replacement
  createRequest: async (data) => {
    return await apiClient.post("/api/replacement", data);
  },

  updateStatus: async (id, status) => {
    return await apiClient.put(`/api/replacement/${id}/status`, { status });
  },
};

// ✅ API untuk Cutting Replacement Module (hanya untuk proses)
export const cuttingReplacementAPI = {
  process: async (data) => {
    return await apiClient.post("/api/cutting/replacement/process", data);
  },
  // Tidak ada endpoint lain — sesuai desain
};
