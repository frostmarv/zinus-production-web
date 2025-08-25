// src/pages/History.jsx
import React from "react";
import "../styles/History.css";

const History = () => {
  return (
    <div className="history-container">
      <h1>📋 History Data</h1>
      <p>Log semua aktivitas sinkronisasi ke JDE</p>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Item</th>
              <th>Qty Fisik</th>
              <th>Status</th>
              <th>JDE ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10:30</td>
              <td>PROD-001</td>
              <td>148</td>
              <td className="status-success">Success</td>
              <td>ADJ-2024-001</td>
            </tr>
            <tr>
              <td>09:45</td>
              <td>PROD-002</td>
              <td>90</td>
              <td className="status-success">Success</td>
              <td>ADJ-2024-002</td>
            </tr>
            <tr>
              <td>09:15</td>
              <td>PROD-999</td>
              <td>50</td>
              <td className="status-fixed">Fixed & Synced</td>
              <td>ADJ-2024-003</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
