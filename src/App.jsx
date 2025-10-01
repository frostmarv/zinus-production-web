// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StockOpname from "./pages/StockOpname";
import ProblematicData from "./pages/ProblematicData";
import History from "./pages/JDE/History";
import WorkableIndex from "./pages/Workable/WorkableIndex";
import BalokCutting from "./pages/Cutting/BalokCutting";
import HistoryIndex from "./pages/History/HistoryIndex";
import CuttingHistoryIndex from "./pages/History/Cutting/CuttingHistoryIndex";
import CuttingHistoryBalok from "./pages/History/Cutting/CuttingHistoryBalok";
import UserManagement from "./pages/UserManagement";
import EditCutting from "./pages/Cutting/EditCutting";
import IndexCutting from "./pages/Cutting/IndexCutting";
import CuttingInput from "./pages/Cutting/InputCutting";
import CuttingHistorySummary from "./pages/History/Cutting/CuttingHistorySummary";
import WorkableBonding from "./pages/Workable/WorkableBonding";
import DetailWorkableBonding from "./pages/Workable/Detail/DetailWorkableBonding";
import MasterDataIndex from "./pages/MasterData/MasterDataIndex";
import MasterFoam from "./pages/MasterData/Planning/MasterFoam";
import MasterSpring from "./pages/MasterData/Planning/MasterSpring";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="app-sidebar">
          <Sidebar />
        </div>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock-opname" element={<StockOpname />} />
            <Route path="/problems" element={<ProblematicData />} />
            <Route path="/jde/history" element={<History />} />
            <Route path="/history" element={<HistoryIndex />} />
            <Route path="/history/cutting" element={<CuttingHistoryIndex />} />
            <Route
              path="/history/cutting/balok"
              element={<CuttingHistoryBalok />}
            />
            <Route path="/workable" element={<WorkableIndex />} />
            <Route path="/cutting/input-balok" element={<BalokCutting />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/cutting/edit/:id" element={<EditCutting />} />
            <Route path="/cutting/index-cutting" element={<IndexCutting />} />
            <Route path="/cutting/input-cutting" element={<CuttingInput />} />
            <Route
              path="/history/cutting/summary"
              element={<CuttingHistorySummary />}
            />
            <Route path="/workable/bonding" element={<WorkableBonding />} />
            <Route
              path="/workable/bonding/detail"
              element={<DetailWorkableBonding />}
            />
            <Route path="/master" element={<MasterDataIndex />} />
            <Route path="/master/foam" element={<MasterFoam />} />
            <Route path="/master/spring" element={<MasterSpring />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
