/* ============================================================
   js/navigation.js - Page navigation management
   ============================================================ */

/**
 * Metadata cho mỗi trang: tiêu đề hiển thị ở topbar
 */
const pageMeta = {
  dashboard:        { title: 'Tổng Quan',            subtitle: 'Xem tổng quan hoạt động nhà hàng hôm nay' },
  'table-map':      { title: 'Sơ Đồ Bàn',            subtitle: 'Quản lý và theo dõi trạng thái các bàn' },
  booking:          { title: 'Đặt Bàn',              subtitle: 'Tạo đặt bàn mới cho khách hàng' },
  cancel:           { title: 'Hủy Đặt Bàn',          subtitle: 'Xử lý yêu cầu hủy đặt bàn' },
  checkin:          { title: 'Check-in',              subtitle: 'Xác nhận khách hàng đến nhà hàng' },
  order:            { title: 'Gọi Món',               subtitle: 'Quản lý order và gọi thêm đồ uống' },
  payment:          { title: 'Thanh Toán',            subtitle: 'Xử lý thanh toán và xuất hóa đơn' },
  'promotion-apply':{ title: 'Áp Dụng Khuyến Mãi',   subtitle: 'Áp dụng mã khuyến mãi cho đơn hàng' },
  'menu-mgmt':      { title: 'Quản Lý Thực Đơn',     subtitle: 'Thêm, sửa, xóa các món trong menu' },
  'customer-mgmt':  { title: 'Quản Lý Khách Hàng',   subtitle: 'Quản lý thông tin và lịch sử khách hàng' },
  'promo-mgmt':     { title: 'Quản Lý Khuyến Mãi',   subtitle: 'Tạo và quản lý chương trình khuyến mãi' },
  'staff-mgmt':     { title: 'Quản Lý Nhân Viên',    subtitle: 'Quản lý thông tin và lịch làm việc nhân viên' },
  revenue:          { title: 'Báo Cáo Doanh Thu',    subtitle: 'Thống kê và phân tích doanh thu' }
};

/**
 * Chuyển trang và load component nếu chưa load
 * @param {string} page - Tên trang (khớp với pageMeta key)
 */
function showPage(page) {
  // Ẩn tất cả sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));

  // Hiển thị section được chọn
  const section = document.getElementById('page-' + page);
  if (section) {
    section.classList.add('active');
  } else {
    // Load component nếu chưa có trong DOM
    loadPageComponent(page);
  }

  // Cập nhật navigation active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Cập nhật topbar title
  updateTopbarTitle(page);

  // Lưu trang hiện tại
  window.currentPage = page;
}

/**
 * Load component HTML vào content div
 * @param {string} page
 */
function loadPageComponent(page) {
  const content = document.getElementById('content');
  if (!content) return;

  fetch(`components/${page}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`Không tìm thấy component: ${page}.html`);
      return res.text();
    })
    .then(html => {
      // Parse HTML vào temp container
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Thu thập tất cả script nodes trước khi di chuyển vào DOM
      const scriptNodes = Array.from(temp.querySelectorAll('script'));

      // Di chuyển các phần tử từ temp vào content
      while (temp.firstChild) {
        content.appendChild(temp.firstChild);
      }

      // Tìm và kích hoạt section vừa được inject
      const section = document.getElementById('page-' + page);
      if (section) {
        section.classList.add('active');
      }

      // Thực thi tất cả script tags của component (bao gồm scripts ngoài page-section)
      scriptNodes.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.textContent = oldScript.textContent;
        if (oldScript.parentNode) {
          oldScript.parentNode.replaceChild(newScript, oldScript);
        } else {
          // Script đã bị detach — append vào body để execute
          document.body.appendChild(newScript);
        }
      });
    })
    .catch(err => {
      console.error(err);
      showToast('Lỗi', `Không thể tải trang "${page}"`, 'danger');
    });
}

/**
 * Cập nhật tiêu đề topbar theo trang hiện tại
 * @param {string} page
 */
function updateTopbarTitle(page) {
  const meta = pageMeta[page];
  if (!meta) return;

  const titleEl    = document.getElementById('topbar-title');
  const subtitleEl = document.getElementById('topbar-subtitle');

  if (titleEl)    titleEl.textContent    = meta.title;
  if (subtitleEl) subtitleEl.textContent = meta.subtitle;
}
