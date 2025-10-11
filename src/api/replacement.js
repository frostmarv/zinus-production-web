// src/api/replacement.js
import { apiClient } from "./client";

// ✅ Helper: konversi objek params ke query string
const buildQueryString = (params) => {
  if (!params || typeof params !== "object") return "";
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  }
  return searchParams.toString();
};

export const replacementAPI = {
  getAll: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `/api/replacement${queryString ? "?" + queryString : ""}`;
    return await apiClient.get(url);
  },

  getById: async (id) => {
    return await apiClient.get(`/api/replacement/${id}`);
  },

  getStatistics: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `/api/replacement/statistics${queryString ? "?" + queryString : ""}`;
    return await apiClient.get(url);
  },

  createRequest: async (data) => {
    return await apiClient.post("/api/replacement/request", data);
  },

  updateStatus: async (id, status) => {
    return await apiClient.put(`/api/replacement/${id}/status`, { status });
  },
};

export const cuttingReplacementAPI = {
  process: async (data) => {
    return await apiClient.post("/api/cutting/replacement/process", data);
  },

  getHistory: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `/api/cutting/replacement${queryString ? "?" + queryString : ""}`;
    return await apiClient.get(url);
  },

  getStatistics: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `/api/cutting/replacement/statistics${queryString ? "?" + queryString : ""}`;
    return await apiClient.get(url);
  },

  markAsCompleted: async (id) => {
    return await apiClient.put(`/api/cutting/replacement/${id}/complete`);
  },
};
