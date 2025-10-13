// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import StockOpname from "./pages/StockOpname";
import ProblematicData from "./pages/ProblematicData";
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
import WorkableBondingReject from "./pages/Workable/Reject/WorkableBondingReject";
import MasterDataIndex from "./pages/MasterData/MasterDataIndex";
import MasterFoam from "./pages/MasterData/Foam/MasterFoam";
import MasterSpring from "./pages/MasterData/Spring/MasterSpring";
import MasterCutting from "./pages/MasterData/Cutting/MasterCutting";
import JdeIndex from "./pages/JDE/JdeIndex";
import FormIndex from "./pages/Input/FormIndex";
import DashboardReplacement from "./pages/Cutting/Replacements/Dashboard";
import ReplacementDetailPage from "./pages/Cutting/Replacements/DetailPage";
import { isAuthenticated } from "./api/authService";
import "./styles/App.css";

// HOC: Hanya untuk pengguna yang SUDAH login
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// HOC: Hanya untuk pengguna yang BELUM login (misal: halaman login)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Layout dengan Sidebar (untuk halaman terproteksi)
const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publik: TANPA sidebar, hanya untuk yang belum login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Semua route lain: DILINDUNGI + pakai layout dengan Sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-opname"
          element={
            <ProtectedRoute>
              <Layout>
                <StockOpname />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Layout>
                <ProblematicData />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <HistoryIndex />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/cutting"
          element={
            <ProtectedRoute>
              <Layout>
                <CuttingHistoryIndex />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/cutting/balok"
          element={
            <ProtectedRoute>
              <Layout>
                <CuttingHistoryBalok />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workable"
          element={
            <ProtectedRoute>
              <Layout>
                <WorkableIndex />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cutting/input-balok"
          element={
            <ProtectedRoute>
              <Layout>
                <BalokCutting />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cutting/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditCutting />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cutting/index-cutting"
          element={
            <ProtectedRoute>
              <Layout>
                <IndexCutting />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cutting/input-cutting"
          element={
            <ProtectedRoute>
              <Layout>
                <CuttingInput />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/cutting/summary"
          element={
            <ProtectedRoute>
              <Layout>
                <CuttingHistorySummary />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workable/bonding"
          element={
            <ProtectedRoute>
              <Layout>
                <WorkableBonding />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workable/bonding/detail"
          element={
            <ProtectedRoute>
              <Layout>
                <DetailWorkableBonding />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workable/bonding/reject"
          element={
            <ProtectedRoute>
              <Layout>
                <WorkableBondingReject />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/master"
          element={
            <ProtectedRoute>
              <Layout>
                <MasterDataIndex />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/foam"
          element={
            <ProtectedRoute>
              <Layout>
                <MasterFoam />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/spring"
          element={
            <ProtectedRoute>
              <Layout>
                <MasterSpring />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/cutting"
          element={
            <ProtectedRoute>
              <Layout>
                <MasterCutting />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jde"
          element={
            <ProtectedRoute>
              <Layout>
                <JdeIndex />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-index"
          element={
            <ProtectedRoute>
              <Layout>
                <FormIndex />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cutting/replacements"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardReplacement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cutting/replacements/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ReplacementDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect semua route tidak dikenal */}
        <Route
          path="*"
          element={
            isAuthenticated() ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
