// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { getProfile } from "../api/userService";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    productionIndex: [
      { id: 1, department: "QUILTING", index: 36200, value: 2.2, progress: 25 },
      { id: 2, department: "SEWING", index: 36200, value: 3.1, progress: 27 },
      { id: 3, department: "CUTTING", index: 36200, value: 4.1, progress: 30 },
      {
        id: 4,
        department: "SPRING CORE",
        index: 36200,
        value: 4.9,
        progress: 34,
      },
      { id: 5, department: "BONDING", index: 36200, value: 2.1, progress: 29 },
      {
        id: 6,
        department: "PACKING FOAM",
        index: 36200,
        value: 2.1,
        progress: 29,
      },
      {
        id: 7,
        department: "PACKING SPRING",
        index: 36200,
        value: 4.9,
        progress: 34,
      },
    ],
    workableIndex: [
      { id: 1, item: "WORKABLE BONDING", quantity: 46000, progress: 46 },
      { id: 2, item: "WORKABLE FOAM", quantity: 46000, progress: 46 },
      { id: 3, item: "WORKABLE SPRING", quantity: 46000, progress: 46 },
    ],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getProfile();
        setCurrentUser(userData);
      } catch (err) {
        console.error("Gagal memuat profil pengguna:", err);
        setErrorUser("Gagal memuat data pengguna.");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="dashboard-root">
      {/* Header Utama */}
      <div className="dashboard-header">
        <h1>Dashboard Zinus Production</h1>
        <p>"Zinus Dream Indonesia Production Monitoring"</p>
      </div>

      {/* Papan Nama Gantung Bergoyang */}
      <div className="welcome-sign-wrapper">
        <div className="welcome-sign">
          <div className="welcome-text">
            <span>Welcome back!</span>
            {loadingUser ? (
              <h3>Loading...</h3>
            ) : errorUser ? (
              <h3 className="error-text">{errorUser}</h3>
            ) : currentUser ? (
              <h3>{currentUser.nama} 👋</h3>
            ) : (
              <h3>User 👋</h3>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content">
        <div className="card production-index-card">
          <div className="card-header">Production Index By Departments</div>
          <div className="card-body">
            {dashboardData.productionIndex.map((item) => (
              <div key={item.id} className="row">
                <div className="col col-1">{item.id}</div>
                <div className="col col-2">{item.department}</div>
                <div className="col col-3">{item.index.toLocaleString()}</div>
                <div className="col col-4">{item.value.toFixed(3)}</div>
                <div className="col col-5">
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor:
                          item.progress >= 30 ? "#4ade80" : "#fca5a5",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="col col-6">{item.progress}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card workable-index-card">
          <div className="card-header">Workable Index</div>
          <div className="card-body">
            {dashboardData.workableIndex.map((item) => (
              <div key={item.id} className="row">
                <div className="col col-1">{item.id}</div>
                <div className="col col-2">{item.item}</div>
                <div className="col col-3">
                  {item.quantity.toLocaleString()}
                </div>
                <div className="col col-4">
                  <div className="progress-container">
                    <div
                      className="progress-bar green"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                    <div
                      className="progress-bar red"
                      style={{ width: `${100 - item.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="col col-5">{item.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
