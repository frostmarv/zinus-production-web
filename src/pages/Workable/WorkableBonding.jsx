// src/components/Workable/WorkableBonding.jsx
import React, { useState, useEffect } from "react";
import { getWorkableBonding } from "../../api/workable-bonding"; // ✅ Import API call
import "../../styles/Workable/WorkableBonding.css";

const WorkableBonding = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWorkableBonding(); // ✅ Pakai API call
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusClass = (status) => {
    const lower = (status || "").toLowerCase();
    if (lower === "workable") return "status-workable";
    if (lower === "running") return "status-running";
    return "";
  };

  if (loading) return <div className="workable-loading">Loading...</div>;
  if (error) return <div className="workable-error">Error: {error}</div>;

  return (
    <div className="workable-container">
      <div className="workable-header">
        <h1>Workable Bonding (Ringkasan)</h1>
      </div>

      <div className="table-wrapper">
        <table className="workable-table">
          <thead>
            <tr>
              <th>WEEK</th>
              <th>SHIP TO NAME</th>
              <th>SKU</th>
              <th>QUANTITY ORDER</th>
              <th>PROGRESS</th>
              <th>REMAIN</th>
              <th>REMARKS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  Tidak ada data workable bonding.
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
                  <td className="progress-cell">
                    {row.progress?.toLocaleString() || 0}
                  </td>
                  <td
                    className={`remain-cell ${row.remain < 0 ? "negative" : ""}`}
                  >
                    {row.remain?.toLocaleString() || 0}
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

export default WorkableBonding;
