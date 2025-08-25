// src/pages/MasterData.jsx
import React from 'react';
import '../styles/MasterData.css';

const MasterData = () => {
  const masterItems = [
    { id: 'PROD-001', name: 'Bearing 10x20mm', category: 'Mechanical', unit: 'Pcs' },
    { id: 'PROD-002', name: 'Seal Rubber', category: 'Sealing', unit: 'Pcs' },
    { id: 'PROD-003', name: 'Bolt M8x20', category: 'Fastener', unit: 'Pcs' },
    { id: 'PROD-004', name: 'Motor 1HP', category: 'Electrical', unit: 'Unit' },
    { id: 'PROD-005', name: 'Gearbox Type-A', category: 'Mechanical', unit: 'Unit' },
  ];

  return (
    <div className="masterdata-container">
      <div className="masterdata-header">
        <h1>📂 Master Data</h1>
        <p>Daftar item produksi & inventory</p>
      </div>

      <div className="masterdata-actions">
        <button className="btn-add">➕ Tambah Item</button>
        <button className="btn-export">📤 Export CSV</button>
      </div>

      <div className="masterdata-table">
        <table>
          <thead>
            <tr>
              <th>Kode Item</th>
              <th>Nama Item</th>
              <th>Kategori</th>
              <th>Unit</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {masterItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.unit}</td>
                <td>
                  <button className="btn-edit">✏️ Edit</button>
                  <button className="btn-delete">🗑️ Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasterData;