// src/pages/Workable/WorkableBonding.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ Untuk navigasi ke detail
import {
  Package,
  Calendar,
  Clock,
  Users,
  Settings,
  BarChart3,
  Eye,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { getWorkableBonding } from "../../api/workable-bonding";
import "../../styles/Workable/WorkableBonding.css";

const WorkableBonding = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWorkableBonding();

        // Sort berdasarkan Ship To Name (Customer) kemudian SKU
        const sortedData = [...result].sort((a, b) => {
          const nameCompare = String(a.shipToName ?? "").localeCompare(
            String(b.shipToName ?? ""),
            undefined,
            { sensitivity: "base" },
          );

          if (nameCompare !== 0) return nameCompare;

          return String(a.sku ?? "").localeCompare(
            String(b.sku ?? ""),
            undefined,
            { sensitivity: "base" },
          );
        });

        setData(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusClass = (status) => {
    const lower = (status || "").toLowerCase();
    if (lower === "workable") return "status-workable";
    if (lower === "running") return "status-running";
    return "";
  };

  if (loading)
    return (
      <div className="workable-container">
        <div className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <Package className="w-8 h-8" />
            </div>
            <div className="header-text">
              <h1 className="header-title">Workable Bonding</h1>
              <p className="header-subtitle">Memuat data workable bonding...</p>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="workable-container">
        <div className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <Package className="w-8 h-8" />
            </div>
            <div className="header-text">
              <h1 className="header-title">Workable Bonding</h1>
              <p className="header-subtitle">Error memuat data</p>
            </div>
          </div>
        </div>
        <div className="error-container">
          <AlertCircle size={20} />
          <p>Error: {error}</p>
          <button
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    );

  return (
    <div className="workable-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <Package className="w-8 h-8" />
          </div>
          <div className="header-text">
            <h1 className="header-title">Workable Bonding</h1>
            <p className="header-subtitle">
              Daftar data workable bonding yang siap untuk diproses
            </p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/workable/bonding/detail" className="btn-detail-header">
            <Eye size={16} />
            Lihat Detail Workable
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>{data.length}</h3>
            <p>Total Item</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>
              {
                data.filter((d) => d.status?.toLowerCase() === "workable")
                  .length
              }
            </h3>
            <p>Workable</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>
              {data.filter((d) => d.status?.toLowerCase() === "running").length}
            </h3>
            <p>Running</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>
              {
                data.filter(
                  (d) => !d.status || d.status?.toLowerCase() === "n/a",
                ).length
              }
            </h3>
            <p>Belum Ada Status</p>
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="table-wrapper">
        <table className="workable-table">
          <thead>
            <tr>
              <th>WEEK</th>
              <th>SHIP TO NAME</th>
              <th>SKU</th>
              <th>QUANTITY ORDER</th>
              <th>PROGRESS</th>
              <th>REMAIN</th>
              <th>REMARKS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <Package size={48} />
                  <p>Tidak ada data workable bonding</p>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>{row.week || "-"}</td>
                  <td>{row.shipToName || "-"}</td>
                  <td className="sku-cell">
                    <span>{row.sku || "-"}</span>
                  </td>
                  <td className="qty-cell">
                    {row.quantityOrder?.toLocaleString() || 0}
                  </td>
                  <td className="progress-cell">
                    {row.progress?.toLocaleString() || 0}
                  </td>
                  <td
                    className={`remain-cell ${row.remain < 0 ? "negative" : ""}`}
                  >
                    {row.remain?.toLocaleString() || 0}
                  </td>
                  <td className="remarks-cell">{row.remarks || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(row.status)}`}
                    >
                      {row.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkableBonding;
