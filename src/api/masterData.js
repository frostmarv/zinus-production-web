import { apiClient } from "./client";

export const masterDataAPI = {
  // 1. Ambil daftar customer
  getCustomers: () => apiClient.get("/api/master-data/customers"),

  // 2. Ambil PO Number berdasarkan customer
  getPoNumbers: (customerId) =>
    apiClient.get(`/api/master-data/po-numbers?customerId=${customerId}`),

  // 3. Ambil Customer PO berdasarkan PO Number
  getCustomerPos: (poNumber) =>
    apiClient.get(`/api/master-data/customer-pos?poNumber=${poNumber}`),

  // 4. Ambil SKU berdasarkan Customer PO
  getSkus: (customerPo) =>
    apiClient.get(`/api/master-data/skus?customerPo=${customerPo}`),

  // 5. Ambil Qty Plan berdasarkan Customer PO + SKU
  getQtyPlans: (customerPo, sku) =>
    apiClient.get(
      `/api/master-data/qty-plans?customerPo=${customerPo}&sku=${sku}`,
    ),

  // 6. Ambil Week berdasarkan Customer PO + SKU
  getWeeks: (customerPo, sku) =>
    apiClient.get(`/api/master-data/weeks?customerPo=${customerPo}&sku=${sku}`),
};
