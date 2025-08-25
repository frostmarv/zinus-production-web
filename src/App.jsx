// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StockOpname from "./pages/StockOpname";
import ProblematicData from "./pages/ProblematicData";
import History from "./pages/History";
import MasterData from "./pages/MasterData";
// import UserManagement from "./pages/UserManagement";
import "./styles/App.css"; // 👈 Import CSS

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <div className="app-sidebar">
          <Sidebar />
        </div>

        {/* Content */}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock-opname" element={<StockOpname />} />
            <Route path="/problems" element={<ProblematicData />} />
            <Route path="/history" element={<History />} />
            <Route path="/master-data" element={<MasterData />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
