// src/pages/Input/Bonding/FormRejectBonding.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createBondingReject,
  uploadBondingRejectImages,
} from '../../../api/bondingReject';
import { masterDataAPI } from '../../../api/masterData';
import { localToUtc } from '../../../utils/timezone';
import '../../../styles/Input/Bonding/FormRejectBonding.css';

const InputRejectBonding = () => {
  const navigate = useNavigate();

  // === HEADER ===
  const [shift, setShift] = useState('1');
  const [group, setGroup] = useState('A');
  const [timeSlot, setTimeSlot] = useState('');

  // === KASHIFT & ADMIN ===
  const [kashift, setKashift] = useState('');
  const [admin, setAdmin] = useState('');

  // === MASTER DATA ===
  const [customer, setCustomer] = useState(''); // VALUE (ID)
  const [customerLabel, setCustomerLabel] = useState(''); // LABEL
  const [poNumber, setPoNumber] = useState('');
  const [sku, setSku] = useState('');
  const [sCode, setSCode] = useState('');
  const [sCodeDescription, setSCodeDescription] = useState('');

  // === NG DATA ===
  const [ngQuantity, setNgQuantity] = useState('');
  const [reason, setReason] = useState('');

  // === IMAGES ===
  const [selectedImages, setSelectedImages] = useState([]);
  const maxImages = 5;

  // === LOADING STATES ===
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingPoNumbers, setLoadingPoNumbers] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(false);
  const [loadingSCodes, setLoadingSCodes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === DATA LISTS ===
  const [customers, setCustomers] = useState([]);
  const [poNumbers, setPoNumbersList] = useState([]);
  const [skus, setSkusList] = useState([]);
  const [sCodes, setSCodesList] = useState([]);

  // === TIME SLOTS ===
  const getTimeSlots = useCallback((shiftVal) => {
    if (shiftVal === '1') {
      return Array.from({ length: 4 }, (_, i) => {
        const start = 8 + i;
        const end = start + 1;
        return `${String(start).padStart(2, '0')}.00 - ${String(end).padStart(2, '0')}.00`;
      });
    } else {
      return Array.from({ length: 7 }, (_, i) => {
        const start = 13 + i;
        const end = start + 1;
        return `${String(start).padStart(2, '0')}.00 - ${String(end).padStart(2, '0')}.00`;
      });
    }
  }, []);

  // === UPDATE KASHIFT & ADMIN BASED ON GROUP ===
  useEffect(() => {
    if (group === 'A') {
      setKashift('Noval');
      setAdmin('Aline');
    } else if (group === 'B') {
      setKashift('Abizar');
      setAdmin('Puji');
    } else {
      setKashift('');
      setAdmin('');
    }
  }, [group]);

  // === INITIALIZE TIME SLOT ===
  useEffect(() => {
    setTimeSlot(getTimeSlots(shift)[0]);
  }, [shift, getTimeSlots]);

  // === LOAD CUSTOMERS ===
  useEffect(() => {
    const loadCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const data = await masterDataAPI.getCustomers();
        setCustomers(data);
      } catch (err) {
        alert('Gagal memuat customer: ' + (err.message || err));
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
        setSkusList([]);
        setSCodesList([]);
        setPoNumber('');
        setSku('');
        setSCode('');
        setSCodeDescription('');
      } catch (err) {
        alert('Gagal memuat PO Numbers: ' + (err.message || err));
      } finally {
        setLoadingPoNumbers(false);
      }
    };
    loadPoNumbers();
  }, [customer]);

  // === LOAD SKUs ===
  useEffect(() => {
    if (!poNumber) return;
    const loadSkus = async () => {
      setLoadingSkus(true);
      try {
        const data = await masterDataAPI.getSkus(poNumber);
        setSkusList(data);
        setSCodesList([]);
        setSku('');
        setSCode('');
        setSCodeDescription('');
      } catch (err) {
        alert('Gagal memuat SKUs: ' + (err.message || err));
      } finally {
        setLoadingSkus(false);
      }
    };
    loadSkus();
  }, [poNumber]);

  // === LOAD S.CODEs ===
  useEffect(() => {
    if (!poNumber || !sku) return;
    const loadSCodes = async () => {
      setLoadingSCodes(true);
      try {
        const qtyPlansRes = await masterDataAPI.getQtyPlans(poNumber, sku);
        let sCodeList = [];
        if (qtyPlansRes.length > 0) {
          const firstPlan = qtyPlansRes[0];
          const sCodesRaw = firstPlan.s_codes || [];
          sCodeList = sCodesRaw.map((sc) => ({
            value: sc.s_code.toString(),
            label: sc.s_code.toString(),
            description: sc.description?.toString() || '',
          }));
        }
        setSCodesList(sCodeList);
        setSCode('');
        setSCodeDescription('');
      } catch (err) {
        alert('Gagal memuat S.CODE: ' + (err.message || err));
      } finally {
        setLoadingSCodes(false);
      }
    };
    loadSCodes();
  }, [poNumber, sku]);

  // === HANDLE CUSTOMER CHANGE ===
  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setCustomer(value);
    const selected = customers.find(c => c.value.toString() === value);
    setCustomerLabel(selected?.label || '');
  };

  // === HANDLE S.CODE CHANGE ===
  const handleSCodeChange = (e) => {
    const value = e.target.value;
    setSCode(value);
    const selected = sCodes.find(sc => sc.value === value);
    setSCodeDescription(selected?.description || '');
  };

  // === IMAGE HANDLERS ===
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );
    if (files.length === 0) return;

    if (selectedImages.length + files.length > maxImages) {
      alert(`Maksimal ${maxImages} gambar`);
      return;
    }
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      // Revoke object URL to prevent memory leak
      URL.revokeObjectURL(URL.createObjectURL(newImages[index]));
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // === VALIDATION ===
  const validateForm = () => {
    if (
      !customerLabel ||
      !poNumber ||
      !sku ||
      !sCode ||
      !shift ||
      !group ||
      !timeSlot ||
      !kashift ||
      !admin ||
      !ngQuantity ||
      !reason
    ) {
      alert('Lengkapi semua field yang diperlukan');
      return false;
    }

    const qty = parseInt(ngQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      alert('Quantity NG harus > 0');
      return false;
    }

    if (reason.trim() === '') {
      alert('Alasan NG wajib diisi');
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
      const nowWib = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' });
      const timestampUtc = localToUtc(nowWib);

      const formData = {
        timestamp: timestampUtc,
        shift,
        group,
        time_slot: timeSlot,
        kashift,
        admin,
        customer: customerLabel,
        po_number: poNumber,
        sku,
        s_code: sCode,
        description: sCodeDescription || '',
        ng_quantity: parseInt(ngQuantity, 10),
        reason: reason.trim(),
      };

      const response = await createBondingReject(formData);
      const bondingRejectId = response.data.id;

      // Upload images if any
      if (selectedImages.length > 0) {
        const imageFormData = new FormData();
        selectedImages.forEach(file => {
          imageFormData.append('images', file);
        });
        await uploadBondingRejectImages(bondingRejectId, imageFormData);
      }

      alert('Data NG dan gambar berhasil disimpan!');
      navigate(-1);
    } catch (err) {
      console.error('Submit error:', err);
      alert(`Gagal menyimpan data: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // === DISPLAY CURRENT WIB TIMESTAMP ===
  const displayCurrentTimestamp = () => {
    return new Date().toLocaleDateString('id-ID', {
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
    <div className="input-reject-bonding">
      <h1 className="page-title">Input Reject Bonding</h1>

      <form onSubmit={handleSubmit} className="bonding-form">
        {/* === HEADER SECTION === */}
        <div className="form-section">
          <h2 className="section-header">Header Information</h2>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Timestamp</label>
              <div className="display-field timestamp-field">
                <span className="icon">🕒</span>
                <span>{displayCurrentTimestamp()}</span>
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

        {/* === FORM INFORMATION === */}
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
              <label>SKU</label>
              {loadingSkus ? (
                <div className="loading-spinner"></div>
              ) : (
                <select
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={!poNumber || isSubmitting}
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
              <label>S.CODE</label>
              {loadingSCodes ? (
                <div className="loading-spinner"></div>
              ) : (
                <select
                  value={sCode}
                  onChange={handleSCodeChange}
                  disabled={!sku || isSubmitting}
                >
                  <option value="">Pilih...</option>
                  {sCodes.map((sc, i) => (
                    <option key={i} value={sc.value}>{sc.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <div className="display-field description-field">
                {sCodeDescription || '-'}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity NG</label>
              <input
                type="number"
                value={ngQuantity}
                onChange={(e) => setNgQuantity(e.target.value)}
                min="1"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Alasan NG</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* === IMAGE UPLOAD === */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Foto NG (Opsional, maks. {maxImages})</label>
              <div className="image-upload-container">
                {selectedImages.map((file, index) => (
                  <div key={index} className="uploaded-image">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {selectedImages.length < maxImages && (
                  <label className="upload-placeholder">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                    <div className="upload-icon">+</div>
                    <span>Tambah Foto</span>
                  </label>
                )}
              </div>
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
            'Simpan Data NG'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputRejectBonding;