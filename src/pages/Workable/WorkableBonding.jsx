import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getWorkableBonding();
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
        setError(null);
        setAutoRefreshActive(false);
      } catch (err) {
        setError(err.message);
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

  const getStatusClass = (status) => {
    const lower = (status || "").toLowerCase();
    if (lower === "workable") return "status-workable";
    if (lower === "running") return "status-running";
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
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <Package size={32} />
          </div>
          <div className="header-text">
            <h1 className="header-title">Workable Bonding</h1>
            <p className="header-subtitle">
              Daftar data workable bonding yang siap untuk diproses
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={handleBack} className="btn-back">
            <ArrowLeft size={16} />
            Kembali
          </button>
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
            <h3>{countByStatus("Workable")}</h3>
            <p>Workable</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{countByStatus("Running")}</h3>
            <p>Running</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{countByStatus("Not Started") + countByStatus("N/A")}</h3>
            <p>Belum Dimulai</p>
          </div>
        </div>
      </div>

      {/* Tombol Lihat Detail Workable */}
      <div className="action-button-wrapper">
        <Link to="/workable/bonding/detail" className="btn-detail-header">
          <Eye size={16} />
          Lihat Detail Workable
        </Link>
      </div>

      {/* Tabel Data - Dengan Scroll Horizontal */}
      <div className="table-wrapper">
        <div className="table-scroll-container">
          <table className="workable-table">
            <thead>
              <tr>
                <th>WEEK</th>
                <th>SHIP TO NAME</th>
                <th>SKU</th>
                <th>QUANTITY ORDER</th>
                <th>WORKABLE</th>
                <th>BONDING</th>
                <th>REMAIN</th>
                <th>REMARKS</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    <div className="loading-spinner"></div>
                    <p>Memuat data...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    <AlertCircle size={24} />
                    <p>Gagal memuat: {error}</p>
                    <p>Sistem akan mencoba lagi secara otomatis...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    <Package size={48} />
                    <p>Tidak ada data workable bonding</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={`${row.sku}-${row.week}-${row.shipToName}`}>
                    <td>{row.week || "-"}</td>
                    <td>{row.shipToName || "-"}</td>
                    <td className="sku-cell">
                      <span>{row.sku || "-"}</span>
                    </td>
                    <td className="qty-cell">
                      {row.quantityOrder?.toLocaleString() || 0}
                    </td>
                    <td className="workable-cell">
                      {row.workable?.toLocaleString() || 0}
                    </td>
                    <td className="bonding-cell">
                      {row.bonding?.toLocaleString() || 0}
                    </td>
                    <td
                      className={`remain-cell ${
                        row.remain < 0 ? "negative" : ""
                      }`}
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
    </div>
  );
};

export default WorkableBonding;
