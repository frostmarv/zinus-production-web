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
import UserManagement from "./pages/UserManagement/UserManagement";
import EditCutting from "./pages/Cutting/EditCutting";
import IndexCutting from "./pages/Cutting/IndexCutting";
import CuttingInput from "./pages/Cutting/InputCutting";
import CuttingHistorySummary from "./pages/History/Cutting/CuttingHistorySummary";
import HistoryBondingIndex from "./pages/History/Bonding/HistoryBondingIndex";
import HistorySummaryBonding from "./pages/History/Bonding/HistorySummaryBonding";
import WorkableBonding from "./pages/Workable/WorkableBonding";
import DetailWorkableBonding from "./pages/Workable/Detail/DetailWorkableBonding";
import WorkableBondingReject from "./pages/Workable/Reject/WorkableBondingReject";
import WorkableLive from "./pages/Workable/WorkableLive";
import MasterDataIndex from "./pages/MasterData/MasterDataIndex";
import MasterFoam from "./pages/MasterData/Foam/MasterFoam";
import MasterSpring from "./pages/MasterData/Spring/MasterSpring";
import MasterCutting from "./pages/MasterData/Cutting/MasterCutting";
import MasterProducts from "./pages/MasterData/Products/MasterProducts";
import JdeIndex from "./pages/JDE/JdeIndex";
import FormIndex from "./pages/Input/FormIndex";
import FormBondingIndex from "./pages/Input/Bonding/FormBondingIndex";
import FormSummaryBonding from "./pages/Input/Bonding/FormSummaryBonding";
import FormRejectBonding from "./pages/Input/Bonding/FormRejectBonding";
import DashboardReplacement from "./pages/Cutting/Replacements/Dashboard";
import ReplacementDetailPage from "./pages/Cutting/Replacements/DetailPage";
import TosPage from "./pages/Public/TermOfService";
import PrivacyPolicyPage from "./pages/Public/PrivacyPolicy";
import {
  ProtectedRoute,
  RoleProtectedRoute,
  PublicRoute,
} from "./components/ProtectedRoute";
import "./styles/App.css";

/* ================================
   📋 Layout Components
================================ */
const Layout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <main>{children}</main>
  </div>
);

const TVLayout = ({ children }) => (
  <div className="w-full h-screen bg-black text-white">{children}</div>
);

/* ================================
   🌍 App Router
================================ */
function App() {
  // Semua route publik yang tidak butuh login
  const PUBLIC_PATHS = ["/login", "/workable-live", "/tos", "/privacy-policy"];

  return (
    <Router>
      <Routes>
        {/* ======================
            🌐 Public Routes
        ======================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/workable-live"
          element={
            <PublicRoute>
              <TVLayout>
                <WorkableLive />
              </TVLayout>
            </PublicRoute>
          }
        />

        <Route
          path="/tos"
          element={
            <PublicRoute>
              <TosPage />
            </PublicRoute>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <PublicRoute>
              <PrivacyPolicyPage />
            </PublicRoute>
          }
        />

        {/* ======================
            🔐 Protected Routes
        ======================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock-opname"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <StockOpname />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/problems"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <ProblematicData />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <HistoryIndex />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history/cutting"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <CuttingHistoryIndex />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history/cutting/balok"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <CuttingHistoryBalok />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/bonding"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <HistoryBondingIndex />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/bonding/summary"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <HistorySummaryBonding />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workable"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <WorkableIndex />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cutting/input-balok"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <BalokCutting />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 👑 Role-based: hanya untuk "Pemilik" */}
        <Route
          path="/users"
          element={
            <RoleProtectedRoute
              allowedRoles={["Pemilik"]}
              publicPaths={PUBLIC_PATHS}
            >
              <Layout>
                <UserManagement />
              </Layout>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/cutting/edit/:id"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <EditCutting />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cutting/index-cutting"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <IndexCutting />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cutting/input-cutting"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <CuttingInput />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history/cutting/summary"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <CuttingHistorySummary />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workable/bonding"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <WorkableBonding />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workable/bonding/detail"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <DetailWorkableBonding />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workable/bonding/reject"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <WorkableBondingReject />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <MasterDataIndex />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master/foam"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <MasterFoam />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master/spring"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <MasterSpring />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master/cutting"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <MasterCutting />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/master/products"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <MasterProducts />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jde"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <JdeIndex />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/form-index"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <FormIndex />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/input/bonding"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <FormBondingIndex />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/input/bonding/summary"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <FormSummaryBonding />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/input/bonding/reject"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <FormRejectBonding />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cutting/replacements"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <DashboardReplacement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cutting/replacements/:id"
          element={
            <ProtectedRoute publicPaths={PUBLIC_PATHS}>
              <Layout>
                <ReplacementDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ======================
            🚫 404 Not Found
        ======================= */}
        <Route
          path="*"
          element={
            <PublicRoute>
              <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
                <h1 className="text-4xl font-bold mb-2 text-gray-800">
                  404 - Halaman Tidak Ditemukan
                </h1>
                <p className="mb-4 text-gray-500">
                  Maaf, halaman yang kamu cari tidak tersedia.
                </p>
                <a
                  href="/"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Kembali ke Dashboard
                </a>
              </div>
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
