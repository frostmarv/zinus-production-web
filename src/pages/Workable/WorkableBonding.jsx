// src/pages/Workable/WorkableBonding.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { getWorkableBonding } from "../../api/workable-bonding";
import "../../styles/Workable/WorkableBonding.css";

const WorkableBonding = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [autoRefreshActive, setAutoRefreshActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getWorkableBonding();
        setData(Array.isArray(result) ? result : []);
        setError(null);
        setAutoRefreshActive(false);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mengambil data.");
        setData([]);
        setAutoRefreshActive(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    let intervalId = null;
    if (autoRefreshActive) {
      intervalId = setInterval(fetchData, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshActive]);

  // Fungsi untuk menampilkan nilai sesuai backend: angka, '-', dll.
  const renderValue = (value) => {
    if (value == null) return "-";

    if (typeof value === "string") {
      // Tampilkan apa adanya jika string (misalnya: "-", "x")
      return value;
    }

    // Jika number, format dengan toLocaleString
    if (typeof value === "number") {
      return value.toLocaleString();
    }

    // Fallback
    return value;
  };

  const calculateWorkableTotal = () => {
    return data.reduce((sum, row) => {
      // Hanya jumlahkan jika workable adalah number
      const workable = typeof row.workable === "number" ? row.workable : 0;
      return sum + workable;
    }, 0);
  };

  // 🔴 Perbarui class berdasarkan status baru
  const getStatusClass = (status) => {
    const lower = (status || "").toLowerCase();
    if (lower === "completed") return "status-completed";
    if (lower === "running") return "status-running";
    if (lower === "halted") return "status-halted";
    if (lower === "not started") return "status-not-started";
    return "status-unknown";
  };

  const handleBack = () => {
    navigate("/workable");
  };

  const countByStatus = (targetStatus) => {
    return data.filter(
      (d) => (d.status || "N/A").toLowerCase() === targetStatus.toLowerCase(),
    ).length;
  };

  return (
    <div className="workable-container">
      {/* Top Header with Real-time Clock */}
      <div className="top-header">
        <div className="header-content">
          <h1 className="header-title">Workable Bonding</h1>
        </div>
        <div className="header-time">
          <span className="date">
            {currentTime.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="time">
            {currentTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: "Asia/Jakarta",
            })}{" "}
            WIB
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <BarChart3 size={20} className="stat-icon" />
          <div className="stat-content">
            <h3>{calculateWorkableTotal().toLocaleString()}</h3>
            <p>WORKABLE TOTAL</p>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle size={20} className="stat-icon" />
          <div className="stat-content">
            <h3>{countByStatus("Completed")}</h3>
            <p>COMPLETED</p>
          </div>
        </div>

        <div className="stat-card">
          <Clock size={20} className="stat-icon" />
          <div className="stat-content">
            <h3>{countByStatus("Running")}</h3>
            <p>RUNNING</p>
          </div>
        </div>

        <div className="stat-card">
          <AlertCircle size={20} className="stat-icon" />
          <div className="stat-content">
            <h3>{countByStatus("Halted")}</h3>
            <p>HALTED</p>
          </div>
        </div>
      </div>

      {/* Action Buttons — DETAIL WORKABLE CENTERED */}
      <div className="action-buttons">
        <button onClick={handleBack} className="btn-back">
          <ArrowLeft size={16} /> KEMBALI
        </button>
        <div className="center-button-wrapper">
          <Link to="/workable/bonding/detail" className="btn-detail-workable">
            <Eye size={16} /> DETAIL WORKABLE
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="workable-table">
          <thead>
            <tr>
              <th>WEEK</th>
              <th>SHIP TO NAME</th>
              <th>SKU</th>
              <th>QTY ORDER</th>
              <th>WORKABLE</th>
              <th>BONDING</th>
              <th>REMAIN PRODUKSI</th>
              <th>REMARKS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="no-data">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="no-data">
                  Gagal memuat: {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={`${row.sku}-${row.week}-${row.shipToName}-${index}`}>
                  <td>{row.week ?? "-"}</td>
                  <td>{row.shipToName ?? "-"}</td>
                  <td>{row.sku ?? "-"}</td>
                  <td>{renderValue(row.quantityOrder)}</td>
                  <td>{renderValue(row.workable)}</td>
                  <td>{renderValue(row.bonding)}</td>
                  <td
                    className={`remain-cell ${
                      typeof row["Remain Produksi"] === "number" && row["Remain Produksi"] < 0
                        ? "negative"
                        : ""
                    }`}
                  >
                    {renderValue(row["Remain Produksi"])}
                  </td>
                  <td>{row.remarks ?? "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(row.status)}`}
                    >
                      {row.status ?? "N/A"}
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