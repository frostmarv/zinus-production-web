// src/pages/StockOpname.jsx
import React, { useState } from "react";
import "../styles/StockOpname.css";

const StockOpname = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      code: "PROD-001",
      name: "Bearing 10x20mm",
      jde: 150,
      physical: "",
      diff: 0,
      location: "Jakarta_Central",
    },
    {
      id: 2,
      code: "PROD-002",
      name: "Seal Rubber",
      jde: 89,
      physical: "",
      diff: 0,
      location: "Jakarta_Central",
    },
    {
      id: 3,
      code: "PROD-003",
      name: "Bolt M8x20",
      jde: 200,
      physical: "",
      diff: 0,
      location: "Jakarta_Central",
    },
  ]);

  const [selectedLocation, setSelectedLocation] = useState("Jakarta_Central");

  const handlePhysicalChange = (id, value) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const physical = parseInt(value) || 0;
        return { ...item, physical, diff: physical - item.jde };
      }
      return item;
    });
    setItems(updated);
  };

  const handleSubmit = () => {
    const totalItems = items.length;
    const itemsWithInput = items.filter((item) => item.physical !== "").length;
    const totalDiff = items.reduce((sum, item) => sum + item.diff, 0);

    if (itemsWithInput === 0) {
      alert("⚠️ Belum ada data yang diinput!");
      return;
    }

    alert(
      `✅ Data berhasil dikirim ke JDE!\n\n` +
        `• Item diinput: ${itemsWithInput}/${totalItems}\n` +
        `• Total selisih: ${totalDiff} unit\n` +
        `• Lokasi: ${selectedLocation}`,
    );
  };

  const locations = ["Jakarta_Central", "Surabaya_West", "Bandung_East"];

  return (
    <div className="stockopname-container">
      <div className="stockopname-header">
        <h1>📦 Stock Opname</h1>
        <p>Input stok fisik dan bandingkan dengan data JDE</p>
      </div>

      {/* Location Selector */}
      <div className="location-selector">
        <label>Pilih Lokasi Gudang:</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="location-dropdown"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="stock-stats">
        <div className="stat-card">
          <h3>{items.length}</h3>
          <p>Total Item</p>
        </div>
        <div className="stat-card">
          <h3>{items.filter((i) => i.physical !== "").length}</h3>
          <p>Sudah Diinput</p>
        </div>
        <div className="stat-card">
          <h3>{items.reduce((sum, item) => sum + item.diff, 0)}</h3>
          <p>Total Selisih</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Kode Item</th>
              <th>Nama Item</th>
              <th>Stok JDE</th>
              <th>Stok Fisik</th>
              <th>Selisih</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.jde}</td>
                <td>
                  <input
                    type="number"
                    value={item.physical}
                    onChange={(e) =>
                      handlePhysicalChange(item.id, e.target.value)
                    }
                    className="physical-input"
                    placeholder="0"
                  />
                </td>
                <td
                  className={
                    item.diff < 0 ? "negative" : item.diff > 0 ? "positive" : ""
                  }
                >
                  {item.diff !== 0 ? item.diff : "-"}
                </td>
                <td>
                  <button className="btn-save">💾 Simpan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="stock-actions">
        <button className="btn-submit" onClick={handleSubmit}>
          ✅ Submit ke JDE
        </button>
        <button className="btn-sync">🔄 Sinkron Manual</button>
      </div>
    </div>
  );
};

export default StockOpname;
