// src/pages/MasterData/Spring/MasterSpring.jsx
import React, { useState, useEffect } from "react";
import { masterPlanningAPI } from "../../../api/masterPlanning";
import { useNavigate } from "react-router-dom";
import "../../../styles/MasterData/Spring/MasterSpring.css";

const MasterSpring = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await masterPlanningAPI.getAll("spring");
        const rawData = response.data || response;
        setData(rawData);
        setFilteredData(rawData);
      } catch (err) {
        setError("Gagal memuat data Spring Master Planning.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter berdasarkan SKU, Week, dan Item Number (asumsi F.code = Item Number)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = data.filter((item) => {
      const matchesSKU = item.SKU?.toLowerCase().includes(term);
      const matchesWeek = item.Week?.toString().includes(term);
      const matchesFCode = item["Item Number"]?.toLowerCase().includes(term); // Ganti jika nama kolom berbeda
      return matchesSKU || matchesWeek || matchesFCode;
    });

    setFilteredData(result);
  }, [searchTerm, data]);

  const handleBack = () => {
    navigate("/master"); // Sesuaikan route jika berbeda
  };

  if (loading) {
    return <div className="master-spring__loading">Memuat data...</div>;
  }

  if (error) {
    return <div className="master-spring__error">{error}</div>;
  }

  return (
    <div className="master-spring">
      <div className="master-spring__header">
        <h1 className="master-spring__title">Master Planning - Spring</h1>
        <button className="master-spring__back-btn" onClick={handleBack}>
          ← Kembali
        </button>
      </div>

      <div className="master-spring__controls">
        <div className="master-spring__search">
          <label htmlFor="spring-search">Cari (SKU, Week, Item Number):</label>
          <input
            id="spring-search"
            type="text"
            placeholder="Ketik untuk mencari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="master-spring__search-input"
          />
        </div>
      </div>

      <div className="master-spring__table-container">
        <table className="master-spring__table">
          <thead>
            <tr>
              <th>Ship to Name</th>
              <th>Cust. PO</th>
              <th>PO No.</th>
              <th>Item Number</th>
              <th>SKU</th>
              <th>Spec</th>
              <th>Item Description</th>
              <th>I/D</th>
              <th>L/D</th>
              <th>S/D</th>
              <th>Order QTY</th>
              <th>Sample</th>
              <th>Total Qty</th>
              <th>Week</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item["Ship to Name"]}</td>
                  <td>{item["Cust. PO"]}</td>
                  <td>{item["PO No."]}</td>
                  <td>{item["Item Number"]}</td>
                  <td>{item.SKU}</td>
                  <td>{item.Spec}</td>
                  <td>{item["Item Description"]}</td>
                  <td>{item["I/D"]}</td>
                  <td>{item["L/D"]}</td>
                  <td>{item["S/D"]}</td>
                  <td>{item["Order QTY"]}</td>
                  <td>{item.Sample}</td>
                  <td>{item["Total Qty"]}</td>
                  <td>{item.Week}</td>
                  <td>{item.Category}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="master-spring__no-data">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasterSpring;
