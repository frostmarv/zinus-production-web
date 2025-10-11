// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL tidak ditemukan di environment variables");
}

function buildUrl(baseUrl, endpoint, params = {}) {
  const url = new URL(endpoint, baseUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  }
  return url.toString();
}

export const apiClient = {
  get: async (endpoint, params = {}) => {
    const url = buildUrl(API_BASE_URL, endpoint, params);
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

  post: async (endpoint, data) => {
    const url = new URL(endpoint, API_BASE_URL).toString();
    console.log("📤 POST:", url, data);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`,
      );
    }

    return response.json();
  },

  put: async (endpoint, data) => {
    const url = new URL(endpoint, API_BASE_URL).toString();
    console.log("🔄 PUT:", url, data);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`,
      );
    }

    return response.json();
  },

  delete: async (endpoint) => {
    const url = new URL(endpoint, API_BASE_URL).toString();
    console.log("🗑️ DELETE:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`,
      );
    }

    // Handle response yang mungkin kosong
    const text = await response.text();
    try {
      return text
        ? JSON.parse(text)
        : { success: true, message: "Deleted successfully" };
    } catch (e) {
      // Jika bukan JSON, kembalikan sebagai teks atau sukses
      return { success: true, message: "Deleted successfully" };
    }
  },
};
