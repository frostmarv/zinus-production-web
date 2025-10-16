// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL tidak ditemukan di environment variables");
}

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

const getHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
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
  console.log("📄 parseJSON raw text:", text); // 👈 TAMBAHKAN LOG

  if (text === "") return null;
  try {
    const json = JSON.parse(text);
    console.log("📄 parseJSON parsed JSON:", json); // 👈 TAMBAHKAN LOG
    return json;
  } catch (e) {
    console.error("Gagal mengurai JSON:", text);
    throw new Error(`Respons bukan JSON valid. Status: ${response.status}`);
  }
}

async function authenticatedFetch(url, options, token = null) {
  const finalToken = token ?? getAccessToken();
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(finalToken),
  });
  return response;
}

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

async function makeRequest(method, endpoint, data = null, params = {}) {
  const url =
    method === "GET"
      ? buildUrl(API_BASE_URL, endpoint, params)
      : new URL(endpoint, API_BASE_URL).toString();

  // Coba request pertama kali
  let response = await authenticatedFetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });

  // Jika 401, coba refresh token dan ulangi
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshToken();
      response = await authenticatedFetch(
        url,
        {
          method,
          body: data ? JSON.stringify(data) : undefined,
        },
        newAccessToken,
      );
    } catch (refreshError) {
      console.error("Auto-refresh gagal:", refreshError);
      clearTokens();
      window.location.href = "/login";
      throw refreshError;
    }
  }

  if (!response.ok) {
    const errorData = await parseJSON(response).catch(() => ({}));
    const message =
      errorData?.message ||
      errorData?.error ||
      `${method} gagal: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const result = await parseJSON(response); // ← INI YANG DIKEMBALIKAN
  console.log("📤 makeRequest result:", result); // 👈 TAMBAHKAN LOG
  return result;
}

export const apiClient = {
  get: (endpoint, params = {}) => makeRequest("GET", endpoint, null, params),
  post: (endpoint, data) => makeRequest("POST", endpoint, data),
  put: (endpoint, data) => makeRequest("PUT", endpoint, data),
  delete: (endpoint) => makeRequest("DELETE", endpoint),
};
