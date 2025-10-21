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
import k3Logo from "@assets/k3_logo.webp"; // ✅ Tambahkan import logo K3

// Import CSS
import "../../styles/Workable/WorkableLive.css";

const WorkableLive = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isInitialLoad = useRef(true);

  // Kolom tetap sama (tidak diubah)
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
      console.error("Gagal mengambil ", err);
      setError("Gagal memuat data dari server");
      setData(null); // pastikan data null saat error
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, []);

  // WebSocket, polling, waktu, dll — tetap sama
  useEffect(() => {
    const handleWebSocketData = (newData) => {
      setData(newData);
      setIsWebSocketConnected(true);
      setError(null);
    };
    workableLiveClient.connectWebSocket(handleWebSocketData);
    return () => workableLiveClient.disconnectWebSocket();
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWebSocketConnected) fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchData, isWebSocketConnected]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // =========================
  // 🧭 Slides — fallback ke array kosong jika data null/error
  // =========================
  const allSlides = useMemo(() => {
    if (!data) {
      return [
        {
          title: "Workable Bonding",
          rows: [],
          columns: bondingColumns,
          type: "bonding",
        },
        {
          title: "Workable Bonding Detail",
          rows: [],
          columns: detailColumns,
          type: "detail",
        },
      ];
    }

    const { bonding } = data;
    return [
      {
        title: "Workable Bonding",
        rows: bonding?.bonding || [],
        columns: bondingColumns,
        type: "bonding",
      },
      {
        title: "Workable Bonding Detail",
        rows: bonding?.detail || [],
        columns: detailColumns,
        type: "detail",
      },
    ];
  }, [data]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (allSlides.length > 0) {
        setCurrentSlideIndex((prev) => (prev + 1) % allSlides.length);
      }
    }, 15000);
    return () => clearInterval(slideInterval);
  }, [allSlides.length]);

  // =========================
  // 🏷️ Status Badge
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
  function DataTable({ title, rows, columns }) {
    let message = "";
    if (loading) {
      message = "Memuat data...";
    } else if (error) {
      message = error;
    } else if (rows.length === 0) {
      message = "Tidak ada data";
    }

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
                        : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: "16px" }}>
                  {message}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // =========================
  // 🖥️ Render — SELALU tampilkan layout penuh
  // =========================
  const currentSlide = allSlides[currentSlideIndex];

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

      {/* 🔴 Iklan Berjalan — DENGAN LOGO K3 DI AWAL & AKHIR */}
      <div className="running-ad">
        <span>
          <img src={k3Logo} alt="K3 Logo" className="k3-logo-inline" />
          &nbsp;"Utamakan K3, Demi Keluarga Menanti Di Rumah *** 
          Keselamatan dan Kesehatan Kerja adalah Tanggung Jawab Kita Bersama!"&nbsp;
          <img src={k3Logo} alt="K3 Logo" className="k3-logo-inline" />
        </span>
      </div>

      {/* Footer */}
      <div className="footer">
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