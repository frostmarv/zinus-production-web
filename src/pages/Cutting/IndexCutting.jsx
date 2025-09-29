// src/pages/Cutting/IndexCutting.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Untuk navigasi
import "../../styles/Cutting/IndexCutting.css"; // CSS terpisah

const IndexCutting = () => {
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk navigasi ke halaman input
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="index-cutting-container">
      {/* Header */}
      <div className="header-section">
        <div className="header-content">
          <h1>📊 Input Data Cutting</h1>
          <p>Pilih jenis data cutting yang ingin diinput</p>
        </div>
      </div>

      {/* Card Options */}
      <div className="cards-grid">
        {/* Card 1: Balok Cutting */}
        <div
          className="card-item"
          onClick={() => handleNavigate("/cutting/input-balok")}
        >
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Balok Input</h3>
            <p>Data input balok foam</p>
            <div className="card-count">
              {/* Tambahkan jumlah record jika perlu */}0 records today
            </div>
          </div>
          <div className="card-arrow">→</div>
        </div>

        {/* Card 2: Actual Cutting */}
        <div
          className="card-item"
          onClick={() => handleNavigate("/cutting/input-cutting")}
        >
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Input Cutting</h3>
            <p>Data hasil produksi cutting</p>
            <div className="card-count">
              {/* Tambahkan jumlah record jika perlu */}0 records today
            </div>
          </div>
          <div className="card-arrow">→</div>
        </div>
      </div>
    </div>
  );
};

export default IndexCutting;
