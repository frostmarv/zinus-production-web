// src/pages/Cutting/Replacements/components/ProcessReplacementModal.jsx
import { useState } from "react";
import "../../../../styles/Cutting/Replacements/components/ProcessReplacementModal.css";
import { cuttingReplacementAPI } from "../../../../api/replacement";

export default function ProcessReplacementModal({
  replacement,
  onClose,
  onSuccess,
}) {
  const [processedQty, setProcessedQty] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = replacement.requestedQty - (replacement.processedQty || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const qty = Number(processedQty);
    if (!qty || qty <= 0) {
      setError("Jumlah harus lebih dari 0");
      return;
    }
    if (qty > remaining) {
      setError(`Maksimal jumlah yang bisa diproses: ${remaining}`);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await cuttingReplacementAPI.process({
        replacementId: replacement.id,
        processedQty: qty,
        remarks: remarks || undefined,
      });

      onSuccess();
    } catch (err) {
      console.error("Gagal memproses replacement:", err);
      setError(err.message || "Gagal memproses. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="process-replacement-modal-overlay" onClick={onClose}>
      <div
        className="process-replacement-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="process-replacement-modal-header">
          <h2>Proses Replacement</h2>
        </div>

        <div className="process-replacement-modal-body">
          <p>
            <strong>Batch:</strong> {replacement.sourceBatchNumber}
          </p>
          <p>
            <strong>Customer:</strong>{" "}
            {replacement.bondingReject?.customer || "-"}
          </p>
          <p>
            <strong>SKU:</strong> {replacement.bondingReject?.sku || "-"}
          </p>
          {/* ✅ S-Code & Description: selalu tampilkan sebagai pasangan */}
          <p>
            <strong>S-Code (Slice):</strong>{" "}
            <code className="s-code-inline">
              {replacement.bondingReject?.s_code || "-"}
            </code>
          </p>
          <p>
            <strong>Deskripsi Slice:</strong>{" "}
            {replacement.bondingReject?.description || "-"}
          </p>
          <p>
            <strong>Alasan NG:</strong>{" "}
            {replacement.bondingReject?.reason || "-"}
          </p>
          <p>
            <strong>Diminta:</strong> {replacement.requestedQty} unit
          </p>
          <p>
            <strong>Sudah Diproses:</strong> {replacement.processedQty || 0}{" "}
            unit
          </p>
          <p>
            <strong>Sisa:</strong>{" "}
            <strong className="text-blue-600">{remaining}</strong> unit
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Jumlah Diproses *</label>
              <input
                type="number"
                className="form-input"
                value={processedQty}
                onChange={(e) => setProcessedQty(e.target.value)}
                min="1"
                max={remaining}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Keterangan (Opsional)</label>
              <input
                type="text"
                className="form-input"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Catatan tambahan..."
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="process-replacement-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !processedQty.trim()}
              >
                {loading ? "Memproses..." : "Kirim"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
