// src/api/client.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL tidak ditemukan di environment variables");
}

// ============================================================
// 🧩 Token Helpers
// ============================================================
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const saveTokens = (access_token, refresh_token) => {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

// ============================================================
// 🧠 Utility Functions
// ============================================================

const getHeaders = (token, isFormData = false) => {
  const headers = {
    Accept: "application/json",
  };

  // Jika bukan FormData, gunakan JSON
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

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

async function parseJSON(response) {
  const text = await response.text();
  console.log("📄 parseJSON raw text:", text);

  if (text === "") return null;

  try {
    const json = JSON.parse(text);
    console.log("📄 parseJSON parsed JSON:", json);
    return json;
  } catch (e) {
    console.error("❌ Gagal mengurai JSON:", text);
    throw new Error(`Respons bukan JSON valid. Status: ${response.status}`);
  }
}

async function authenticatedFetch(url, options, token = null) {
  const finalToken = token ?? getAccessToken();
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(finalToken, options.isFormData),
  });
  return response;
}

// ============================================================
// 🔄 Refresh Token
// ============================================================
async function refreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const refreshUrl = new URL("/api/auth/refresh", API_BASE_URL).toString();
  const refreshResponse = await fetch(refreshUrl, {
    method: "POST",
    headers: getHeaders(refreshToken),
  });

  if (!refreshResponse.ok) {
    clearTokens();
    throw new Error("Refresh token invalid");
  }

  const data = await parseJSON(refreshResponse);
  if (!data?.access_token || !data?.refresh_token) {
    clearTokens();
    throw new Error("Invalid refresh response");
  }

  saveTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

// ============================================================
// 🚀 Main Request Function
// ============================================================
async function makeRequest(method, endpoint, data = null, params = {}) {
  const url =
    method === "GET"
      ? buildUrl(API_BASE_URL, endpoint, params)
      : new URL(endpoint, API_BASE_URL).toString();

  const isFormData = data instanceof FormData;

  const options = {
    method,
    isFormData,
    body:
      data && !isFormData
        ? JSON.stringify(data)
        : isFormData
        ? data
        : undefined,
  };

  console.log(`🚀 [${method}] ${url}`, {
    isFormData,
    data: isFormData ? "(FormData)" : data,
  });

  // Request pertama
  let response = await authenticatedFetch(url, options);

  // Jika token expired → refresh
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshToken();
      response = await authenticatedFetch(url, options, newAccessToken);
    } catch (err) {
      console.error("❌ Auto-refresh gagal:", err);
      clearTokens();
      window.location.href = "/login";
      throw err;
    }
  }

  // Tangani error
  if (!response.ok) {
    const errorData = await parseJSON(response).catch(() => ({}));
    const message =
      errorData?.message ||
      errorData?.error ||
      `${method} gagal: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  // Parse hasil JSON
  const result = await parseJSON(response);
  console.log("📤 makeRequest result:", result);
  return result;
}

// ============================================================
// 🌐 Public API Client
// ============================================================
export const apiClient = {
  get: (endpoint, params = {}) => makeRequest("GET", endpoint, null, params),
  post: (endpoint, data) => makeRequest("POST", endpoint, data),
  patch: (endpoint, data) => makeRequest("PATCH", endpoint, data),
  put: (endpoint, data) => makeRequest("PUT", endpoint, data),
  delete: (endpoint) => makeRequest("DELETE", endpoint),
};
