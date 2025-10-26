import React, { useState, useEffect } from "react";
import { masterProductsAPI } from "../../../api/masterProducts";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../api/authService";
import "../../../styles/MasterData/Products/MasterProducts.css";

const MasterProducts = () => {
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
    itemNumber: "",
    sku: "",
    category: "FOAM",
    spec: "",
    itemDescription: "",
  });
  const navigate = useNavigate();

  const user = getUser();
  const canManage = user?.role === "Pemilik" || user?.department === "PPIC";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await masterProductsAPI.getAll();
        const rawData = response.data || response;
        setData(rawData);
        setFilteredData(rawData);
      } catch (err) {
        setError("Gagal memuat data Products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = data.filter((item) => {
      const matchesSKU = item.sku?.toLowerCase().includes(term);
      const matchesItemNumber = item.itemNumber?.toLowerCase().includes(term);
      const matchesCategory = item.category?.toLowerCase().includes(term);
      const matchesSpec = item.spec?.toLowerCase().includes(term);
      const matchesDescription = item.itemDescription?.toLowerCase().includes(term);
      return matchesSKU || matchesItemNumber || matchesCategory || matchesSpec || matchesDescription;
    });

    setFilteredData(result);
  }, [searchTerm, data]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);

    try {
      await masterProductsAPI.uploadFile(file);
      alert("Upload file berhasil!");
      const response = await masterProductsAPI.getAll();
      const rawData = response.data || response;
      setData(rawData);
      setFilteredData(rawData);
    } catch (err) {
      setUploadError("Gagal mengupload file. Silakan coba lagi.");
      console.error(err);
    } finally {
      setUploadLoading(false);
      e.target.value = "";
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        itemNumber: item.itemNumber || "",
        sku: item.sku || "",
        category: item.category || "FOAM",
        spec: item.spec || "",
        itemDescription: item.itemDescription || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        itemNumber: "",
        sku: "",
        category: "FOAM",
        spec: "",
        itemDescription: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const specRegex = /^(\d+\.?\d*)\s*\*\s*(\d+\.?\d*)\s*\*\s*(\d+\.?\d*)\s*([a-zA-Z]*)$/;
    if (!specRegex.test(formData.spec)) {
      alert("Spec harus dalam format yang valid, contoh: 75*54*8IN");
      return;
    }

    try {
      if (editingItem) {
        await masterProductsAPI.update(editingItem.productId, formData);
      } else {
        await masterProductsAPI.create(formData);
      }

      alert(editingItem ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!");
      setIsModalOpen(false);

      const response = await masterProductsAPI.getAll();
      const rawData = response.data || response;
      setData(rawData);
      setFilteredData(rawData);
    } catch (err) {
      alert("Gagal menyimpan data. Silakan coba lagi.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await masterProductsAPI.delete(id);
      alert("Data berhasil dihapus!");
      const response = await masterProductsAPI.getAll();
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
    return <div className="master-products__loading">Memuat data...</div>;
  }

  if (error) {
    return <div className="master-products__error">{error}</div>;
  }

  return (
    <div className="master-products">
      <div className="master-products__header">
        <h1 className="master-products__title">Master Products</h1>
        <button className="master-products__back-btn" onClick={handleBack}>
          ← Kembali
        </button>
      </div>

      <div className="master-products__controls">
        <div className="master-products__search">
          <label htmlFor="products-search">Cari (SKU, Item Number, Spec, Category):</label>
          <input
            id="products-search"
            type="text"
            placeholder="Ketik untuk mencari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="master-products__search-input"
          />
        </div>

        {canManage && (
          <div className="master-products__actions">
            <div className="master-products__upload">
              <label htmlFor="file-upload" className="master-products__upload-btn">
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
                <div className="master-products__upload-error">{uploadError}</div>
              )}
            </div>

            <button
              className="master-products__add-btn"
              onClick={() => handleOpenModal()}
            >
              + Tambah Data
            </button>
          </div>
        )}
      </div>

      <div className="master-products__table-container">
        <table className="master-products__table">
          <thead>
            <tr>
              <th>Item Number</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Spec</th>
              <th>Item Description</th>
              {canManage && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.productId || index}>
                  <td>{item.itemNumber}</td>
                  <td>{item.sku}</td>
                  <td>{item.category}</td>
                  <td>{item.spec}</td>
                  <td>{item.itemDescription}</td>
                  {canManage && (
                    <td>
                      <button
                        className="master-products__edit-btn"
                        onClick={() => handleOpenModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="master-products__delete-btn"
                        onClick={() => handleDelete(item.productId)}
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={canManage ? 6 : 5}
                  className="master-products__no-data"
                >
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="master-products__modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="master-products__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingItem ? "Edit Product" : "Tambah Product Baru"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="master-products__form-row">
                <label>Item Number:</label>
                <input
                  type="text"
                  name="itemNumber"
                  value={formData.itemNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-products__form-row">
                <label>SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  disabled={editingItem} // Tidak bisa edit SKU saat update
                />
              </div>
              <div className="master-products__form-row">
                <label>Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="FOAM">FOAM</option>
                  <option value="SPRING">SPRING</option>
                </select>
              </div>
              <div className="master-products__form-row">
                <label>Spec (Format: 75*54*8IN):</label>
                <input
                  type="text"
                  name="spec"
                  value={formData.spec}
                  onChange={handleInputChange}
                  placeholder="Contoh: 75*54*8IN"
                  required
                />
              </div>
              <div className="master-products__form-row">
                <label>Item Description:</label>
                <input
                  type="text"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="master-products__form-actions">
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

export default MasterProducts;