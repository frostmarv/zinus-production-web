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
  Eye,
  X,
  Edit3,
  Trash2,
  Save,
  Plus,
  Check,
} from "lucide-react";
import {
  cuttingProductionAPI,
  cuttingProductionEntryAPI,
} from "../../../api/cutting";
import "../../../styles/History/Cutting/CuttingHistorySummary.css";

const CuttingHistorySummary = () => {
  // === Helper Functions for foamingDate ===
  const parseCustomDateTime = (str) => {
    if (!str) return null;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2})$/;
    const match = str.match(regex);
    if (!match) return null;
    const [, day, month, year, hour, minute] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  };

  const formatCustomDateTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  // === State ===
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    shift: "",
    group: "",
    machine: "",
    operator: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftHeader, setDraftHeader] = useState({});
  const [draftEntries, setDraftEntries] = useState([]);
  const [opLoading, setOpLoading] = useState({ save: false, delete: false });
  const [opError, setOpError] = useState(null);

  // State untuk update hole/foaming
  const [updatingHole, setUpdatingHole] = useState(null);
  const [updatingFoaming, setUpdatingFoaming] = useState(null);

  // === Fetch Data ===
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Memuat data cutting production summary...");
      const result = await cuttingProductionAPI.getAll();

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

  // === Filter Handlers ===
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ date: "", shift: "", group: "", machine: "", operator: "" });
    setCurrentPage(1);
  };

  // === Date Formatting ===
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // === Quantity Helpers ===
  const getTotalQuantity = (entries) => {
    return (
      entries?.reduce(
        (sum, entry) => sum + (parseInt(entry.quantityProduksi) || 0),
        0,
      ) || 0
    );
  };

  const getTotalRemain = (entries) => {
    return (
      entries?.reduce(
        (sum, entry) => sum + (parseInt(entry.remainQuantity) || 0),
        0,
      ) || 0
    );
  };

  // === Pagination ===
  const paginationData = {
    currentItems: summaryData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ),
    totalPages: Math.ceil(summaryData.length / itemsPerPage),
  };

  // === Modal Handlers ===
  const openModal = (item) => {
    setSelectedItem(item);
    setTimeout(() => setIsModalOpen(true), 10);
    setIsEditMode(false);
    setOpError(null);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (
      isEditMode &&
      !window.confirm(
        "Anda memiliki perubahan yang belum disimpan. Tutup modal?",
      )
    ) {
      return;
    }

    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedItem(null);
      setIsEditMode(false);
      setDraftHeader({});
      setDraftEntries([]);
      setOpError(null);
      setUpdatingHole(null);
      setUpdatingFoaming(null);
      document.body.style.overflow = "auto";
    }, 300);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setDraftHeader({
      shift: selectedItem.shift,
      group: selectedItem.group,
      time: selectedItem.time,
      machine: selectedItem.machine || "",
      operator: selectedItem.operator || "",
    });
    setDraftEntries(
      selectedItem.entries?.map((e) => {
        const qtyOrder = parseInt(e.quantityOrder) || 0;
        const qtyProd = parseInt(e.quantityProduksi) || 0;
        return {
          ...e,
          quantityProduksi: qtyProd,
          remainQuantity: Math.max(0, qtyOrder - qtyProd),
        };
      }) || [],
    );
    setOpError(null);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setDraftHeader({});
    setDraftEntries([]);
    setOpError(null);
  };

  const handleHeaderChange = (field, value) => {
    setDraftHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleEntryQtyChange = (index, newQty) => {
    const qty = parseInt(newQty) || 0;
    setDraftEntries((prev) => {
      const updated = [...prev];
      const entry = updated[index];
      const remain = (entry.quantityOrder || 0) - qty;
      updated[index] = {
        ...entry,
        quantityProduksi: qty,
        remainQuantity: remain,
      };
      return updated;
    });
  };

  const handleSave = async () => {
    setOpLoading((prev) => ({ ...prev, save: true }));
    setOpError(null);

    if (!draftHeader.shift || !draftHeader.group || !draftHeader.time) {
      setOpError("Shift, Group, dan Time harus diisi");
      setOpLoading((prev) => ({ ...prev, save: false }));
      return;
    }

    for (let i = 0; i < draftEntries.length; i++) {
      const entry = draftEntries[i];
      const qty = parseInt(entry.quantityProduksi) || 0;
      const order = parseInt(entry.quantityOrder) || 0;

      if (isNaN(qty) || qty < 0) {
        setOpError(`Entry ${i + 1}: Quantity Produksi harus angka positif`);
        setOpLoading((prev) => ({ ...prev, save: false }));
        return;
      }

      if (qty > order) {
        setOpError(
          `Entry ${i + 1}: Quantity Produksi (${qty}) tidak boleh melebihi Quantity Order (${order})`,
        );
        setOpLoading((prev) => ({ ...prev, save: false }));
        return;
      }
    }

    const normalizedEntries = draftEntries.map((entry) => ({
      ...entry,
      quantityProduksi: parseInt(entry.quantityProduksi) || 0,
      remainQuantity: Math.max(
        0,
        (parseInt(entry.quantityOrder) || 0) -
          (parseInt(entry.quantityProduksi) || 0),
      ),
    }));

    try {
      const payload = {
        ...selectedItem,
        shift: draftHeader.shift,
        group: draftHeader.group,
        time: draftHeader.time,
        machine: draftHeader.machine,
        operator: draftHeader.operator,
        entries: normalizedEntries,
      };

      await cuttingProductionAPI.update(selectedItem.id, payload);
      await fetchData();
      setIsModalOpen(false);
      setTimeout(() => {
        setSelectedItem(null);
        setIsEditMode(false);
        document.body.style.overflow = "auto";
      }, 300);
      alert("✅ Data berhasil diupdate!");
    } catch (err) {
      console.error("❌ Gagal update data:", err);
      setOpError(`Gagal update: ${err.message}`);
    } finally {
      setOpLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "⚠️ Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.",
      )
    ) {
      return;
    }

    setOpLoading((prev) => ({ ...prev, delete: true }));
    setOpError(null);

    try {
      await cuttingProductionAPI.delete(selectedItem.id);
      await fetchData();
      setIsModalOpen(false);
      setTimeout(() => {
        setSelectedItem(null);
        setIsEditMode(false);
        document.body.style.overflow = "auto";
      }, 300);
      alert("✅ Data berhasil dihapus!");
    } catch (err) {
      console.error("❌ Gagal hapus data:", err);
      setOpError(`Gagal hapus: ${err.message}`);
    } finally {
      setOpLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleUpdateHole = async (entryId, currentHole) => {
    const qty = prompt("Masukkan jumlah quantity yang di-hole:", "0");
    if (qty === null) return;

    const quantityHole = parseInt(qty);
    if (isNaN(quantityHole) || quantityHole <= 0) {
      alert("Jumlah quantity harus angka positif.");
      return;
    }

    setUpdatingHole(entryId);
    try {
      await cuttingProductionEntryAPI.updateHoleQuantity(entryId, quantityHole);
      await fetchData();
      alert("✅ Quantity hole berhasil diperbarui!");
    } catch (err) {
      console.error("❌ Gagal update hole:", err);
      alert(`Gagal update hole: ${err.message}`);
    } finally {
      setUpdatingHole(null);
    }
  };

  const handleApproveFoaming = async (entryId) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menandai foaming date sebagai selesai?",
      )
    ) {
      return;
    }

    setUpdatingFoaming(entryId);
    try {
      await cuttingProductionEntryAPI.markFoamingDateCompleted(entryId);
      await fetchData();
      alert("✅ Foaming date berhasil ditandai sebagai selesai!");
    } catch (err) {
      console.error("❌ Gagal approve foaming:", err);
      alert(`Gagal approve foaming: ${err.message}`);
    } finally {
      setUpdatingFoaming(null);
    }
  };

  // Esc key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  return (
    <div className="cutting-history-summary-root">
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

      {/* Table & Pagination */}
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

          <div className="summary-list">
            {paginationData.currentItems.length === 0 ? (
              <div className="no-data-message">
                <Package size={48} />
                <p>Tidak ada data production</p>
              </div>
            ) : (
              paginationData.currentItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-header">
                    <div className="item-title">
                      <Package size={20} />
                      <span>Production #{item.id?.substring(0, 8)}</span>
                    </div>
                    <div className="item-date">
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>

                  <div className="item-content">
                    <div className="info-row">
                      <div className="info-col">
                        <div className="info-label">Shift:</div>
                        <div className="info-value shift-badge">
                          {item.shift}
                        </div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Group:</div>
                        <div className="info-value group-badge">
                          {item.group}
                        </div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Time:</div>
                        <div className="info-value">{item.time}</div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Week:</div>
                        <div className="info-value week-badge">{item.week}</div>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-col">
                        <div className="info-label">Machine:</div>
                        <div className="info-value">{item.machine || "-"}</div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Operator:</div>
                        <div className="info-value">{item.operator || "-"}</div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Customer:</div>
                        <div className="info-value">
                          {item.entries?.[0]?.customer || "-"}
                        </div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">PO:</div>
                        <div className="info-value">
                          {item.entries?.[0]?.poNumber || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-col">
                        <div className="info-label">SKU:</div>
                        <div className="info-value">
                          {item.entries?.[0]?.sku || "-"}
                        </div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Qty Order:</div>
                        <div className="info-value">
                          {item.entries?.[0]?.quantityOrder || 0}
                        </div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Qty Produksi:</div>
                        <div className="info-value qty-produksi">
                          {getTotalQuantity(item.entries)}
                        </div>
                      </div>
                      <div className="info-col">
                        <div className="info-label">Remain:</div>
                        <div className="info-value qty-remain">
                          {getTotalRemain(item.entries)}
                        </div>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-col full-width">
                        <div className="info-label">Entries:</div>
                        <div className="info-value">
                          {item.entries?.length || 0} item
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="item-footer">
                    <div className="item-timestamp">
                      <Clock size={14} />
                      {formatTimestamp(item.timestamp)}
                    </div>
                    <div className="item-status">
                      {item.entries?.length > 0 ? (
                        <CheckCircle size={14} color="#10b981" />
                      ) : (
                        <AlertTriangle size={14} color="#f59e0b" />
                      )}
                    </div>
                    <button
                      className="btn-detail"
                      onClick={() => openModal(item)}
                    >
                      <Eye size={14} />
                      Detail
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

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

      {/* Modal Detail */}
      {isModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Package size={24} />
                Production Detail #{selectedItem.id?.substring(0, 8)}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {opError && (
                <div className="modal-error">
                  <AlertTriangle size={16} />
                  {opError}
                </div>
              )}

              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <strong>Tanggal:</strong>
                  <span>{formatDate(selectedItem.timestamp)}</span>
                </div>
                <div className="modal-info-item">
                  <strong>Shift:</strong>
                  {isEditMode ? (
                    <select
                      value={draftHeader.shift}
                      onChange={(e) =>
                        handleHeaderChange("shift", e.target.value)
                      }
                      className="modal-input"
                    >
                      <option value="1">Shift 1</option>
                      <option value="2">Shift 2</option>
                    </select>
                  ) : (
                    <span className="shift-badge">{selectedItem.shift}</span>
                  )}
                </div>
                <div className="modal-info-item">
                  <strong>Group:</strong>
                  {isEditMode ? (
                    <select
                      value={draftHeader.group}
                      onChange={(e) =>
                        handleHeaderChange("group", e.target.value)
                      }
                      className="modal-input"
                    >
                      <option value="A">Group A</option>
                      <option value="B">Group B</option>
                    </select>
                  ) : (
                    <span className="group-badge">{selectedItem.group}</span>
                  )}
                </div>
                <div className="modal-info-item">
                  <strong>Time:</strong>
                  {isEditMode ? (
                    <input
                      type="time"
                      value={draftHeader.time}
                      onChange={(e) =>
                        handleHeaderChange("time", e.target.value)
                      }
                      className="modal-input"
                    />
                  ) : (
                    <span>{selectedItem.time}</span>
                  )}
                </div>
                <div className="modal-info-item">
                  <strong>Week:</strong>
                  <span className="week-badge">
                    {selectedItem.entries?.[0]?.week || "-"}
                  </span>
                </div>
                <div className="modal-info-item">
                  <strong>Machine:</strong>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={draftHeader.machine}
                      onChange={(e) =>
                        handleHeaderChange("machine", e.target.value)
                      }
                      className="modal-input"
                      placeholder="Machine"
                    />
                  ) : (
                    <span>{selectedItem.machine || "-"}</span>
                  )}
                </div>
                <div className="modal-info-item">
                  <strong>Operator:</strong>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={draftHeader.operator}
                      onChange={(e) =>
                        handleHeaderChange("operator", e.target.value)
                      }
                      className="modal-input"
                      placeholder="Nama operator"
                    />
                  ) : (
                    <span>{selectedItem.operator || "-"}</span>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h3>
                  Detail Entries (
                  {isEditMode
                    ? draftEntries.length
                    : selectedItem.entries?.length || 0}{" "}
                  items)
                </h3>
                <div className="modal-table-wrapper">
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Customer</th>
                        <th>PO Number</th>
                        <th>SKU</th>
                        <th>S.CODE</th>
                        <th>Description</th>
                        <th>Qty Order</th>
                        <th>Qty Produksi</th>
                        <th>Remain</th>
                        <th>Is Hole</th>
                        <th>Qty Hole</th>
                        <th>Qty Hole Remain</th>
                        <th>Foaming Date</th>
                        <th>Foaming Completed</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isEditMode ? draftEntries : selectedItem.entries)?.map(
                        (entry, index) => (
                          <tr key={entry.id || index}>
                            <td>{index + 1}</td>
                            <td>{entry.customer || "-"}</td>
                            <td>{entry.poNumber || "-"}</td>
                            <td>{entry.sku || "-"}</td>
                            <td>{entry.sCode || "-"}</td>
                            <td>{entry.description || "-"}</td>
                            <td>{entry.quantityOrder || 0}</td>
                            <td className="qty-produksi">
                              {isEditMode ? (
                                <input
                                  type="number"
                                  value={entry.quantityProduksi}
                                  onChange={(e) =>
                                    handleEntryQtyChange(index, e.target.value)
                                  }
                                  min="0"
                                  max={entry.quantityOrder}
                                  className="modal-input modal-input-small"
                                />
                              ) : (
                                entry.quantityProduksi || 0
                              )}
                            </td>
                            <td className="qty-remain">
                              {entry.remainQuantity || 0}
                            </td>
                            <td>
                              {entry.isHole ? (
                                <span className="badge badge-hint">Hole</span>
                              ) : (
                                <span className="badge badge-default">-</span>
                              )}
                            </td>
                            <td>{entry.quantityHole || 0}</td>
                            <td>{entry.quantityHoleRemain || 0}</td>
                            {/* ✅ Foaming Date with custom format */}
                            <td>
                              {entry.foamingDate
                                ? formatCustomDateTime(
                                    parseCustomDateTime(entry.foamingDate),
                                  )
                                : "-"}
                            </td>
                            <td>
                              {entry.foamingDateCompleted ? (
                                <span className="badge badge-success">
                                  Selesai
                                </span>
                              ) : (
                                <span className="badge badge-warning">
                                  Belum
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="action-buttons">
                                {entry.isHole && (
                                  <button
                                    className="btn-update-hole"
                                    onClick={() =>
                                      handleUpdateHole(
                                        entry.id,
                                        entry.quantityHole,
                                      )
                                    }
                                    disabled={updatingHole === entry.id}
                                  >
                                    {updatingHole === entry.id ? (
                                      <RefreshCw size={14} className="spin" />
                                    ) : (
                                      <Plus size={14} />
                                    )}
                                    Update Hole
                                  </button>
                                )}
                                {entry.foamingDate &&
                                  !entry.foamingDateCompleted && (
                                    <button
                                      className="btn-approve-foaming"
                                      onClick={() =>
                                        handleApproveFoaming(entry.id)
                                      }
                                      disabled={updatingFoaming === entry.id}
                                    >
                                      {updatingFoaming === entry.id ? (
                                        <RefreshCw size={14} className="spin" />
                                      ) : (
                                        <Check size={14} />
                                      )}
                                      Approve
                                    </button>
                                  )}
                                {entry.foamingDate &&
                                  entry.foamingDateCompleted && (
                                    <span className="badge badge-success">
                                      Approved
                                    </span>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {isEditMode ? (
                <>
                  <button
                    className="btn-cancel"
                    onClick={handleCancelEdit}
                    disabled={opLoading.save}
                  >
                    Batal
                  </button>
                  <button
                    className="btn-update"
                    onClick={handleSave}
                    disabled={opLoading.save}
                  >
                    {opLoading.save ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <Save size={16} />
                        Simpan
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-delete"
                    onClick={handleDelete}
                    disabled={opLoading.delete}
                  >
                    {opLoading.delete ? (
                      "Menghapus..."
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </button>
                  <button
                    className="btn-edit"
                    onClick={handleEdit}
                    disabled={opLoading.delete}
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button className="btn-close" onClick={closeModal}>
                    Tutup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuttingHistorySummary;
