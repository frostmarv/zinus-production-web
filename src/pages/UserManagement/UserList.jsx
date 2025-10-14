// src/pages/UserManagement/UserList.jsx
import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../api/userService";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import "../../styles/UserManagement/UserManagement.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;

    try {
      await deleteUser(id);
      fetchUsers(); // refresh list
    } catch (err) {
      alert(err.message || "Gagal menghapus pengguna");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="user-list">
      <div className="header">
        <h3>Daftar Pengguna</h3>
        <button onClick={() => setShowCreateModal(true)}>
          Tambah Pengguna
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nama}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Create */}
      {showCreateModal && (
        <CreateUser
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {/* Modal Edit */}
      {editingUser && (
        <EditUser
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserList;
