import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { workableLiveClient } from "../../api/workableLive";

// Import logo
import zinusLogo from "@assets/logo.png";
import hyundaiLogo from "@assets/hyundai_putih.png";

// Import CSS
import "../../styles/Workable/WorkableLive.css";

const WorkableLive = () => {
  // =========================
  // 🧱 State Management
  // =========================
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Ref untuk deteksi apakah sedang polling (bukan load pertama)
  const isInitialLoad = useRef(true);

  // =========================
  // 📊 Table Column Definitions
  // =========================
  const bondingColumns = [
    { key: "week", label: "WEEK" },
    { key: "shipToName", label: "SHIP TO NAME" },
    { key: "sku", label: "SKU" },
    { key: "quantityOrder", label: "QTY ORDER" },
    { key: "workable", label: "WORKABLE" },
    { key: "bonding", label: "BONDING" },
    { key: "Remain Produksi", label: "REMAIN PRODUKSI" },
    { key: "remarks", label: "REMARKS" },
    {
      key: "status",
      label: "STATUS",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const detailColumns = [
    { key: "week", label: "WEEK" },
    { key: "shipToName", label: "SHIP TO NAME" },
    { key: "sku", label: "SKU" },
    { key: "quantityOrder", label: "QTY ORDER" },
    { key: "workable", label: "WORKABLE" },
    { key: "bonding", label: "BONDING" },
    { key: "Layer 1", label: "L1" },
    { key: "Layer 2", label: "L2" },
    { key: "Layer 3", label: "L3" },
    { key: "Layer 4", label: "L4" },
    { key: "Hole", label: "HOLE" },
    { key: "remarks", label: "REMARKS" },
    {
      key: "status",
      label: "STATUS",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  // =========================
  // 🔄 Fetch API Data
  // =========================
  const fetchData = useCallback(async () => {
    try {
      const result = await workableLiveClient.getLiveData();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, []);

  // =========================
  // 🔌 WebSocket Setup
  // =========================
  useEffect(() => {
    const handleWebSocketData = (newData) => {
      setData(newData);
      setIsWebSocketConnected(true);
    };

    workableLiveClient.connectWebSocket(handleWebSocketData);

    return () => {
      workableLiveClient.disconnectWebSocket();
    };
  }, []);

  // =========================
  // 📦 Fetch Data on Mount
  // =========================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 🔁 Fallback Polling (5s)
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWebSocketConnected) {
        fetchData();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchData, isWebSocketConnected]);

  // =========================
  // ⏱️ Update Waktu Real-time
  // =========================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // =========================
  // 🧭 All Slides Definition
  // =========================
  const allSlides = useMemo(() => {
    if (!data) return [];
    const { bonding } = data;
    return [
      {
        title: "Workable Bonding",
        rows: bonding.bonding,
        columns: bondingColumns,
        type: "bonding",
      },
      {
        title: "Workable Bonding Detail",
        rows: bonding.detail,
        columns: detailColumns,
        type: "detail",
      },
    ];
  }, [data]);

  // =========================
  // ⏱️ Auto Slide Every 15s
  // =========================
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (allSlides.length > 0) {
        setCurrentSlideIndex((prev) => (prev + 1) % allSlides.length);
      }
    }, 15000);
    return () => clearInterval(slideInterval);
  }, [allSlides.length]);

  // =========================
  // 🧩 Loading / Error States
  // =========================
  if (loading) {
    return <div className="loading">Memuat Data Live...</div>;
  }
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (!data || allSlides.length === 0) {
    return <div className="loading">Tidak Ada Data</div>;
  }

  const currentSlide = allSlides[currentSlideIndex];

  // =========================
  // 🏷️ Status Badge Component
  // =========================
  function StatusBadge({ status }) {
    let className = "status-badge";
    if (status === "Completed") className += " completed";
    else if (status === "Running") className += " running";
    else if (status === "Not Started") className += " not-started";
    return <span className={className}>{status}</span>;
  }

  // =========================
  // 📋 Table Component
  // =========================
  function DataTable({
    title,
    rows,
    columns,
    emptyMessage = "Tidak ada data",
  }) {
    return (
      <div className="table-container">
        <div className="slide-header">{title}</div>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // =========================
  // 🖥️ Render Layout — TANPA TOPBAR, JAM DI FOOTER
  // =========================
  return (
    <div className="workable-live-container">
      {/* Main Content */}
      <div className="main-content">
        <div className="content-main">
          <DataTable
            title={currentSlide.title}
            rows={currentSlide.rows}
            columns={currentSlide.columns}
          />
          <div className="slide-indicators">
            {allSlides.map((_, idx) => (
              <div
                key={idx}
                className={`slide-indicator ${currentSlideIndex === idx ? "active" : ""}`}
                onClick={() => setCurrentSlideIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bar — DIPERBARUI: Tanggal & Jam di Kiri */}
      <div className="footer">
        {/* Kiri: Tanggal & Jam */}
        <div className="footer-timestamp">
          <div className="date">
            {currentTime.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="time">
            {currentTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: "Asia/Jakarta",
            })}{" "}
            WIB
          </div>
        </div>

        {/* Tengah: Zinus */}
        <div className="footer-group">
          <div className="zinus-footer-center">
            <img src={zinusLogo} alt="Zinus Logo" />
            <span>Zinus Dream Indonesia</span>
          </div>
          <img
            src={hyundaiLogo}
            alt="Hyundai Logo"
            className="hyundai-footer"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkableLive;
