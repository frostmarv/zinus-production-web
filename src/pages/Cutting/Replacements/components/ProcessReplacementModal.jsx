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

  const remaining = replacement.requestedQty - replacement.processedQty;

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

      // Ambil operator dari localStorage / context (contoh: dummy)
      const operatorName = localStorage.getItem("operatorName") || "Operator";

      await cuttingReplacementAPI.process({
        replacementId: replacement.id,
        processedQty: qty,
        remarks: remarks || undefined,
        operatorName: operatorName,
        // machineId bisa ditambahkan nanti
      });

      onSuccess();
    } catch (err) {
      console.error("Gagal memproses replacement:", err);
      setError("Gagal memproses. Silakan coba lagi.");
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
          <p>
            <strong>Alasan NG:</strong> {replacement.remarks}
          </p>
          <p>
            <strong>Diminta:</strong> {replacement.requestedQty} unit
          </p>
          <p>
            <strong>Sudah Diproses:</strong> {replacement.processedQty} unit
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
              {error && <div className="form-error">{error}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Keterangan (Opsional)</label>
              <input
                type="text"
                className="form-input"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Contoh: Mesin MC-001, shift pagi"
              />
            </div>

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
                disabled={loading || !processedQty}
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
