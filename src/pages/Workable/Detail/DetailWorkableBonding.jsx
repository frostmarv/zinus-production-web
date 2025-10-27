// src/pages/Workable/Detail/DetailWorkableBonding.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Eye } from "lucide-react";
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
      try {
        const result = await getWorkableBondingDetail();
        // ✅ JANGAN URUTKAN LAGI — backend sudah urutkan sesuai prioritas status!
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderLayerCell = (value, orderQty) => {
    if (value == null || value === "" || isNaN(value)) return "-";

    const numValue = Number(value);
    const orderNum = Number(orderQty) || 0;
    const isComplete = numValue >= orderNum && orderNum > 0;

    return (
      <span className={isComplete ? "layer-complete" : "layer-incomplete"}>
        {numValue.toLocaleString()}
      </span>
    );
  };

  const getStatusClass = (status) => {
    if (!status) return "status-n-a";
    return `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
  };

  if (loading) {
    return (
      <div className="detail-container">
        {/* Top Header with Real-time Clock */}
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
            <ArrowLeft size={16} />
            KEMBALI
          </button>
          <Link to="/workable/bonding/reject" className="btn-view-ng">
            <AlertTriangle size={16} />
            LIHAT DATA NG
          </Link>
        </div>

        <div className="detail-loading">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        {/* Top Header with Real-time Clock */}
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
            <ArrowLeft size={16} />
            KEMBALI
          </button>
          <Link to="/workable/bonding/reject" className="btn-view-ng">
            <AlertTriangle size={16} />
            LIHAT DATA NG
          </Link>
        </div>

        <div className="detail-error">Gagal memuat data: {error}</div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      {/* Top Header with Real-time Clock */}
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
          <ArrowLeft size={16} />
          KEMBALI
        </button>
        <Link to="/workable/bonding/reject" className="btn-view-ng">
          <AlertTriangle size={16} />
          LIHAT DATA NG
        </Link>
      </div>

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
                  Tidak ada data detail.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={`${row.sku}-${row.week}-${index}`}>
                  <td>{row.week || "-"}</td>
                  <td>{row.shipToName || "-"}</td>
                  <td className="sku-cell">{row.sku || "-"}</td>
                  <td className="qty-cell">
                    {row.quantityOrder != null
                      ? row.quantityOrder.toLocaleString()
                      : 0}
                  </td>
                  <td className="workable-cell">
                    {row.workable != null ? row.workable.toLocaleString() : 0}
                  </td>
                  <td className="bonding-cell">
                    {row.bonding != null ? row.bonding.toLocaleString() : 0}
                  </td>
                  <td>{renderLayerCell(row["Layer 1"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Layer 2"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Layer 3"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Layer 4"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Hole"], row.quantityOrder)}</td>
                  <td className="remain-cell">
                    {row["Remain Produksi"] != null ? row["Remain Produksi"].toLocaleString() : 0}
                  </td>
                  <td className="remarks-cell">{row.remarks || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(row.status)}`}
                    >
                      {row.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailWorkableBonding;