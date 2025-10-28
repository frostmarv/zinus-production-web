// src/pages/UserManagement/EditUser.jsx
import React, { useState } from "react";
import { updateUser, resetUserPassword } from "../../api/userService";
import "../../styles/UserManagement/UserManagement.css";

// 🔽 Sama seperti di CreateUser
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

const EditUser = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama: user.nama,
    email: user.email,
    role: user.role,
    department: user.department,
    nomorHp: user.nomorHp || "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateUser(user.id, {
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        nomorHp: formData.nomorHp,
      });

      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          throw new Error("Password minimal 6 karakter");
        }
        await resetUserPassword(user.id, formData.newPassword);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Gagal memperbarui pengguna");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Pengguna</h3>
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
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
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
          <input
            type="password"
            placeholder="Password Baru (kosongkan jika tidak ingin diubah)"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
          />
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
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

export default EditUser;