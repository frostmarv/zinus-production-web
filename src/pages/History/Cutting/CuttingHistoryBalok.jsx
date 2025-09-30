// src/pages/History/Cutting/CuttingHistoryBalok.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cuttingAPI } from "../../../api/cutting";
import {
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Users,
  Settings,
  Package,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import "../../../styles/History/Cutting.css";

const CuttingHistoryBalok = () => {
  const navigate = useNavigate(); // ✅ Gunakan useNavigate
  const [cuttingData, setCuttingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    date: "",
    shift: "",
    machine: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data dari API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Memuat data cutting history...");
      const result = await cuttingAPI.getAll();

      let rawData;
      if (Array.isArray(result)) {
        rawData = result;
      } else if (result && Array.isArray(result.data)) {
        rawData = result.data;
      } else if (result && Array.isArray(result.cutting)) {
        rawData = result.cutting;
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
          (!filters.date || item.productionDate?.includes(filters.date)) &&
          (!filters.shift || item.shift === filters.shift) &&
          (!filters.machine || item.machine === filters.machine)
        );
      });

      setCuttingData(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Gagal ambil data cutting:", err);
      setError(err.message || "Gagal memuat data dari server");
      setCuttingData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle detail click
  const handleDetailClick = useCallback((item) => {
    setSelectedData(item);
  }, []);

  // ✅ Handle edit click - Arahkan ke halaman edit dengan React Router
  const handleEditClick = useCallback(
    (item) => {
      navigate(`/cutting/edit/${item.id}`); // ✅ Gunakan navigate
    },
    [navigate],
  );

  // Handle delete click - Tampilkan konfirmasi
  const handleDeleteClick = useCallback((item) => {
    setDeleteConfirm(item);
  }, []);

  // Confirm delete - Kirim ke backend
  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await cuttingAPI.delete(deleteConfirm.id);

      setCuttingData((prev) =>
        prev.filter((item) => item.id !== deleteConfirm.id),
      );
      setDeleteConfirm(null);
      alert("✅ Data berhasil dihapus dari server!");
    } catch (err) {
      console.error("❌ Gagal hapus data dari server:", err);
      alert(`❌ Gagal menghapus data: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteConfirm]);

  // Close modal
  const closeModal = useCallback(() => {
    setSelectedData(null);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (!isDeleting) {
      setDeleteConfirm(null);
    }
  }, [isDeleting]);

  // Handle filter change
  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({ date: "", shift: "", machine: "" });
  }, []);

  // Pagination logic
  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cuttingData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(cuttingData.length / itemsPerPage);

    return { currentItems, totalPages, indexOfFirstItem, indexOfLastItem };
  }, [cuttingData, currentPage, itemsPerPage]);

  // Format functions
  const formatTimestamp = useCallback((dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, []);

  const formatTimeSlot = useCallback((timeString) => {
    return timeString || "-";
  }, []);

  const getActualCount = useCallback((actuals) => {
    return actuals?.length || 0;
  }, []);

  const getActualQty = useCallback((actuals) => {
    return (
      actuals?.reduce(
        (sum, item) => sum + (parseInt(item.qtyBalok, 10) || 0),
        0,
      ) || 0
    );
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedData) closeModal();
        if (deleteConfirm && !isDeleting) closeDeleteConfirm();
      }
    };

    if (selectedData || (deleteConfirm && !isDeleting)) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedData, deleteConfirm, isDeleting, closeModal, closeDeleteConfirm]);

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-header">
        <div className="header-content">
          <h1>
            <Package size={32} />
            History Cutting
          </h1>
          <p>Riwayat data cutting yang telah diinput</p>
        </div>
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
              Tanggal Produksi
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
              <Settings size={16} />
              Machine
            </label>
            <select
              value={filters.machine}
              onChange={(e) => handleFilterChange("machine", e.target.value)}
              className="filter-input"
            >
              <option value="">Semua Machine</option>
              <option value="Multi Cutting 1">Multi Cutting 1</option>
              <option value="Multi Cutting 2">Multi Cutting 2</option>
              <option value="Rountable 1">Rountable 1</option>
              <option value="Rountable 2">Rountable 2</option>
              <option value="Rountable 3">Rountable 3</option>
              <option value="Rountable 4">Rountable 4</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={resetFilters} className="btn-reset">
            <RefreshCw size={16} />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data dari server...</p>
        </div>
      )}

      {/* Error State */}
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

      {/* Table & Pagination */}
      {!loading && !error && (
        <>
          <div className="results-info">
            <p>
              Menampilkan{" "}
              <span className="highlight">
                {paginationData.currentItems.length}
              </span>{" "}
              dari <span className="highlight">{cuttingData.length}</span> data
            </p>
          </div>

          <div className="table-container">
            <div className="table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Tanggal Produksi</th>
                    <th>Shift</th>
                    <th>Machine</th>
                    <th>Time Slot</th>
                    <th>Week</th>
                    <th>Actual</th>
                    <th>Total Qty</th>
                    <th>Foaming</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginationData.currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data">
                        <Package size={48} />
                        <p>Tidak ada data ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    paginationData.currentItems.map((item) => {
                      const actualArray = Array.isArray(item.actuals)
                        ? item.actuals
                        : [];
                      const actualCount = getActualCount(actualArray);
                      const totalQty = getActualQty(actualArray);

                      return (
                        <tr key={item.id}>
                          <td>{formatTimestamp(item.productionDate)}</td>
                          <td>
                            <span className="shift-badge">{item.shift}</span>
                          </td>
                          <td>{item.machine}</td>
                          <td>{formatTimeSlot(item.time)}</td>
                          <td>
                            <span className="week-badge">{item.week}</span>
                          </td>
                          <td>
                            <span className="balok-count">{actualCount}</span>
                          </td>
                          <td>
                            <span className="qty-total">{totalQty}</span>
                          </td>
                          <td>
                            {item.foamingDate?.isChecked ? (
                              <span className="foaming-yes">✅ Ya</span>
                            ) : (
                              <span className="foaming-no">❌ Tidak</span>
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-detail"
                                onClick={() => handleDetailClick(item)}
                                aria-label={`Lihat detail ${item.id}`}
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                className="btn-edit"
                                onClick={() => handleEditClick(item)}
                                aria-label={`Edit ${item.id}`}
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDeleteClick(item)}
                                aria-label={`Hapus ${item.id}`}
                                disabled={isDeleting}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {paginationData.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={16} /> Previous
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
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Cutting Data</h3>
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {/* Header Info */}
              <div className="detail-section">
                <h4>
                  <Settings size={20} />
                  Informasi Umum
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>ID:</label>
                    <span className="id-text">{selectedData.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tanggal Produksi:</label>
                    <span>{formatTimestamp(selectedData.productionDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Shift:</label>
                    <span className="shift-badge">{selectedData.shift}</span>
                  </div>
                  <div className="detail-item">
                    <label>Machine:</label>
                    <span>{selectedData.machine}</span>
                  </div>
                  <div className="detail-item">
                    <label>Time Slot:</label>
                    <span>{selectedData.time}</span>
                  </div>
                  <div className="detail-item">
                    <label>Week:</label>
                    <span className="week-badge">{selectedData.week}</span>
                  </div>
                  <div className="detail-item">
                    <label>No. Urut:</label>
                    <span>{selectedData.noUrut}</span>
                  </div>
                  <div className="detail-item">
                    <label>Dibuat Pada:</label>
                    <span>
                      {new Date(selectedData.createdAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Balok (Plan) */}
              <div className="detail-section">
                <h4>
                  <Package size={20} />
                  Data Balok (Plan)
                </h4>
                {Array.isArray(selectedData.balok) &&
                selectedData.balok.length > 0 ? (
                  selectedData.balok.map((balokItem, idx) => (
                    <div key={balokItem.id} className="balok-detail">
                      <h5>
                        Balok #{idx + 1} (ID: {balokItem.id.substring(0, 8)}...)
                      </h5>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Density:</label>
                          <span>{balokItem.density || "-"}</span>
                        </div>
                        <div className="detail-item">
                          <label>ILD:</label>
                          <span>{balokItem.ild || "-"}</span>
                        </div>
                        <div className="detail-item">
                          <label>Warna:</label>
                          <span className="colour-badge">
                            {balokItem.colour}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Panjang:</label>
                          <span>
                            {balokItem.length !== undefined &&
                            balokItem.length !== null
                              ? `${balokItem.length} mm`
                              : "-"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Lebar:</label>
                          <span>
                            {balokItem.width !== undefined &&
                            balokItem.width !== null
                              ? `${balokItem.width} mm`
                              : "-"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Tinggi:</label>
                          <span>
                            {balokItem.height !== undefined &&
                            balokItem.height !== null
                              ? `${balokItem.height} mm`
                              : "-"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Size Actual:</label>
                          <span>{balokItem.sizeActual || "-"}</span>
                        </div>
                        <div className="detail-item">
                          <label>Jumlah Plan:</label>
                          <span className="qty-badge">
                            {balokItem.qtyBalok || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data-text">Tidak ada data balok (plan)</p>
                )}
              </div>

              {/* Data Actual */}
              {Array.isArray(selectedData.actuals) &&
                selectedData.actuals.length > 0 && (
                  <div className="detail-section">
                    <h4>
                      <CheckCircle size={20} />
                      Data Actual
                    </h4>
                    {selectedData.actuals.map((actualItem, idx) => (
                      <div key={actualItem.id} className="balok-detail">
                        <h5>
                          Actual #{idx + 1} (ID: {actualItem.id.substring(0, 8)}
                          ...)
                        </h5>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <label>Density:</label>
                            <span>{actualItem.density || "-"}</span>
                          </div>
                          <div className="detail-item">
                            <label>ILD:</label>
                            <span>{actualItem.ild || "-"}</span>
                          </div>
                          <div className="detail-item">
                            <label>Warna:</label>
                            <span className="colour-badge">
                              {actualItem.colour}
                            </span>
                          </div>
                          <div className="detail-item">
                            <label>Panjang:</label>
                            <span>
                              {actualItem.length !== undefined &&
                              actualItem.length !== null
                                ? `${actualItem.length} mm`
                                : "-"}
                            </span>
                          </div>
                          <div className="detail-item">
                            <label>Lebar:</label>
                            <span>
                              {actualItem.width !== undefined &&
                              actualItem.width !== null
                                ? `${actualItem.width} mm`
                                : "-"}
                            </span>
                          </div>
                          <div className="detail-item">
                            <label>Tinggi:</label>
                            <span>
                              {actualItem.height !== undefined &&
                              actualItem.height !== null
                                ? `${actualItem.height} mm`
                                : "-"}
                            </span>
                          </div>
                          <div className="detail-item">
                            <label>Jumlah Actual:</label>
                            <span className="qty-badge">
                              {actualItem.qtyBalok || "-"}
                            </span>
                          </div>
                          <div className="detail-item">
                            <label>Qty Produksi:</label>
                            <span>{actualItem.qtyProduksi || "-"}</span>
                          </div>
                          <div className="detail-item">
                            <label>Re-Size:</label>
                            <span>{actualItem.reSize || "-"}</span>
                          </div>
                          <div className="detail-item">
                            <label>JDF Weight:</label>
                            <span>{actualItem.jdfWeight || "-"}</span>
                          </div>
                          <div className="detail-item">
                            <label>Remark:</label>
                            <span>{actualItem.remark || "-"}</span>
                          </div>
                          <div className="detail-item">
                            <label>Deskripsi:</label>
                            <span
                              className={`descript-badge ${actualItem.descript?.toLowerCase() || "flat"}`}
                            >
                              {actualItem.descript || "FLAT"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Foaming Date */}
              {selectedData.foamingDate?.isChecked && (
                <div className="detail-section">
                  <h4>
                    <Clock size={20} />
                    Foaming Date
                  </h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Tanggal Selesai:</label>
                      <span>
                        {formatTimestamp(
                          selectedData.foamingDate.tanggalSelesai,
                        )}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Jam:</label>
                      <span className="time-badge">
                        {selectedData.foamingDate.jam}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={closeDeleteConfirm}>
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Konfirmasi Hapus</h3>
              <button
                className="modal-close"
                onClick={closeDeleteConfirm}
                aria-label="Batal"
                disabled={isDeleting}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertTriangle size={48} color="#ef4444" />
                <p>Apakah Anda yakin ingin menghapus data ini?</p>
                <p className="delete-info">
                  <strong>ID:</strong> {deleteConfirm.id}
                  <br />
                  <strong>Tanggal Produksi:</strong>{" "}
                  {formatTimestamp(deleteConfirm.productionDate)}
                  <br />
                  <strong>Machine:</strong> {deleteConfirm.machine}
                </p>
                <p className="delete-note">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="delete-actions">
                <button
                  onClick={closeDeleteConfirm}
                  className="btn-cancel"
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn-confirm-delete"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner"></span> Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} /> Hapus Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuttingHistoryBalok;
