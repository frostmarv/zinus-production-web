// src/pages/Input/Bonding/FormBondingIndex.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  AlertTriangle,
  ChevronRight,
  FileText,
  ClipboardList,
  XCircle,
} from "lucide-react";
import "../../../styles/Input/Bonding/FormBondingIndex.css";

const FormBondingIndex = () => {
  const navigate = useNavigate();

  const bondingMenus = [
    {
      id: "summary",
      title: "Form Summary",
      description: "Input data summary produksi bonding",
      icon: ClipboardList,
      path: "/input/bonding/summary", // Pastikan route ini valid
      color: "#329F96",
      bgColor: "#E9FBF0",
      active: true,
    },
    {
      id: "reject",
      title: "Form Reject",
      description: "Input data reject bonding",
      icon: XCircle,
      path: "/input/bonding/reject", // Pastikan route ini valid
      color: "#ef4444",
      bgColor: "#fef2f2",
      active: true,
    },
    // Tambahkan submenu lain jika diperlukan
  ];

  const handleMenuClick = (item) => {
    if (item.active) {
      navigate(item.path);
    } else {
      alert("🛠️ Fitur ini sedang dalam pengembangan.\nAkan segera tersedia!");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="form-bonding-index-header">
        <button onClick={handleBack} className="btn-back">
          <AlertTriangle size={18} />
          <span>KEMBALI</span>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <Layers size={32} />
          </div>
          <div className="header-text">
            <h1>Input Data Bonding</h1>
            <p>Pilih formulir untuk memasukkan data produksi bonding</p>
          </div>
        </div>
      </div>

      <div className="bonding-menu-grid">
        {bondingMenus.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`menu-card ${!item.active ? "menu-card--disabled" : ""}`}
              onClick={() => handleMenuClick(item)}
              tabIndex={item.active ? 0 : -1}
              role="button"
            >
              <div
                className="icon-container"
                style={{ backgroundColor: item.bgColor }}
              >
                <Icon size={24} style={{ color: item.color }} />
                {!item.active && (
                  <div className="coming-soon-badge">
                    <AlertTriangle size={12} />
                  </div>
                )}
              </div>
              <div className="menu-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {!item.active && (
                  <span className="coming-soon-label">Coming Soon</span>
                )}
              </div>
              {item.active ? (
                <ChevronRight size={20} className="arrow-icon" />
              ) : (
                <div className="arrow-placeholder"></div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FormBondingIndex;