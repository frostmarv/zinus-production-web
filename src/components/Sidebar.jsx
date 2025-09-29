// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  Database,
  History,
  AlertCircle,
  CheckCircle,
  Scissors,
  FileText,
} from "lucide-react";
import "../styles/Sidebar.css";
import logo from "@assets/logo.png";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: BarChart3 },
    { name: "History Production", path: "/history", icon: History },
    { name: "Workable Data", path: "/workable", icon: CheckCircle },
    { name: "Input Cutting", path: "/cutting/index-cutting", icon: FileText },
    { name: "JDE", path: "/jde/history", icon: Database },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Zinus Logo" className="logo-img" />
        <div className="logo-text">Zinus</div>
      </div>

      {/* Menu Items */}
      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path} className="menu-item">
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
