import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Users,
  Package,
  FileText,
  Hash,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";
import { masterDataAPI } from "../../api/masterData";
import "../../styles/Cutting/InputCutting.css";

const InputCutting = () => {
  const [headerData, setHeaderData] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    shift: "1",
    group: "A",
    time: "08:00",
  });

  const [formEntries, setFormEntries] = useState([
    {
      id: 1,
      customerId: "",
      poNumber: "",
      customerPO: "",
      sku: "",
      sCode: "",
      quantityOrder: "",
      quantityProduksi: "",
      week: "",
      remainQuantity: 0,
      // Cache untuk dropdown
      customers: [],
      poNumbers: [],
      customerPOs: [],
      skus: [],
    },
  ]);

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load customers data
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await masterDataAPI.getCustomers();
        const data = Array.isArray(response) ? response : [];
        // Backend sudah mengembalikan format {value, label} yang benar
        setCustomers(data);
        setFormEntries((prev) =>
          prev.map((entry) => ({
            ...entry,
            customers: data,
          })),
        );
      } catch (err) {
        console.error("Gagal memuat data customers:", err);
        setError("Gagal memuat data customers");
        alert("❌ Gagal memuat data customers");
      } finally {
        setLoadingCustomers(false);
      }
    };
    loadCustomers();
  }, []);

  // Generate time options
  const getTimeOptions = (shift) => {
    const times = [];
    if (shift === "1") {
      for (let hour = 8; hour <= 20; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    } else {
      for (let hour = 20; hour <= 23; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      for (let hour = 0; hour <= 8; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    }
    return times;
  };

  // Handle header changes
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "shift" && { time: getTimeOptions(value)[0] || "08:00" }),
    }));
  };

  // Memoized API calls
  const loadPoNumbers = useCallback(async (entryId, customerId) => {
    try {
      const response = await masterDataAPI.getPoNumbers(customerId);
      const data = Array.isArray(response) ? response : [];
      // Backend mungkin sudah mengembalikan format {value, label}
      setFormEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, poNumbers: data } : entry,
        ),
      );
    } catch (err) {
      console.error("Gagal memuat PO Numbers:", err);
      alert("❌ Gagal memuat PO Numbers");
    }
  }, []);

  const loadCustomerPOs = useCallback(async (entryId, poNumber) => {
    try {
      const response = await masterDataAPI.getCustomerPOs(poNumber);
      const data = Array.isArray(response) ? response : [];
      // Backend mungkin sudah mengembalikan format {value, label}
      setFormEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, customerPOs: data } : entry,
        ),
      );
    } catch (err) {
      console.error("Gagal memuat Customer POs:", err);
      alert("❌ Gagal memuat Customer POs");
    }
  }, []);

  const loadSkus = useCallback(async (entryId, customerPo) => {
    try {
      const response = await masterDataAPI.getSkus(customerPo);
      const data = Array.isArray(response) ? response : [];
      // Backend mungkin sudah mengembalikan format {value, label}
      setFormEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, skus: data } : entry,
        ),
      );
    } catch (err) {
      console.error("Gagal memuat SKUs:", err);
      alert("❌ Gagal memuat SKUs");
    }
  }, []);

  const loadQtyPlans = useCallback(async (entryId, customerPo, sku) => {
    try {
      const response = await masterDataAPI.getQtyPlans(customerPo, sku);
      console.log("📦 Qty Plans Response:", response);
      const rawData = Array.isArray(response) ? response : [];
      // Karena hanya ada 1 qty per SKU, langsung ambil value pertama
      const qtyValue = rawData.length > 0 ? rawData[0] : "";
      console.log("📦 Qty Value:", qtyValue);
      setFormEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                quantityOrder: qtyValue.toString(),
              }
            : entry,
        ),
      );
    } catch (err) {
      console.error("Gagal memuat Qty Plans:", err);
      alert("❌ Gagal memuat Qty Plans");
    }
  }, []);

  const loadWeeks = useCallback(async (entryId, customerPo, sku) => {
    try {
      const response = await masterDataAPI.getWeeks(customerPo, sku);
      console.log("📅 Weeks Response:", response);
      const rawData = Array.isArray(response) ? response : [];
      // Karena hanya ada 1 week per SKU, langsung ambil value pertama
      const weekValue = rawData.length > 0 ? rawData[0] : "";
      console.log("📅 Week Value:", weekValue);
      setFormEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                week: weekValue.toString(),
              }
            : entry,
        ),
      );
    } catch (err) {
      console.error("Gagal memuat Weeks:", err);
      alert("❌ Gagal memuat Weeks");
    }
  }, []);

  // Handle form entry changes with cascading logic
  const handleFormEntryChange = async (id, field, value) => {
    setFormEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;

        let updated = { ...entry, [field]: value };

        if (field === "customerId") {
          updated.poNumber = "";
          updated.customerPO = "";
          updated.sku = "";
          updated.quantityOrder = "";
          updated.week = "";
          updated.poNumbers = [];
          updated.customerPOs = [];
          updated.skus = [];

          if (value) {
            loadPoNumbers(id, value);
          }
        } else if (field === "poNumber") {
          updated.customerPO = "";
          updated.sku = "";
          updated.quantityOrder = "";
          updated.week = "";
          updated.customerPOs = [];
          updated.skus = [];

          if (value) {
            loadCustomerPOs(id, value);
          }
        } else if (field === "customerPO") {
          updated.sku = "";
          updated.quantityOrder = "";
          updated.week = "";
          updated.skus = [];

          if (value) {
            loadSkus(id, value);
          }
        } else if (field === "sku") {
          updated.quantityOrder = "";
          updated.week = "";

          if (value && updated.customerPO) {
            loadQtyPlans(id, updated.customerPO, value);
            loadWeeks(id, updated.customerPO, value);
          }
        }

        // Hitung remain quantity
        if (["quantityOrder", "quantityProduksi", "sku"].includes(field)) {
          const qtyOrder = parseFloat(updated.quantityOrder) || 0;
          const qtyProd = parseFloat(updated.quantityProduksi) || 0;
          updated.remainQuantity = qtyOrder - qtyProd;
        }

        return updated;
      }),
    );
  };

  // Add/remove entries
  const addFormEntry = () => {
    const newId = formEntries.length
      ? Math.max(...formEntries.map((e) => e.id)) + 1
      : 1;
    setFormEntries((prev) => [
      ...prev,
      {
        id: newId,
        customerId: "",
        poNumber: "",
        customerPO: "",
        sku: "",
        sCode: "",
        quantityOrder: "",
        quantityProduksi: "",
        week: "",
        remainQuantity: 0,
        customers: customers,
        poNumbers: [],
        customerPOs: [],
        skus: [],
      },
    ]);
  };

  const removeFormEntry = (id) => {
    if (formEntries.length > 1) {
      setFormEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const submitData = {
      timestamp: new Date(headerData.timestamp).toISOString(),
      shift: headerData.shift,
      group: headerData.group,
      time: headerData.time,
      entries: formEntries.map(
        ({
          id,
          customers,
          poNumbers,
          customerPOs,
          skus,
          ...entry
        }) => {
          const customerName =
            customers.find((c) => c.value == entry.customerId)?.label || ""; // Use .value and .label
          return {
            customer: customerName,
            poNumber: entry.poNumber,
            customerPO: entry.customerPO,
            sku: entry.sku,
            sCode: entry.sCode,
            quantityOrder: Number(entry.quantityOrder) || 0,
            quantityProduksi: Number(entry.quantityProduksi) || 0,
            week: entry.week,
            remainQuantity: Number(entry.remainQuantity) || 0,
          };
        },
      ),
    };

    try {
      console.log("Submitting data:", submitData);
      alert("✅ Data berhasil disimpan!");

      setHeaderData({
        timestamp: new Date().toISOString().slice(0, 16),
        shift: "1",
        group: "A",
        time: "08:00",
      });
      setFormEntries([
        {
          id: 1,
          customerId: "",
          poNumber: "",
          customerPO: "",
          sku: "",
          sCode: "",
          quantityOrder: "",
          quantityProduksi: "",
          week: "",
          remainQuantity: 0,
          customers: customers,
          poNumbers: [],
          customerPOs: [],
          skus: [],
        },
      ]);
    } catch (err) {
      console.error("Error submitting data:", err);
      const msg = err.message || "Terjadi kesalahan saat menyimpan data";
      setError(msg);
      alert(`❌ ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = getTimeOptions(headerData.shift);

  return (
    <div className="cutting-container">
      <div className="cutting-card">
        <div className="cutting-form-wrapper">
          <div className="cutting-header">
            <h1 className="cutting-title">
              <div className="cutting-title-icon">
                <Package className="w-7 h-7" />
              </div>
              Input Data Cutting
            </h1>
            <p className="cutting-subtitle">
              Masukkan data produksi cutting dengan lengkap dan akurat
            </p>
          </div>

          {error && <div className="cutting-error-banner">❌ {error}</div>}

          <form onSubmit={handleSubmit} className="cutting-form">
            {/* Header Section */}
            <div className="cutting-section">
              <div className="cutting-section-header">
                <h2 className="cutting-section-title">
                  <Calendar className="w-5 h-5" /> Header Information
                </h2>
              </div>
              <div className="cutting-header-grid">
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <div className="cutting-label-icon">
                      <Calendar />
                    </div>
                    Timestamp
                  </label>
                  <input
                    type="datetime-local"
                    name="timestamp"
                    value={headerData.timestamp}
                    onChange={handleHeaderChange}
                    className="cutting-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <div className="cutting-label-icon">
                      <Users />
                    </div>
                    Shift
                  </label>
                  <select
                    name="shift"
                    value={headerData.shift}
                    onChange={handleHeaderChange}
                    className="cutting-select"
                    disabled={isSubmitting}
                  >
                    <option value="1">Shift 1</option>
                    <option value="2">Shift 2</option>
                  </select>
                </div>
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <div className="cutting-label-icon">
                      <Users />
                    </div>
                    Group
                  </label>
                  <select
                    name="group"
                    value={headerData.group}
                    onChange={handleHeaderChange}
                    className="cutting-select"
                    disabled={isSubmitting}
                  >
                    <option value="A">Group A</option>
                    <option value="B">Group B</option>
                  </select>
                </div>
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <div className="cutting-label-icon">
                      <Calendar />
                    </div>
                    Time
                  </label>
                  <select
                    name="time"
                    value={headerData.time}
                    onChange={handleHeaderChange}
                    className="cutting-select"
                    disabled={isSubmitting}
                  >
                    {timeOptions.map((time, index) => (
                      <option
                        key={`time-${headerData.shift}-${time}`}
                        value={time}
                      >
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Entries */}
            <div className="cutting-section">
              <div className="cutting-section-header">
                <h2 className="cutting-section-title">
                  <FileText className="w-5 h-5" /> Form Information
                </h2>
              </div>

              {formEntries.map((entry, idx) => (
                <div key={entry.id} className="cutting-form-entry">
                  <div className="cutting-form-entry-header">
                    {formEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFormEntry(entry.id)}
                        className="cutting-remove-btn"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="cutting-grid">
                    {/* Customer */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <Users />
                        </div>
                        Customer
                      </label>
                      <select
                        value={entry.customerId}
                        onChange={(e) =>
                          handleFormEntryChange(
                            entry.id,
                            "customerId",
                            e.target.value,
                          )
                        }
                        className="cutting-select"
                        required
                        disabled={isSubmitting || loadingCustomers}
                      >
                        <option value="">Pilih Customer</option>
                        {(entry.customers || []).map((customer, idx) => (
                          <option
                            key={`customer-${entry.id}-${customer.value || idx}`}
                            value={customer.value}
                          >
                            {customer.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* PO Number */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <Hash />
                        </div>
                        PO Number
                      </label>
                      <select
                        value={entry.poNumber}
                        onChange={(e) =>
                          handleFormEntryChange(
                            entry.id,
                            "poNumber",
                            e.target.value,
                          )
                        }
                        className="cutting-select"
                        required
                        disabled={!entry.customerId || isSubmitting}
                      >
                        <option value="">Pilih PO Number</option>
                        {(entry.poNumbers || []).map((po, idx) => (
                          <option
                            key={`po-${entry.id}-${po.value || idx}`}
                            value={po.value}
                          >
                            {po.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Customer PO */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <FileText />
                        </div>
                        Customer PO
                      </label>
                      <select
                        value={entry.customerPO}
                        onChange={(e) =>
                          handleFormEntryChange(
                            entry.id,
                            "customerPO",
                            e.target.value,
                          )
                        }
                        className="cutting-select"
                        required
                        disabled={!entry.poNumber || isSubmitting}
                      >
                        <option value="">Pilih Customer PO</option>
                        {(entry.customerPOs || []).map((po, idx) => (
                          <option
                            key={`customerpo-${entry.id}-${po.value || idx}`}
                            value={po.value}
                          >
                            {po.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SKU */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <Package />
                        </div>
                        SKU
                      </label>
                      <select
                        value={entry.sku}
                        onChange={(e) =>
                          handleFormEntryChange(entry.id, "sku", e.target.value)
                        }
                        className="cutting-select"
                        required
                        disabled={!entry.customerPO || isSubmitting}
                      >
                        <option value="">Pilih SKU</option>
                        {(entry.skus || []).map((sku, idx) => (
                          <option
                            key={`sku-${entry.id}-${sku.value || idx}`}
                            value={sku.value}
                          >
                            {sku.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* S.CODE */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <Hash />
                        </div>
                        S.CODE
                      </label>
                      <input
                        type="text"
                        value={entry.sCode}
                        onChange={(e) =>
                          handleFormEntryChange(
                            entry.id,
                            "sCode",
                            e.target.value,
                          )
                        }
                        className="cutting-input"
                        placeholder="Enter S.CODE"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Quantity Order */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <BarChart3 />
                        </div>
                        Quantity Order (Planned Qty)
                      </label>
                      <input
                        type="number"
                        value={entry.quantityOrder}
                        readOnly
                        className="cutting-input cutting-input-readonly"
                        placeholder="Auto-fill ketika SKU dipilih"
                        disabled
                      />
                    </div>

                    {/* Quantity Produksi */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <BarChart3 />
                        </div>
                        Quantity Produksi
                      </label>
                      <input
                        type="number"
                        value={entry.quantityProduksi}
                        onChange={(e) =>
                          handleFormEntryChange(
                            entry.id,
                            "quantityProduksi",
                            e.target.value,
                          )
                        }
                        className="cutting-input"
                        min="0"
                        step="1"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Remain Quantity */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <BarChart3 />
                        </div>
                        Remain Quantity
                      </label>
                      <input
                        type="number"
                        value={entry.remainQuantity}
                        readOnly
                        className="cutting-input cutting-input-readonly"
                        disabled
                      />
                    </div>

                    {/* Week */}
                    <div className="cutting-field-group">
                      <label className="cutting-label">
                        <div className="cutting-label-icon">
                          <Calendar />
                        </div>
                        Week
                      </label>
                      <input
                        type="text"
                        value={entry.week}
                        readOnly
                        className="cutting-input cutting-input-readonly"
                        placeholder="Auto-fill ketika SKU dipilih"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="cutting-add-entry-container">
                <button
                  type="button"
                  onClick={addFormEntry}
                  className="cutting-add-btn"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" /> Add Entry
                </button>
              </div>
            </div>

            <div className="cutting-submit-container">
              <button
                type="submit"
                className="cutting-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit All Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputCutting;
