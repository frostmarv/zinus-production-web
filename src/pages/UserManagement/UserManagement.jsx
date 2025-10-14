// src/pages/UserManagement/UserManagement.jsx
import React from "react";
import UserList from "./UserList";
import "../../styles/UserManagement/UserManagement.css";

const UserManagement = () => {
  return (
    <div className="user-management">
      <h2>Manajemen Pengguna</h2>
      <UserList />
    </div>
  );
};

export default UserManagement;
