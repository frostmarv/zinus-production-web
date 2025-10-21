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
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { masterDataAPI } from "../../api/masterData";
import { cuttingProductionAPI } from "../../api/cutting";
import "../../styles/Cutting/InputCutting.css";
import { formatAsJakarta } from "../../utils/timezone";

// Komponen Notifikasi Custom
const CuttingNotification = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess
    ? "var(--cutting-success-light)"
    : "var(--cutting-error-light)";
  const borderColor = isSuccess
    ? "var(--cutting-success-color)"
    : "var(--cutting-error-color)";
  const textColor = isSuccess
    ? "var(--cutting-success-color)"
    : "var(--cutting-error-color)";

  return (
    <div
      className="cutting-notification"
      style={{
        background: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        color: textColor,
      }}
    >
      <div className="cutting-notification-icon">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
      </div>
      <div className="cutting-notification-message">{message}</div>
      <button
        className="cutting-notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

const InputCutting = () => {
  // ... (semua state awal tetap sama)
  const [headerData, setHeaderData] = useState({
    shift: "1",
    group: "A",
    time: "08:00",
    machine: "",
    operator: "",
  });

  const [currentTimestamp, setCurrentTimestamp] = useState(new Date());
  const [formEntries, setFormEntries] = useState([
    {
      id: 1,
      customerId: "",
      poNumber: "",
      sku: "",
      sCode: "",
      description: "",
      quantityOrder: "",
      quantityProduksi: "",
      week: "",
      remainQuantity: 0,
      plannedQtyCache: 0,
      isHole: false,
      foamingDate: "",
      customers: [],
      poNumbers: [],
      skus: [],
      sCodes: [],
      sCodesData: [],
    },
  ]);

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ✨ State untuk notifikasi custom
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success", // 'success' | 'error'
  });

  // Fungsi helper untuk tampilkan notifikasi
  const showNotification = (message, type = "success") => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  // Auto-update waktu
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await masterDataAPI.getCustomers();
        const data = Array.isArray(response) ? response : [];
        setCustomers(data);
        setFormEntries((prev) =>
          prev.map((entry) => ({ ...entry, customers: data })),
        );
      } catch (err) {
        console.error("Gagal memuat data customers:", err);
        setError("Gagal memuat data customers");
        showNotification("❌ Gagal memuat data customers", "error");
      } finally {
        setLoadingCustomers(false);
      }
    };
    loadCustomers();
  }, []);

  // ... (semua fungsi loadPoNumbers, loadSkus, dll tetap sama — hanya ganti alert jadi showNotification)

  const loadPoNumbers = useCallback(async (entryId, customerId) => {
    try {
      const response = await masterDataAPI.getPoNumbers(customerId);
      const data = Array.isArray(response) ? response : [];
      setFormEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, poNumbers: data } : entry,
        ),
      );
    } catch (err) {
      console.error("Gagal memuat PO Numbers:", err);
      showNotification("❌ Gagal memuat PO Numbers", "error");
    }
  }, []);

  const loadSkus = useCallback(async (entryId, poNumber) => {
    try {
      const response = await masterDataAPI.getCustomerPOs(poNumber);
      const customerPOs = Array.isArray(response) ? response : [];

      if (customerPOs.length > 0) {
        const customerPO = customerPOs[0].value;
        const skuResponse = await masterDataAPI.getSkus(customerPO);
        const data = Array.isArray(skuResponse) ? skuResponse : [];
        setFormEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, skus: data } : entry,
          ),
        );
      } else {
        setFormEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, skus: [] } : entry,
          ),
        );
      }
    } catch (err) {
      console.error("Gagal memuat SKUs:", err);
      setFormEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, skus: [] } : entry,
        ),
      );
      showNotification("❌ Gagal memuat SKUs", "error");
    }
  }, []);

  const loadQtyPlans = useCallback(async (entryId, poNumber, sku) => {
    try {
      const customerPOs = await masterDataAPI.getCustomerPOs(poNumber);
      if (customerPOs.length > 0) {
        const customerPO = customerPOs[0].value;
        const response = await masterDataAPI.getQtyPlans(customerPO, sku);
        const rawData = Array.isArray(response) ? response : [];
        const qtyValue =
          rawData.length > 0 && rawData[0].value !== undefined
            ? rawData[0].value
            : "";

        const sCodesRaw =
          rawData.length > 0 && rawData[0].s_codes ? rawData[0].s_codes : [];

        const sCodesOptions = sCodesRaw.map((item) => ({
          value: item.s_code,
          label: item.s_code,
        }));

        const plannedQty = Number(qtyValue) || 0;

        setFormEntries((prevEntries) => {
          return prevEntries.map((entry) => {
            if (entry.id !== entryId) return entry;
            return {
              ...entry,
              quantityOrder: qtyValue.toString(),
              sCodes: sCodesOptions,
              sCodesData: sCodesRaw,
              plannedQtyCache: plannedQty,
            };
          });
        });
      }
    } catch (err) {
      console.error("Gagal memuat Qty Plans:", err);
      showNotification("❌ Gagal memuat Qty Plans", "error");
    }
  }, []);

  const loadWeeks = useCallback(async (entryId, poNumber, sku) => {
    try {
      const customerPOs = await masterDataAPI.getCustomerPOs(poNumber);
      if (customerPOs.length > 0) {
        const customerPO = customerPOs[0].value;
        const response = await masterDataAPI.getWeeks(customerPO, sku);
        const rawData = Array.isArray(response) ? response : [];
        const weekValue =
          rawData.length > 0 && rawData[0].value !== undefined
            ? rawData[0].value
            : "";
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
      }
    } catch (err) {
      console.error("Gagal memuat Weeks:", err);
      showNotification("❌ Gagal memuat Weeks", "error");
    }
  }, []);

  const loadRemainQuantity = useCallback(
    async (entryId, poNumber, sku, sCode) => {
      try {
        const customerPOs = await masterDataAPI.getCustomerPOs(poNumber);
        if (customerPOs.length > 0) {
          const customerPO = customerPOs[0].value;
          const response = await masterDataAPI.getRemainQuantity(
            customerPO,
            sku,
            sCode,
          );
          console.log("📊 Remain Quantity dari API:", response);

          const remainQty =
            response?.remainQuantity !== undefined
              ? Number(response.remainQuantity)
              : 0;

          setFormEntries((prev) =>
            prev.map((entry) =>
              entry.id === entryId
                ? {
                    ...entry,
                    remainQuantity: remainQty,
                  }
                : entry,
            ),
          );
        }
      } catch (err) {
        console.error("Gagal memuat Remain Quantity:", err);
        setFormEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  remainQuantity: 0,
                }
              : entry,
          ),
        );
        // Tidak perlu notifikasi error di sini karena ini opsional
      }
    },
    [],
  );

  // ... (handleFormEntryChange, addFormEntry, removeFormEntry tetap sama)

  const handleFormEntryChange = async (id, field, value) => {
    setFormEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;

        if (field === "isHole") {
          return { ...entry, isHole: value };
        }

        if (field === "foamingDateEnabled") {
          return {
            ...entry,
            foamingDate: value ? new Date().toISOString() : "",
          };
        }

        if (field === "foamingDate") {
          return { ...entry, foamingDate: value };
        }

        let updated = { ...entry, [field]: value };

        if (field === "customerId") {
          updated.poNumber = "";
          updated.sku = "";
          updated.sCode = "";
          updated.description = "";
          updated.quantityOrder = "";
          updated.quantityProduksi = "";
          updated.week = "";
          updated.remainQuantity = 0;
          updated.poNumbers = [];
          updated.skus = [];
          updated.sCodes = [];
          updated.sCodesData = [];
          updated.isHole = false;
          updated.foamingDate = "";

          if (value) {
            loadPoNumbers(id, value);
          }
        } else if (field === "poNumber") {
          updated.sku = "";
          updated.sCode = "";
          updated.description = "";
          updated.quantityOrder = "";
          updated.quantityProduksi = "";
          updated.week = "";
          updated.remainQuantity = 0;
          updated.skus = [];
          updated.sCodes = [];
          updated.sCodesData = [];
          updated.isHole = false;
          updated.foamingDate = "";

          if (value) {
            loadSkus(id, value);
          }
        } else if (field === "sku") {
          updated.quantityOrder = "";
          updated.quantityProduksi = "";
          updated.week = "";
          updated.sCode = "";
          updated.description = "";
          updated.remainQuantity = 0;
          updated.sCodes = [];
          updated.sCodesData = [];
          updated.isHole = false;
          updated.foamingDate = "";

          if (value && updated.poNumber) {
            loadQtyPlans(id, updated.poNumber, value);
            loadWeeks(id, updated.poNumber, value);
          }
        } else if (field === "sCode") {
          const selectedSCode = entry.sCodesData?.find(
            (item) => item.s_code === value,
          );
          updated.description = selectedSCode?.description || "";
          updated.isHole = false;
          updated.foamingDate = "";

          if (value && updated.poNumber && updated.sku) {
            loadRemainQuantity(id, updated.poNumber, updated.sku, value);
          } else {
            updated.remainQuantity = 0;
          }
        }

        return updated;
      }),
    );
  };

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
        sku: "",
        sCode: "",
        description: "",
        quantityOrder: "",
        quantityProduksi: "",
        week: "",
        remainQuantity: 0,
        plannedQtyCache: 0,
        isHole: false,
        foamingDate: "",
        customers: customers,
        poNumbers: [],
        skus: [],
        sCodes: [],
        sCodesData: [],
      },
    ]);
  };

  const removeFormEntry = (id) => {
    if (formEntries.length > 1) {
      setFormEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // ✨ handleSubmit: ganti alert jadi notifikasi custom
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const actualSubmitTime = new Date().toISOString();

    const submitData = {
      timestamp: actualSubmitTime,
      shift: headerData.shift,
      group: headerData.group,
      time: headerData.time,
      machine: headerData.machine,
      operator: headerData.operator,
      entries: formEntries.map(
        ({
          id,
          customers,
          poNumbers,
          skus,
          sCodes,
          sCodesData,
          plannedQtyCache,
          remainQuantity,
          ...entry
        }) => {
          const customerName =
            customers.find((c) => c.value == entry.customerId)?.label || "";
          return {
            customer: customerName,
            poNumber: entry.poNumber,
            sku: entry.sku,
            sCode: entry.sCode,
            description: entry.description,
            quantityOrder: Number(entry.quantityOrder) || 0,
            quantityProduksi: Number(entry.quantityProduksi) || 0,
            week: entry.week,
            isHole: entry.isHole,
            foamingDate: entry.foamingDate || null,
          };
        },
      ),
    };

    try {
      console.log("Submitting ", submitData);
      const response = await cuttingProductionAPI.save(submitData);
      console.log("Response dari server:", response);

      // ✅ Notifikasi sukses
      showNotification("✅ Data berhasil disimpan ke database!");

      // Reset form
      setHeaderData({
        shift: "1",
        group: "A",
        time: "08:00",
        machine: "",
        operator: "",
      });
      setFormEntries([
        {
          id: 1,
          customerId: "",
          poNumber: "",
          sku: "",
          sCode: "",
          description: "",
          quantityOrder: "",
          quantityProduksi: "",
          week: "",
          remainQuantity: 0,
          plannedQtyCache: 0,
          isHole: false,
          foamingDate: "",
          customers: customers,
          poNumbers: [],
          skus: [],
          sCodes: [],
          sCodesData: [],
        },
      ]);
    } catch (err) {
      console.error("Error submitting ", err);
      let msg = "Terjadi kesalahan saat menyimpan data";
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === "string") {
          msg = errorData;
        } else if (errorData.message) {
          msg = errorData.message;
        } else if (errorData.error) {
          msg = errorData.error;
        } else if (errorData.errors) {
          msg = JSON.stringify(errorData.errors);
        }
        console.error("Backend error details:", errorData);
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      // ❌ Notifikasi error
      showNotification(`❌ Gagal menyimpan: ${msg}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "shift" && { time: getTimeOptions(value)[0] || "08:00" }),
    }));
  };

  const timeOptions = getTimeOptions(headerData.shift);
  const displayTimestamp = formatAsJakarta(currentTimestamp.toISOString());

  return (
    <div className="input-cutting-root">
      {/* ✨ Notifikasi Custom */}
      <CuttingNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />

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
              {/* ... (semua JSX form tetap sama) */}
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
                    <div className="cutting-timestamp-display">
                      {displayTimestamp}
                    </div>
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
                      {timeOptions.map((time) => (
                        <option
                          key={`time-${headerData.shift}-${time}`}
                          value={time}
                        >
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="cutting-field-group">
                    <label className="cutting-label">
                      <div className="cutting-label-icon">
                        <Package />
                      </div>
                      Machine
                    </label>
                    <select
                      name="machine"
                      value={headerData.machine}
                      onChange={handleHeaderChange}
                      className="cutting-select"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Pilih Machine</option>
                      <option value="Multi Cutting 1">Multi Cutting 1</option>
                      <option value="Multi Cutting 2">Multi Cutting 2</option>
                      <option value="Rountable 1">Rountable 1</option>
                      <option value="Rountable 2">Rountable 2</option>
                      <option value="Rountable 3">Rountable 3</option>
                      <option value="Rountable 4">Rountable 4</option>
                      <option value="Vertikal 1">Vertikal 1</option>
                      <option value="Vertikal 2">Vertikal 2</option>
                      <option value="Vertikal 3">Vertikal 3</option>
                    </select>
                  </div>
                  <div className="cutting-field-group">
                    <label className="cutting-label">
                      <div className="cutting-label-icon">
                        <Users />
                      </div>
                      Nama Operator
                    </label>
                    <input
                      type="text"
                      name="operator"
                      value={headerData.operator}
                      onChange={handleHeaderChange}
                      className="cutting-input"
                      placeholder="Masukkan nama operator"
                      required
                      disabled={isSubmitting}
                    />
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

                {formEntries.map((entry) => (
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
                      {/* ... (semua field form tetap sama) */}
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
                            handleFormEntryChange(
                              entry.id,
                              "sku",
                              e.target.value,
                            )
                          }
                          className="cutting-select"
                          required
                          disabled={!entry.poNumber || isSubmitting}
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

                      <div className="cutting-field-group">
                        <label className="cutting-label">
                          <div className="cutting-label-icon">
                            <Hash />
                          </div>
                          S.CODE
                        </label>
                        <select
                          value={entry.sCode}
                          onChange={(e) =>
                            handleFormEntryChange(
                              entry.id,
                              "sCode",
                              e.target.value,
                            )
                          }
                          className="cutting-select"
                          required={(entry.sCodes || []).length > 0}
                          disabled={
                            !entry.sku ||
                            (entry.sCodes || []).length === 0 ||
                            isSubmitting
                          }
                        >
                          <option value="">
                            {(entry.sCodes || []).length === 0
                              ? "Tidak ada S.CODE"
                              : "Pilih S.CODE"}
                          </option>
                          {(entry.sCodes || []).map((sCode, idx) => (
                            <option
                              key={`scode-${entry.id}-${sCode.value || idx}`}
                              value={sCode.value}
                            >
                              {sCode.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="cutting-field-group">
                        <label className="cutting-label">
                          <div className="cutting-label-icon">
                            <FileText />
                          </div>
                          Description
                        </label>
                        <input
                          type="text"
                          value={entry.description}
                          readOnly
                          className="cutting-input cutting-input-readonly"
                          placeholder="Auto-fill ketika S.CODE dipilih"
                          disabled
                        />
                      </div>

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

                      <div className="cutting-field-group">
                        <label className="cutting-label">
                          <div className="cutting-label-icon">
                            <Package />
                          </div>
                          Hole
                        </label>
                        <label className="cutting-checkbox-label">
                          <input
                            type="checkbox"
                            checked={entry.isHole}
                            onChange={(e) =>
                              handleFormEntryChange(
                                entry.id,
                                "isHole",
                                e.target.checked,
                              )
                            }
                            disabled={isSubmitting}
                            className="cutting-checkbox"
                          />
                          <span>Item ini di Hole</span>
                        </label>
                      </div>

                      <div className="cutting-field-group">
                        <label className="cutting-label">
                          <div className="cutting-label-icon">
                            <Calendar />
                          </div>
                          Foaming Date
                        </label>
                        <label className="cutting-checkbox-label">
                          <input
                            type="checkbox"
                            checked={!!entry.foamingDate}
                            onChange={(e) =>
                              handleFormEntryChange(
                                entry.id,
                                "foamingDateEnabled",
                                e.target.checked,
                              )
                            }
                            disabled={isSubmitting}
                            className="cutting-checkbox"
                          />
                          <span>Item ini dalam Foaming Date</span>
                        </label>
                        {entry.foamingDate && (
                          <input
                            type="datetime-local"
                            value={new Date(entry.foamingDate)
                              .toISOString()
                              .slice(0, 16)}
                            onChange={(e) =>
                              handleFormEntryChange(
                                entry.id,
                                "foamingDate",
                                e.target.value,
                              )
                            }
                            className="cutting-input"
                            disabled={isSubmitting}
                          />
                        )}
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
    </div>
  );
};

export default InputCutting;
