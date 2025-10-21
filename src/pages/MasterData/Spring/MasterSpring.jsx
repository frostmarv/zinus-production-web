// src/pages/MasterData/Spring/MasterSpring.jsx
import React, { useState, useEffect } from "react";
import { masterPlanningAPI } from "../../../api/masterPlanning";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../api/authService";
import "../../../styles/MasterData/Spring/MasterSpring.css";

const MasterSpring = () => {
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
    category: "SPRING",
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

  // ✅ Cek hak akses
  const user = getUser();
  const canManage = user?.role === "Pemilik" || user?.department === "PPIC";

  // Ambil data spring dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await masterPlanningAPI.getAllSpring();
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

  // Filter data berdasarkan pencarian
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
      const matchesSpec = item.Spec?.toLowerCase().includes(term); // ✅ Tambahkan pencarian berdasarkan spec
      return matchesSKU || matchesWeek || matchesFCode || matchesCustomer || matchesSpec;
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
      await masterPlanningAPI.uploadFile(file);
      alert("Upload file berhasil!");
      const response = await masterPlanningAPI.getAllSpring();
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

  // Handle open modal (create/edit)
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        shipToName: item["Ship to Name"] || "",
        customerPO: item["Cust. PO"] || "",
        poNumber: item["PO No."] || "",
        itemNumber: item["Item Number"] || "",
        sku: item.SKU || "",
        category: item.Category || "SPRING",
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
        category: "SPRING",
        spec: "", // ✅ Kosongkan
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

      alert(
        editingItem
          ? "Data berhasil diperbarui!"
          : "Data berhasil ditambahkan!",
      );
      setIsModalOpen(false);

      const response = await masterPlanningAPI.getAllSpring();
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
      await masterPlanningAPI.delete(id);
      alert("Data berhasil dihapus!");
      const response = await masterPlanningAPI.getAllSpring();
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
          <label htmlFor="spring-search">Cari (SKU, Week, Item Number, Spec):</label>
          <input
            id="spring-search"
            type="text"
            placeholder="Ketik untuk mencari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="master-spring__search-input"
          />
        </div>

        {/* ✅ Tampilkan aksi hanya jika berhak */}
        {canManage && (
          <div className="master-spring__actions">
            <div className="master-spring__upload">
              <label
                htmlFor="file-upload"
                className="master-spring__upload-btn"
              >
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
                <div className="master-spring__upload-error">{uploadError}</div>
              )}
            </div>

            <button
              className="master-spring__add-btn"
              onClick={() => handleOpenModal()}
            >
              + Tambah Data
            </button>
          </div>
        )}
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
              {/* ✅ Kolom Aksi hanya muncul jika berhak */}
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
                  {/* ✅ Tombol aksi hanya muncul jika berhak */}
                  {canManage && (
                    <td>
                      <button
                        className="master-spring__edit-btn"
                        onClick={() => handleOpenModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="master-spring__delete-btn"
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
                  className="master-spring__no-data"
                >
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal hanya bisa dibuka jika canManage, tapi tetap aman karena di-handle di tombol */}
      {isModalOpen && (
        <div
          className="master-spring__modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="master-spring__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingItem ? "Edit Data" : "Tambah Data Baru"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="master-spring__form-row">
                <label>Ship to Name:</label>
                <input
                  type="text"
                  name="shipToName"
                  value={formData.shipToName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
                <label>Customer PO:</label>
                <input
                  type="text"
                  name="customerPO"
                  value={formData.customerPO}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
                <label>PO Number:</label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
                <label>Item Number:</label>
                <input
                  type="text"
                  name="itemNumber"
                  value={formData.itemNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
                <label>SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
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
              <div className="master-spring__form-row">
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
              <div className="master-spring__form-row">
                <label>Item Description:</label>
                <input
                  type="text"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
                <label>Order Qty:</label>
                <input
                  type="number"
                  name="orderQty"
                  value={formData.orderQty}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
                <label>Sample:</label>
                <input
                  type="number"
                  name="sample"
                  value={formData.sample}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-spring__form-row">
                <label>Week:</label>
                <input
                  type="text"
                  name="week"
                  value={formData.week}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="master-spring__form-row">
                <label>I/D:</label>
                <input
                  type="date"
                  name="iD"
                  value={formData.iD}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-spring__form-row">
                <label>L/D:</label>
                <input
                  type="date"
                  name="lD"
                  value={formData.lD}
                  onChange={handleInputChange}
                />
              </div>
              <div className="master-spring__form-row">
                <label>S/D:</label>
                <input
                  type="date"
                  name="sD"
                  value={formData.sD}
                  onChange={handleInputChange}
                />
              </div>

              <div className="master-spring__form-actions">
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

export default MasterSpring;