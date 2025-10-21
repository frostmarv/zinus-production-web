import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { workableLiveClient } from "../../api/workableLive";

// 🖼️ Import assets
import zinusLogo from "@assets/logo.png";
import hyundaiLogo from "@assets/hyundai_putih.png";
import k3Logo from "@assets/k3_logo.webp";

// 🎨 Import CSS
import "../../styles/Workable/WorkableLive.css";

// 🟩 Status Badge — dipindahkan ke luar!
const StatusBadge = React.memo(({ status }) => {
  let className = "status-badge";
  if (status === "Completed") className += " completed";
  else if (status === "Running") className += " running";
  else if (status === "Not Started") className += " not-started";
  return <span className={className}>{status}</span>;
});

// 📊 Tabel Data — dipindahkan ke luar dan di-memo
const DataTable = React.memo(({ title, rows, columns, loading, error }) => {
  let message = "";
  if (loading) message = "Memuat data...";
  else if (error) message = error;
  else if (rows.length === 0) message = "Tidak ada data";

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
              <td
                colSpan={columns.length}
                style={{ textAlign: "center", padding: "16px" }}
              >
                {message}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

// 🔴 Running Ad — sudah benar, tetap pakai React.memo
const RunningAd = React.memo(({ text, logo }) => {
  return (
    <div className="running-ad">
      <div className="running-ad-track">
        <div className="running-ad-content">
          <img src={logo} alt="K3 Logo" className="k3-logo-inline" />
          <span>{text}</span>
          <img src={logo} alt="K3 Logo" className="k3-logo-inline" />
        </div>
        <div className="running-ad-content">
          <img src={logo} alt="K3 Logo" className="k3-logo-inline" />
          <span>{text}</span>
          <img src={logo} alt="K3 Logo" className="k3-logo-inline" />
        </div>
      </div>
    </div>
  );
});

// 🔧 Kolom tetap di dalam karena menggunakan <StatusBadge />, tapi aman karena StatusBadge stabil
const getBondingColumns = () => [
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

const getDetailColumns = () => [
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

// 📺 Komponen Utama
const WorkableLive = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🧩 Fetch data
  const fetchData = useCallback(async () => {
    try {
      const result = await workableLiveClient.getLiveData();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Gagal memuat data dari server");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔌 WebSocket listener
  useEffect(() => {
    const handleWebSocketData = (newData) => {
      setData(newData);
      setIsWebSocketConnected(true);
      setError(null);
    };
    workableLiveClient.connectWebSocket(handleWebSocketData);
    return () => workableLiveClient.disconnectWebSocket();
  }, []);

  // 🔁 Auto-refresh data jika websocket mati
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (!isWebSocketConnected) fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchData, isWebSocketConnected]);

  // ⏰ Waktu berjalan
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🧮 Slide management
  const allSlides = useMemo(() => {
    const bondingColumns = getBondingColumns();
    const detailColumns = getDetailColumns();

    if (!data) {
      return [
        { title: "Workable Bonding", rows: [], columns: bondingColumns },
        { title: "Workable Bonding Detail", rows: [], columns: detailColumns },
      ];
    }

    const { bonding } = data;
    return [
      {
        title: "Workable Bonding",
        rows: bonding?.bonding || [],
        columns: bondingColumns,
      },
      {
        title: "Workable Bonding Detail",
        rows: bonding?.detail || [],
        columns: detailColumns,
      },
    ];
  }, [data]);

  // ⏳ Ganti slide otomatis
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % allSlides.length);
    }, 15000);
    return () => clearInterval(slideInterval);
  }, [allSlides.length]);

  const currentSlide = allSlides[currentSlideIndex];

  return (
    <div className="workable-live-container">
      <div className="main-content">
        <div className="content-main">
          <DataTable
            title={currentSlide.title}
            rows={currentSlide.rows}
            columns={currentSlide.columns}
            loading={loading}
            error={error}
          />
          <div className="slide-indicators">
            {allSlides.map((_, idx) => (
              <div
                key={idx}
                className={`slide-indicator ${
                  currentSlideIndex === idx ? "active" : ""
                }`}
                onClick={() => setCurrentSlideIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🔴 Running Text K3 */}
      <RunningAd
        text="Utamakan K3, Demi Keluarga Menanti di Rumah — Keselamatan dan Kesehatan Kerja adalah Tanggung Jawab Kita Bersama!"
        logo={k3Logo}
      />

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
          <img src={hyundaiLogo} alt="Hyundai Logo" className="hyundai-footer" />
        </div>
      </div>
    </div>
  );
};

export default WorkableLive;