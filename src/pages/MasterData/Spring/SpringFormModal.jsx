// src/pages/MasterData/Spring/SpringFormModal.jsx
import React from "react";
import { X, Save } from "lucide-react";
import "../../../styles/MasterData/Spring/MasterSpring.css";

const SpringFormModal = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Edit Data Spring" : "Tambah Data Spring"}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-grid">
            <div>
              <label>Customer</label>
              <input
                type="text"
                name="Ship to Name"
                value={formData["Ship to Name"]}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label>PO No.</label>
              <input
                type="text"
                name="PO No."
                value={formData["PO No."]}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label>SKU</label>
              <input
                type="text"
                name="SKU"
                value={formData.SKU}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label>Spec</label>
              <input
                type="text"
                name="Spec"
                value={formData.Spec}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Item Number</label>
              <input
                type="text"
                name="Item Number"
                value={formData["Item Number"]}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Item Description</label>
              <input
                type="text"
                name="Item Description"
                value={formData["Item Description"]}
                onChange={onChange}
              />
            </div>
            <div>
              <label>I/D</label>
              <input
                type="date"
                name="I/D"
                value={formData["I/D"]}
                onChange={onChange}
              />
            </div>
            <div>
              <label>L/D</label>
              <input
                type="date"
                name="L/D"
                value={formData["L/D"]}
                onChange={onChange}
              />
            </div>
            <div>
              <label>S/D</label>
              <input
                type="date"
                name="S/D"
                value={formData["S/D"]}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Order QTY</label>
              <input
                type="number"
                name="Order QTY"
                value={formData["Order QTY"]}
                onChange={onChange}
                min="0"
              />
            </div>
            <div>
              <label>Sample</label>
              <input
                type="number"
                name="Sample"
                value={formData.Sample}
                onChange={onChange}
                min="0"
              />
            </div>
            <div>
              <label>Total Qty</label>
              <input
                type="number"
                name="Total Qty"
                value={formData["Total Qty"]}
                onChange={onChange}
                min="0"
              />
            </div>
            <div>
              <label>Week</label>
              <input
                type="text"
                name="Week"
                value={formData.Week}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                name="Category"
                value={formData.Category}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-save">
              <Save size={16} />
              {isEditing ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpringFormModal;
