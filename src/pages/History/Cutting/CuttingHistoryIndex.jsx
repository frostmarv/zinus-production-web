// src/pages/History/Cutting/CuttingHistoryIndex.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  BarChart3,
  Calendar,
  Clock,
  Users,
  Settings,
  Repeat, // ✅ Tambahkan ikon Repeat untuk Replacement
} from "lucide-react";
import "../../../styles/History/Cutting/CuttingHistoryIndex.css";

const CuttingHistoryIndex = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "balok",
      name: "History Balok",
      icon: Package,
      description: "Lihat detail data balok cutting",
      path: "/history/cutting/balok",
      color: "#059669", // Hijau
    },
    {
      id: "summary",
      name: "History Summary",
      icon: BarChart3,
      description: "Lihat ringkasan data cutting",
      path: "/history/cutting/summary",
      color: "#0ea5e9", // Biru
    },
    // ✅ TAMBAHKAN MENU REPLACEMENT DI SINI
    {
      id: "replacement",
      name: "Replacement",
      icon: Repeat,
      description: "Kelola penggantian NG dari Bonding",
      path: "/cutting/replacements",
      color: "#d97706", // Orange (sesuai tema warning/pending)
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    // ✅ WRAP SELURUH KONTEN DALAM SCOPE
    <div className="cutting-history-index-root">
      {/* Header */}
      <div className="cutting-history-index-header">
        <div className="header-content">
          <h1>📚 History Cutting</h1>
          <p>Pilih jenis history cutting yang ingin dilihat</p>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="menu-grid">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => handleNavigate(item.path)}
              style={{
                borderLeft: `4px solid ${item.color}`,
              }}
              tabIndex={0}
              role="button"
            >
              <div className="card-icon" style={{ color: item.color }}>
                <IconComponent size={32} />
              </div>
              <div className="card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">
            <Calendar size={24} />
          </div>
          <div className="info-content">
            <h4>Data Terkini</h4>
            <p>Semua data diambil dari database cutting terbaru</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Clock size={24} />
          </div>
          <div className="info-content">
            <h4>Real-time</h4>
            <p>Data selalu diperbarui secara otomatis</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Users size={24} />
          </div>
          <div className="info-content">
            <h4>Akses Cepat</h4>
            <p>Navigasi mudah ke setiap jenis history</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Settings size={24} />
          </div>
          <div className="info-content">
            <h4>Filter & Sort</h4>
            <p>Gunakan filter untuk mencari data spesifik</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuttingHistoryIndex;
