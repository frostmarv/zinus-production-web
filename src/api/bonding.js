// src/api/bonding.js

import { apiClient } from './client';

/**
 * Bonding API Client
 * Mengelola operasi terkait Bonding Summary
 */

/**
 * Mengirim data Bonding Summary baru ke backend
 * @param {Object} data - Data bonding summary sesuai DTO CreateBondingSummaryDto
 * @returns {Promise<Object>} - Respons dari server
 */
export const createBondingSummary = (data) => {
  return apiClient.post('/api/bonding/summary/form-input', data);
};

/**
 * Mendapatkan semua data Bonding Summary
 * @returns {Promise<Array>} - Daftar semua bonding summary
 */
export const getAllBondingSummaries = () => {
  return apiClient.get('/api/bonding/summary');
};

/**
 * Mendapatkan satu data Bonding Summary berdasarkan ID
 * @param {number|string} id - ID bonding summary
 * @returns {Promise<Object>} - Data bonding summary berdasarkan ID
 */
export const getBondingSummaryById = (id) => {
  return apiClient.get(`/api/bonding/summary/${id}`);
};