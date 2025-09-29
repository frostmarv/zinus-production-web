import React, { useState, useEffect } from "react";
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
import { cuttingProductionAPI } from "../../api/cutting";
import "../../styles/Cutting/InputCutting.css";

const InputCutting = () => {
  // === Header State ===
  const [headerData, setHeaderData] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    shift: "1",
    group: "A",
    time: "08:00",
    customerId: "",
    poNumber: "",
    customerPo: "",
    sku: "",
    qtyPlan: "",
    week: "",
  });

  // === Form Entries ===
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
      poNumbers: [],
      customerPOs: [],
      skus: [],
    },
  ]);

  // === Master Data Options (Header) ===
  const [customerOptions, setCustomerOptions] = useState([]);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [customerPoOptions, setCustomerPoOptions] = useState([]);
  const [skuOptions, setSkuOptions] = useState([]);
  const [qtyOptions, setQtyOptions] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);

  // === Loading States ===
  const [loadingOptions, setLoadingOptions] = useState({
    customers: false,
    poNumbers: false,
    customerPos: false,
    skus: false,
    qtyPlans: false,
    weeks: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // === Load Customers on Mount ===
  useEffect(() => {
    const loadCustomers = async () => {
      setLoadingOptions((prev) => ({ ...prev, customers: true }));
      try {
        const customers = await masterDataAPI.getCustomers();
        setCustomerOptions(customers);
      } catch (error) {
        console.error("Error loading customers:", error);
        alert("❌ Gagal memuat data customer");
      } finally {
        setLoadingOptions((prev) => ({ ...prev, customers: false }));
      }
    };
    loadCustomers();
  }, []);

  // === Helper: Fetch PO Numbers ===
  const fetchPoNumbers = async (
    customerId,
    isHeader = false,
    entryId = null,
  ) => {
    if (!customerId) return;
    try {
      const data = await masterDataAPI.getPoNumbers(customerId);
      if (isHeader) {
        setPoNumberOptions(data);
      } else {
        setFormEntries((prev) =>
          prev.map((e) =>
            e.id === entryId
              ? { ...e, poNumbers: data.map((item) => item.poNumber || item) }
              : e,
          ),
        );
      }
    } catch (err) {
      console.error("Error fetching PO Numbers:", err);
      alert("❌ Gagal memuat PO Numbers");
    }
  };

  // === Helper: Fetch Customer POs ===
  const fetchCustomerPos = async (
    poNumber,
    isHeader = false,
    entryId = null,
  ) => {
    if (!poNumber) return;
    try {
      const data = await masterDataAPI.getCustomerPos(poNumber);
      if (isHeader) {
        setCustomerPoOptions(data);
      } else {
        setFormEntries((prev) =>
          prev.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                  customerPOs: data.map((item) => item.customerPo || item),
                }
              : e,
          ),
        );
      }
    } catch (err) {
      console.error("Error fetching Customer POs:", err);
      alert("❌ Gagal memuat Customer PO");
    }
  };

  // === Helper: Fetch SKUs ===
  const fetchSkus = async (customerPo, isHeader = false, entryId = null) => {
    if (!customerPo) return;
    try {
      const data = await masterDataAPI.getSkus(customerPo);
      if (isHeader) {
        setSkuOptions(data);
      } else {
        setFormEntries((prev) =>
          prev.map((e) => (e.id === entryId ? { ...e, skus: data } : e)),
        );
      }
    } catch (err) {
      console.error("Error fetching SKUs:", err);
      alert("❌ Gagal memuat SKU");
    }
  };

  // === Header Handlers ===
  const handleCustomerChange = async (customerId) => {
    setHeaderData((prev) => ({
      ...prev,
      customerId,
      poNumber: "",
      customerPo: "",
      sku: "",
      qtyPlan: "",
      week: "",
    }));
    setPoNumberOptions([]);
    setCustomerPoOptions([]);
    setSkuOptions([]);
    setQtyOptions([]);
    setWeekOptions([]);

    if (customerId) {
      await fetchPoNumbers(customerId, true);
    }
  };

  const handlePoNumberChange = async (poNumber) => {
    setHeaderData((prev) => ({
      ...prev,
      poNumber,
      customerPo: "",
      sku: "",
      qtyPlan: "",
      week: "",
    }));
    setCustomerPoOptions([]);
    setSkuOptions([]);
    setQtyOptions([]);
    setWeekOptions([]);

    if (poNumber) {
      await fetchCustomerPos(poNumber, true);
    }
  };

  const handleCustomerPoChange = async (customerPo) => {
    setHeaderData((prev) => ({
      ...prev,
      customerPo,
      sku: "",
      qtyPlan: "",
      week: "",
    }));
    setSkuOptions([]);
    setQtyOptions([]);
    setWeekOptions([]);

    if (customerPo) {
      await fetchSkus(customerPo, true);
    }
  };

  const handleSkuChange = async (sku) => {
    setHeaderData((prev) => ({ ...prev, sku, qtyPlan: "", week: "" }));
    setQtyOptions([]);
    setWeekOptions([]);

    if (sku && headerData.customerPo) {
      try {
        const [qtys, weeks] = await Promise.all([
          masterDataAPI.getQtyPlans(headerData.customerPo, sku),
          masterDataAPI.getWeeks(headerData.customerPo, sku),
        ]);
        setQtyOptions(qtys);
        setWeekOptions(weeks);

        if (qtys.length > 0) {
          setHeaderData((prev) => ({
            ...prev,
            qtyPlan: qtys[0].qty || qtys[0],
          }));
        }
        if (weeks.length > 0) {
          setHeaderData((prev) => ({
            ...prev,
            week: weeks[0].week || weeks[0],
          }));
        }
      } catch (err) {
        console.error("Error loading Qty/Week:", err);
        alert("❌ Gagal memuat Qty Plan dan Week");
      }
    }
  };

  // === Time Options ===
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

  // === Header Change (non-cascading fields) ===
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "shift" && { time: getTimeOptions(value)[0] || "08:00" }),
    }));
  };

  // === Form Entry Change ===
  const handleFormEntryChange = async (id, field, value) => {
    setFormEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;

        let updated = { ...entry, [field]: value };

        if (field === "customerId") {
          updated = {
            ...updated,
            poNumber: "",
            customerPO: "",
            sku: "",
            quantityOrder: "",
            week: "",
            poNumbers: [],
            customerPOs: [],
            skus: [],
          };
        } else if (field === "poNumber") {
          updated = {
            ...updated,
            customerPO: "",
            sku: "",
            quantityOrder: "",
            week: "",
            customerPOs: [],
            skus: [],
          };
        } else if (field === "customerPO") {
          updated = {
            ...updated,
            sku: "",
            quantityOrder: "",
            week: "",
            skus: [],
          };
        } else if (field === "sku") {
          const selectedItem = entry.skus.find((item) => item.sku === value);
          updated.quantityOrder = selectedItem?.planned_qty?.toString() || "";
          updated.week = selectedItem?.week_number?.toString() || "";
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

    // Trigger API calls after state update
    if (field === "customerId" && value) {
      await fetchPoNumbers(value, false, id);
    } else if (field === "poNumber" && value) {
      await fetchCustomerPos(value, false, id);
    } else if (field === "customerPO" && value) {
      await fetchSkus(value, false, id);
    }
  };

  // === Add/Remove Entries ===
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

  // === Submit Handler ===
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
        ({ id, poNumbers, customerPOs, skus, ...entry }) => {
          const customer = customerOptions.find(
            (c) => c.id == entry.customerId,
          );
          return {
            customer: customer ? customer.name : "",
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
      await cuttingProductionAPI.save(submitData);
      alert("✅ Data berhasil disimpan!");

      // Reset form
      setHeaderData({
        timestamp: new Date().toISOString().slice(0, 16),
        shift: "1",
        group: "A",
        time: "08:00",
        customerId: "",
        poNumber: "",
        customerPo: "",
        sku: "",
        qtyPlan: "",
        week: "",
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
    <div className="cutting-form-wrapper">
      <div>
        <h1 className="cutting-title">
          <Package className="w-7 h-7" /> Input Data Cutting
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
              <label className="cutting-label">Timestamp</label>
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
              <label className="cutting-label">Shift</label>
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
              <label className="cutting-label">Group</label>
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
              <label className="cutting-label">Time</label>
              <select
                name="time"
                value={headerData.time}
                onChange={handleHeaderChange}
                className="cutting-select"
                disabled={isSubmitting}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cascading Dropdowns - Header */}
          <div className="form-group">
            <label>Week</label>
            <select
              value={headerData.week}
              onChange={(e) =>
                setHeaderData((prev) => ({ ...prev, week: e.target.value }))
              }
              className="form-input"
              disabled={weekOptions.length === 0}
            >
              <option value="">Pilih Week</option>
              {weekOptions.map((week, index) => (
                <option key={`week-${index}`} value={week.week || week}>
                  {week.week || week}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Customer</label>
            <select
              value={headerData.customerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="form-input"
              disabled={loadingOptions.customers}
            >
              <option value="">Pilih Customer</option>
              {customerOptions.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>PO Number</label>
            <select
              value={headerData.poNumber}
              onChange={(e) => handlePoNumberChange(e.target.value)}
              className="form-input"
              disabled={!headerData.customerId}
            >
              <option value="">Pilih PO Number</option>
              {poNumberOptions.map((po, index) => (
                <option key={`po-${index}`} value={po.poNumber || po}>
                  {po.poNumber || po}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Customer PO</label>
            <select
              value={headerData.customerPo}
              onChange={(e) => handleCustomerPoChange(e.target.value)}
              className="form-input"
              disabled={!headerData.poNumber}
            >
              <option value="">Pilih Customer PO</option>
              {customerPoOptions.map((po, index) => (
                <option key={`cpo-${index}`} value={po.customerPo || po}>
                  {po.customerPo || po}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>SKU</label>
            <select
              value={headerData.sku}
              onChange={(e) => handleSkuChange(e.target.value)}
              className="form-input"
              disabled={!headerData.customerPo}
            >
              <option value="">Pilih SKU</option>
              {skuOptions.map((sku, index) => (
                <option key={`sku-${index}`} value={sku.sku || sku}>
                  {sku.sku || sku}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Qty Plan</label>
            <select
              value={headerData.qtyPlan}
              onChange={(e) =>
                setHeaderData((prev) => ({ ...prev, qtyPlan: e.target.value }))
              }
              className="form-input"
              disabled={qtyOptions.length === 0}
            >
              <option value="">Pilih Qty Plan</option>
              {qtyOptions.map((qty, index) => (
                <option key={`qty-${index}`} value={qty.qty || qty}>
                  {qty.qty || qty}
                </option>
              ))}
            </select>
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
                <h3 className="cutting-entry-title">Entry {idx + 1}</h3>
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
                    <Users /> Customer
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
                    disabled={isSubmitting}
                  >
                    <option value="">Pilih Customer</option>
                    {customerOptions.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PO Number */}
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <Hash /> PO Number
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
                    {entry.poNumbers.map((po, i) => (
                      <option key={`entry-po-${entry.id}-${i}`} value={po}>
                        {po}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer PO */}
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <FileText /> Customer PO
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
                    {entry.customerPOs.map((po, i) => (
                      <option key={`entry-cpo-${entry.id}-${i}`} value={po}>
                        {po}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU */}
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <Package /> SKU
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
                    {entry.skus.map((item, i) => (
                      <option
                        key={`entry-sku-${entry.id}-${i}`}
                        value={item.sku}
                      >
                        {item.sku} ({item.item_number})
                      </option>
                    ))}
                  </select>
                </div>

                {/* S.CODE */}
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <Hash /> S.CODE
                  </label>
                  <input
                    type="text"
                    value={entry.sCode}
                    onChange={(e) =>
                      handleFormEntryChange(entry.id, "sCode", e.target.value)
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
                    <BarChart3 /> Quantity Order
                  </label>
                  <input
                    type="number"
                    value={entry.quantityOrder}
                    readOnly
                    className="cutting-input cutting-input-readonly"
                    disabled
                  />
                </div>

                {/* Quantity Produksi */}
                <div className="cutting-field-group">
                  <label className="cutting-label">
                    <BarChart3 /> Quantity Produksi
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
                    <BarChart3 /> Remain Quantity
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
                    <Calendar /> Week
                  </label>
                  <input
                    type="text"
                    value={entry.week}
                    readOnly
                    className="cutting-input cutting-input-readonly"
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
  );
};

export default InputCutting;
