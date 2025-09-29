// src/pages/Workable/WorkableIndex.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Workable/Index.css";

const WorkableIndex = () => {
  const departments = [
    {
      id: "bonding",
      name: "Bonding",
      icon: "📦",
      description: "Data bonding foam products",
      count: 24,
      path: "/workable/bonding",
    },
    {
      id: "packing-foam",
      name: "Packing Foam",
      icon: "📦",
      description: "Data packing foam products",
      count: 30,
      path: "/workable/packing-foam",
    },
    {
      id: "packing-spring",
      name: "Packing Spring",
      icon: "⚙️",
      description: "Data packing spring products",
      count: 22,
      path: "/workable/packing-spring",
    },
  ];

  return (
    <div className="workable-index-container">
      {/* Header */}
      <div className="header-section">
        <div className="header-content">
          <h1>📊 Department Workable</h1>
          <p>Select a department to view workable data for today</p>
          <div className="last-update">
            <span>
              🕒 LAST UPDATE: {new Date().toLocaleTimeString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="departments-grid">
        {departments.map((dept) => (
          <Link key={dept.id} to={dept.path} className="department-card">
            <div className="card-icon">{dept.icon}</div>
            <div className="card-content">
              <h3>{dept.name}</h3>
              <p>{dept.description}</p>
              <div className="card-count">{dept.count} records today</div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkableIndex;
