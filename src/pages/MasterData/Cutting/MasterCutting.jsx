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
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    product_sku: "",
    second_item_number: "",
    description: "",
    description_line_2: "",
    layer_index: null,
    category_layers: "",
  });
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

  // Filter berdasarkan: sku, second_item_number, description
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = data.filter((item) => {
      return (
        item.sku?.toLowerCase().includes(term) ||
        item.second_item_number?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
      );
    });

    setFilteredData(result);
  }, [searchTerm, data]);

  // Handle upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);

    try {
      await masterCuttingAPI.uploadFile(file);
      alert("Upload file berhasil!");
      // Refresh data
      const response = await masterCuttingAPI.getAll();
      const rawData = response.data || response;
      setData(rawData);
      setFilteredData(rawData);
    } catch (err) {
      setUploadError("Gagal mengupload file. Silakan coba lagi.");
      console.error(err);
    } finally {
      setUploadLoading(false);
      // Reset input file
      e.target.value = "";
    }
  };

  // Handle open modal (create/edit)
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        product_sku: item.sku || item.product_id || "",
        second_item_number: item.second_item_number || "",
        description: item.description || "",
        description_line_2: item.description_line_2 || "",
        layer_index: item.layer_index || null,
        category_layers: item.category_layers || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        product_sku: "",
        second_item_number: "",
        description: "",
        description_line_2: "",
        layer_index: null,
        category_layers: "",
      });
    }
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        // Update
        await masterCuttingAPI.update(editingItem.id, formData);
      } else {
        // Create
        await masterCuttingAPI.create(formData);
      }

      alert(
        editingItem
          ? "Data berhasil diperbarui!"
          : "Data berhasil ditambahkan!",
      );
      setIsModalOpen(false);

      // Refresh data
      const response = await masterCuttingAPI.getAll();
      const rawData = response.data || response;
      setData(rawData);
      setFilteredData(rawData);
    } catch (err) {
      alert("Gagal menyimpan data. Silakan coba lagi.");
      console.error(err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await masterCuttingAPI.delete(id);
      alert("Data berhasil dihapus!");
      // Refresh data
      const response = await masterCuttingAPI.getAll();
      const rawData = response.data || response;
      setData(rawData);
      setFilteredData(rawData);
    } catch (err) {
      alert("Gagal menghapus data. Silakan coba lagi.");
      console.error(err);
    }
  };

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
            Cari (SKU, Second Item, Deskripsi):
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

        <div className="master-cutting__actions">
          {/* Upload File */}
          <div className="master-cutting__upload">
            <label htmlFor="file-upload" className="master-cutting__upload-btn">
              {uploadLoading ? "Mengupload..." : "Upload File"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
              disabled={uploadLoading}
              style={{ display: "none" }}
            />
            {uploadError && (
              <div className="master-cutting__upload-error">{uploadError}</div>
            )}
          </div>

          {/* Add New Button */}
          <button
            className="master-cutting__add-btn"
            onClick={() => handleOpenModal()}
          >
            + Tambah Data
          </button>
        </div>
      </div>

      <div className="master-cutting__table-container">
        <table className="master-cutting__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product SKU</th>
              <th>Second Item Number</th>
              <th>Description</th>
              <th>Description Line 2</th>
              <th>Layer Index</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.sku}</td>
                  <td>{item.second_item_number}</td>
                  <td>{item.description}</td>
                  <td>{item.description_line_2}</td>
                  <td>{item.layer_index}</td>
                  <td>{item.category_layers}</td>
                  <td>{new Date(item.created_at).toLocaleString("id-ID")}</td>
                  <td>
                    <button
                      className="master-cutting__edit-btn"
                      onClick={() => handleOpenModal(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="master-cutting__delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
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

      {/* Modal untuk Create/Edit */}
      {isModalOpen && (
        <div
          className="master-cutting__modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="master-cutting__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingItem ? "Edit Data" : "Tambah Data Baru"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="master-cutting__form-row">
                <label>Product SKU:</label>
                <input
                  type="text"
                  name="product_sku"
                  value={formData.product_sku}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-cutting__form-row">
                <label>Second Item Number:</label>
                <input
                  type="text"
                  name="second_item_number"
                  value={formData.second_item_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-cutting__form-row">
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-cutting__form-row">
                <label>Description Line 2:</label>
                <input
                  type="text"
                  name="description_line_2"
                  value={formData.description_line_2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-cutting__form-row">
                <label>Layer Index:</label>
                <input
                  type="number"
                  name="layer_index"
                  value={formData.layer_index}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-cutting__form-row">
                <label>Category:</label>
                <input
                  type="text"
                  name="category_layers"
                  value={formData.category_layers}
                  onChange={handleInputChange}
                />
              </div>

              <div className="master-cutting__form-actions">
                <button type="submit">
                  {editingItem ? "Update" : "Simpan"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCutting;
