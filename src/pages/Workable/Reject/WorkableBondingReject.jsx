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
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    navigate("/workable/bonding/detail");
  };

  const totalNG = (row) => {
    return (
      (row["NG Layer 1"] || 0) +
      (row["NG Layer 2"] || 0) +
      (row["NG Layer 3"] || 0) +
      (row["NG Layer 4"] || 0) +
      (row["NG Hole"] || 0)
    );
  };

  const totalReplacement = (row) => {
    return (
      (row["Replacement Layer 1"] || 0) +
      (row["Replacement Layer 2"] || 0) +
      (row["Replacement Layer 3"] || 0) +
      (row["Replacement Layer 4"] || 0) +
      (row["Replacement Hole"] || 0)
    );
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
                  <td>{row.week || "-"}</td>
                  <td>{row.shipToName || "-"}</td>
                  <td>{row.sku || "-"}</td> {/* 🔽 HAPUS className="sku-cell" */}
                  <td className="qty-cell">
                    {row.quantityOrder?.toLocaleString() || 0}
                  </td>
                  <td className="ng-cell">{row["NG Layer 1"] || 0}</td>
                  <td className="ng-cell">{row["NG Layer 2"] || 0}</td>
                  <td className="ng-cell">{row["NG Layer 3"] || 0}</td>
                  <td className="ng-cell">{row["NG Layer 4"] || 0}</td>
                  <td className="ng-cell hole">{row["NG Hole"] || 0}</td>
                  <td className="rep-cell">
                    {row["Replacement Layer 1"] || 0}
                  </td>
                  <td className="rep-cell">
                    {row["Replacement Layer 2"] || 0}
                  </td>
                  <td className="rep-cell">
                    {row["Replacement Layer 3"] || 0}
                  </td>
                  <td className="rep-cell">
                    {row["Replacement Layer 4"] || 0}
                  </td>
                  <td className="rep-cell hole">
                    {row["Replacement Hole"] || 0}
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

export default WorkableBondingReject;