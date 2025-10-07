// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Package,
  Scissors,
  Bed,
  Settings,
  Users,
  BarChart3,
  Clock,
  Calendar,
} from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  // ✅ Data dummy untuk progress produksi semua departemen
  const [productionData, setProductionData] = useState({
    summary: {
      totalInput: 1247,
      success: 1123,
      error: 89,
      waiting: 35,
      lastUpdate: new Date().toLocaleTimeString("id-ID"),
    },
    departments: [
      {
        id: "cutting",
        name: "Cutting",
        icon: Scissors,
        progress: 85,
        target: 150,
        actual: 128,
        status: "running",
        color: "#3b82f6",
        bgColor: "#eff6ff",
        items: [
          { name: "Balok Foam", progress: 85, status: "success" },
          { name: "Outcover", progress: 78, status: "warning" },
        ],
      },
      {
        id: "foam",
        name: "Foam",
        icon: Bed,
        progress: 92,
        target: 200,
        actual: 184,
        status: "success",
        color: "#10b981",
        bgColor: "#ecfdf5",
        items: [
          { name: "Foam Block", progress: 92, status: "success" },
          { name: "Foam Slice", progress: 88, status: "success" },
        ],
      },
      {
        id: "packing",
        name: "Packing",
        icon: Package,
        progress: 76,
        target: 300,
        actual: 228,
        status: "running",
        color: "#f59e0b",
        bgColor: "#fffbeb",
        items: [
          { name: "Foam Products", progress: 76, status: "running" },
          { name: "Spring Sets", progress: 80, status: "running" },
        ],
      },
      {
        id: "qc",
        name: "QC",
        icon: CheckCircle,
        progress: 98,
        target: 250,
        actual: 245,
        status: "success",
        color: "#8b5cf6",
        bgColor: "#faf5ff",
        items: [
          { name: "Final Inspection", progress: 98, status: "success" },
          { name: "Defect Tracking", progress: 95, status: "success" },
        ],
      },
      {
        id: "assembly",
        name: "Assembly",
        icon: Settings,
        progress: 65,
        target: 180,
        actual: 117,
        status: "running",
        color: "#ef4444",
        bgColor: "#fef2f2",
        items: [
          { name: "Mattress Assembly", progress: 65, status: "running" },
          { name: "Spring Core", progress: 70, status: "warning" },
        ],
      },
      {
        id: "shipping",
        name: "Shipping",
        icon: Users,
        progress: 95,
        target: 120,
        actual: 114,
        status: "success",
        color: "#06b6d4",
        bgColor: "#f0fdfa",
        items: [
          { name: "Orders Shipped", progress: 95, status: "success" },
          { name: "Logistics", progress: 90, status: "success" },
        ],
      },
    ],
    recentErrors: [
      { id: 1, dept: "Foam", item: "Foam Block A", qty: 200, time: "10:23:45" },
      {
        id: 2,
        dept: "Assembly",
        item: "Mattress X",
        qty: 50,
        time: "09:45:22",
      },
    ],
  });

  // ✅ Auto-refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setProductionData((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          lastUpdate: new Date().toLocaleTimeString("id-ID"),
        },
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Fungsi untuk warna progress bar
  const getProgressColor = (status) => {
    switch (status) {
      case "success":
        return "#10b981";
      case "running":
        return "#f59e0b";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-icon">
            <BarChart3 size={32} />
          </div>
          <div className="header-text">
            <h1>📈 Production Monitoring Dashboard</h1>
            <p>Real-time progress tracking across all production departments</p>
          </div>
        </div>
        <div className="header-meta">
          <div className="last-update">
            <Clock size={16} />
            <span>Last Update: {productionData.summary.lastUpdate}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#eff6ff" }}>
            <Package size={24} style={{ color: "#3b82f6" }} />
          </div>
          <div className="stat-content">
            <h3>{productionData.summary.totalInput.toLocaleString()}</h3>
            <p>Total Input</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <CheckCircle size={24} style={{ color: "#10b981" }} />
          </div>
          <div className="stat-content">
            <h3>{productionData.summary.success.toLocaleString()}</h3>
            <p>Success</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef2f2" }}>
            <AlertCircle size={24} style={{ color: "#ef4444" }} />
          </div>
          <div className="stat-content">
            <h3>{productionData.summary.error.toLocaleString()}</h3>
            <p>Error</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fffbeb" }}>
            <Clock size={24} style={{ color: "#f59e0b" }} />
          </div>
          <div className="stat-content">
            <h3>{productionData.summary.waiting.toLocaleString()}</h3>
            <p>Waiting</p>
          </div>
        </div>
      </div>

      {/* Department Progress Grid */}
      <div className="departments-grid">
        {productionData.departments.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <div key={dept.id} className="department-card">
              <div className="dept-header">
                <div
                  className="dept-icon"
                  style={{ backgroundColor: dept.bgColor }}
                >
                  <IconComponent size={24} style={{ color: dept.color }} />
                </div>
                <div className="dept-info">
                  <h3>{dept.name}</h3>
                  <div className="dept-progress">
                    <span className="progress-value">{dept.progress}%</span>
                    <span className="progress-target">of {dept.target}</span>
                  </div>
                </div>
                <div className={`dept-status ${dept.status}`}>
                  {dept.status === "success"
                    ? "✅"
                    : dept.status === "running"
                      ? "🔄"
                      : "⚠️"}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${dept.progress}%`,
                    backgroundColor: getProgressColor(dept.status),
                  }}
                ></div>
              </div>

              {/* Sub-items */}
              <div className="dept-items">
                {dept.items.map((item, idx) => (
                  <div key={idx} className="item-progress">
                    <span className="item-name">{item.name}</span>
                    <div className="item-bar-container">
                      <div
                        className="item-bar"
                        style={{
                          width: `${item.progress}%`,
                          backgroundColor: getProgressColor(item.status),
                        }}
                      ></div>
                    </div>
                    <span className="item-progress-value">
                      {item.progress}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="dept-stats">
                <div className="stat">
                  <span className="stat-label">Target:</span>
                  <span className="stat-value">{dept.target}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Actual:</span>
                  <span className="stat-value">{dept.actual}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Remaining:</span>
                  <span className="stat-value">
                    {dept.target - dept.actual}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Recent Errors & Summary */}
      <div className="bottom-section">
        {/* Recent Errors */}
        <div className="error-card">
          <div className="card-header">
            <h3>
              <AlertCircle size={20} style={{ color: "#ef4444" }} />
              Recent Errors
            </h3>
          </div>
          <div className="error-list">
            {productionData.recentErrors.map((error) => (
              <div key={error.id} className="error-item">
                <div className="error-dept">{error.dept}</div>
                <div className="error-details">
                  <span className="error-item-name">{error.item}</span>
                  <span className="error-qty">Qty: {error.qty}</span>
                  <span className="error-time">{error.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Production Summary */}
        <div className="summary-card">
          <div className="card-header">
            <h3>
              <BarChart3 size={20} style={{ color: "#3b82f6" }} />
              Production Summary
            </h3>
          </div>
          <div className="summary-content">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Success Rate:</span>
                <span className="stat-value success">
                  {Math.round(
                    (productionData.summary.success /
                      productionData.summary.totalInput) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Error Rate:</span>
                <span className="stat-value error">
                  {Math.round(
                    (productionData.summary.error /
                      productionData.summary.totalInput) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Avg. Time:</span>
                <span className="stat-value">2.3h</span>
              </div>
            </div>
            <div className="summary-chart">
              <div className="chart-bar success" style={{ width: "85%" }}>
                Success
              </div>
              <div className="chart-bar error" style={{ width: "7%" }}>
                Error
              </div>
              <div className="chart-bar waiting" style={{ width: "8%" }}>
                Waiting
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
