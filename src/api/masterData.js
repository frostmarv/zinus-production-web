// src/api/masterData.js
import { apiClient } from "./client";

// Helper untuk request
const handleRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    console.error("❌ API Error (masterData):", error);
    throw error;
  }
};

export const masterDataAPI = {
  // 1. Customers
  getCustomers: () =>
    handleRequest(async () => {
      const res = await apiClient.get("/api/master-data/customers");
      return res; // sudah { value, label }
    }),

  // 2. PO Numbers by Customer
  getPoNumbers: (customerId) =>
    handleRequest(async () => {
      const res = await apiClient.get(
        `/api/master-data/po-numbers?customerId=${customerId}`,
      );
      return res; // sudah { value, label }
    }),

  // 3. Customer POs by PO Number
  getCustomerPOs: (poNumber) =>
    handleRequest(async () => {
      const res = await apiClient.get(
        `/api/master-data/customer-pos?poNumber=${poNumber}`,
      );
      return res; // sudah { value, label }
    }),

  // 4. SKUs by Customer PO
  getSkus: (customerPo) =>
    handleRequest(async () => {
      const res = await apiClient.get(
        `/api/master-data/skus?customerPo=${customerPo}`,
      );
      return res; // sudah { value, label }
    }),

  // 5. Qty Plans by Customer PO + SKU
  getQtyPlans: (customerPo, sku) =>
    handleRequest(async () => {
      const res = await apiClient.get(
        `/api/master-data/qty-plans?customerPo=${customerPo}&sku=${sku}`,
      );
      return res; // sudah { value, label }
    }),

  // 6. Weeks by Customer PO + SKU
  getWeeks: (customerPo, sku) =>
    handleRequest(async () => {
      const res = await apiClient.get(
        `/api/master-data/weeks?customerPo=${customerPo}&sku=${sku}`,
      );
      return res; // { value, label, f_code, s_codes: [{s_code, description}] }
    }),
};
