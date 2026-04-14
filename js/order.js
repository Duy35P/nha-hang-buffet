/* ============================================================
   js/order.js - Order management functions
   ============================================================ */

// Danh sách items trong giỏ order hiện tại
let orderItems = [];

// Menu items dữ liệu mẫu
const menuData = [
  { id: 1, name: 'Nước Khoáng Lavie',  price: 15000,  cat: 'nuoc',   icon: '💧', unit: 'chai' },
  { id: 2, name: 'Pepsi / 7Up',         price: 25000,  cat: 'nuoc',   icon: '🥤', unit: 'lon'  },
  { id: 3, name: 'Nước Ép Cam',         price: 45000,  cat: 'nuoc',   icon: '🍊', unit: 'ly'   },
  { id: 4, name: 'Nước Ép Dưa Hấu',    price: 45000,  cat: 'nuoc',   icon: '🍉', unit: 'ly'   },
  { id: 5, name: 'Sinh Tố Xoài',        price: 55000,  cat: 'nuoc',   icon: '🥭', unit: 'ly'   },
  { id: 6, name: 'Trà Đào',             price: 35000,  cat: 'nuoc',   icon: '🍑', unit: 'ly'   },
  { id: 7, name: 'Bia Tiger',           price: 35000,  cat: 'bia',    icon: '🍺', unit: 'lon'  },
  { id: 8, name: 'Bia Heineken',        price: 40000,  cat: 'bia',    icon: '🍺', unit: 'lon'  },
  { id: 9, name: 'Rượu Vang Đỏ',       price: 350000, cat: 'ruou',   icon: '🍷', unit: 'ly'   },
  { id:10, name: 'Whisky On The Rocks', price: 120000, cat: 'ruou',   icon: '🥃', unit: 'ly'   },
  { id:11, name: 'Gỏi Cuốn Tôm',       price: 65000,  cat: 'khai-vi',icon: '🥗', unit: 'đĩa'  },
  { id:12, name: 'Chả Giò',            price: 55000,  cat: 'khai-vi',icon: '🥢', unit: 'đĩa'  },
  { id:13, name: 'Kem Vanilla',         price: 45000,  cat: 'trang-mien',icon:'🍨',unit:'phần' },
  { id:14, name: 'Bánh Flan',           price: 35000,  cat: 'trang-mien',icon:'🍮',unit:'phần' },
];

/**
 * Lọc menu theo danh mục
 * @param {string} cat - Danh mục: 'all' | 'nuoc' | 'bia' | 'ruou' | 'khai-vi' | 'trang-mien'
 */
function filterCat(cat) {
  // Cập nhật active button
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  // Lọc và render menu items
  const items = cat === 'all' ? menuData : menuData.filter(i => i.cat === cat);
  renderMenuItems(items);
}

/**
 * Render menu items vào grid
 * @param {Array} items
 */
function renderMenuItems(items) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🍽️</div><p>Không có món nào trong danh mục này</p></div>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="menu-item-card" onclick="addOrderItem(${item.id})">
      <div class="menu-item-img">${item.icon}</div>
      <div class="menu-item-info">
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-price">${formatCurrency(item.price)}</div>
        <div class="menu-item-cat">${item.unit}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Thêm một item vào giỏ order
 * @param {number} itemId - ID của menu item
 */
function addOrderItem(itemId) {
  const menuItem = menuData.find(i => i.id === itemId);
  if (!menuItem) return;

  const existing = orderItems.find(i => i.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    orderItems.push({ ...menuItem, qty: 1 });
  }

  renderBasket();
  showToast('Đã Thêm', `${menuItem.name} đã được thêm vào order`, 'success', 1800);
}

/**
 * Thay đổi số lượng item trong giỏ
 * @param {number} itemId - ID của item
 * @param {number} delta  - +1 hoặc -1
 */
function changeQty(itemId, delta) {
  const item = orderItems.find(i => i.id === itemId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    orderItems = orderItems.filter(i => i.id !== itemId);
  }

  renderBasket();
}

/**
 * Render giỏ order (basket) bên phải
 */
function renderBasket() {
  const list    = document.getElementById('basketItems');
  const subtotalEl = document.getElementById('basketSubtotal');
  const totalEl    = document.getElementById('basketTotal');
  const countEl    = document.getElementById('basketCount');

  if (!list) return;

  if (orderItems.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <p>Chưa có món nào<br>Chọn món từ menu bên trái</p>
      </div>
    `;
  } else {
    list.innerHTML = orderItems.map(item => `
      <div class="basket-item">
        <div class="basket-item-icon">${item.icon}</div>
        <div class="basket-item-info">
          <div class="basket-item-name">${item.name}</div>
          <div class="basket-item-price">${formatCurrency(item.price)}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
    `).join('');
  }

  // Tính tổng tiền
  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax      = Math.round(subtotal * 0.08);
  const total    = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (totalEl)    totalEl.textContent    = formatCurrency(total);
  if (countEl)    countEl.textContent    = orderItems.reduce((sum, i) => sum + i.qty, 0) + ' món';
}

/**
 * Gửi order (submit)
 */
function submitOrder() {
  if (orderItems.length === 0) {
    showToast('Giỏ Trống', 'Vui lòng thêm ít nhất một món trước khi gửi order', 'warning');
    return;
  }

  const tableNum = document.getElementById('orderTableSelect')?.value;
  if (!tableNum) {
    showToast('Chưa Chọn Bàn', 'Vui lòng chọn số bàn trước khi gửi order', 'warning');
    return;
  }

  // Giả lập gửi order thành công
  showToast('Order Thành Công!', `Đã gửi ${orderItems.length} món cho bàn ${tableNum}`, 'success');
  orderItems = [];
  renderBasket();
}
