// src/Workable.jsx
import React, { useState } from "react";
import "../styles/Workable.css";

const Workable = () => {
  const [activeTab, setActiveTab] = useState("bonding");

  // Data contoh - Workable Bonding
  const bondingData = [
    {
      we: "37",
      buyer: "AMAZON DI",
      po: "MTSADMT2509G3L/G3O/3L",
      sku: "ZU-MFMA10ZI-12F",
      qty: 720,
      layer1: 637,
      layer2: 83,
      layer3: 1508,
      hole: 0,
      convolute: 0,
      total: 19148,
      balance: 8399,
      workable: 83,
      foamDate: "2024-01-15",
    },
    {
      we: "37",
      buyer: "AMAZON DI",
      po: "MTSADMT2509G3L/G3N/G3O/G3S/G3T/3L",
      sku: "ZU-MFMA10ZI-08T",
      qty: 14920,
      layer1: 13374,
      layer2: 1546,
      layer3: 1508,
      hole: 0,
      convolute: 0,
      total: 19148,
      balance: 8399,
      workable: 1508,
      foamDate: "2024-01-15",
    },
  ];

  // Data contoh - Workable Packing Foam
  const packingFoamData = [
    {
      we: "37",
      buyer: "AMAZON DI",
      po: "ZU-MFMA10ZI-12F",
      sku: "ZU-MFMA10ZI-12F",
      qty: 720,
      cutting: 637,
      outcoverInhouse: 83,
      outcoverC: 1508,
      inner: 0,
      cBox: 0,
      label: 0,
      gcc: 0,
      totalProduksi: 19148,
      balanceProduksi: 8399,
      workable: 83,
      remark:
        "Outcover Sewing ( NG Mati 11pcs ) & Foam Slice ( NG BE 7.5 = 4 & BM 1 = 58 )",
    },
    {
      we: "37",
      buyer: "AMAZON DI",
      po: "ZU-MFMA10ZI-08T",
      sku: "ZU-MFMA10ZI-08T",
      qty: 14920,
      cutting: 13374,
      outcoverInhouse: 1546,
      outcoverC: 1508,
      inner: 0,
      cBox: 0,
      label: 0,
      gcc: 0,
      totalProduksi: 19148,
      balanceProduksi: 8399,
      workable: 1508,
      remark: "Outcover Sewing ( NG Mati 2pcs ) Foam Slice ( NG BM 2 – 9 )",
    },
  ];

  // Data contoh - Workable Packing Spring
  const packingSpringData = [
    {
      we: "37",
      buyer: "AMAZON DI",
      po: "ZU-MSHO2KZI-12Q",
      sku: "ZU-MSHO2KZI-12Q",
      qty: 395,
      totalProduksi: 393,
      balanceProduksi: 2,
      workable: 0,
      remark: "",
    },
    {
      we: "40",
      buyer: "WMT.COM",
      po: "PPSM-12F",
      sku: "PPSM-12F",
      qty: 51,
      totalProduksi: 51,
      balanceProduksi: 51,
      workable: 0,
      remark: "",
    },
  ];

  // Calculate metrics
  const calculateMetrics = () => {
    let data = [];
    if (activeTab === "bonding") data = bondingData;
    else if (activeTab === "packing-foam") data = packingFoamData;
    else data = packingSpringData;

    const totalBatches = data.length;
    const workableToday = data.reduce(
      (sum, item) => sum + (item.workable || 0),
      0,
    );
    const totalQty = data.reduce((sum, item) => sum + (item.qty || 0), 0);
    const completedQty = data.reduce(
      (sum, item) => sum + (item.total || item.totalProduksi || 0),
      0,
    );
    const completionRate =
      totalQty > 0 ? Math.round((completedQty / totalQty) * 100) : 0;
    const activeStations = data.filter(
      (item) => (item.workable || 0) > 0,
    ).length;

    return {
      totalBatches,
      workableToday,
      completionRate,
      activeStations,
      totalStations: 8,
    };
  };

  const metrics = calculateMetrics();

  const getStatusBadge = (item) => {
    const workable = item.workable || 0;
    if (workable > 1000) return { text: "Workable", class: "status-workable" };
    if (workable > 0) return { text: "In Progress", class: "status-progress" };
    return { text: "Completed", class: "status-completed" };
  };

  const calculateProgress = (item) => {
    const qty = item.qty || 0;
    const completed = item.total || item.totalProduksi || 0;
    return qty > 0 ? Math.round((completed / qty) * 100) : 0;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
  };

  const renderDashboard = () => {
    let data = [];
    let title = "";

    if (activeTab === "bonding") {
      data = bondingData;
      title = "Workable Bonding Today";
    } else if (activeTab === "packing-foam") {
      data = packingFoamData;
      title = "Workable Packing Foam Today";
    } else {
      data = packingSpringData;
      title = "Workable Packing Spring Today";
    }

    return (
      <div className="dashboard-content">
        {/* Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon blue">📊</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.totalBatches}</div>
              <div className="metric-label">Total Batches</div>
              <div className="metric-change positive">+12% from yesterday</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon green">▶️</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.workableToday}</div>
              <div className="metric-label">Workable Today</div>
              <div className="metric-change positive">
                Ready for {activeTab}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon blue">📈</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.completionRate}%</div>
              <div className="metric-label">Completion Rate</div>
              <div className="metric-change positive">+5% from target</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon orange">🏭</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.activeStations}</div>
              <div className="metric-label">Active Stations</div>
              <div className="metric-change neutral">
                Out of {metrics.totalStations} total
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Production Table */}
          <div className="dashboard-card main-table">
            <div className="card-header">
              <h3>{title}</h3>
              <div className="live-indicator">
                <span className="live-dot"></span>
                Live Data
              </div>
            </div>

            <div className="table-container">
              <table className="production-table">
                <thead>
                  <tr>
                    <th>SKU CODE</th>
                    <th>TARGET</th>
                    <th>COMPLETED</th>
                    <th>PROGRESS</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const progress = calculateProgress(item);
                    const status = getStatusBadge(item);
                    return (
                      <tr key={index}>
                        <td>
                          <div className="sku-info">
                            <div className="sku-icon">📦</div>
                            <span className="sku-code">{item.sku}</span>
                          </div>
                        </td>
                        <td className="number-cell">
                          {item.qty?.toLocaleString()}
                        </td>
                        <td className="number-cell">
                          {(
                            item.total ||
                            item.totalProduksi ||
                            0
                          ).toLocaleString()}
                        </td>
                        <td>
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">{progress}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${status.class}`}>
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panel */}
          <div className="dashboard-card side-panel">
            <div className="card-header">
              <h3>Complete Batch</h3>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label>Batch ID</label>
                <input
                  type="text"
                  placeholder="Enter batch ID"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Process Step</label>
                <select className="form-select">
                  <option>Select step</option>
                  <option>Bonding</option>
                  <option>Cutting</option>
                  <option>Assembly</option>
                  <option>Packing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Done</label>
                <input
                  type="number"
                  placeholder="Completed quantity"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Operator ID</label>
                <input
                  type="text"
                  value="1234"
                  className="form-input"
                  readOnly
                />
              </div>

              <button className="complete-btn">✓ Complete Batch</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Production Dashboard</h1>
            <p className="header-date">Today, {getCurrentDate()}</p>
          </div>
          <div className="header-actions">
            <button className="refresh-btn">🔄 Refresh Data</button>
            <div className="system-status">
              <span className="status-dot online"></span>
              System Online
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === "bonding" ? "active" : ""}`}
          onClick={() => setActiveTab("bonding")}
        >
          Bonding
        </button>
        <button
          className={`nav-tab ${activeTab === "packing-foam" ? "active" : ""}`}
          onClick={() => setActiveTab("packing-foam")}
        >
          Packing Foam
        </button>
        <button
          className={`nav-tab ${activeTab === "packing-spring" ? "active" : ""}`}
          onClick={() => setActiveTab("packing-spring")}
        >
          Packing Spring
        </button>
      </div>

      {/* Dashboard Content */}
      {renderDashboard()}
    </div>
  );
};

export default Workable;
