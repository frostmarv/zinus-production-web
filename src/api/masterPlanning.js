// src/services/masterPlanning.js
import { apiClient } from "../api/client";

/**
 * Mengambil seluruh data production planning dari API
 * @returns {Promise<Array>} Array of production planning records
 */
export const fetchProductionPlanningData = async () => {
  try {
    const data = await apiClient.get("/production-planning");
    return data;
  } catch (error) {
    console.error("Gagal mengambil data production planning:", error);
    throw error; // Biar komponen bisa handle error
  }
};
