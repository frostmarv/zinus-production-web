// src/pages/History/Cutting/CuttingHistorySummaryDetail.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Package,
  Flame,
  Send,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
// ✅ GUNAKAN cuttingProductionAPI untuk endpoint /api/cutting/production
import { cuttingProductionAPI } from "../../../api/cutting";
import "../../../styles/History/Cutting/CuttingHistorySummaryDetail.css";

const CuttingHistorySummaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cuttingData, setCuttingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data dari API berdasarkan ID
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        `🔄 Memuat data cutting production detail untuk ID: ${id}...`,
      );
      // ✅ Gunakan cuttingProductionAPI.getById (akan memanggil GET /api/cutting/production/:id)
      const result = await cuttingProductionAPI.getById(id);

      let rawData;
      if (result && Array.isArray(result)) {
        // Jika API mengembalikan array, cari berdasarkan ID
        rawData = result.find((item) => item.id === id);
      } else if (result && result.data) {
        // Jika API mengembalikan { data: ... }
        rawData = result.data;
      } else if (result && result.production) {
        // Jika API mengembalikan { production: ... }
        rawData = result.production;
      } else {
        // Jika API langsung mengembalikan object
        rawData = result;
      }

      setCuttingData(rawData);
    } catch (err) {
      console.error("❌ Gagal ambil data cutting production detail:", err);
      setError(`Gagal memuat riwayat: ${err.message}`);
      setCuttingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

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

  // Handle edit click
  const handleEditClick = () => {
    // Arahkan ke halaman edit (misalnya: /cutting/edit/:id)
    navigate(`/cutting/edit/${id}`);
  };

  // Handle delete click
  const handleDeleteClick = async () => {
    if (isDeleting) return;

    const confirmDelete = window.confirm(
      `⚠️ Apakah Anda yakin ingin menghapus data ini?\n\nID: ${id}\nTanggal: ${formatDate(cuttingData?.timestamp)}\nShift: ${cuttingData?.shift}\nGroup: ${cuttingData?.group}`,
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      console.log(`🗑️ Menghapus data cutting production dengan ID: ${id}...`);
      // ✅ Gunakan cuttingProductionAPI.delete (akan memanggil DELETE /api/cutting/production/:id)
      await cuttingProductionAPI.delete(id);

      alert("✅ Data berhasil dihapus dari server production!");
      // Kembali ke halaman history
      navigate("/history/cutting/summary");
    } catch (err) {
      console.error("❌ Gagal hapus data cutting production:", err);
      alert(`❌ Gagal menghapus  ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hitung total quantity
  const getTotalQuantity = (entries) => {
    return (
      entries?.reduce((sum, item) => sum + (parseInt(item.qtyBalok) || 0), 0) ||
      0
    );
  };

  // Hitung total qty produksi
  const getTotalQtyProduksi = (actuals) => {
    return (
      actuals?.reduce(
        (sum, item) => sum + (parseInt(item.qtyProduksi) || 0),
        0,
      ) || 0
    );
  };

  if (loading) {
    return (
      <div className="cutting-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data detail dari server production...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cutting-detail-container">
        <div className="error-container">
          <AlertTriangle size={20} />
          <p>{error}</p>
          <button onClick={fetchData} className="btn-retry">
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!cuttingData) {
    return (
      <div className="cutting-detail-container">
        <div className="no-data-container">
          <Package size={48} />
          <p>Tidak ada data cutting production dengan ID: {id}</p>
          <button
            onClick={() => navigate("/history/cutting/summary")}
            className="btn-back"
          >
            <ArrowLeft size={16} />
            Kembali ke History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cutting-detail-container">
      {/* Header */}
      <div className="cutting-detail-header">
        <button
          onClick={() => navigate("/history/cutting/summary")}
          className="btn-back"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1>
          <Package size={32} />
          Detail Cutting Production
        </h1>
        <p>ID: {cuttingData.id?.substring(0, 8)}...</p>
      </div>

      {/* Action Buttons */}
      <div className="detail-actions">
        <button onClick={handleEditClick} className="btn-edit">
          <Edit size={16} />
          Edit Data
        </button>
        <button
          onClick={handleDeleteClick}
          className="btn-delete"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          {isDeleting ? "Menghapus..." : "Hapus Data"}
        </button>
      </div>

      {/* Detail Info */}
      <div className="detail-section">
        <h3>
          <Settings size={20} />
          Informasi Umum
        </h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>ID:</label>
            <span className="id-text">{cuttingData.id}</span>
          </div>
          <div className="detail-item">
            <label>Tanggal Produksi:</label>
            <span>{formatTimestamp(cuttingData.timestamp)}</span>
          </div>
          <div className="detail-item">
            <label>Shift:</label>
            <span className="shift-badge">{cuttingData.shift}</span>
          </div>
          <div className="detail-item">
            <label>Group:</label>
            <span className="group-badge">{cuttingData.group}</span>
          </div>
          <div className="detail-item">
            <label>Machine:</label>
            <span>{cuttingData.machine}</span>
          </div>
          <div className="detail-item">
            <label>Time Slot:</label>
            <span>{cuttingData.timeSlot}</span>
          </div>
          <div className="detail-item">
            <label>Week:</label>
            <span className="week-badge">{cuttingData.week}</span>
          </div>
          <div className="detail-item">
            <label>Operator:</label>
            <span>{cuttingData.operator}</span>
          </div>
        </div>
      </div>

      {/* Data Balok (Plan) */}
      <div className="detail-section">
        <h3>
          <Package size={20} />
          Data Balok (Plan)
        </h3>
        {cuttingData.balok ? (
          <div className="balok-detail">
            <div className="detail-grid">
              <div className="detail-item">
                <label>Density:</label>
                <span>{cuttingData.balok.density || "-"}</span>
              </div>
              <div className="detail-item">
                <label>ILD:</label>
                <span>{cuttingData.balok.ild || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Colour:</label>
                <span className="colour-badge">{cuttingData.balok.colour}</span>
              </div>
              <div className="detail-item">
                <label>Length:</label>
                <span>
                  {cuttingData.balok.length
                    ? `${cuttingData.balok.length} mm`
                    : "-"}
                </span>
              </div>
              <div className="detail-item">
                <label>Width:</label>
                <span>
                  {cuttingData.balok.width
                    ? `${cuttingData.balok.width} mm`
                    : "-"}
                </span>
              </div>
              <div className="detail-item">
                <label>Height:</label>
                <span>
                  {cuttingData.balok.height
                    ? `${cuttingData.balok.height} mm`
                    : "-"}
                </span>
              </div>
              <div className="detail-item">
                <label>Size Actual:</label>
                <span>{cuttingData.balok.sizeActual || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Qty Balok:</label>
                <span className="qty-badge">
                  {cuttingData.balok.qtyBalok || "-"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="no-data-text">Tidak ada data balok (plan)</p>
        )}
      </div>

      {/* Data Actual */}
      {Array.isArray(cuttingData.actual) && cuttingData.actual.length > 0 && (
        <div className="detail-section">
          <h3>
            <CheckCircle size={20} />
            Data Actual
          </h3>
          {cuttingData.actual.map((actualItem, index) => (
            <div key={actualItem.id || index} className="balok-detail">
              <h4>Actual #{index + 1}</h4>
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
                  <label>Colour:</label>
                  <span className="colour-badge">{actualItem.colour}</span>
                </div>
                <div className="detail-item">
                  <label>Length:</label>
                  <span>
                    {actualItem.length ? `${actualItem.length} mm` : "-"}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Width:</label>
                  <span>
                    {actualItem.width ? `${actualItem.width} mm` : "-"}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Height:</label>
                  <span>
                    {actualItem.height ? `${actualItem.height} mm` : "-"}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Size Actual:</label>
                  <span>{actualItem.sizeActual || "-"}</span>
                </div>
                <div className="detail-item">
                  <label>Qty Balok:</label>
                  <span className="qty-badge">
                    {actualItem.qtyBalok || "-"}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Qty Produksi:</label>
                  <span className="qty-produksi-badge">
                    {actualItem.qtyProduksi || "-"}
                  </span>
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
                  <label>Description:</label>
                  <span
                    className={`descript-badge ${actualItem.descript?.toLowerCase()}`}
                  >
                    {actualItem.descript || "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Foaming Date */}
      {cuttingData.foamingDate?.isChecked && (
        <div className="detail-section">
          <h3>
            <Flame size={20} />
            Foaming Date
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Tanggal Selesai:</label>
              <span>{formatDate(cuttingData.foamingDate.tanggalSelesai)}</span>
            </div>
            <div className="detail-item">
              <label>Jam:</label>
              <span className="time-badge">{cuttingData.foamingDate.jam}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="detail-footer">
        <p>
          <strong>Dibuat Pada:</strong> {formatTimestamp(cuttingData.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default CuttingHistorySummaryDetail;
