// src/pages/History/HistoryIndex.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Shirt,
  Bed,
  Coins as Coil,
  Package,
  Box,
  CheckCircle,
  Archive,
  BarChart3,
  ChevronRight,
  Clock,
  AlertTriangle,
  Layers,
} from "lucide-react";
import "../../styles/History/HistoryIndex.css";

const HistoryDashboard = () => {
  const navigate = useNavigate();

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const [lastUpdate] = useState(getCurrentTime());

  const departments = [
    {
      id: "cutting",
      name: "Cutting",
      icon: Scissors,
      count: 24,
      color: "#ef4444",
      bgColor: "#fef2f2",
      path: "/history/cutting",
      description: "Data cutting produksi",
      status: "ACTIVE",
      isActive: true,
    },
    // ✅ Bonding dipindahkan ke sini — tepat setelah Cutting
    {
      id: "bonding",
      name: "Bonding",
      icon: Layers,
      count: 10,
      color: "#329F96",
      bgColor: "#E9FBF0",
      path: "/history/bonding",
      description: "Data bonding produksi",
      status: "ACTIVE",
      isActive: true,
    },
    {
      id: "sewing",
      name: "Sewing",
      icon: Shirt,
      count: 18,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      path: "/history/sewing",
      description: "Data sewing outcover",
      status: "ACTIVE",
      isActive: false,
    },
    {
      id: "quilting",
      name: "Quilting",
      icon: Bed,
      count: 15,
      color: "#8b5cf6",
      bgColor: "#faf5ff",
      path: "/history/quilting",
      description: "Data quilting mattress",
      status: "ACTIVE",
      isActive: false,
    },
    {
      id: "spring-core",
      name: "Spring Core",
      icon: Coil,
      count: 12,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      path: "/history/spring-core",
      description: "Data spring core assembly",
      status: "ACTIVE",
      isActive: false,
    },
    {
      id: "packing-foam",
      name: "Packing Foam",
      icon: Package,
      count: 30,
      color: "#10b981",
      bgColor: "#f0fdf4",
      path: "/history/packing-foam",
      description: "Data packing foam products",
      status: "ACTIVE",
      isActive: false,
    },
    {
      id: "packing-spring",
      name: "Packing Spring",
      icon: Box,
      count: 22,
      color: "#06b6d4",
      bgColor: "#f0fdfa",
      path: "/history/packing-spring",
      description: "Data packing spring products",
      status: "ACTIVE",
      isActive: false,
    },
    {
      id: "finish-good",
      name: "Finish Good",
      icon: CheckCircle,
      count: 28,
      color: "#059669",
      bgColor: "#ecfdf5",
      path: "/history/finish-good",
      description: "Data finish good products",
      status: "ACTIVE",
      isActive: false,
    },
    {
      id: "cd-box",
      name: "C/D Box",
      icon: Archive,
      count: 16,
      color: "#f97316",
      bgColor: "#fff7ed",
      path: "/history/cd-box",
      description: "Data C/D box packaging",
      status: "ACTIVE",
      isActive: false,
    },
  ];

  const handleDepartmentClick = (path, deptName, isActive) => {
    if (!isActive) {
      alert("🛠️ Fitur ini sedang dalam pengembangan.\nAkan segera tersedia!");
      return;
    }
    navigate(path);
  };

  return (
    <>
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-icon">
            <BarChart3 size={32} />
          </div>
          <div className="header-text">
            <h1>Department History</h1>
            <p>Select a department to view detailed reports</p>
          </div>
        </div>
        <div className="header-meta">
          <div className="last-update">
            <Clock size={16} />
            <span>Last Update: {lastUpdate}</span>
          </div>
        </div>
      </div>

      <div className="departments-list">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <div
              key={dept.id}
              className={`department-item ${!dept.isActive ? "department-item--disabled" : ""}`}
              onClick={() =>
                handleDepartmentClick(dept.path, dept.name, dept.isActive)
              }
              tabIndex={dept.isActive ? 0 : -1}
              role="button"
            >
              <div
                className="department-icon"
                style={{ backgroundColor: dept.bgColor }}
              >
                <IconComponent size={24} style={{ color: dept.color }} />
                {!dept.isActive && (
                  <div className="coming-soon-badge">
                    <AlertTriangle size={12} />
                  </div>
                )}
              </div>

              <div className="department-info">
                <div className="department-header">
                  <h3>{dept.name}</h3>
                  <span className="status-badge">{dept.status}</span>
                </div>
                <p className="department-description">{dept.description}</p>
                <div className="department-stats">
                  <span className="record-count">
                    {dept.count} records today
                  </span>
                  {!dept.isActive && (
                    <span className="coming-soon-label">Coming Soon</span>
                  )}
                </div>
              </div>

              {dept.isActive ? (
                <div className="department-arrow">
                  <ChevronRight size={20} />
                </div>
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

export default HistoryDashboard;
