// src/pages/History/Bonding/HistorySummaryBonding.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBondingSummaries } from "../../../api/bonding";
import "../../../styles/History/Bonding/HistorySummaryBonding.css";

const HistorySummaryBonding = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    shift: "",
    machine: "",
    customer: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBondingSummaries();
        setSummaries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Gagal memuat data bonding summary.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  const filteredSummaries = useMemo(() => {
    return summaries.filter((item) => {
      const itemDate = new Date(item.timestamp);

      // Date filter
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (itemDate < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999); // Include entire end day
        if (itemDate > end) return false;
      }

      // Text filters
      if (filters.shift && item.shift !== filters.shift) return false;
      if (
        filters.machine &&
        !item.machine.toLowerCase().includes(filters.machine.toLowerCase())
      )
        return false;
      if (
        filters.customer &&
        !item.customer.toLowerCase().includes(filters.customer.toLowerCase())
      )
        return false;

      return true;
    });
  }, [summaries, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get unique shifts for dropdown
  const shiftOptions = [...new Set(summaries.map((s) => s.shift))]
    .filter(Boolean)
    .sort();

  return (
    <div className="history-summary-bonding">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Riwayat Bonding Summary</h1>
        <button
          className="btn-back"
          onClick={() => navigate("/history/bonding")}
        >
          ← Kembali ke Bonding
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Tanggal Mulai</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Tanggal Akhir</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Shift</label>
            <select
              name="shift"
              value={filters.shift}
              onChange={handleFilterChange}
            >
              <option value="">Semua Shift</option>
              {shiftOptions.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Machine</label>
            <input
              type="text"
              name="machine"
              placeholder="Cari machine..."
              value={filters.machine}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Customer</label>
            <input
              type="text"
              name="customer"
              placeholder="Cari customer..."
              value={filters.customer}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && <p className="loading">Memuat data...</p>}
      {error && <p className="error">{error}</p>}

      {/* Data Table */}
      {!loading && !error && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal & Waktu</th>
                <th>Shift</th>
                <th>Group</th>
                <th>Time Slot</th>
                <th>Machine</th>
                <th>Kashift</th>
                <th>Admin</th>
                <th>Customer</th>
                <th>PO</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSummaries.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-data">
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredSummaries.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDateTime(item.timestamp)}</td>
                    <td>{item.shift}</td>
                    <td>{item.group}</td>
                    <td>{item.timeSlot}</td>
                    <td>{item.machine}</td>
                    <td>{item.kashift}</td>
                    <td>{item.admin}</td>
                    <td>{item.customer}</td>
                    <td>{item.poNumber}</td>
                    <td>{item.sku}</td>
                    <td>{item.quantityProduksi}</td>
                    <td>
                      <button
                        className="btn-action view"
                        onClick={() => openModal(item)}
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal View */}
      {isModalOpen && currentItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Bonding Summary</h2>
              <button className="btn-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>ID:</strong> {currentItem.id}
                </div>
                <div className="detail-item">
                  <strong>Tanggal & Waktu:</strong>{" "}
                  {formatDateTime(currentItem.timestamp)}
                </div>
                <div className="detail-item">
                  <strong>Shift:</strong> {currentItem.shift}
                </div>
                <div className="detail-item">
                  <strong>Group:</strong> {currentItem.group}
                </div>
                <div className="detail-item">
                  <strong>Time Slot:</strong> {currentItem.timeSlot}
                </div>
                <div className="detail-item">
                  <strong>Machine:</strong> {currentItem.machine}
                </div>
                <div className="detail-item">
                  <strong>Kashift:</strong> {currentItem.kashift}
                </div>
                <div className="detail-item">
                  <strong>Admin:</strong> {currentItem.admin}
                </div>
                <div className="detail-item">
                  <strong>Customer:</strong> {currentItem.customer}
                </div>
                <div className="detail-item">
                  <strong>PO Number:</strong> {currentItem.poNumber}
                </div>
                <div className="detail-item">
                  <strong>Customer PO:</strong> {currentItem.customerPo}
                </div>
                <div className="detail-item">
                  <strong>SKU:</strong> {currentItem.sku}
                </div>
                <div className="detail-item">
                  <strong>Week:</strong> {currentItem.week}
                </div>
                <div className="detail-item">
                  <strong>Quantity Produksi:</strong>{" "}
                  {currentItem.quantityProduksi}
                </div>
                <div className="detail-item">
                  <strong>Dibuat:</strong>{" "}
                  {formatDateTime(currentItem.createdAt)}
                </div>
                <div className="detail-item">
                  <strong>Diperbarui:</strong>{" "}
                  {formatDateTime(currentItem.updatedAt)}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorySummaryBonding;
