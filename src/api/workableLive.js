// src/api/workableLive.js

// Import API_BASE_URL dari client.js agar konsisten
import { API_BASE_URL } from "./client";

// Fungsi untuk fetch data live tanpa auth (menggunakan fetch langsung)
async function fetchLiveWorkableData() {
  const url = new URL("/api/live-data", API_BASE_URL).toString();

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching live data:", errorText);
    throw new Error(
      `Gagal mengambil data live: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  console.log("📊 Live data diterima:", data);
  return data;
}

// Fungsi untuk membuat WebSocket URL dengan benar
function buildWebSocketUrl() {
  if (!API_BASE_URL) {
    console.error(
      "❌ API_BASE_URL tidak ditemukan, tidak bisa buat WebSocket URL",
    );
    return null;
  }

  const url = new URL(API_BASE_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/live-data"; // Namespace WebSocket

  return url.toString();
}

// Jika Anda ingin pakai WebSocket juga
let ws = null;
let wsReconnectInterval = null;

function connectWebSocket(onData) {
  const wsUrl = buildWebSocketUrl();
  if (!wsUrl) {
    console.error("❌ WebSocket URL tidak valid karena API_BASE_URL kosong");
    return;
  }

  console.log("🔌 Menghubungkan ke WebSocket:", wsUrl);

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("✅ WebSocket terhubung");
    if (wsReconnectInterval) {
      clearInterval(wsReconnectInterval);
      wsReconnectInterval = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📡 Data WebSocket diterima:", data);
      if (onData) onData(data);
    } catch (e) {
      console.error("Gagal mengurai data WebSocket:", e);
    }
  };

  ws.onclose = () => {
    console.log("❌ WebSocket terputus. Mencoba koneksi ulang...");
    // Coba koneksi ulang setiap 5 detik
    if (!wsReconnectInterval) {
      wsReconnectInterval = setInterval(() => {
        connectWebSocket(onData);
      }, 5000);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

function disconnectWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
  if (wsReconnectInterval) {
    clearInterval(wsReconnectInterval);
    wsReconnectInterval = null;
  }
}

export const workableLiveClient = {
  // Fetch data dari API (tanpa auth)
  getLiveData: fetchLiveWorkableData,
  // WebSocket
  connectWebSocket,
  disconnectWebSocket,
  // Jika nanti ada endpoint live yang perlu auth, bisa pakai apiClient
  // contoh: import { apiClient } from './client'; apiClient.get('/live/some-protected-endpoint')
};
