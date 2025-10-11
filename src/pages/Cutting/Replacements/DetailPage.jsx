// src/pages/Cutting/Replacements/DetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../../../styles/Cutting/Replacements/DetailPage.css";
import {
  replacementAPI,
  cuttingReplacementAPI,
} from "../../../api/replacement";
import ProcessReplacementModal from "./components/ProcessReplacementModal";

const StatusBadge = ({ status }) => {
  const statusClass = `status-badge status-${status.toLowerCase()}`;
  return <span className={statusClass}>{status.replace("_", " ")}</span>;
};

export default function ReplacementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replacement, setReplacement] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReplacement, setSelectedReplacement] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [replacementRes, historyRes] = await Promise.all([
        replacementAPI.getById(id),
        cuttingReplacementAPI.getHistory({ replacementId: id }),
      ]);
      setReplacement(replacementRes.data.data);
      setHistory(historyRes.data.data);
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
    fetchData(); // Refresh data
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

  const remaining = replacement.requestedQty - replacement.processedQty;
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
          <div className="detail-value">{replacement.processedQty} unit</div>
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
              {replacement.bondingReject.poNumber || "-"}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">SKU</div>
            <div className="detail-value">{replacement.bondingReject.sku}</div>
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

      {/* Riwayat Proses Cutting */}
      <div className="detail-card">
        <h2>Riwayat Pemrosesan</h2>
        {history.length === 0 ? (
          <p>Belum ada proses yang dilakukan.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jumlah</th>
                <th>Operator</th>
                <th>Mesin</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>
                    {new Date(item.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{item.processedQty} unit</td>
                  <td>{item.operatorName || "-"}</td>
                  <td>{item.machineId || "-"}</td>
                  <td>{item.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Tombol Proses Lagi */}
        {!isCompleted && (
          <button className="btn-process-again" onClick={handleOpenProcess}>
            Proses Lagi
          </button>
        )}
      </div>

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
