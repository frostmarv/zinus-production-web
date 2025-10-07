// src/pages/Input/FormIndex.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Shirt,
  Bed,
  Loader,
  Package,
  Box,
  CheckCircle,
  Archive,
  FileText,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import "../../styles/Input/FormIndex.css";

const FormIndex = () => {
  const navigate = useNavigate();

  const inputMenus = [
    {
      id: "cutting",
      title: "Input Cutting",
      description: "Input data cutting balok foam dan layer",
      icon: Scissors,
      path: "/cutting/index-cutting",
      color: "#ef4444",
      active: true,
    },
    {
      id: "sewing",
      title: "Input Sewing",
      description: "Input data sewing outcover",
      icon: Shirt,
      path: "/input/sewing",
      color: "#3b82f6",
      active: false,
    },
    {
      id: "quilting",
      title: "Input Quilting",
      description: "Input data quilting mattress",
      icon: Bed,
      path: "/input/quilting",
      color: "#8b5cf6",
      active: false,
    },
    {
      id: "spring-core",
      title: "Input Spring Core",
      description: "Input data spring core assembly",
      icon: Loader,
      path: "/input/spring-core",
      color: "#f59e0b",
      active: false,
    },
    {
      id: "packing-foam",
      title: "Input Packing Foam",
      description: "Input data packing foam products",
      icon: Package,
      path: "/input/packing-foam",
      color: "#10b981",
      active: false,
    },
    {
      id: "packing-spring",
      title: "Input Packing Spring",
      description: "Input data packing spring products",
      icon: Box,
      path: "/input/packing-spring",
      color: "#06b6d4",
      active: false,
    },
    {
      id: "finish-good",
      title: "Input Finish Good",
      description: "Input data finish good products",
      icon: CheckCircle,
      path: "/input/finish-good",
      color: "#059669",
      active: false,
    },
    {
      id: "cd-box",
      title: "Input C/D Box",
      description: "Input data C/D box packaging",
      icon: Archive,
      path: "/input/cd-box",
      color: "#f97316",
      active: false,
    },
  ];

  const handleMenuClick = (item) => {
    if (item.active) {
      navigate(item.path);
    } else {
      alert("🛠️ Fitur ini sedang dalam pengembangan.\nAkan segera tersedia!");
    }
  };

  return (
    <>
      <div className="form-index-header">
        <div className="header-icon">
          <FileText size={48} />
        </div>
        <h1>Input Data Production</h1>
        <p>Pilih departemen untuk memasukkan data produksi harian</p>
      </div>

      <div className="menu-grid">
        {inputMenus.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`menu-card ${!item.active ? "menu-card--disabled" : ""}`}
              onClick={() => handleMenuClick(item)}
            >
              <div
                className="icon-container"
                style={{
                  borderColor: item.active
                    ? `${item.color}40`
                    : "rgba(231, 229, 228, 0.6)",
                  backgroundColor: item.active
                    ? `${item.color}10`
                    : "rgba(255, 255, 255, 0.7)",
                }}
              >
                <Icon
                  size={28}
                  style={{
                    color: item.color,
                    filter: item.active
                      ? `drop-shadow(0 2px 4px ${item.color}40)`
                      : "none",
                  }}
                />
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

export default FormIndex;
