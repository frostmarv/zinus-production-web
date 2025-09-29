// src/pages/Cutting/EditCutting.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cuttingAPI } from "../../api/cutting";
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  Settings,
  Calendar,
  Clock,
  Users,
  RefreshCw,
} from "lucide-react";
import "../../styles/Cutting/EditCutting.css";

const EditCutting = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productionDate: "",
    shift: "",
    machine: "",
    time: "",
    week: "",
    noUrut: "",
    balok: [],
    actuals: [],
    foamingDate: {
      isChecked: false,
      tanggalSelesai: "",
      jam: "",
    },
  });

  // Fetch data saat pertama kali load
  const fetchData = useCallback(async () => {
    if (!id) {
      setError("ID tidak ditemukan");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // ✅ Sekarang cuttingAPI.getById sudah ada
      const data = await cuttingAPI.getById(id);

      // Pastikan foamingDate ada
      const foaming = data.foamingDate || {
        isChecked: false,
        tanggalSelesai: "",
        jam: "",
      };

      setFormData({
        productionDate: data.productionDate || "",
        shift: data.shift || "",
        machine: data.machine || "",
        time: data.time || "",
        week: data.week || "",
        noUrut: data.noUrut || "",
        balok: Array.isArray(data.balok) ? data.balok : [],
        actuals: Array.isArray(data.actuals) ? data.actuals : [],
        foamingDate: foaming,
      });
    } catch (err) {
      console.error("❌ Gagal memuat data:", err);
      setError(err.message || "Gagal memuat data untuk diedit.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoamingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      foamingDate: {
        ...prev.foamingDate,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi dasar
    if (!formData.productionDate || !formData.shift || !formData.machine) {
      alert("⚠️ Harap isi semua field yang wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await cuttingAPI.update(id, formData);
      alert("✅ Data berhasil diperbarui!");
      navigate("/history/cutting");
    } catch (err) {
      console.error("❌ Gagal menyimpan data:", err);
      alert(
        "❌ Gagal menyimpan perubahan: " +
          (err.message || "Kesalahan tidak dikenal"),
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle back with confirmation if there are changes
  const handleBack = useCallback(() => {
    const hasChanges =
      JSON.stringify(formData) !==
      JSON.stringify({
        productionDate: "",
        shift: "",
        machine: "",
        time: "",
        week: "",
        noUrut: "",
        balok: [],
        actuals: [],
        foamingDate: {
          isChecked: false,
          tanggalSelesai: "",
          jam: "",
        },
      });

    if (hasChanges) {
      const confirmLeave = window.confirm(
        "⚠️ Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?",
      );
      if (!confirmLeave) return;
    }
    navigate("/history/cutting");
  }, [formData, navigate]);

  if (loading) {
    return (
      <div className="edit-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data untuk diedit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-container">
        <div className="error-container">
          <AlertTriangle size={20} />
          <p>{error}</p>
          <button onClick={fetchData} className="btn-retry">
            <RefreshCw size={16} /> Coba Lagi
          </button>
          <button
            onClick={() => navigate("/history/cutting")}
            className="btn-cancel"
          >
            Kembali ke History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-header">
        <button className="btn-back" onClick={handleBack}>
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1>Edit Data Cutting</h1>
        <p>ID: {id}</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Informasi Umum */}
        <div className="form-section">
          <h3>
            <Settings size={20} /> Informasi Umum
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Calendar size={16} /> Tanggal Produksi *
              </label>
              <input
                type="date"
                name="productionDate"
                value={formData.productionDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <Clock size={16} /> Shift *
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Shift</option>
                <option value="1">Shift 1</option>
                <option value="2">Shift 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <Settings size={16} /> Machine *
              </label>
              <select
                name="machine"
                value={formData.machine}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Mesin</option>
                <option value="Multi Cutting 1">Multi Cutting 1</option>
                <option value="Multi Cutting 2">Multi Cutting 2</option>
                <option value="Rountable 1">Rountable 1</option>
                <option value="Rountable 2">Rountable 2</option>
                <option value="Rountable 3">Rountable 3</option>
                <option value="Rountable 4">Rountable 4</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <Clock size={16} /> Time Slot
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="Contoh: 08:00 - 16:00"
              />
            </div>
            <div className="form-group">
              <label>
                <Calendar size={16} /> Week
              </label>
              <input
                type="text"
                name="week"
                value={formData.week}
                onChange={handleChange}
                placeholder="Contoh: W12 2025"
              />
            </div>
            <div className="form-group">
              <label>
                <Users size={16} /> No. Urut
              </label>
              <input
                type="text"
                name="noUrut"
                value={formData.noUrut}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Foaming Date */}
        <div className="form-section">
          <h3>
            <Clock size={20} /> Foaming Date
          </h3>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isChecked"
                checked={formData.foamingDate.isChecked}
                onChange={handleFoamingChange}
              />
              Foaming Selesai?
            </label>
          </div>
          {formData.foamingDate.isChecked && (
            <div className="form-grid">
              <div className="form-group">
                <label>Tanggal Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData.foamingDate.tanggalSelesai}
                  onChange={handleFoamingChange}
                />
              </div>
              <div className="form-group">
                <label>Jam</label>
                <input
                  type="text"
                  name="jam"
                  value={formData.foamingDate.jam}
                  onChange={handleFoamingChange}
                  placeholder="Contoh: 15:30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tombol Simpan */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel-secondary"
            onClick={handleBack}
            disabled={saving}
          >
            Batal
          </button>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner"></span> Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCutting;
