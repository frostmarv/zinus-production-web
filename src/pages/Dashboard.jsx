// src/pages/Dashboard.jsx
import React from "react";
import { TrendingUp, AlertCircle, CheckCircle, Eye } from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const statsCards = [
    { title: "Total Input", value: "100", color: "default" },
    { title: "Success", value: "80", color: "success" },
    { title: "Error", value: "20", color: "error" },
    { title: "Waiting", value: "10", color: "warning" },
  ];

  const chartData = [
    { dept: "Cutting", value: 75 },
    { dept: "Foam", value: 95 },
    { dept: "Packing", value: 80 },
    { dept: "QC", value: 60 },
  ];

  const tableData = [
    {
      date: "2024-01",
      dept: "Cutting",
      item: "Foam",
      qty: 50,
      status: "success",
    },
    { date: "2024-01", dept: "Foam", item: "Foam", qty: 50, status: "error" },
    {
      date: "2024-01",
      dept: "Packing",
      item: "Product A",
      qty: 200,
      status: "success",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>🏠 Dashboard</h1>
        <p>Selamat datang di Zinus Production System</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <div key={index} className={`stats-card ${card.color}`}>
            <div className="card-header">
              <h3>{card.title}</h3>
            </div>
            <div className="card-value">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <div className="card-header">
            <h3>📊 Input per Dept</h3>
          </div>
          <div className="bar-chart">
            {chartData.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar" style={{ height: `${item.value}%` }}></div>
                <span className="bar-label">{item.dept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="card-header">
            <h3>📈 Success vs Error</h3>
          </div>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <div className="pie-slice success" data-value="80"></div>
              <div className="pie-slice error" data-value="20"></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <div className="legend-color success"></div>
                <span>Success</span>
                <strong>80%</strong>
              </div>
              <div className="legend-item">
                <div className="legend-color error"></div>
                <span>Error</span>
                <strong>20%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table and Notifications */}
      <div className="bottom-grid">
        {/* Latest Data Table */}
        <div className="table-card">
          <div className="card-header">
            <h3>📋 Latest Data</h3>
            <button className="view-all-btn">
              <Eye size={16} />
              View all
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Dept</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.dept}</td>
                    <td>{row.item}</td>
                    <td>{row.qty}</td>
                    <td>
                      <span className={`status-badge ${row.status}`}>
                        {row.status === "success" ? (
                          <>
                            <CheckCircle size={14} />
                            Success
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} />
                            Error
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Notification */}
        <div className="notification-card">
          <div className="card-header error">
            <AlertCircle size={20} />
            <h3>⚠️ Error Notification</h3>
          </div>
          <div className="notification-content">
            <h4>Foam Product A error</h4>
            <p>production qty 200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
