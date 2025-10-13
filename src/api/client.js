// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL tidak ditemukan di environment variables");
}

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json", // 👈 Penting: minta JSON, bukan HTML
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

function buildUrl(baseUrl, endpoint, params = {}) {
  const url = new URL(endpoint, baseUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  }
  return url.toString();
}

// Helper: parse respons teks ke JSON dengan aman
async function parseJSON(response) {
  const text = await response.text();

  if (text === "") {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Gagal mengurai JSON dari respons:", text);
    throw new Error(
      `Respons dari server bukan JSON valid. Status: ${response.status}.`,
    );
  }
}

export const apiClient = {
  get: async (endpoint, params = {}) => {
    const url = buildUrl(API_BASE_URL, endpoint, params);
    console.log("🔍 GET:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await parseJSON(response).catch(() => ({}));
      const message =
        errorData?.message ||
        errorData?.error ||
        `GET gagal: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return parseJSON(response);
  },

  post: async (endpoint, data) => {
    const url = new URL(endpoint, API_BASE_URL).toString();
    console.log("📤 POST:", url, data);

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await parseJSON(response).catch(() => ({}));
      const message =
        errorData?.message ||
        errorData?.error ||
        `POST gagal: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return parseJSON(response);
  },

  put: async (endpoint, data) => {
    const url = new URL(endpoint, API_BASE_URL).toString();
    console.log("🔄 PUT:", url, data);

    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await parseJSON(response).catch(() => ({}));
      const message =
        errorData?.message ||
        errorData?.error ||
        `PUT gagal: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return parseJSON(response);
  },

  delete: async (endpoint) => {
    const url = new URL(endpoint, API_BASE_URL).toString();
    console.log("🗑️ DELETE:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await parseJSON(response).catch(() => ({}));
      const message =
        errorData?.message ||
        errorData?.error ||
        `DELETE gagal: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return parseJSON(response);
  },
};
