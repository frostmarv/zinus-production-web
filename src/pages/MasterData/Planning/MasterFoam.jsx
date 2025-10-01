// src/pages/MasterData/Foam/MasterFoam.jsx
import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { masterPlanningAPI } from "../../../api/masterPlanning";
import "../../../styles/MasterData/Planning/MasterFoam.css";

const MasterFoam = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    week: "",
    "Ship to Name": "",
  });

  // Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    "Ship to Name": "",
    "Cust. PO": "",
    "PO No.": "",
    "Item Number": "",
    SKU: "",
    Spec: "",
    "Item Description": "",
    "I/D": "",
    "L/D": "",
    "S/D": "",
    "Order QTY": 0,
    Sample: 0,
    "Total Qty": 0,
    Week: "",
    Category: "",
  });

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await masterPlanningAPI.getAll("foam");
      let rawData = Array.isArray(result) ? result : result.data || [];
      setData(rawData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return String(item[key]).toLowerCase().includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal for create/edit
  const openModal = (record = null) => {
    if (record) {
      setCurrentRecord(record);
      setFormData({ ...record });
      setIsEditing(true);
    } else {
      setCurrentRecord(null);
      setFormData({
        "Ship to Name": "",
        "Cust. PO": "",
        "PO No.": "",
        "Item Number": "",
        SKU: "",
        Spec: "",
        "Item Description": "",
        "I/D": "",
        "L/D": "",
        "S/D": "",
        "Order QTY": 0,
        Sample: 0,
        "Total Qty": 0,
        Week: "",
        Category: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({
      "Ship to Name": "",
      "Cust. PO": "",
      "PO No.": "",
      "Item Number": "",
      SKU: "",
      Spec: "",
      "Item Description": "",
      "I/D": "",
      "L/D": "",
      "S/D": "",
      "Order QTY": 0,
      Sample: 0,
      "Total Qty": 0,
      Week: "",
      Category: "",
    });
  };

  // Submit form (POST/PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await masterPlanningAPI.update(
          "foam",
          currentRecord["Cust. PO"],
          formData,
        );
      } else {
        await masterPlanningAPI.create("foam", formData);
      }
      fetchData();
      closeModal();
    } catch (err) {
      alert(`Gagal menyimpan  ${err.message}`);
    }
  };

  // Delete record
  const handleDelete = async (custPO) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        await masterPlanningAPI.delete("foam", custPO);
        fetchData();
      } catch (err) {
        alert(`Gagal menghapus  ${err.message}`);
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ category: "", week: "", "Ship to Name": "" });
    setSearchTerm("");
  };

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="master-foam-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button
            className="btn-back"
            onClick={() => navigate("/master")}
            title="Kembali ke Master Data Index"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
          <div className="header-title">
            <Package size={24} />
            <h1>Master Data Foam</h1>
          </div>
          <p className="header-subtitle">Manajemen data foam produksi</p>
        </div>
        <div className="header-right">
          <button className="btn-add" onClick={() => openModal()}>
            <Plus size={16} />
            Tambah Data
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="search-filter-section">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Cari data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Category</label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            placeholder="Filter category..."
          />
        </div>
        <div className="filter-group">
          <label>Week</label>
          <input
            type="text"
            value={filters.week}
            onChange={(e) => setFilters({ ...filters, week: e.target.value })}
            placeholder="Filter week..."
          />
        </div>
        <div className="filter-group">
          <label>Customer</label>
          <input
            type="text"
            value={filters["Ship to Name"]}
            onChange={(e) =>
              setFilters({ ...filters, "Ship to Name": e.target.value })
            }
            placeholder="Filter customer..."
          />
        </div>
        <button onClick={resetFilters} className="btn-reset">
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>PO No.</th>
              <th>SKU</th>
              <th>Spec</th>
              <th>Order Qty</th>
              <th>Week</th>
              <th>Category</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  Tidak ada data ditemukan
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item["Cust. PO"]}>
                  <td>{item["Ship to Name"]}</td>
                  <td>{item["PO No."]}</td>
                  <td>{item.SKU}</td>
                  <td>{item.Spec}</td>
                  <td>{item["Order QTY"]}</td>
                  <td>{item.Week}</td>
                  <td>{item.Category}</td>
                  <td className="action-cell">
                    <button
                      className="btn-edit"
                      onClick={() => openModal(item)}
                      title="Edit data"
                    >
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item["Cust. PO"])}
                      title="Hapus data"
                    >
                      <Trash2 size={16} />
                      <span>Hapus</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? "Edit Data Foam" : "Tambah Data Foam"}</h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div>
                  <label>Customer</label>
                  <input
                    type="text"
                    name="Ship to Name"
                    value={formData["Ship to Name"]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>PO No.</label>
                  <input
                    type="text"
                    name="PO No."
                    value={formData["PO No."]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>SKU</label>
                  <input
                    type="text"
                    name="SKU"
                    value={formData.SKU}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Spec</label>
                  <input
                    type="text"
                    name="Spec"
                    value={formData.Spec}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Item Number</label>
                  <input
                    type="text"
                    name="Item Number"
                    value={formData["Item Number"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Item Description</label>
                  <input
                    type="text"
                    name="Item Description"
                    value={formData["Item Description"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>I/D</label>
                  <input
                    type="date"
                    name="I/D"
                    value={formData["I/D"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>L/D</label>
                  <input
                    type="date"
                    name="L/D"
                    value={formData["L/D"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>S/D</label>
                  <input
                    type="date"
                    name="S/D"
                    value={formData["S/D"]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Order QTY</label>
                  <input
                    type="number"
                    name="Order QTY"
                    value={formData["Order QTY"]}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div>
                  <label>Sample</label>
                  <input
                    type="number"
                    name="Sample"
                    value={formData.Sample}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div>
                  <label>Total Qty</label>
                  <input
                    type="number"
                    name="Total Qty"
                    value={formData["Total Qty"]}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div>
                  <label>Week</label>
                  <input
                    type="text"
                    name="Week"
                    value={formData.Week}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    name="Category"
                    value={formData.Category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button type="submit" className="btn-save">
                  <Save size={16} />
                  {isEditing ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterFoam;
