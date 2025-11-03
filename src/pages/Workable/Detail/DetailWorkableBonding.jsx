// src/pages/Workable/Detail/DetailWorkableBonding.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getWorkableBondingDetail } from "../../../api/workable-bonding";
import "../../../styles/Workable/Detail/DetailWorkableBonding.css";

const DetailWorkableBonding = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getWorkableBondingDetail();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mengambil data.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render cell for Layer/Hole: support 'x', '-', or number
  const renderLayerOrHoleCell = (value) => {
    if (value == null || value === "") return "-";

    // Tampilkan apa adanya jika string 'x' atau '-'
    if (typeof value === "string") {
      if (value === "x") {
        return <span className="layer-na">x</span>;
      } else if (value === "-") {
        return <span className="layer-pending">-</span>;
      }
    }

    // Jika angka, format dan tampilkan sebagai complete
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      return (
        <span className="layer-complete">
          {numValue.toLocaleString()}
        </span>
      );
    }

    // Fallback
    return "-";
  };

  const getStatusClass = (status) => {
    if (!status) return "status-n-a";
    const lower = status.toLowerCase();
    if (lower === "completed") return "status-completed";
    if (lower === "running") return "status-running";
    if (lower === "halted") return "status-halted";
    if (lower === "not started") return "status-not-started";
    return "status-unknown";
  };

  // Kolom header tetap statis
  const renderTable = () => (
    <div className="detail-table-wrapper">
      <table className="detail-table">
        <thead>
          <tr>
            <th>WEEK</th>
            <th>SHIP TO NAME</th>
            <th>SKU</th>
            <th>QTY ORDER</th>
            <th>WORKABLE</th>
            <th>BONDING</th>
            <th>LAYER 1</th>
            <th>LAYER 2</th>
            <th>LAYER 3</th>
            <th>LAYER 4</th>
            <th>HOLE</th>
            <th>REMAIN</th>
            <th>REMARKS</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="14" className="no-data">
                {loading
                  ? "Memuat data..."
                  : error
                  ? `Gagal memuat data: ${error}`
                  : "Tidak ada data detail."}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={`${row.sku}-${row.week}-${index}`}>
                <td>{row.week ?? "-"}</td>
                <td>{row.shipToName ?? "-"}</td>
                <td>{row.sku ?? "-"}</td>
                <td className="qty-cell">
                  {typeof row.quantityOrder === "number"
                    ? row.quantityOrder.toLocaleString()
                    : row.quantityOrder ?? 0}
                </td>
                <td className="workable-cell">
                  {typeof row.workable === "number"
                    ? row.workable.toLocaleString()
                    : row.workable ?? "-"}
                </td>
                <td className="bonding-cell">
                  {typeof row.bonding === "number"
                    ? row.bonding.toLocaleString()
                    : row.bonding ?? "-"}
                </td>
                <td>{renderLayerOrHoleCell(row["Layer 1"])}</td>
                <td>{renderLayerOrHoleCell(row["Layer 2"])}</td>
                <td>{renderLayerOrHoleCell(row["Layer 3"])}</td>
                <td>{renderLayerOrHoleCell(row["Layer 4"])}</td>
                <td>{renderLayerOrHoleCell(row["Hole"])}</td>
                <td className="remain-cell">
                  {typeof row["Remain Produksi"] === "number"
                    ? row["Remain Produksi"].toLocaleString()
                    : row["Remain Produksi"] ?? "-"}
                </td>
                <td className="remarks-cell">{row.remarks ?? "-"}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(row.status)}`}
                  >
                    {row.status ?? "N/A"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="detail-container">
      <div className="top-header">
        <div className="header-content">
          <h1 className="header-title">Detail Workable Bonding</h1>
        </div>
        <div className="header-time">
          <span className="date">
            {currentTime.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="time">
            {currentTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: "Asia/Jakarta",
            })}{" "}
            WIB
          </span>
        </div>
      </div>

      <div className="action-buttons">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/workable/bonding")}
        >
          <ArrowLeft size={16} /> KEMBALI
        </button>
        <Link to="/workable/bonding/reject" className="btn-view-ng">
          <AlertTriangle size={16} /> LIHAT DATA NG
        </Link>
      </div>

      {renderTable()}
    </div>
  );
};

export default DetailWorkableBonding;