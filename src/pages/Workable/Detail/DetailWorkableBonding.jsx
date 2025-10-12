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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getWorkableBondingDetail();

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
        <div className="detail-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/workable/bonding")}
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <h1>Detail Workable Bonding</h1>
          <div className="header-actions">
            <Link to="/workable/bonding/reject" className="btn-view-ng">
              <AlertTriangle size={16} />
              Lihat Data NG
            </Link>
          </div>
        </div>
        <div className="detail-loading">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <div className="detail-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/workable/bonding")}
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <h1>Detail Workable Bonding</h1>
          <div className="header-actions">
            <Link to="/workable/bonding/reject" className="btn-view-ng">
              <AlertTriangle size={16} />
              Lihat Data NG
            </Link>
          </div>
        </div>
        <div className="detail-error">Gagal memuat data: {error}</div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/workable/bonding")}
        >
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1>Detail Workable Bonding</h1>
        <div className="header-actions">
          <Link to="/workable/bonding/reject" className="btn-view-ng">
            <AlertTriangle size={16} />
            Lihat Data NG
          </Link>
        </div>
      </div>

      <div className="detail-table-wrapper">
        <div className="table-scroll-container">
          <table className="detail-table">
            <thead>
              <tr>
                <th>CUSTOMER PO</th>
                <th>WEEK</th>
                <th>SHIP TO NAME</th>
                <th>SKU</th>
                <th>QUANTITY ORDER</th>
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
                  <td colSpan="15" className="no-data">
                    Tidak ada data detail.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={`${row.customerPO}-${row.sku}-${row.week}`}>
                    <td>{row.customerPO || "-"}</td>
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
                    <td>
                      {renderLayerCell(row["Layer 1"], row.quantityOrder)}
                    </td>
                    <td>
                      {renderLayerCell(row["Layer 2"], row.quantityOrder)}
                    </td>
                    <td>
                      {renderLayerCell(row["Layer 3"], row.quantityOrder)}
                    </td>
                    <td>
                      {renderLayerCell(row["Layer 4"], row.quantityOrder)}
                    </td>
                    <td>{renderLayerCell(row["Hole"], row.quantityOrder)}</td>
                    <td className="remain-cell">
                      {row.remain != null ? row.remain.toLocaleString() : 0}
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
    </div>
  );
};

export default DetailWorkableBonding;
