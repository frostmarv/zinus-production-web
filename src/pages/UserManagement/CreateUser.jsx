// src/pages/UserManagement/CreateUser.jsx
import React, { useState } from "react";
import { createUser } from "../../api/userService";
import "../../styles/UserManagement/UserManagement.css";

// 🔽 Sinkronkan dengan enum backend
const ROLE_OPTIONS = [
  { value: "Pemilik", label: "Pemilik" },
  { value: "Manager", label: "Manager" },
  { value: "Supervisor", label: "Supervisor" },
  { value: "Kashift", label: "Kashift" },
  { value: "Kanit", label: "Kanit" },
  { value: "Admin", label: "Admin" },
  { value: "Admin JDE", label: "Admin JDE" },
  { value: "Admin Produksi", label: "Admin Produksi" },
  { value: "Admin Material", label: "Admin Material" },
];

const DEPARTMENT_OPTIONS = [
  { value: "Development", label: "Development" },
  { value: "Bonding", label: "Bonding" },
  { value: "Cutting", label: "Cutting" },
  { value: "Quilting", label: "Quilting" },
  { value: "Sewing", label: "Sewing" },
  { value: "Spring Core", label: "Spring Core" },
  { value: "Packing Foam", label: "Packing Foam" },
  { value: "Packing Spring", label: "Packing Spring" },
  { value: "CDBox", label: "CDBox" },
  { value: "PPIC", label: "PPIC" },
];

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
            required
          >
            <option value="">Pilih Role</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            required
          >
            <option value="">Pilih Department</option>
            {DEPARTMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
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