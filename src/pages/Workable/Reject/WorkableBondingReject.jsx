// src/pages/Workable/Reject/WorkableBondingReject.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  BarChart3,
  AlertTriangle,
  Eye,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { getWorkableBondingReject } from "../../../api/workable-bonding";
import "../../../styles/Workable/Reject/WorkableBondingReject.css";

const WorkableBondingReject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getWorkableBondingReject();
        const sortedData = [...result].sort((a, b) => {
          const nameCompare = String(a.shipToName ?? "").localeCompare(
            String(b.shipToName ?? ""),
            undefined,
            { sensitivity: "base" },
          );
          if (nameCompare !== 0) return nameCompare;
          return String(a.sku ?? "").localeCompare(
            String(b.sku ?? ""),
            undefined,
            { sensitivity: "base" },
          );
        });
        setData(sortedData);
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
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <AlertTriangle size={32} />
          </div>
          <div className="header-text">
            <h1 className="header-title">Workable Bonding - Reject</h1>
            <p className="header-subtitle">
              Data NG (Not Good) dan replacement per layer
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={handleBack} className="btn-back">
            <ArrowLeft size={16} />
            Kembali
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>{data.length}</h3>
            <p>Total Item</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{data.reduce((sum, row) => sum + totalNG(row), 0)}</h3>
            <p>Total NG</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <RotateCcw size={24} />
          </div>
          <div className="stat-content">
            <h3>{data.reduce((sum, row) => sum + totalReplacement(row), 0)}</h3>
            <p>Total Replacement</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>
              {data.reduce((sum, row) => sum + (row.quantityOrder || 0), 0)}
            </h3>
            <p>Total Order</p>
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="table-wrapper">
        <div className="table-scroll-container">
          <table className="workable-reject-table">
            <thead>
              <tr>
                <th>WEEK</th>
                <th>SHIP TO NAME</th>
                <th>SKU</th>
                <th>QUANTITY ORDER</th>
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
                    <div className="loading-spinner"></div>
                    <p>Memuat data...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="14" className="no-data">
                    <AlertTriangle size={24} />
                    <p>Gagal memuat: {error}</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="14" className="no-data">
                    <Package size={48} />
                    <p>Tidak ada data reject</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={`${row.sku}-${row.week}-${row.shipToName}`}>
                    <td>{row.week || "-"}</td>
                    <td>{row.shipToName || "-"}</td>
                    <td className="sku-cell">
                      <span>{row.sku || "-"}</span>
                    </td>
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
    </div>
  );
};

export default WorkableBondingReject;
