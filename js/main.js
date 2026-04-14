/* ============================================================
   js/main.js - App initialization, clock, component loader
   ============================================================ */

/**
 * Cập nhật đồng hồ realtime trên topbar
 */
function updateClock() {
  const timeEl = document.getElementById('topbarTime');
  const dateEl = document.getElementById('topbarDate');

  if (timeEl) timeEl.textContent = formatTime(new Date());
  if (dateEl) dateEl.textContent = formatDateTime(new Date());
}

/**
 * Thực thi các thẻ <script> sau khi inject HTML vào DOM
 * (innerHTML không tự chạy script, cần tạo lại element)
 * @param {HTMLElement} container - Element chứa HTML đã inject
 */
function executeScripts(container) {
  container.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    // Sao chép tất cả attributes
    Array.from(oldScript.attributes).forEach(attr =>
      newScript.setAttribute(attr.name, attr.value)
    );
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

/**
 * Load một component HTML từ file và inject vào element target
 * @param {string} url      - Đường dẫn file HTML
 * @param {string} targetId - ID của element target
 * @returns {Promise}
 */
function loadComponent(url, targetId) {
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
      return res.text();
    })
    .then(html => {
      const el = document.getElementById(targetId);
      if (el) {
        el.innerHTML = html;
        executeScripts(el);
      }
    })
    .catch(err => {
      console.error('Lỗi load component:', err);
    });
}

/**
 * Khởi tạo ứng dụng
 * - Load sidebar, topbar
 * - Load trang mặc định (dashboard)
 * - Khởi động đồng hồ
 */
async function initApp() {
  // Load sidebar và topbar song song
  await Promise.all([
    loadComponent('components/sidebar.html', 'sidebar'),
    loadComponent('components/topbar.html',  'topbar')
  ]);

  // Khởi động đồng hồ
  updateClock();
  setInterval(updateClock, 1000);

  // Load dashboard mặc định
  await loadComponent('components/dashboard.html', 'content');

  // Thêm active class cho dashboard section vừa được inject
  const content = document.getElementById('content');
  if (content && content.firstElementChild) {
    content.firstElementChild.classList.add('active');
  }

  // Đặt active cho nav item dashboard
  const firstNav = document.querySelector('.nav-item[data-page="dashboard"]');
  if (firstNav) firstNav.classList.add('active');

  // Cập nhật topbar title cho dashboard
  updateTopbarTitle('dashboard');

  window.currentPage = 'dashboard';
}

// Chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initApp);
