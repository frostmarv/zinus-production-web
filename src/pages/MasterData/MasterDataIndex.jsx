// src/pages/MasterData/MasterDataIndex.jsx
import React from "react";
import { Package, Layers, ChevronRight, Square, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/MasterData/MasterDataIndex.css";

const MasterDataIndex = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "foam",
      title: "Master Data Foam",
      description: "Manage foam types, materials, and specifications",
      icon: Square, // Bisa ganti ikon lain jika cocok
      path: "/master/foam",
      color: "bg-blue-500",
    },
    {
      id: "spring",
      title: "Master Data Spring",
      description: "Manage spring types, dimensions, and specifications",
      icon: Leaf, // Bisa ganti ikon lain
      path: "/master/spring",
      color: "bg-green-500",
    },
    {
      id: "cutting",
      title: "Master Data Cutting/Layers",
      description: "Manage cutting layers, materials, and processes",
      icon: Layers,
      path: "/master/cutting",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="master-data-index-container">
      <div className="master-data-header">
        <h1>
          <Package size={32} />
          Master Data Management
        </h1>
        <p>Kelola data utama sistem produksi cutting</p>
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => navigate(item.path)}
            >
              <div className={`icon-container ${item.color}`}>
                <Icon size={32} color="white" />
              </div>
              <div className="menu-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <ChevronRight size={24} className="arrow-icon" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MasterDataIndex;
