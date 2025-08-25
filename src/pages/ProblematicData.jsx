// src/pages/ProblematicData.jsx
import React, { useState } from 'react';
import '../styles/ProblematicData.css';

const ProblematicData = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      item_code: 'PROD-999',
      item_name: 'Bearing Special',
      physical_qty: 50,
      location: 'Jakarta_Central',
      error_message: 'Item tidak ditemukan di JDE',
      status: 'Error',
      user: 'user003',
      timestamp: '2024-01-15 10:30'
    },
    {
      id: 2,
      item_code: 'PROD-888',
      item_name: 'Seal Custom',
      physical_qty: 25,
      location: 'Surabaya_West',
      error_message: 'Lokasi tidak valid',
      status: 'Error',
      user: 'user007',
      timestamp: '2024-01-15 09:45'
    }
  ]);

  const handleFix = (id) => {
    const newCode = prompt('Perbaiki Kode Item:');
    if (newCode) {
      setItems(items.map(item => 
        item.id === id ? { ...item, item_code: newCode } : item
      ));
      alert(`Item ${id} diperbaiki. Silakan kirim ulang.`);
    }
  };

  const handleRetry = (id) => {
    alert(`🔁 Sistem mencoba kirim ulang data ID: ${id} ke JDE...`);
    // Simulasi sukses
    setTimeout(() => {
      setItems(items.map(item => 
        item.id === id ? { ...item, status: 'Fixed & Synced' } : item
      ));
      alert('✅ Berhasil! Data telah disinkronkan ke JDE.');
    }, 1500);
  };

  return (
    <div className="problematic-container">
      <div className="problematic-header">
        <h1>⚠️ Data Bermasalah</h1>
        <p>Data yang gagal divalidasi sebelum dikirim ke JDE</p>
      </div>

      <div className="problematic-stats">
        <div className="stat-card error">
          <h3>{items.filter(i => i.status === 'Error').length}</h3>
          <p>Data Error</p>
        </div>
        <div className="stat-card fixed">
          <h3>{items.filter(i => i.status === 'Fixed & Synced').length}</h3>
          <p>Sudah Diperbaiki</p>
        </div>
      </div>

      <div className="problematic-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode Item</th>
              <th>Nama Item</th>
              <th>Qty Fisik</th>
              <th>Lokasi</th>
              <th>Error</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <input 
                    type="text" 
                    defaultValue={item.item_code} 
                    className="item-code-input"
                  />
                </td>
                <td>{item.item_name}</td>
                <td>{item.physical_qty}</td>
                <td>{item.location}</td>
                <td className="error-message">{item.error_message}</td>
                <td>
                  <span className={`status-badge ${item.status === 'Error' ? 'error' : 'fixed'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-fix"
                    onClick={() => handleFix(item.id)}
                  >
                    ✏️ Perbaiki
                  </button>
                  <button 
                    className="btn-retry"
                    onClick={() => handleRetry(item.id)}
                    disabled={item.status === 'Fixed & Synced'}
                  >
                    🔄 Kirim Ulang
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblematicData;