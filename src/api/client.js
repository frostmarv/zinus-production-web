// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL tidak ditemukan di .env");
}

export const apiClient = {
  // GET request
  get: async (endpoint) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("🔍 GET:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  // POST request
  post: async (endpoint, data) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("📤 POST:", url, data);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  // PUT request
  put: async (endpoint, data) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("🔄 PUT:", url, data);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  // DELETE request
  delete: async (endpoint) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("🗑️ DELETE:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Beberapa API DELETE mengembalikan data, beberapa tidak
    // Cek apakah response punya konten sebelum parse JSON
    const text = await response.text();
    return text ? JSON.parse(text) : { message: "Deleted successfully" };
  },
};
