// src/pages/MasterData/MasterDataIndex.jsx
import React from "react";
import { Package, Layers, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/MasterData/MasterDataIndex.css";

const MasterDataIndex = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "production",
      title: "Production Master Data",
      description: "Manage production data, processes, and configurations",
      icon: Package,
      path: "/master/planning",
      color: "bg-blue-500",
    },
    {
      id: "layers",
      title: "Layers Master Data",
      description: "Manage material layers, types, and specifications",
      icon: Layers,
      path: "/master/layers",
      color: "bg-green-500",
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
