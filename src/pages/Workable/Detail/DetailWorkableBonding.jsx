// src/components/Workable/Detail/DetailWorkableBonding.jsx
import React, { useState, useEffect } from "react";
import { getWorkableBondingDetail } from "../../../api/workable-bonding"; // ✅ Import API call
import "../../../styles/Workable/Detail/DetailWorkableBonding.css";

const DetailWorkableBonding = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWorkableBondingDetail(); // ✅ Pakai API call
        
        // Sort berdasarkan Ship To Name (Customer) kemudian SKU
        const sortedData = [...result].sort((a, b) => {
          const nameCompare = String(a.shipToName ?? '').localeCompare(
            String(b.shipToName ?? ''), 
            undefined, 
            { sensitivity: 'base' }
          );
          
          if (nameCompare !== 0) return nameCompare;
          
          return String(a.sku ?? '').localeCompare(
            String(b.sku ?? ''), 
            undefined, 
            { sensitivity: 'base' }
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
    if (value == null || value === "") return "-";
    const numValue = Number(value);
    const isComplete = numValue >= (Number(orderQty) || 0);
    return (
      <span className={isComplete ? "layer-complete" : "layer-incomplete"}>
        {numValue.toLocaleString()}
      </span>
    );
  };

  if (loading) return <div className="detail-loading">Loading detail...</div>;
  if (error) return <div className="detail-error">Error: {error}</div>;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detail Workable Bonding</h1>
      </div>

      <div className="detail-table-wrapper">
        <table className="detail-table">
          <thead>
            <tr>
              <th>WEEK</th>
              <th>SHIP TO NAME</th>
              <th>SKU</th>
              <th>QUANTITY ORDER</th>
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
                <td colSpan="12" className="no-data">
                  Tidak ada data detail.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>{row.week}</td>
                  <td>{row.shipToName}</td>
                  <td className="sku-cell">{row.sku}</td>
                  <td className="qty-cell">
                    {row.quantityOrder?.toLocaleString() || 0}
                  </td>
                  <td>{renderLayerCell(row["Layer 1"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Layer 2"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Layer 3"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Layer 4"], row.quantityOrder)}</td>
                  <td>{renderLayerCell(row["Hole"], row.quantityOrder)}</td>
                  <td className="remain-cell">
                    {row.remain?.toLocaleString() || 0}
                  </td>
                  <td className="remarks-cell">{row.remarks || "-"}</td>
                  <td>
                    <span
                      className={`status-badge status-${row.status?.toLowerCase() || "n-a"}`}
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
