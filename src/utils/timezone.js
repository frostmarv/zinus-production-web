// src/utils/timezone.js

const JAKARTA_OFFSET = "+07:00"; // WIB = UTC+7
const JAKARTA_TZ = "Asia/Jakarta";

/**
 * Konversi string waktu lokal (WIB) ke UTC ISO string
 * @param {string} localDateTime - format: "2025-04-05 14:30" atau "2025-04-05T14:30"
 * @returns {string} ISO UTC, contoh: "2025-04-05T07:30:00.000Z"
 */
export const localToUtc = (localDateTime) => {
  if (!localDateTime) {
    throw new Error("localDateTime is required");
  }

  // Normalisasi format ke ISO dengan offset WIB
  let isoWithOffset = localDateTime.trim();
  if (!isoWithOffset.includes("T")) {
    isoWithOffset = isoWithOffset.replace(" ", "T");
  }
  if (!isoWithOffset.includes("+") && !isoWithOffset.includes("Z")) {
    isoWithOffset += JAKARTA_OFFSET;
  }

  const date = new Date(isoWithOffset);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${localDateTime}`);
  }

  return date.toISOString();
};

/**
 * Konversi UTC ISO string ke string waktu lokal Jakarta (WIB)
 * @param {string} utcString - contoh: "2025-04-05T07:30:00.000Z"
 * @param {Object} [options] - opsional
 * @param {'datetime'|'date'|'time'} [options.format='datetime']
 * @param {boolean} [options.showSeconds=false]
 * @returns {string} dalam format WIB, contoh: "05/04/2025 14.30"
 */
export const utcToLocal = (utcString, options = {}) => {
  if (!utcString) {
    throw new Error("utcString is required");
  }

  const date = new Date(utcString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid UTC string: ${utcString}`);
  }

  const { format = "datetime", showSeconds = false } = options;

  const config = {
    timeZone: JAKARTA_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  if (showSeconds) config.second = "2-digit";
  if (format === "date") {
    delete config.hour;
    delete config.minute;
    if (config.second) delete config.second;
  } else if (format === "time") {
    delete config.day;
    delete config.month;
    delete config.year;
  }

  return new Intl.DateTimeFormat("id-ID", config).format(date);
};

/**
 * Alias untuk tampilan umum: "dd/MM/yyyy HH:mm"
 * @param {string} utcString
 * @returns {string}
 */
export const formatAsJakarta = (utcString) => {
  return utcToLocal(utcString, { format: "datetime" });
};
