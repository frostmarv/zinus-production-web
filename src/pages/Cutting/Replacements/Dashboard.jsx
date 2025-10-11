// src/pages/Cutting/Replacements/Dashboard.jsx
import { useState, useEffect } from "react";
import "./../../../styles/Cutting/Replacements/Dashboard.css";
import { replacementAPI } from "../../../api/replacement";
import ProcessReplacementModal from "./components/ProcessReplacementModal";

const StatusBadge = ({ status }) => {
  const statusClass = `status-badge status-${status.toLowerCase()}`;
  return <span className={statusClass}>{status.replace("_", " ")}</span>;
};

export default function CuttingReplacementDashboard() {
  const [replacements, setReplacements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "PENDING",
    sourceBatchNumber: "",
  });
  const [selectedReplacement, setSelectedReplacement] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        targetDept: "CUTTING",
        status: filters.status || undefined,
        sourceBatchNumber: filters.sourceBatchNumber || undefined,
      };

      const [listRes, statsRes] = await Promise.all([
        replacementAPI.getAll(params),
        replacementAPI.getStatistics({ targetDept: "CUTTING" }),
      ]);

      const replacementList = Array.isArray(listRes?.data?.data)
        ? listRes.data.data
        : [];

      // ✅ Transformasi respons statistik dari backend ke format UI
      const backendStats = statsRes?.data?.data;
      let statistics = {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        totalRequested: 0,
        totalProcessed: 0,
        completionRate: 0,
      };

      if (backendStats) {
        const { byStatus = {}, quantities = {} } = backendStats;
        const totalRequested = quantities.totalRequested || 0;
        const totalProcessed = quantities.totalProcessed || 0;

        statistics = {
          total: backendStats.total || 0,
          pending: byStatus.pending || 0,
          inProgress: byStatus.inProgress || 0,
          completed: byStatus.completed || 0,
          cancelled: byStatus.cancelled || 0,
          totalRequested,
          totalProcessed,
          completionRate:
            totalRequested > 0
              ? Math.round((totalProcessed / totalRequested) * 100)
              : 0,
        };
      }

      setReplacements(replacementList);
      setStats(statistics);
    } catch (err) {
      console.error("Gagal memuat data:", err);
      alert("Gagal memuat data replacement");
      setReplacements([]);
      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        totalRequested: 0,
        totalProcessed: 0,
        completionRate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenProcess = (replacement) => {
    setSelectedReplacement(replacement);
  };

  const handleCloseModal = () => {
    setSelectedReplacement(null);
  };

  const handleProcessSuccess = () => {
    setSelectedReplacement(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="cutting-replacement-dashboard">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  const safeReplacements = Array.isArray(replacements) ? replacements : [];

  return (
    <div className="cutting-replacement-dashboard">
      <h1>Cutting Replacement Dashboard</h1>

      {/* Statistik */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="title">Total</div>
            <div className="value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="title">Pending</div>
            <div className="value">{stats.pending}</div>
          </div>
          <div className="stat-card">
            <div className="title">In Progress</div>
            <div className="value">{stats.inProgress}</div>
          </div>
          <div className="stat-card">
            <div className="title">Completed</div>
            <div className="value">{stats.completed}</div>
          </div>
          <div className="stat-card">
            <div className="title">Completion Rate</div>
            <div className="value">{stats.completionRate}%</div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="filter-section">
        <div className="filter-grid">
          <div>
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange("status", e.target.value || "")
              }
            >
              <option value="">Semua</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="filter-label">Batch Number</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Cari batch..."
              value={filters.sourceBatchNumber}
              onChange={(e) =>
                handleFilterChange("sourceBatchNumber", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Tabel Replacement */}
      <div className="table-container">
        <table className="replacement-table">
          <thead>
            <tr>
              <th>Batch Number</th>
              <th>Customer / SKU</th>
              <th>Diminta</th>
              <th>Diproses</th>
              <th>Sisa</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {safeReplacements.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data-cell">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              safeReplacements.map((item) => (
                <tr key={item.id}>
                  <td>{item.sourceBatchNumber}</td>
                  <td>
                    <div className="customer-name">
                      {item.bondingReject?.customer || "-"}
                    </div>
                    <div className="sku-text">
                      {item.bondingReject?.sku || "-"}
                    </div>
                  </td>
                  <td>{item.requestedQty}</td>
                  <td>{item.processedQty || 0}</td>
                  <td>{item.requestedQty - (item.processedQty || 0)}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    {(item.status === "PENDING" ||
                      item.status === "IN_PROGRESS") && (
                      <button
                        className="btn-process"
                        onClick={() => handleOpenProcess(item)}
                      >
                        Proses
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Proses */}
      {selectedReplacement && (
        <ProcessReplacementModal
          replacement={selectedReplacement}
          onClose={handleCloseModal}
          onSuccess={handleProcessSuccess}
        />
      )}
    </div>
  );
}
