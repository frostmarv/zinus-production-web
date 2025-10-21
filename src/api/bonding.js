// src/api/bonding.js
import { apiClient } from "./client";

/**
 * Mengirim data bonding summary baru ke backend
 * @param {Object} data - Data bonding summary sesuai DTO CreateBondingSummaryDto
 * @returns {Promise<Object>} Respons dari server
 */
export const createBondingSummary = async (data) => {
  return await apiClient.post("/api/bonding/summary/form-input", data);
};

/**
 * Mendapatkan semua data bonding summary
 * @returns {Promise<Array>} Daftar semua bonding summary
 */
export const getAllBondingSummaries = async () => {
  return await apiClient.get("/api/bonding/summary");
};

/**
 * Mendapatkan detail bonding summary berdasarkan ID
 * @param {number|string} id - ID dari bonding summary
 * @returns {Promise<Object>} Detail bonding summary
 */
export const getBondingSummaryById = async (id) => {
  return await apiClient.get(`/api/bonding/summary/${id}`);
};
