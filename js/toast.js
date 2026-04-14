/* ============================================================
   js/toast.js - Toast notification functions
   ============================================================ */

/**
 * Hiển thị toast notification
 * @param {string} title  - Tiêu đề thông báo
 * @param {string} msg    - Nội dung chi tiết
 * @param {string} type   - Loại: 'success' | 'danger' | 'warning' | 'info'
 * @param {number} duration - Thời gian hiển thị (ms), mặc định 3500
 */
function showToast(title, msg, type = 'success', duration = 3500) {
  const area = document.getElementById('toastArea');
  if (!area) return;

  const icons = {
    success: '✅',
    danger:  '❌',
    warning: '⚠️',
    info:    'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Dùng textContent để tránh XSS - không inject HTML từ user input
  const iconEl = document.createElement('span');
  iconEl.className = 'toast-icon';
  iconEl.textContent = icons[type] || 'ℹ️';

  const bodyEl = document.createElement('div');
  bodyEl.className = 'toast-body';

  const titleEl = document.createElement('div');
  titleEl.className = 'toast-title';
  titleEl.textContent = title;
  bodyEl.appendChild(titleEl);

  if (msg) {
    const msgEl = document.createElement('div');
    msgEl.className = 'toast-msg';
    msgEl.textContent = msg;
    bodyEl.appendChild(msgEl);
  }

  toast.appendChild(iconEl);
  toast.appendChild(bodyEl);

  area.appendChild(toast);

  // Tự động xóa sau duration ms
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(() => toast.remove(), 320);
  }, duration);
}
