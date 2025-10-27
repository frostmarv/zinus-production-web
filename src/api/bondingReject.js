// src/api/bondingReject.js

import { apiClient } from './client';

/**
 * Membuat catatan reject bonding baru
 * @param {Object} data - Data input form reject bonding
 * @returns {Promise<Object>} Respons dari server
 */
export const createBondingReject = (data) => {
  return apiClient.post('/api/bonding/reject/form-input', data);
};

/**
 * Mengunggah gambar untuk reject bonding tertentu
 * @param {string} id - ID bonding reject
 * @param {FormData} formData - FormData berisi file gambar (key: 'images')
 * @returns {Promise<Object>} Respons dari server
 */
export const uploadBondingRejectImages = (id, formData) => {
  return apiClient.post(`/api/bonding/reject/${id}/upload-images`, formData);
};

/**
 * Mendapatkan semua data bonding reject dengan filter opsional
 * @param {Object} params - Parameter query (shift, group, status, startDate, endDate)
 * @returns {Promise<Object>} Respons dari server
 */
export const getBondingRejects = (params = {}) => {
  return apiClient.get('/api/bonding/reject', params);
};

/**
 * Mendapatkan detail bonding reject berdasarkan ID
 * @param {string} id - ID bonding reject
 * @returns {Promise<Object>} Respons dari server
 */
export const getBondingRejectById = (id) => {
  return apiClient.get(`/api/bonding/reject/${id}`);
};

/**
 * Mendapatkan bonding reject berdasarkan nomor batch
 * @param {string} batchNumber - Nomor batch
 * @returns {Promise<Object>} Respons dari server
 */
export const getBondingRejectByBatchNumber = (batchNumber) => {
  return apiClient.get(`/api/bonding/reject/batch/${batchNumber}`);
};

/**
 * Memperbarui data bonding reject
 * @param {string} id - ID bonding reject
 * @param {Object} data - Data yang akan diperbarui
 * @returns {Promise<Object>} Respons dari server
 */
export const updateBondingReject = (id, data) => {
  return apiClient.put(`/api/bonding/reject/${id}`, data);
};

/**
 * Memperbarui status bonding reject
 * @param {string} id - ID bonding reject
 * @param {string} status - Status baru (mengikuti enum BondingRejectStatus)
 * @returns {Promise<Object>} Respons dari server
 */
export const updateBondingRejectStatus = (id, status) => {
  return apiClient.put(`/api/bonding/reject/${id}/status`, { status });
};

/**
 * Menghapus bonding reject berdasarkan ID
 * @param {string} id - ID bonding reject
 * @returns {Promise<void>} Respons dari server
 */
export const deleteBondingReject = (id) => {
  return apiClient.delete(`/api/bonding/reject/${id}`);
};

/**
 * Mengekspor data bonding reject ke Google Sheets
 * @param {Object} params - Parameter filter (shift, group, status, startDate, endDate)
 * @returns {Promise<Object>} Respons dari server
 */
export const exportBondingRejectToSheets = (params = {}) => {
  return apiClient.post('/api/bonding/reject/export-to-sheets', null, params);
};