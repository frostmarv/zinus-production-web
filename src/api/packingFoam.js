// src/api/packingFoam.js
import { apiClient } from './client';

const BASE_PATH = '/api/packing-foam';

// ============================================================
// 🧩 Packing Foam API Functions
// ============================================================

/**
 * GET /packing-foam/summary
 * Ambil semua data summary packing foam
 */
export const getPackingFoamSummaries = (params = {}) => {
  return apiClient.get(`${BASE_PATH}/summary`, params);
};

/**
 * POST /packing-foam/summary/post
 * Buat data summary packing foam baru
 */
export const createPackingFoamSummary = (data) => {
  return apiClient.post(`${BASE_PATH}/summary/post`, data);
};

/**
 * PUT /packing-foam/summary/:id
 * Update data summary packing foam berdasarkan ID
 */
export const updatePackingFoamSummary = (id, data) => {
  return apiClient.put(`${BASE_PATH}/summary/${id}`, data);
};

/**
 * DELETE /packing-foam/summary/:id
 * Hapus data summary packing foam berdasarkan ID
 */
export const deletePackingFoamSummary = (id) => {
  return apiClient.delete(`${BASE_PATH}/summary/${id}`);
};