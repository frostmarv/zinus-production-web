// src/pages/History/HistoryIndex.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Tambahkan useNavigate
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
} from "lucide-react";
import "../../styles/History/Index.css";

const HistoryDashboard = () => {
  const navigate = useNavigate(); // ✅ Inisialisasi navigate

  // Get current time for last update
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const [lastUpdate] = useState(getCurrentTime());

  // Data departemen dengan informasi lengkap
  const departments = [
    {
      id: "cutting",
      name: "Cutting",
      icon: Scissors,
      count: 24,
      color: "#ef4444",
      bgColor: "#fef2f2",
      path: "/history/cutting",
      description: "Data cutting balok foam",
      status: "ACTIVE",
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
    },
  ];

  // ✅ Perbaiki fungsi handleDepartmentClick untuk navigasi
  const handleDepartmentClick = (path, deptName) => {
    console.log(`Navigating to ${deptName}: ${path}`);
    navigate(path); // ✅ Gunakan navigate untuk routing
  };

  return (
    <div className="history-dashboard-container">
      {/* Header */}
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

      {/* Department List */}
      <div className="departments-list">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <div
              key={dept.id}
              className="department-item"
              onClick={() => handleDepartmentClick(dept.path, dept.name)} // ✅ Klik akan navigasi
              style={{ cursor: "pointer" }} // ✅ Tambahkan cursor pointer untuk UX
            >
              <div
                className="department-icon"
                style={{ backgroundColor: dept.bgColor }}
              >
                <IconComponent size={24} style={{ color: dept.color }} />
              </div>

              <div className="department-info">
                <div className="department-header">
                  <h3>{dept.name}</h3>
                  <span className="status-badge" style={{ color: dept.color }}>
                    {dept.status}
                  </span>
                </div>
                <p className="department-description">{dept.description}</p>
                <div className="department-stats">
                  <span className="record-count">
                    {dept.count} records today
                  </span>
                </div>
              </div>

              <div className="department-arrow">
                <ChevronRight size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryDashboard;
