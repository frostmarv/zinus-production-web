// src/pages/Cutting/DetailCutting.jsx
import React from "react";
import "../../styles/Cutting/DetailCutting.css";

const DetailCutting = ({ data, onClose }) => {
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

  // Format tanggal saja (untuk foaming date)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Detail Cutting</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="detail-info">
          <div className="info-grid">
            <div className="info-item">
              <strong>Tanggal</strong>
              <span>{formatTimestamp(data.timestamp)}</span>
            </div>
            <div className="info-item">
              <strong>Shift</strong>
              <span>{data.shift || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Group</strong>
              <span>{data.group || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Machine</strong>
              <span>{data.machine || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Time Slot</strong>
              <span>{data.timeSlot || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Week</strong>
              <span>{data.week || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Foaming</strong>
              <span>{data.foamingDate?.isChecked ? "✅ Ya" : "❌ Tidak"}</span>
            </div>

            {/* ✅ Tambah info foaming date jika ada */}
            {data.foamingDate?.isChecked && (
              <>
                <div className="info-item">
                  <strong>Tgl Selesai Foaming</strong>
                  <span>{formatDate(data.foamingDate.tanggalSelesai)}</span>
                </div>
                <div className="info-item">
                  <strong>Jam Foaming</strong>
                  <span>{data.foamingDate.jam || "-"}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Balok List */}
        <div className="balok-section">
          <h3>📦 Data Balok</h3>
          <div className="balok-table">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Density</th>
                  <th>ILD</th>
                  <th>Colour</th>
                  <th>Length</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Size Actual</th>
                  <th>Qty Balok</th>
                </tr>
              </thead>
              <tbody>
                {data.balok && data.balok.length > 0 ? (
                  data.balok.map((balok, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{balok.density || "-"}</td>
                      <td>{balok.ild || "-"}</td>
                      <td>{balok.colour || "-"}</td>
                      <td>{balok.length || "-"}</td>
                      <td>{balok.width || "-"}</td>
                      <td>{balok.height || "-"}</td>
                      <td>{balok.sizeActual || "-"}</td>
                      <td>{balok.qtyBalok || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      Tidak ada data balok
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailCutting;
