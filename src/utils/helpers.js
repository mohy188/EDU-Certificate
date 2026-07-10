/**
 * Helper utilities for formatting and file processing.
 */

/**
 * Converts a File object to a Base64 data URL.
 * @param {File} file - File object to read
 * @returns {Promise<string>} - Base64 data URL
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Formats a date string into standard UK numeric format (DD/MM/YYYY)
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} - Formatted date
 */
export function formatUKDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Formats a date string into an elegant textual UK date (e.g. "10th July 2026")
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} - Elegant formatted date
 */
export function formatElegantDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = date.getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  // Get day suffix (st, nd, rd, th)
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';
  
  return `${day}${suffix} ${month} ${year}`;
}

/**
 * Sanitizes and capitalizes a person's name for certificate display.
 * @param {string} name - The raw input name
 * @returns {string} - Capitalized name (e.g. "JOHN SMITH" or "John Smith")
 */
export function formatLearnerName(name) {
  if (!name) return '';
  return name.trim().toUpperCase();
}
