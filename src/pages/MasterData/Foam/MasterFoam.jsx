// src/pages/MasterData/Foam/MasterFoam.jsx
import React, { useState, useEffect } from "react";
import { masterPlanningAPI } from "../../../api/masterPlanning";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../api/authService";
import "../../../styles/MasterData/Foam/MasterFoam.css";

const MasterFoam = () => {
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
    shipToName: "",
    customerPO: "",
    poNumber: "",
    itemNumber: "",
    sku: "",
    category: "FOAM",
    spec: "", // ✅ Satu field
    itemDescription: "",
    orderQty: 0,
    sample: 0,
    week: "1",
    iD: "",
    lD: "",
    sD: "",
  });
  const navigate = useNavigate();

  const user = getUser();
  const canManage = user?.role === "Pemilik" || user?.department === "PPIC";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await masterPlanningAPI.getAllFoam();
        const rawData = response.data || response;
        setData(rawData);
        setFilteredData(rawData);
      } catch (err) {
        setError("Gagal memuat data Foam Master Planning.");
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
      const matchesSKU = item.SKU?.toLowerCase().includes(term);
      const matchesWeek = item.Week?.toString().includes(term);
      const matchesFCode = item["Item Number"]?.toLowerCase().includes(term);
      const matchesCustomer = item["Ship to Name"]?.toLowerCase().includes(term);
      const matchesSpec = item.Spec?.toLowerCase().includes(term);
      return matchesSKU || matchesWeek || matchesFCode || matchesCustomer || matchesSpec;
    });

    setFilteredData(result);
  }, [searchTerm, data]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);

    try {
      await masterPlanningAPI.uploadFile(file);
      alert("Upload file berhasil!");
      const response = await masterPlanningAPI.getAllFoam();
      const rawData = response.data || response;
      setData(rawData);
      setFilteredData(rawData);
    } catch (err) {
      setUploadError("Gagal mengupload file. Silakan coba lagi.");
      console.error(err);
    } finally {
      setUploadLoading(false);
      e.target.value = ""; // Reset input file
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        shipToName: item["Ship to Name"] || "",
        customerPO: item["Cust. PO"] || "",
        poNumber: item["PO No."] || "",
        itemNumber: item["Item Number"] || "",
        sku: item.SKU || "",
        category: item.Category || "FOAM",
        spec: item.Spec || "", // ✅ Ambil dari item.Spec
        itemDescription: item["Item Description"] || "",
        orderQty: item["Order QTY"] || 0,
        sample: item.Sample || 0,
        week: item.Week?.toString() || "1",
        iD: item["I/D"] || "",
        lD: item["L/D"] || "",
        sD: item["S/D"] || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        shipToName: "",
        customerPO: "",
        poNumber: "",
        itemNumber: "",
        sku: "",
        category: "FOAM",
        spec: "",
        itemDescription: "",
        orderQty: 0,
        sample: 0,
        week: "1",
        iD: "",
        lD: "",
        sD: "",
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

    // ✅ Validasi format spec
    const specRegex = /^(\d+\.?\d*)\s*\*\s*(\d+\.?\d*)\s*\*\s*(\d+\.?\d*)\s*([a-zA-Z]*)$/;
    if (!specRegex.test(formData.spec)) {
      alert("Spec harus dalam format yang valid, contoh: 75*54*8IN");
      return;
    }

    try {
      if (editingItem) {
        await masterPlanningAPI.update(editingItem.id, formData);
      } else {
        await masterPlanningAPI.create(formData);
      }

      alert(editingItem ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!");
      setIsModalOpen(false);

      const response = await masterPlanningAPI.getAllFoam();
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
      await masterPlanningAPI.delete(id);
      alert("Data berhasil dihapus!");
      const response = await masterPlanningAPI.getAllFoam();
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
    return <div className="master-foam__loading">Memuat data...</div>;
  }

  if (error) {
    return <div className="master-foam__error">{error}</div>;
  }

  return (
    <div className="master-foam">
      <div className="master-foam__header">
        <h1 className="master-foam__title">Master Planning - Foam</h1>
        <button className="master-foam__back-btn" onClick={handleBack}>
          ← Kembali
        </button>
      </div>

      <div className="master-foam__controls">
        <div className="master-foam__search">
          <label htmlFor="foam-search">Cari (SKU, Week, Item Number, Spec):</label>
          <input
            id="foam-search"
            type="text"
            placeholder="Ketik untuk mencari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="master-foam__search-input"
          />
        </div>

        {canManage && (
          <div className="master-foam__actions">
            <div className="master-foam__upload">
              <label htmlFor="file-upload" className="master-foam__upload-btn">
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
                <div className="master-foam__upload-error">{uploadError}</div>
              )}
            </div>

            <button
              className="master-foam__add-btn"
              onClick={() => handleOpenModal()}
            >
              + Tambah Data
            </button>
          </div>
        )}
      </div>

      <div className="master-foam__table-container">
        <table className="master-foam__table">
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
              {canManage && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id || index}>
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
                  {canManage && (
                    <td>
                      <button
                        className="master-foam__edit-btn"
                        onClick={() => handleOpenModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="master-foam__delete-btn"
                        onClick={() => handleDelete(item.id)}
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
                  colSpan={canManage ? 16 : 15}
                  className="master-foam__no-data"
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
          className="master-foam__modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="master-foam__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingItem ? "Edit Data" : "Tambah Data Baru"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="master-foam__form-row">
                <label>Ship to Name:</label>
                <input
                  type="text"
                  name="shipToName"
                  value={formData.shipToName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
                <label>Customer PO:</label>
                <input
                  type="text"
                  name="customerPO"
                  value={formData.customerPO}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
                <label>PO Number:</label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
                <label>Item Number:</label>
                <input
                  type="text"
                  name="itemNumber"
                  value={formData.itemNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
                <label>SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
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
              {/* ✅ Input hanya spec */}
              <div className="master-foam__form-row">
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
              <div className="master-foam__form-row">
                <label>Item Description:</label>
                <input
                  type="text"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
                <label>Order Qty:</label>
                <input
                  type="number"
                  name="orderQty"
                  value={formData.orderQty}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
                <label>Sample:</label>
                <input
                  type="number"
                  name="sample"
                  value={formData.sample}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-foam__form-row">
                <label>Week:</label>
                <input
                  type="text"
                  name="week"
                  value={formData.week}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-foam__form-row">
                <label>I/D:</label>
                <input
                  type="date"
                  name="iD"
                  value={formData.iD}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-foam__form-row">
                <label>L/D:</label>
                <input
                  type="date"
                  name="lD"
                  value={formData.lD}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-foam__form-row">
                <label>S/D:</label>
                <input
                  type="date"
                  name="sD"
                  value={formData.sD}
                  onChange={handleInputChange}
                />
              </div>

              <div className="master-foam__form-actions">
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

export default MasterFoam;