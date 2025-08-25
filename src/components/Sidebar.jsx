// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Users, Database, History, AlertCircle } from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: BarChart3 },
    { name: "Data Error", path: "/problems", icon: AlertCircle },
    { name: "History", path: "/history", icon: History },
    { name: "MasterData", path: "/master-data", icon: Database },
    { name: "UserManagement", path: "/users", icon: Users },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">G</div>
        <div className="logo-text">Zinus</div>
      </div>

      {/* Menu Items */}
      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link // ✅ Ganti jadi Link
              to={item.path}
              className="menu-item"
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
