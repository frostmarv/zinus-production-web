// src/pages/History/Cutting/CuttingHistorySummary.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Package,
  BarChart3,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
  User,
  Eye, // ✅ Icon untuk tombol detail
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Untuk navigasi
import { cuttingProductionAPI } from "../../../api/cutting"; // ✅ Import API helper
import "../../../styles/History/Cutting/CuttingHistorySummary.css"; // ✅ Import CSS

const CuttingHistorySummary = () => {
  const navigate = useNavigate(); // ✅ Hook untuk navigasi
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    date: "",
    shift: "",
    group: "",
    machine: "",
    operator: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch data dari API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Memuat data cutting production summary...");
      const result = await cuttingProductionAPI.getAll(); // ✅ Panggil /api/cutting/production

      let rawData;
      if (Array.isArray(result)) {
        rawData = result;
      } else if (result && Array.isArray(result.data)) {
        rawData = result.data;
      } else if (result && Array.isArray(result.production)) {
        rawData = result.production;
      } else {
        console.warn(
          "Format data tidak dikenali, menggunakan array kosong:",
          result,
        );
        rawData = [];
      }

      // Filter di frontend
      const filtered = rawData.filter((item) => {
        return (
          (!filters.date || item.timestamp?.includes(filters.date)) &&
          (!filters.shift || item.shift === filters.shift) &&
          (!filters.group || item.group === filters.group) &&
          (!filters.machine || item.machine?.includes(filters.machine)) &&
          (!filters.operator || item.operator?.includes(filters.operator))
        );
      });

      setSummaryData(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Gagal ambil data cutting production:", err);
      setError(`Gagal memuat riwayat: ${err.message}`);
      setSummaryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ date: "", shift: "", group: "", machine: "", operator: "" });
    setCurrentPage(1);
  };

  // Format timestamp
  const formatTimestamp = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date only
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Hitung total quantity
  const getTotalQuantity = (entries) => {
    return (
      entries?.reduce(
        (sum, entry) => sum + (parseInt(entry.quantityProduksi) || 0),
        0,
      ) || 0
    );
  };

  // Hitung total remain
  const getTotalRemain = (entries) => {
    return (
      entries?.reduce(
        (sum, entry) => sum + (parseInt(entry.remainQuantity) || 0),
        0,
      ) || 0
    );
  };

  // Pagination logic
  const paginationData = {
    currentItems: summaryData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ),
    totalPages: Math.ceil(summaryData.length / itemsPerPage),
  };

  // ✅ Handle klik tombol detail
  const handleDetailClick = (id) => {
    navigate(`/history/cutting/summary/${id}`); // ✅ Arahkan ke halaman detail
  };

  return (
    <div className="cutting-history-summary-container">
      {/* Header */}
      <div className="cutting-history-summary-header">
        <h1>
          <BarChart3 size={32} />
          Cutting Production Summary
        </h1>
        <p>Ringkasan data produksi cutting dari API production</p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>
            <Filter size={20} />
            Filter Data
          </h3>
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label>
              <Calendar size={16} />
              Tanggal
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>
              <Clock size={16} />
              Shift
            </label>
            <select
              value={filters.shift}
              onChange={(e) => handleFilterChange("shift", e.target.value)}
              className="filter-input"
            >
              <option value="">Semua Shift</option>
              <option value="1">Shift 1</option>
              <option value="2">Shift 2</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Users size={16} />
              Group
            </label>
            <select
              value={filters.group}
              onChange={(e) => handleFilterChange("group", e.target.value)}
              className="filter-input"
            >
              <option value="">Semua Group</option>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Settings size={16} />
              Machine
            </label>
            <input
              type="text"
              value={filters.machine}
              onChange={(e) => handleFilterChange("machine", e.target.value)}
              placeholder="Cari machine..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>
              <User size={16} />
              Operator
            </label>
            <input
              type="text"
              value={filters.operator}
              onChange={(e) => handleFilterChange("operator", e.target.value)}
              placeholder="Cari operator..."
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={resetFilters} className="btn-reset">
            <RefreshCw size={16} />
            Reset Filter
          </button>
          <button onClick={fetchData} className="btn-refresh">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data dari server production...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <AlertTriangle size={20} />
          <p>{error}</p>
          <button onClick={fetchData} className="btn-retry">
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && (
        <>
          <div className="results-info">
            <p>
              Menampilkan{" "}
              <span className="highlight">
                {paginationData.currentItems.length}
              </span>{" "}
              dari <span className="highlight">{summaryData.length}</span> data
            </p>
          </div>

          <div className="summary-grid">
            {paginationData.currentItems.length === 0 ? (
              <div className="no-data-card">
                <Package size={48} />
                <p>Tidak ada data production</p>
              </div>
            ) : (
              paginationData.currentItems.map((item) => (
                <div key={item.id} className="summary-card">
                  <div className="card-header">
                    <h3>
                      <Package size={20} />
                      Production #{item.id?.substring(0, 8)}
                    </h3>
                    <span className="card-date">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <div className="info-item">
                        <strong>Shift:</strong>
                        <span className="shift-badge">{item.shift}</span>
                      </div>
                      <div className="info-item">
                        <strong>Group:</strong>
                        <span className="group-badge">{item.group}</span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-item">
                        <strong>Time:</strong>
                        <span>{item.time}</span>
                      </div>
                      <div className="info-item">
                        <strong>Week:</strong>
                        <span className="week-badge">{item.week}</span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-item">
                        <strong>Machine:</strong>
                        <span>{item.machine || "-"}</span>
                      </div>
                      <div className="info-item">
                        <strong>Operator:</strong>
                        <span>{item.operator || "-"}</span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-item">
                        <strong>Customer:</strong>
                        <span>{item.entries?.[0]?.customer || "-"}</span>
                      </div>
                      <div className="info-item">
                        <strong>PO:</strong>
                        <span>{item.entries?.[0]?.poNumber || "-"}</span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-item">
                        <strong>SKU:</strong>
                        <span>{item.entries?.[0]?.sku || "-"}</span>
                      </div>
                      <div className="info-item">
                        <strong>Qty Order:</strong>
                        <span>{item.entries?.[0]?.quantityOrder || 0}</span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-item">
                        <strong>Qty Produksi:</strong>
                        <span className="qty-produksi">
                          {getTotalQuantity(item.entries)}
                        </span>
                      </div>
                      <div className="info-item">
                        <strong>Remain:</strong>
                        <span className="qty-remain">
                          {getTotalRemain(item.entries)}
                        </span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-item full-width">
                        <strong>Entries:</strong>
                        <span>{item.entries?.length || 0} item</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <span className="timestamp">
                      <Clock size={14} />
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <span className="status">
                      {item.entries?.length > 0 ? (
                        <CheckCircle size={14} color="#10b981" />
                      ) : (
                        <AlertTriangle size={14} color="#f59e0b" />
                      )}
                    </span>

                    {/* ✅ Tombol Detail */}
                    <button
                      className="btn-detail"
                      onClick={() => handleDetailClick(item.id)} // ✅ Klik detail
                    >
                      <Eye size={14} />
                      Detail
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {paginationData.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <RefreshCw size={16} /> Previous
              </button>

              <div className="pagination-info">
                Halaman {currentPage} dari {paginationData.totalPages}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginationData.totalPages),
                  )
                }
                disabled={currentPage === paginationData.totalPages}
                className="pagination-btn"
              >
                Next <RefreshCw size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CuttingHistorySummary;
