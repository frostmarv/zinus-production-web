// src/pages/MasterData/MasterDataIndex.jsx
import React from "react";
import { Cuboid, Leaf, Scissors, Database, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/MasterData/MasterDataIndex.css";

const MasterDataIndex = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "foam",
      title: "Master Data Foam",
      description:
        "Kelola jenis foam, spesifikasi material, dan parameter produksi.",
      icon: Cuboid,
      path: "/master/foam",
      color: "#3b82f6",
    },
    {
      id: "spring",
      title: "Master Data Spring",
      description: "Kelola jenis pegas, dimensi, dan karakteristik teknis.",
      icon: Leaf,
      path: "/master/spring",
      color: "#10b981",
    },
    {
      id: "cutting",
      title: "Master Data Cutting",
      description:
        "Kelola layer cutting, konfigurasi material, dan proses produksi.",
      icon: Scissors,
      path: "/master/cutting",
      color: "#8b5cf6",
    },
  ];

  return (
    // ✅ WRAP SELURUH KONTEN DALAM SCOPE
    <div className="master-data-index-root">
      <div className="master-data-index-container">
        <div className="master-data-header">
          <div className="header-icon">
            <Database size={36} />
          </div>
          <h1>Master Data Management</h1>
          <p>
            Sistem terpusat untuk mengelola data inti produksi secara efisien
            dan akurat.
          </p>
        </div>

        <div className="menu-grid">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="menu-card"
                onClick={() => navigate(item.path)}
                style={{ "--card-accent-color": item.color }}
              >
                <div className="icon-container">
                  <Icon size={28} />
                </div>
                <div className="menu-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <ChevronRight size={20} className="arrow-icon" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MasterDataIndex;
