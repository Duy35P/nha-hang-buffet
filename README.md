# 🍽️ Hệ Thống Quản Lý Nhà Hàng Buffet

Hệ thống quản lý nhà hàng buffet được xây dựng theo kiến trúc **component-based** thuần HTML/CSS/JS, không phụ thuộc framework.

## 📁 Cấu Trúc Dự Án

```
nha-hang-buffet/
├── index.html                  ← File chính, load tất cả components
├── README.md
│
├── css/
│   └── styles.css              ← Toàn bộ CSS của ứng dụng
│
├── js/
│   ├── toast.js                ← Hàm showToast() — thông báo nhanh
│   ├── utils.js                ← Các hàm tiện ích chung
│   ├── navigation.js           ← showPage(), pageMeta — điều hướng
│   ├── table-map.js            ← selectTable() — sơ đồ bàn
│   ├── order.js                ← filterCat(), addOrderItem(), changeQty()
│   └── main.js                 ← Khởi tạo app, updateClock(), loadComponent()
│
└── components/
    ├── sidebar.html            ← Thanh điều hướng bên trái
    ├── topbar.html             ← Thanh trên cùng (tiêu đề + đồng hồ)
    ├── dashboard.html          ← Trang Tổng Quan
    ├── table-map.html          ← Sơ Đồ Bàn
    ├── booking.html            ← Đặt Bàn
    ├── cancel.html             ← Hủy Đặt Bàn
    ├── checkin.html            ← Check-in
    ├── order.html              ← Gọi Món
    ├── payment.html            ← Thanh Toán
    ├── promotion-apply.html    ← Áp Dụng Khuyến Mãi
    ├── menu-mgmt.html          ← Quản Lý Thực Đơn
    ├── customer-mgmt.html      ← Quản Lý Khách Hàng
    ├── promo-mgmt.html         ← Quản Lý Chương Trình KM
    ├── staff-mgmt.html         ← Quản Lý Nhân Viên
    └── revenue.html            ← Báo Cáo Doanh Thu
```

## 🚀 Cách Chạy

Vì ứng dụng sử dụng **Fetch API** để load components, bạn cần chạy qua HTTP server (không mở trực tiếp file HTML):

### Cách 1: Python HTTP Server
```bash
# Python 3
python -m http.server 8080

# Mở trình duyệt: http://localhost:8080
```

### Cách 2: Node.js HTTP Server
```bash
npx serve .
# hoặc
npx http-server . -p 8080
```

### Cách 3: VS Code Live Server
Cài extension **Live Server** → Click phải `index.html` → **Open with Live Server**

## 🏗️ Kiến Trúc Component

### Luồng Hoạt Động

```
index.html
    │
    ├── Load CSS: css/styles.css
    │
    ├── Load JS (theo thứ tự):
    │   1. toast.js      ← Phải load trước (các file khác dùng showToast)
    │   2. utils.js      ← Phải load trước (các file khác dùng formatCurrency...)
    │   3. navigation.js ← Load trước main.js (dùng showPage, updateTopbarTitle)
    │   4. table-map.js  ← Dùng selectTable, showToast
    │   5. order.js      ← Dùng formatCurrency, showToast
    │   6. main.js       ← Load sau cùng, gọi initApp()
    │
    └── main.js → initApp():
        ├── loadComponent('components/sidebar.html', 'sidebar')
        ├── loadComponent('components/topbar.html', 'topbar')
        ├── loadComponent('components/dashboard.html', 'content')  ← Mặc định
        └── setInterval(updateClock, 1000)
```

### Navigation Flow

```
User click nav item
    ↓
showPage('page-name')  [navigation.js]
    ↓
├── Ẩn tất cả .page-section
├── Nếu #page-{name} đã có trong DOM → hiển thị
└── Nếu chưa có → fetch('components/{name}.html') → inject vào #content
    ↓
updateTopbarTitle('page-name')  → Cập nhật tiêu đề topbar
```

## 🎨 Design System

### Màu Sắc (CSS Variables)

| Variable | Giá Trị | Dùng Cho |
|----------|---------|----------|
| `--primary` | `#6b2d3e` | Màu chính (burgundy) |
| `--primary-dark` | `#4a1929` | Sidebar background |
| `--accent` | `#c9a84c` | Màu điểm nhấn (gold) |
| `--bg` | `#f9f6f1` | Nền trang |
| `--surface` | `#ffffff` | Nền card/modal |
| `--success` | `#3a7d44` | Trạng thái thành công |
| `--danger` | `#b53a3a` | Trạng thái lỗi/nguy hiểm |
| `--warning` | `#c08a1e` | Cảnh báo |

### Typography

- **Tiêu đề, số liệu**: `Cormorant Garamond` (serif, Google Fonts)
- **Nội dung thông thường**: `DM Sans` (sans-serif, Google Fonts)

## 📄 Mô Tả Các JS Modules

### `js/toast.js`
```js
showToast(title, msg, type, duration)
// type: 'success' | 'danger' | 'warning' | 'info'
```

### `js/utils.js`
```js
formatCurrency(amount)   → "1,500,000 ₫"
formatDateTime(date)     → "Thứ Hai, 14/04/2026"
formatTime(date)         → "09:42:15"
generateId(prefix)       → "BK3421"
debounce(fn, delay)
todayISO()               → "2026-04-14"
```

### `js/navigation.js`
```js
showPage(page)           // Chuyển trang
pageMeta                 // Object chứa title/subtitle cho mỗi trang
updateTopbarTitle(page)  // Cập nhật topbar
```

### `js/table-map.js`
```js
selectTable(el, tableNum, status)  // Xử lý click chọn bàn
updateTableInfo(tableNum, data)    // Cập nhật panel thông tin
```

### `js/order.js`
```js
filterCat(cat)           // Lọc menu theo danh mục
addOrderItem(itemId)     // Thêm món vào giỏ
changeQty(itemId, delta) // Tăng/giảm số lượng
renderBasket()           // Render giỏ hàng
submitOrder()            // Gửi order
```

### `js/main.js`
```js
updateClock()            // Cập nhật đồng hồ mỗi giây
loadComponent(url, id)   // Fetch HTML và inject vào element
initApp()                // Khởi tạo toàn bộ ứng dụng
```

## 📱 Responsive Design

- **Desktop** (>900px): Sidebar đầy đủ (240px) + Content
- **Tablet** (600–900px): Sidebar thu gọn (icon only, 64px)
- **Mobile** (<600px): Stats 2 cột, padding giảm

## 🔧 Mở Rộng

### Thêm Trang Mới

1. Tạo file `components/ten-trang.html`:
```html
<div class="page-section" id="page-ten-trang">
  <!-- Nội dung trang -->
</div>
```

2. Thêm vào `pageMeta` trong `navigation.js`:
```js
'ten-trang': { title: 'Tên Trang', subtitle: 'Mô tả...' }
```

3. Thêm nav item vào `components/sidebar.html`:
```html
<div class="nav-item" data-page="ten-trang" onclick="showPage('ten-trang')">
  <span class="nav-icon">🆕</span>
  <span>Tên Trang</span>
</div>
```

### Tích Hợp Backend

Thay thế mock data trong các component bằng fetch API calls:
```js
// Thay vì:
const mockData = [...]

// Dùng:
const res = await fetch('/api/endpoint');
const data = await res.json();
```

## 📦 Dependencies

Không có! Ứng dụng dùng thuần:
- HTML5
- CSS3 (với CSS Variables)
- Vanilla JavaScript (ES6+)
- [Google Fonts](https://fonts.google.com/) (Cormorant Garamond + DM Sans)

---

*Nhà Hàng Buffet Hoàng Gia — Management System v1.0*
