// src/api/authService.js
import { apiClient } from "../api/client";

export const login = async (email, password) => {
  try {
    // ⚠️ apiClient.post() sudah return JSON, bukan { data: ... }
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });

    // ✅ Langsung ambil dari response, bukan response.data
    const { access_token, user } = response;

    if (!access_token) {
      throw new Error("Login gagal: token tidak ditemukan dalam respons.");
    }

    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response; // return full response
  } catch (error) {
    console.error("Error saat login:", error);
    // Jika error berasal dari apiClient (HTTP error), tampilkan pesan jelas
    if (error.message?.startsWith("HTTP ")) {
      throw new Error("Login gagal: " + error.message.replace("HTTP ", ""));
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
