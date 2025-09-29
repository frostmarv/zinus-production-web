// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL tidak ditemukan di environment variables");
}

export const apiClient = {
  // GET request
  get: async (endpoint) => {
    // Normalize URL to avoid double slashes
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    const url = baseUrl + path;
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
    // Normalize URL to avoid double slashes
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    const url = baseUrl + path;
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
    // Normalize URL to avoid double slashes
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    const url = baseUrl + path;
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
    // Normalize URL to avoid double slashes
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    const url = baseUrl + path;
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
