// src/pages/Cutting/IndexCutting.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Cutting/IndexCutting.css";

const IndexCutting = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Header */}
      <div className="cutting-header">
        <div className="header-content">
          <h1>📊 Input Data Cutting</h1>
          <p>Pilih jenis data cutting yang ingin diinput</p>
        </div>
      </div>

      {/* Card Options */}
      <div className="cutting-cards-grid">
        {/* Card 1: Balok Cutting */}
        <div
          className="cutting-card-item"
          onClick={() => handleNavigate("/cutting/input-balok")}
          tabIndex={0}
          role="button"
        >
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Balok Input</h3>
            <p>Data input balok foam</p>
            <div className="card-count">0 records today</div>
          </div>
          <div className="card-arrow">→</div>
        </div>

        {/* Card 2: Actual Cutting */}
        <div
          className="cutting-card-item"
          onClick={() => handleNavigate("/cutting/input-cutting")}
          tabIndex={0}
          role="button"
        >
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Input Cutting</h3>
            <p>Data hasil produksi cutting</p>
            <div className="card-count">0 records today</div>
          </div>
          <div className="card-arrow">→</div>
        </div>
      </div>
    </>
  );
};

export default IndexCutting;
