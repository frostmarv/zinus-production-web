// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  History,
  CheckCircle,
  Database as DatabaseIcon,
  FileText,
  LogOut,
} from "lucide-react";
import "../styles/Sidebar.css";
import logo from "@assets/logo.png";
import { logout } from "../api/authService"; // Sesuaikan path jika perlu

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: BarChart3 },
    { name: "Master Data", path: "/master", icon: Package },
    { name: "History Production", path: "/history", icon: History },
    { name: "Workable Data", path: "/workable", icon: CheckCircle },
    { name: "JDE", path: "/jde", icon: DatabaseIcon },
    { name: "Form Input", path: "/form-index", icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    // Opsional: redirect ke login
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Zinus Logo" className="logo-img" />
        <div className="logo-text">Zinus Production</div>
      </div>

      <ul className="menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Tombol Logout */}
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>

      {/* Footer copyright */}
      <div className="sidebar-footer">
        <small>© 2025 Nurmalik Wijaya. All rights reserved.</small>
      </div>
    </div>
  );
};

export default Sidebar;
