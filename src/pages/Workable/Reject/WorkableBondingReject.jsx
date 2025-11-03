// src/pages/Workable/Reject/WorkableBondingReject.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getWorkableBondingReject } from "../../../api/workable-bonding";
import "../../../styles/Workable/Reject/WorkableBondingReject.css";

const WorkableBondingReject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
        const result = await getWorkableBondingReject();
        setData(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mengambil data.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    navigate("/workable/bonding/detail");
  };

  // Fungsi untuk menampilkan nilai sesuai backend: angka, '-', 'x', dll.
  const renderValue = (value) => {
    if (value == null) return "-";

    if (typeof value === "string") {
      // Tampilkan apa adanya jika string (misalnya: "-", "x")
      return value;
    }

    // Jika number, format dengan toLocaleString
    if (typeof value === "number") {
      return value.toLocaleString();
    }

    // Fallback
    return value;
  };

  // Fungsi untuk menghitung total NG (hanya angka, abaikan "x" atau "-")
  const totalNG = (row) => {
    const fields = [
      row["NG Layer 1"],
      row["NG Layer 2"],
      row["NG Layer 3"],
      row["NG Layer 4"],
      row["NG Hole"],
    ];
    return fields.reduce((sum, val) => {
      const num = typeof val === "number" ? val : 0;
      return sum + num;
    }, 0);
  };

  // Fungsi untuk menghitung total Replacement (hanya angka, abaikan "x" atau "-")
  const totalReplacement = (row) => {
    const fields = [
      row["Replacement Layer 1"],
      row["Replacement Layer 2"],
      row["Replacement Layer 3"],
      row["Replacement Layer 4"],
      row["Replacement Hole"],
    ];
    return fields.reduce((sum, val) => {
      const num = typeof val === "number" ? val : 0;
      return sum + num;
    }, 0);
  };

  return (
    <div className="workable-reject-container">
      {/* Top Header with Real-time Clock */}
      <div className="top-header">
        <div className="header-content">
          <h1 className="header-title">Workable Bonding - Reject</h1>
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
        <button onClick={handleBack} className="btn-back">
          <ArrowLeft size={16} />
          KEMBALI
        </button>
      </div>

      {/* Tabel Data */}
      <div className="table-wrapper">
        <table className="workable-reject-table">
          <thead>
            <tr>
              <th>WEEK</th>
              <th>SHIP TO NAME</th>
              <th>SKU</th>
              <th>QTY ORDER</th>
              <th>NG LAYER 1</th>
              <th>NG LAYER 2</th>
              <th>NG LAYER 3</th>
              <th>NG LAYER 4</th>
              <th>NG HOLE</th>
              <th>REPLACEMENT L1</th>
              <th>REPLACEMENT L2</th>
              <th>REPLACEMENT L3</th>
              <th>REPLACEMENT L4</th>
              <th>REPLACEMENT HOLE</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="14" className="no-data">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="14" className="no-data">
                  Gagal memuat: {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="14" className="no-data">
                  Tidak ada data reject.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={`${row.sku}-${row.week}-${row.shipToName}-${index}`}>
                  <td>{row.week ?? "-"}</td>
                  <td>{row.shipToName ?? "-"}</td>
                  <td>{row.sku ?? "-"}</td>
                  <td className="qty-cell">
                    {renderValue(row.quantityOrder)}
                  </td>
                  <td className="ng-cell">{renderValue(row["NG Layer 1"])}</td>
                  <td className="ng-cell">{renderValue(row["NG Layer 2"])}</td>
                  <td className="ng-cell">{renderValue(row["NG Layer 3"])}</td>
                  <td className="ng-cell">{renderValue(row["NG Layer 4"])}</td>
                  <td className="ng-cell hole">{renderValue(row["NG Hole"])}</td>
                  <td className="rep-cell">{renderValue(row["Replacement Layer 1"])}</td>
                  <td className="rep-cell">{renderValue(row["Replacement Layer 2"])}</td>
                  <td className="rep-cell">{renderValue(row["Replacement Layer 3"])}</td>
                  <td className="rep-cell">{renderValue(row["Replacement Layer 4"])}</td>
                  <td className="rep-cell hole">{renderValue(row["Replacement Hole"])}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkableBondingReject;