// src/pages/Cutting/Replacements/DetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../../../styles/Cutting/Replacements/DetailPage.css";
import { replacementAPI } from "../../../api/replacement";
import ProcessReplacementModal from "./components/ProcessReplacementModal";

const StatusBadge = ({ status }) => {
  const statusClass = `status-badge status-${status.toLowerCase()}`;
  return <span className={statusClass}>{status.replace("_", " ")}</span>;
};

export default function ReplacementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replacement, setReplacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReplacement, setSelectedReplacement] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const replacementRes = await replacementAPI.getById(id);
      setReplacement(replacementRes.data);
    } catch (err) {
      console.error("Gagal memuat detail:", err);
      alert("Gagal memuat data replacement");
      navigate("/cutting/replacements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleOpenProcess = () => {
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
      <div className="replacement-detail-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (!replacement) {
    return (
      <div className="replacement-detail-container">
        <p>Data tidak ditemukan.</p>
      </div>
    );
  }

  const remaining = replacement.requestedQty - (replacement.processedQty || 0);
  const isCompleted = replacement.status === "COMPLETED";

  return (
    <div className="replacement-detail-container">
      <a href="/cutting/replacements" className="back-link">
        ← Kembali ke Daftar
      </a>
      <h1>Detail Replacement</h1>

      {/* Info Replacement */}
      <div className="detail-card">
        <h2>Informasi Replacement</h2>
        <div className="detail-row">
          <div className="detail-label">ID Replacement</div>
          <div className="detail-value">{replacement.id}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Batch Number</div>
          <div className="detail-value">{replacement.sourceBatchNumber}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Diminta</div>
          <div className="detail-value">{replacement.requestedQty} unit</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Sudah Diproses</div>
          <div className="detail-value">
            {replacement.processedQty || 0} unit
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Sisa</div>
          <div className="detail-value">
            <strong>{remaining}</strong> unit
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Status</div>
          <div className="detail-value">
            <StatusBadge status={replacement.status} />
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Keterangan</div>
          <div className="detail-value">{replacement.remarks || "-"}</div>
        </div>
      </div>

      {/* Data Bonding Reject */}
      {replacement.bondingReject && (
        <div className="detail-card">
          <h2>Data NG dari Bonding</h2>
          <div className="detail-row">
            <div className="detail-label">Customer</div>
            <div className="detail-value">
              {replacement.bondingReject.customer}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">PO Number</div>
            <div className="detail-value">
              {replacement.bondingReject.po_number || "-"}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">SKU</div>
            <div className="detail-value">{replacement.bondingReject.sku}</div>
          </div>
          {/* ✅ S-Code & Description: selalu tampilkan sebagai pasangan */}
          <div className="detail-row">
            <div className="detail-label">S-Code (Slice)</div>
            <div className="detail-value">
              <code>{replacement.bondingReject.s_code || "-"}</code>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Deskripsi Slice</div>
            <div className="detail-value">
              {replacement.bondingReject.description || "-"}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Alasan NG</div>
            <div className="detail-value">
              {replacement.bondingReject.reason}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Shift / Group</div>
            <div className="detail-value">
              {replacement.bondingReject.shift} /{" "}
              {replacement.bondingReject.group}
            </div>
          </div>
        </div>
      )}

      {/* Tombol Proses Lagi */}
      {!isCompleted && (
        <div className="action-section">
          <button className="btn-process-again" onClick={handleOpenProcess}>
            Proses Lagi
          </button>
        </div>
      )}

      {/* Modal */}
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
