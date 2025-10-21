// src/pages/JDE/JdeIndex.jsx
import React from "react";
import { Database, Clock, Calendar, Users } from "lucide-react";
import "../../styles/JDE/JdeIndex.css";

const JdeIndex = () => {
  return (
    <div className="jde-index-container">
      <div className="coming-soon-content">
        <div className="icon-container">
          <Database size={64} />
        </div>
        <h1 className="coming-soon-title">JDE Integration</h1>
        <p className="coming-soon-subtitle">
          Sistem integrasi dengan JDE sedang dalam pengembangan
        </p>
        <div className="features-preview">
          <div className="feature-item">
            <Clock size={20} />
            <span>Sinkronisasi data real-time</span>
          </div>
          <div className="feature-item">
            <Calendar size={20} />
            <span>Histori produksi otomatis</span>
          </div>
          <div className="feature-item">
            <Users size={20} />
            <span>Manajemen user terintegrasi</span>
          </div>
        </div>
        <div className="footer-note">
          <p>Diperkirakan rilis: Q3 2025</p>
        </div>
      </div>
    </div>
  );
};

export default JdeIndex;