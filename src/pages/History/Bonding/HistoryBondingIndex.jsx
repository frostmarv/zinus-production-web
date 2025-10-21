// src/pages/History/Bonding/HistoryBondingIndex.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle, ChevronRight, BarChart3 } from "lucide-react";
import "../../../styles/History/Bonding/HistoryBondingIndex.css";

const HistoryBondingIndex = () => {
  const navigate = useNavigate();

  const bondingModules = [
    {
      id: "summary",
      title: "Bonding Summary",
      description: "Lihat dan kelola data ringkasan produksi bonding",
      path: "/history/bonding/summary",
      icon: FileText,
      color: "#329F96",
      bgColor: "#E9FBF0",
    },
    {
      id: "reject",
      title: "Bonding Reject",
      description: "Lihat dan analisis data produk bonding yang ditolak",
      path: "/history/bonding/reject",
      icon: AlertTriangle,
      color: "#ef4444",
      bgColor: "#fef2f2",
      comingSoon: true, // opsional: aktifkan jika belum siap
    },
  ];

  const handleCardClick = (path, isComingSoon) => {
    if (isComingSoon) {
      alert("🛠️ Fitur ini sedang dalam pengembangan.\nAkan segera tersedia!");
      return;
    }
    navigate(path);
  };

  return (
    <div className="bonding-dashboard">
      {/* Header */}
      <div className="bonding-header">
        <div className="header-content">
          <div className="header-icon">
            <BarChart3 size={32} />
          </div>
          <div className="header-text">
            <h1>Bonding History</h1>
            <p>Pilih jenis laporan bonding untuk melihat data historis</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="bonding-modules">
        {bondingModules.map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              className={`module-card ${module.comingSoon ? "module-card--disabled" : ""}`}
              onClick={() => handleCardClick(module.path, module.comingSoon)}
              tabIndex={module.comingSoon ? -1 : 0}
              role="button"
            >
              <div
                className="module-icon"
                style={{ backgroundColor: module.bgColor }}
              >
                <Icon size={24} style={{ color: module.color }} />
              </div>
              <div className="module-info">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
              <div className="module-arrow">
                <ChevronRight size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryBondingIndex;
