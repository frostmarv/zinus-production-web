// src/pages/UserManagement/EditUser.jsx
import React, { useState } from "react";
import { updateUser, resetUserPassword } from "../../api/userService";
import "../../styles/UserManagement/UserManagement.css";

const EditUser = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama: user.nama,
    email: user.email,
    role: user.role,
    department: user.department,
    nomorHp: user.nomorHp || "",
    newPassword: "", // ✅ Tambahkan field untuk password baru
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Update basic info
      await updateUser(user.id, {
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        nomorHp: formData.nomorHp,
      });

      // Jika ada password baru, reset password
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
          >
            {/* ✅ Perbaiki value agar sesuai enum */}
            <option value="Admin">Admin</option>
            <option value="Pemilik">Pemilik</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Kashift">Kashift</option>
            <option value="Kanit">Kanit</option>
            <option value="Admin Lapangan">Admin Lapangan</option>
            <option value="Admin Material">Admin Material</option>
          </select>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          >
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
          {/* ✅ Tambahkan field reset password */}
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
