/* ============================================================
   js/utils.js - Utility functions
   ============================================================ */

/**
 * Định dạng số tiền VNĐ
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

/**
 * Định dạng ngày giờ tiếng Việt
 * @param {Date} date
 * @returns {string}
 */
function formatDateTime(date) {
  const d = date || new Date();
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[d.getDay()];
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dayName}, ${dd}/${mm}/${yyyy}`;
}

/**
 * Định dạng giờ HH:MM:SS
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  const d = date || new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Tạo ID ngẫu nhiên dạng prefix + số
 * @param {string} prefix
 * @returns {string}
 */
function generateId(prefix = 'ID') {
  return prefix + Math.floor(1000 + Math.random() * 9000);
}

/**
 * Debounce function
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Lấy ngày hiện tại dạng YYYY-MM-DD (cho input type="date")
 * @returns {string}
 */
function todayISO() {
  return new Date().toISOString().split('T')[0];
}
