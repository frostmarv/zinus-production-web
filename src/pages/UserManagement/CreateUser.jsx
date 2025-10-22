// src/pages/UserManagement/CreateUser.jsx
import React, { useState } from "react";
import { createUser } from "../../api/userService";
import "../../styles/UserManagement/UserManagement.css";

const CreateUser = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "",
    department: "",
    nomorHp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUser(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menambahkan pengguna");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Tambah Pengguna Baru</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 karakter)"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required // ✅ Wajibkan user memilih
          >
            <option value="">Pilih Role</option>{" "}
            {/* ✅ Tambahkan placeholder */}
            <option value="Admin">Admin</option>
            <option value="Pemilik">Pemilik</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Kashift">Kashift</option>
            <option value="Kanit">Kanit</option>
            <option value="Admin Produksi">Admin Produksi</option>
            <option value="Admin Material">Admin Material</option>
            <option value="Admin Jde">Admin Lapangan</option>
          </select>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            required // ✅ Wajibkan user memilih
          >
            <option value="">Pilih Department</option>{" "}
            {/* ✅ Tambahkan placeholder */}
            <option value="Development">Development</option>
            <option value="Bonding">Bonding</option>
            <option value="Cutting">Cutting</option>
            <option value="Cutting">PPIC</option>
          </select>
          <input
            type="text"
            placeholder="Nomor HP"
            value={formData.nomorHp}
            onChange={(e) =>
              setFormData({ ...formData, nomorHp: e.target.value })
            }
          />
          <div className="modal-actions">
            <button
              type="submit"
              disabled={loading || !formData.role || !formData.department}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
