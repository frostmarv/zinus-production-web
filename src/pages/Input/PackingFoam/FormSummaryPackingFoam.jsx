// src/pages/Input/PackingFoam/FormSummaryPackingFoam.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPackingFoamSummary } from '../../../api/packingFoam'; // ✅ Gunakan packingFoam.js
import { masterDataAPI } from '../../../api/masterData'; // ✅ Gunakan masterData.js
import { localToUtc } from '../../../utils/timezone'; // ✅ Gunakan timezone helper
import '../../../styles/Input/PackingFoam/FormSummaryPackingFoam.css';

const FormSummaryPackingFoam = () => {
  const navigate = useNavigate();

  // === HEADER ===
  const [shift, setShift] = useState('1');
  const [group, setGroup] = useState('A');
  const [timeSlot, setTimeSlot] = useState('');
  const [machine, setMachine] = useState('');

  // === KASHIFT & ADMIN ===
  const [kashift, setKashift] = useState('');
  const [admin, setAdmin] = useState('');

  // === MASTER DATA ===
  const [customer, setCustomer] = useState(''); // VALUE (ID)
  const [customerLabel, setCustomerLabel] = useState(''); // LABEL for backend
  const [poNumber, setPoNumber] = useState('');
  const [customerPo, setCustomerPo] = useState('');
  const [sku, setSku] = useState('');

  // === AUTO-FILLED ===
  const [quantityOrder, setQuantityOrder] = useState(null);
  const [remainQuantity, setRemainQuantity] = useState(null); // Tetap ada untuk backend
  const [week, setWeek] = useState(null);
  const [quantityProduksi, setQuantityProduksi] = useState('');

  // === LOADING STATES ===
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingPoNumbers, setLoadingPoNumbers] = useState(false);
  const [loadingCustomerPos, setLoadingCustomerPos] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === DATA LISTS ===
  const [customers, setCustomers] = useState([]);
  const [poNumbers, setPoNumbersList] = useState([]);
  const [customerPos, setCustomerPosList] = useState([]);
  const [skus, setSkusList] = useState([]);

  // === TIME SLOTS ===
  const getTimeSlots = (shiftVal) => {
    if (shiftVal === '1') {
      // Shift 1: 08.00 - 12.00 (4 jam, 4 slot)
      return Array.from({ length: 4 }, (_, i) => {
        const start = 8 + i;
        const end = start + 1;
        return `${String(start).padStart(2, '0')}.00 - ${String(end).padStart(2, '0')}.00`;
      });
    } else {
      // Shift 2: 13.00 - 20.00 (7 jam, 7 slot)
      return Array.from({ length: 7 }, (_, i) => {
        const start = 13 + i;
        const end = start + 1;
        return `${String(start).padStart(2, '0')}.00 - ${String(end).padStart(2, '0')}.00`;
      });
    }
  };

  // === UPDATE KASHIFT & ADMIN BASED ON GROUP ===
  useEffect(() => {
    if (group === 'A') {
      setKashift('Lutfi');
      setAdmin('Epsum');
    } else if (group === 'B') {
      setKashift('Akbar');
      setAdmin('Jannah');
    } else {
      setKashift('');
      setAdmin('');
    }
  }, [group]);

  // === INITIALIZE TIME SLOT ===
  useEffect(() => {
    setTimeSlot(getTimeSlots(shift)[0]);
  }, [shift]);

  // === LOAD CUSTOMERS ===
  useEffect(() => {
    const loadCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const data = await masterDataAPI.getCustomers();
        setCustomers(data);
      } catch (err) {
        alert('Gagal memuat customer: ' + err.message);
      } finally {
        setLoadingCustomers(false);
      }
    };
    loadCustomers();
  }, []);

  // === LOAD PO NUMBERS ===
  useEffect(() => {
    if (!customer) return;
    const loadPoNumbers = async () => {
      setLoadingPoNumbers(true);
      try {
        const data = await masterDataAPI.getPoNumbers(customer);
        setPoNumbersList(data);
        setCustomerPosList([]);
        setSkusList([]);
        setPoNumber('');
        setCustomerPo('');
        setSku('');
        setQuantityOrder(null);
        setRemainQuantity(null);
        setWeek(null);
      } catch (err) {
        alert('Gagal memuat PO Numbers: ' + err.message);
      } finally {
        setLoadingPoNumbers(false);
      }
    };
    loadPoNumbers();
  }, [customer]);

  // === LOAD CUSTOMER POs ===
  useEffect(() => {
    if (!poNumber) return;
    const loadCustomerPos = async () => {
      setLoadingCustomerPos(true);
      try {
        const data = await masterDataAPI.getCustomerPOs(poNumber);
        setCustomerPosList(data);
        setSkusList([]);
        setCustomerPo('');
        setSku('');
        setQuantityOrder(null);
        setRemainQuantity(null);
        setWeek(null);
      } catch (err) {
        alert('Gagal memuat Customer POs: ' + err.message);
      } finally {
        setLoadingCustomerPos(false);
      }
    };
    loadCustomerPos();
  }, [poNumber]);

  // === LOAD SKUs ===
  useEffect(() => {
    if (!customerPo) return;
    const loadSkus = async () => {
      setLoadingSkus(true);
      try {
        const data = await masterDataAPI.getSkus(customerPo);
        setSkusList(data);
        setSku('');
        setQuantityOrder(null);
        setRemainQuantity(null);
        setWeek(null);
      } catch (err) {
        alert('Gagal memuat SKUs: ' + err.message);
      } finally {
        setLoadingSkus(false);
      }
    };
    loadSkus();
  }, [customerPo]);

  // === LOAD ALL MASTER DATA ===
  useEffect(() => {
    if (!customerPo || !sku) return;
    const loadAllData = async () => {
      setLoadingData(true);
      try {
        const [qtyPlansRes, weeksRes] = await Promise.all([
          masterDataAPI.getQtyPlans(customerPo, sku),
          masterDataAPI.getWeeks(customerPo, sku),
        ]);

        let qtyOrder = null;
        let sCodes = [];
        if (qtyPlansRes.length > 0) {
          const firstPlan = qtyPlansRes[0];
          qtyOrder = typeof firstPlan.value === 'number' ? firstPlan.value : parseInt(firstPlan.value, 10);
          sCodes = firstPlan.s_codes || [];
        }

        let weekValue = null;
        if (weeksRes.length > 0) {
          weekValue = weeksRes[0].value?.toString() || null;
        }

        let remainQty = null;
        if (sCodes.length > 0) {
          const firstSCode = sCodes[0];
          const sCode = firstSCode.s_code;
          if (sCode) {
            const remainRes = await masterDataAPI.getRemainQuantity(customerPo, sku, sCode);
            remainQty = remainRes.remainQuantity || null;
            qtyOrder = remainRes.quantityOrder || qtyOrder;
          }
        }

        setQuantityOrder(qtyOrder);
        setRemainQuantity(remainQty); // Tetap diisi untuk backend
        setWeek(weekValue);
      } catch (err) {
        alert('Gagal memuat data master: ' + err.message);
      } finally {
        setLoadingData(false);
      }
    };
    loadAllData();
  }, [customerPo, sku]);

  // === HANDLE CUSTOMER LABEL ===
  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setCustomer(value);
    const selected = customers.find(c => c.value.toString() === value);
    setCustomerLabel(selected?.label || '');
  };

  // === VALIDATION ===
  const validateForm = () => {
    if (
      !customerLabel ||
      !poNumber ||
      !customerPo ||
      !sku ||
      !shift ||
      !group ||
      !timeSlot ||
      !machine ||
      !kashift ||
      !admin ||
      !week
    ) {
      alert('Lengkapi semua field yang diperlukan');
      return false;
    }

    const qty = parseInt(quantityProduksi, 10);
    if (isNaN(qty) || qty <= 0) {
      alert('Quantity Produksi tidak valid');
      return false;
    }

    return true;
  };

  // === SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 🔥 Generate timestamp lokal WIB sekarang
      const nowWib = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }); // format: "2025-10-27 14:30:45"
      const timestampUtc = localToUtc(nowWib); // Konversi ke UTC ISO string

      const formData = {
        timestamp: timestampUtc, // ✅ Kirim dalam UTC ISO
        shift,
        group,
        time_slot: timeSlot,
        machine,
        kashift,
        admin,
        customer: customerLabel,
        po_number: poNumber,
        customer_po: customerPo,
        sku,
        week,
        quantity_produksi: parseInt(quantityProduksi, 10),
      };

      await createPackingFoamSummary(formData); // ✅ Gunakan packingFoam.js
      alert('Data berhasil disimpan!');
      navigate(-1);
    } catch (err) {
      console.error('Submit error:', err);
      alert(`Gagal menyimpan data: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // === DISPLAY TIMESTAMP IN WIB ===
  const displayTimestamp = () => {
    const now = new Date();
    return now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
      hour12: false,
    }).replace(/ /g, ' ').replace(',', ',');
  };

  return (
    <div className="form-summary-packing-foam">
      <h1 className="form-title">Input Summary Packing Foam</h1>

      <form onSubmit={handleSubmit} className="packing-foam-form">
        {/* === HEADER SECTION === */}
        <div className="form-section">
          <h2 className="section-header">Header Information</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Timestamp</label>
              <div className="display-field timestamp-field">
                <span className="icon">🕒</span>
                <span>{displayTimestamp()}</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Shift</label>
              <select value={shift} onChange={(e) => setShift(e.target.value)} disabled={isSubmitting}>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>

            <div className="form-group">
              <label>Group</label>
              <select value={group} onChange={(e) => setGroup(e.target.value)} disabled={isSubmitting}>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Time</label>
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} disabled={isSubmitting}>
                {getTimeSlots(shift).map((slot, i) => (
                  <option key={i} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Machine</label>
              <select value={machine} onChange={(e) => setMachine(e.target.value)} disabled={isSubmitting}>
                {Array.from({ length: 8 }, (_, i) => `PUR ${i + 1}`).map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {kashift && admin && (
            <div className="form-row">
              <div className="form-group">
                <label>Kashift</label>
                <div className="display-field kashift-field">{kashift}</div>
              </div>
              <div className="form-group">
                <label>Admin</label>
                <div className="display-field admin-field">{admin}</div>
              </div>
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* === MASTER DATA SECTION === */}
        <div className="form-section">
          <h2 className="section-header">Form Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Customer</label>
              {loadingCustomers ? (
                <div className="loading-spinner"></div>
              ) : (
                <select value={customer} onChange={handleCustomerChange} disabled={isSubmitting}>
                  <option value="">Pilih...</option>
                  {customers.map((c, i) => (
                    <option key={i} value={c.value}>{c.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>PO Number</label>
              {loadingPoNumbers ? (
                <div className="loading-spinner"></div>
              ) : (
                <select
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  disabled={!customer || isSubmitting}
                >
                  <option value="">Pilih...</option>
                  {poNumbers.map((p, i) => (
                    <option key={i} value={p.value}>{p.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer PO</label>
              {loadingCustomerPos ? (
                <div className="loading-spinner"></div>
              ) : (
                <select
                  value={customerPo}
                  onChange={(e) => setCustomerPo(e.target.value)}
                  disabled={!poNumber || isSubmitting}
                >
                  <option value="">Pilih...</option>
                  {customerPos.map((cp, i) => (
                    <option key={i} value={cp.value}>{cp.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SKU</label>
              {loadingSkus ? (
                <div className="loading-spinner"></div>
              ) : (
                <select
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={!customerPo || isSubmitting}
                >
                  <option value="">Pilih...</option>
                  {skus.map((s, i) => (
                    <option key={i} value={s.value}>{s.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity Order</label>
              {loadingData ? (
                <div className="loading-spinner"></div>
              ) : (
                <div className="display-field order-field">{quantityOrder ?? '-'}</div>
              )}
            </div>

            {/* === REMAIN QUANTITY DIHAPUS DARI TAMPILAN === */}
            {/* <div className="form-group">
              <label>Remain Quantity</label>
              {loadingData ? (
                <div className="loading-spinner"></div>
              ) : (
                <div className="display-field remain-field">{remainQuantity ?? '-'}</div>
              )}
            </div> */}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Week</label>
              {loadingData ? (
                <div className="loading-spinner"></div>
              ) : (
                <div className="display-field week-field">{week ?? '-'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Quantity Produksi</label>
              <input
                type="number"
                value={quantityProduksi}
                onChange={(e) => setQuantityProduksi(e.target.value)}
                min="1"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Menyimpan...
            </>
          ) : (
            'Simpan Data'
          )}
        </button>
      </form>
    </div>
  );
};

export default FormSummaryPackingFoam;