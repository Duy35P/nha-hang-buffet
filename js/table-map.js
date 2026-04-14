/* ============================================================
   js/table-map.js - Table map selection management
   ============================================================ */

// Trạng thái bàn được chọn hiện tại
let selectedTable = null;

/**
 * Chọn / bỏ chọn một bàn trên sơ đồ
 * @param {HTMLElement} el  - Element của bàn được click
 * @param {string|number} tableNum - Số bàn
 * @param {string} status   - Trạng thái hiện tại của bàn
 */
function selectTable(el, tableNum, status) {
  // Không cho chọn bàn đang occupied
  if (status === 'occupied') {
    showToast('Bàn Đang Sử Dụng', `Bàn ${tableNum} hiện đang có khách, vui lòng chọn bàn khác.`, 'warning');
    return;
  }

  // Bỏ chọn bàn cũ
  document.querySelectorAll('.table-item.selected').forEach(t => {
    t.classList.remove('selected');
    // Khôi phục class status gốc
    const s = t.dataset.status;
    if (s) t.classList.add(s);
  });

  // Nếu click vào bàn đã chọn → bỏ chọn
  if (selectedTable === tableNum) {
    selectedTable = null;
    updateTableInfo(null);
    return;
  }

  // Chọn bàn mới
  el.classList.remove(status);
  el.classList.add('selected');
  selectedTable = tableNum;

  // Cập nhật panel thông tin bàn
  updateTableInfo(tableNum, el.dataset);

  showToast('Đã Chọn Bàn', `Bàn ${tableNum} đã được chọn.`, 'info', 2000);
}

/**
 * Cập nhật panel thông tin bàn được chọn
 * @param {string|number|null} tableNum
 * @param {DOMStringMap} data - dataset của element
 */
function updateTableInfo(tableNum, data) {
  const panel = document.getElementById('selected-table-info');
  if (!panel) return;

  if (!tableNum) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = 'block';

  const seats  = (data && data.seats)  || '—';
  const status = (data && data.status) || '—';
  const zone   = (data && data.zone)   || '—';

  const statusLabels = {
    available: 'Trống',
    reserved:  'Đã Đặt',
    occupied:  'Đang Sử Dụng'
  };

  panel.innerHTML = `
    <div class="info-panel-title">📍 Thông Tin Bàn Được Chọn</div>
    <div class="info-row">
      <span class="lbl">Số Bàn</span>
      <span class="val">Bàn ${tableNum}</span>
    </div>
    <div class="info-row">
      <span class="lbl">Sức Chứa</span>
      <span class="val">${seats} người</span>
    </div>
    <div class="info-row">
      <span class="lbl">Khu Vực</span>
      <span class="val">${zone}</span>
    </div>
    <div class="info-row">
      <span class="lbl">Trạng Thái</span>
      <span class="val">${statusLabels[status] || status}</span>
    </div>
  `;
}
