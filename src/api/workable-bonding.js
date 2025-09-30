// src/api/workable-bonding.js
import { apiClient } from "./client";

/**
 * Ambil data Workable Bonding (ringkasan)
 * @returns {Promise<Array>} Daftar workable bonding
 */
export const getWorkableBonding = () => {
  return apiClient.get("/api/workable-bonding");
};

/**
 * Ambil data Detail Workable Bonding
 * @returns {Promise<Array>} Daftar detail workable bonding
 */
export const getWorkableBondingDetail = () => {
  return apiClient.get("/api/workable-bonding/detail");
};
