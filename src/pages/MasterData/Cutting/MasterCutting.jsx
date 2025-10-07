// src/pages/MasterData/Cutting/MasterCutting.jsx
import React, { useState, useEffect } from "react";
import { masterCuttingAPI } from "../../../api/masterCutting";
import { useNavigate } from "react-router-dom";
import "../../../styles/MasterData/Cutting/MasterCutting.css";

const MasterCutting = () => {
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
        const response = await masterCuttingAPI.getAll();
        const rawData = response.data || response;
        setData(rawData);
        setFilteredData(rawData);
      } catch (err) {
        setError("Gagal memuat data Cutting Master.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter berdasarkan: sku, item_number, second_item_number, description
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = data.filter((item) => {
      return (
        item.sku?.toLowerCase().includes(term) ||
        item.item_number?.toLowerCase().includes(term) ||
        item.second_item_number?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
      );
    });

    setFilteredData(result);
  }, [searchTerm, data]);

  const handleBack = () => {
    navigate("/master");
  };

  if (loading) {
    return <div className="master-cutting__loading">Memuat data...</div>;
  }

  if (error) {
    return <div className="master-cutting__error">{error}</div>;
  }

  return (
    <div className="master-cutting">
      <div className="master-cutting__header">
        <h1 className="master-cutting__title">Master Data - Cutting</h1>
        <button className="master-cutting__back-btn" onClick={handleBack}>
          ← Kembali
        </button>
      </div>

      <div className="master-cutting__controls">
        <div className="master-cutting__search">
          <label htmlFor="cutting-search">
            Cari (SKU, Item Number, Second Item, Deskripsi):
          </label>
          <input
            id="cutting-search"
            type="text"
            placeholder="Ketik untuk mencari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="master-cutting__search-input"
          />
        </div>
      </div>

      <div className="master-cutting__table-container">
        <table className="master-cutting__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Number</th>
              <th>Second Item Number</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Description Line 2</th>
              <th>Layer Index</th>
              <th>Product ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.item_number}</td>
                  <td>{item.second_item_number}</td>
                  <td>{item.sku}</td>
                  <td>{item.description}</td>
                  <td>{item.description_line_2}</td>
                  <td>{item.layer_index}</td>
                  <td>{item.product_id}</td>
                  <td>{new Date(item.created_at).toLocaleString("id-ID")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="master-cutting__no-data">
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

export default MasterCutting;
