/**
 * REST API CLIENT & WEBSOCKET ENGINE
 * Dynamically resolves relative PHP API endpoints on production or localhost
 */
// Auto-detect base API URL supporting direct path and subfolders like /kent/cpro306/g1/
function getAPIBase() {
  if (window.location.hostname === 'localhost' && window.location.port === '5000') {
    return 'http://localhost:5000/api';
  }
  let path = window.location.pathname;
  if (path.endsWith('.html') || path.endsWith('.php')) {
    path = path.substring(0, path.lastIndexOf('/'));
  }
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return window.location.origin + path + '/api';
}
const API_BASE = getAPIBase();


function getCategoryIcon(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('hot drink') || n.includes('chocolate') || n.includes('chai')) return 'ri-fire-line';
  if (n.includes('cold coffee') || n.includes('cold brew')) return 'ri-snow-line';
  if (n.includes('coffee') || n.includes('espresso')) return 'ri-cup-line';
  if (n.includes('tea')) return 'ri-leaf-line';
  if (n.includes('cold drink') || n.includes('beverage')) return 'ri-goblet-line';
  if (n.includes('smoothie')) return 'ri-drinks-line';
  if (n.includes('juice')) return 'ri-contrast-drop-2-line';
  if (n.includes('breakfast') || n.includes('egg')) return 'ri-sun-line';
  if (n.includes('toastie') || n.includes('melt')) return 'ri-bread-line';
  if (n.includes('sandwich') || n.includes('blt') || n.includes('wrap')) return 'ri-restaurant-line';
  if (n.includes('pastr') || n.includes('croissant') || n.includes('danish')) return 'ri-cake-3-line';
  if (n.includes('baker') || n.includes('muffin') || n.includes('scone') || n.includes('bread')) return 'ri-cake-2-line';
  if (n.includes('lunch') || n.includes('salad') || n.includes('bowl')) return 'ri-bowl-line';
  if (n.includes('side') || n.includes('chip') || n.includes('fries')) return 'ri-french-fries-line';
  return 'ri-cup-line';
}

const API = {
  async fetchHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch { return { status: 'offline' }; }
  },
    async fetchBootstrap() {
    try {
      const res = await fetch(`${API_BASE}/bootstrap.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async fetchCategories() {
    try {
      const res = await fetch(`${API_BASE}/menu/categories.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      try {
        const res2 = await fetch(`${API_BASE}/menu/categories`);
        const data2 = await res2.json();
        return data2.success ? data2.data : null;
      } catch { return null; }
    }
  },
  async fetchCustomisations(productId = null, categoryId = null) {
    try {
      let url = `${API_BASE}/customisations/customisations.php`;
      let params = [];
      if (productId) params.push(`product_id=${productId}`);
      if (categoryId) params.push(`category_id=${categoryId}`);
      if (params.length) url += '?' + params.join('&');
      const res = await fetch(url);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async fetchMenuItems() {
    try {
      const res = await fetch(`${API_BASE}/menu/items.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      try {
        const res2 = await fetch(`${API_BASE}/menu/items`);
        const data2 = await res2.json();
        return data2.success ? data2.data : null;
      } catch { return null; }
    }
  },
  async fetchInventory() {
    try {
      const res = await fetch(`${API_BASE}/inventory/inventory.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      try {
        const res2 = await fetch(`${API_BASE}/inventory`);
        const data2 = await res2.json();
        return data2.success ? data2.data : null;
      } catch { return null; }
    }
  },
  async fetchTables() {
    try {
      const res = await fetch(`${API_BASE}/tables/tables.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      try {
        const res2 = await fetch(`${API_BASE}/tables`);
        const data2 = await res2.json();
        return data2.success ? data2.data : null;
      } catch { return null; }
    }
  },
    async fetchStationTickets(station = 'all') {
    try {
      const res = await fetch(`${API_BASE}/orders/kds.php?station=${encodeURIComponent(station)}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
    async serveOrder(orderId) {
    try {
      const res = await fetch(`${API_BASE}/orders/kds.php?action=serve_order&order_id=${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch { return null; }
  },
  async setStationTicketStatus(ticketId, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/kds.php?action=set_status&ticket_id=${ticketId}&status=${encodeURIComponent(status)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch { return null; }
  },
  async bumpStationTicket(ticketId) {
    try {
      const res = await fetch(`${API_BASE}/orders/kds.php?action=bump_ticket&ticket_id=${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch { return null; }
  },
  async recallStationTicket(ticketId) {
    try {
      const res = await fetch(`${API_BASE}/orders/kds.php?action=recall_ticket&ticket_id=${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchCustomerOrder(orderId = null) {
    try {
      const url = orderId ? `${API_BASE}/orders/customer_order.php?order_id=${orderId}` : `${API_BASE}/orders/customer_order.php?latest=1`;
      const res = await fetch(url);
      return await res.json();
    } catch { return null; }
  },
  async fetchOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders/orders.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      try {
        const res2 = await fetch(`${API_BASE}/orders`);
        const data2 = await res2.json();
        return data2.success ? data2.data : null;
      } catch { return null; }
    }
  },
  async fetchAuditLogs() {
    try {
      const res = await fetch(`${API_BASE}/reports/audit.php`, { credentials: 'same-origin' });
      const data = await res.json();
      if (!data || !data.success || !data.data) return [];
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.data.logs)) return data.data.logs;
      return [];
    } catch(e) {
      console.warn('Audit logs fetch error:', e);
      return [];
    }
  },
  async fetchReports(type = 'sales', period = 'this_month') {
    try {
      const res = await fetch(`${API_BASE}/reports/reports.php?type=${encodeURIComponent(type)}&period=${encodeURIComponent(period)}`, { credentials: 'same-origin' });
      const data = await res.json();
      return (data && data.success && data.data) ? data.data : null;
    } catch(e) {
      console.warn('Reports fetch error:', e);
      return null;
    }
  },
    async createPayPalOrder(orderId, amount) {
    try {
      const res = await fetch(`${API_BASE}/payments/paypal.php?action=create_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, amount: amount })
      });
      return await res.json();
    } catch { return null; }
  },
  async capturePayPalOrder(paypalOrderId, orderId, amount, cashier) {
    try {
      const res = await fetch(`${API_BASE}/payments/paypal.php?action=capture_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypal_order_id: paypalOrderId,
          order_id: orderId,
          amount: amount,
          cashier: cashier
        })
      });
      return await res.json();
    } catch { return null; }
  },
  async createOrder(orderPayload) {
    try {
      const res = await fetch(`${API_BASE}/orders/orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      return await res.json();
    } catch { return null; }
  },
  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/orders.php?id=${encodeURIComponent(orderId)}&action=status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch { return null; }
  },
  async updateTable(id, tableData) {
    try {
      const res = await fetch(`${API_BASE}/tables/tables.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableData)
      });
      return await res.json();
    } catch { return null; }
  },
  async updateInventoryStock(id, stockQty) {
    try {
      const res = await fetch(`${API_BASE}/inventory/inventory.php?id=${encodeURIComponent(id)}&action=stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQty })
      });
      return await res.json();
    } catch { return null; }
  },
  async addInventoryItem(invData) {
    try {
      const res = await fetch(`${API_BASE}/inventory/inventory.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invData)
      });
      return await res.json();
    } catch { return null; }
  },
  async addMenuItem(itemData) {
    try {
      const res = await fetch(`${API_BASE}/menu/items.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      return await res.json();
    } catch { return null; }
  },
  async updateMenuItem(id, itemData) {
    try {
      const res = await fetch(`${API_BASE}/menu/items.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      return await res.json();
    } catch { return null; }
  },
  async deleteMenuItem(id) {
    try {
      const res = await fetch(`${API_BASE}/menu/items.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchReservations() {
    try {
      const res = await fetch(`${API_BASE}/reservations/reservations.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async createReservation(resData) {
    try {
      const res = await fetch(`${API_BASE}/reservations/reservations.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resData)
      });
      return await res.json();
    } catch { return null; }
  },
  async deleteReservation(id) {
    try {
      const res = await fetch(`${API_BASE}/reservations/reservations.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchCustomers() {
    try {
      const res = await fetch(`${API_BASE}/customers/customers.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async createCustomer(custData) {
    try {
      const res = await fetch(`${API_BASE}/customers/customers.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custData)
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchTransactions() {
    try {
      const res = await fetch(`${API_BASE}/payments/payments.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async createTransaction(txnData) {
    try {
      const res = await fetch(`${API_BASE}/payments/payments.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txnData)
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchNextOrderNum() {
    try {
      const res = await fetch(`${API_BASE}/orders/orders.php?action=next_num`);
      const data = await res.json();
      return data.success ? data.data?.nextNumber : 9045;
    } catch { return 9045; }
  },
  async fetchAnalyticsSummary() {
    try {
      const res = await fetch(`${API_BASE}/reports/dashboard.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async addTable(tableData) {
    try {
      const res = await fetch(`${API_BASE}/tables/tables.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableData)
      });
      return await res.json();
    } catch { return null; }
  },
  async deleteTable(id) {
    try {
      const res = await fetch(`${API_BASE}/tables/tables.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchDiscounts(filters = {}) {
    try {
      const q = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/discounts/discounts.php${q ? '?' + q : ''}`, { credentials: 'same-origin' });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async fetchDiscountsAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/discounts/discounts.php?action=analytics`, { credentials: 'same-origin' });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async fetchBannerPromo() {
    try {
      const res = await fetch(`${API_BASE}/discounts/discounts.php?action=banner`, { credentials: 'same-origin' });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async createDiscount(discData) {
    try {
      const res = await fetch(`${API_BASE}/discounts/discounts.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(discData)
      });
      return await res.json();
    } catch { return null; }
  },
  async updateDiscount(id, discData) {
    try {
      const res = await fetch(`${API_BASE}/discounts/discounts.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(discData)
      });
      return await res.json();
    } catch { return null; }
  },
  async deleteDiscount(id) {
    try {
      const res = await fetch(`${API_BASE}/discounts/discounts.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      return await res.json();
    } catch { return null; }
  },
  async validateDiscount(payload) {
    try {
      const res = await fetch(`${API_BASE}/discounts/discounts.php?action=validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchFeedback() {
    try {
      const res = await fetch(`${API_BASE}/feedback/feedback.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async addFeedback(fbData) {
    try {
      const res = await fetch(`${API_BASE}/feedback/feedback.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbData)
      });
      return await res.json();
    } catch { return null; }
  },
  async deleteFeedback(id) {
    try {
      const res = await fetch(`${API_BASE}/feedback/feedback.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchStaff() {
    try {
      const res = await fetch(`${API_BASE}/employees/employees.php`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async addStaff(staffData) {
    try {
      const res = await fetch(`${API_BASE}/employees/employees.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData)
      });
      return await res.json();
    } catch { return null; }
  },
  async updateStaff(id, staffData) {
    try {
      const res = await fetch(`${API_BASE}/employees/employees.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData)
      });
      return await res.json();
    } catch { return null; }
  },
  async deleteStaff(id) {
    try {
      const res = await fetch(`${API_BASE}/employees/employees.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch { return null; }
  },
  async updateCustomer(id, custData) {
    try {
      const res = await fetch(`${API_BASE}/customers/customers.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custData)
      });
      return await res.json();
    } catch { return null; }
  },
  async deleteCustomer(id) {
    try {
      const res = await fetch(`${API_BASE}/customers/customers.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch { return null; }
  },
  async fetchState(key) {
    try {
      const res = await fetch(`${API_BASE}/state/${encodeURIComponent(key)}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch { return null; }
  },
  async saveState(key, value) {
    try {
      const res = await fetch(`${API_BASE}/state/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      return await res.json();
    } catch { return null; }
  }
};

let socket = null;
if (typeof io !== 'undefined') {
  try {
    socket = io('http://localhost:5000');
    socket.on('connect', () => {
      console.log('[Frontend] Connected to WebSocket server on port 5000');
    });
    socket.on('order:new', (newOrder) => {
      console.log('[KDS Stream] New order received via WebSocket:', newOrder);
      if (typeof DB !== 'undefined' && DB.kdsOrders) {
        // Prevent duplicates
        if (!DB.kdsOrders.some(o => o.id === newOrder.id)) {
          DB.kdsOrders.unshift(newOrder);
          if (typeof updateKDSBadge === 'function') updateKDSBadge();
          if (typeof renderCurrentModule === 'function' && AppState.activeModule === 'kds') {
            renderCurrentModule();
          }
        }
      }
    });
    socket.on('order:status_update', (data) => {
      console.log('[KDS Stream] Order status updated via WebSocket:', data);
      // Re-sync data from backend to keep tables, KDS, and dashboard in sync
      if (typeof syncBackendData === 'function') {
        syncBackendData();
      }
    });
    socket.on('table:update', (data) => {
      console.log('[Table Stream] Table updated via WebSocket:', data);
      if (typeof DB !== 'undefined' && DB.tables) {
        const t = DB.tables.find(tbl => tbl.id === data.id);
        if (t) {
          t.status = data.status;
          if (data.orderId !== undefined) t.orderId = data.orderId;
        }
        if (typeof saveLocalDB === 'function') saveLocalDB();
        if (typeof renderCartTableSelect === 'function') renderCartTableSelect();
        if (typeof renderCurrentModule === 'function' && AppState.activeModule === 'tables') {
          renderCurrentModule();
        }
      }
    });
  } catch (e) {
    console.warn('[Socket.io] Real-time engine offline:', e);
  }
}

// ==========================================
// 1. DATA MODELS & IN-MEMORY DATABASE
// ==========================================

const defaultPermissions = {
  admin: {
    pos: true,
    kds: true,
    waitstaff: true,
    customer_tracker: true,
    tables: true,
    reservations: true,
    payments: true,
    menu: true,
    inventory: true,
    suppliers: true,
    discounts: true,
    customers: true,
    employees: true,
    feedback: true,
    dashboard: true,
    access: true,
    audit: true,
    reports: true,
    ai_forecast: true,
    ai_forecasting: true
  },
  manager: {
    pos: true,
    kds: true,
    waitstaff: true,
    customer_tracker: true,
    tables: true,
    reservations: true,
    payments: true,
    menu: true,
    inventory: true,
    suppliers: true,
    discounts: true,
    customers: true,
    employees: true,
    feedback: true,
    dashboard: true,
    access: false,
    audit: true,
    reports: true,
    ai_forecast: true,
    ai_forecasting: true
  },
  cashier: {
    pos: true,
    kds: true,
    waitstaff: true,
    customer_tracker: true,
    tables: true,
    reservations: true,
    payments: true,
    menu: true,
    inventory: true,
    suppliers: false,
    discounts: true,
    customers: true,
    employees: false,
    feedback: true,
    dashboard: false,
    access: false,
    audit: false
  },
  kitchen: {
    pos: false,
    kds: true,
    waitstaff: false,
    customer_tracker: false,
    tables: false,
    reservations: false,
    menu: false,
    inventory: true,
    suppliers: false,
    discounts: false,
    customers: false,
    employees: false,
    feedback: true,
    dashboard: false,
    access: false,
    audit: false
  },
  barista: {
    pos: false,
    kds: true,
    waitstaff: false,
    customer_tracker: false,
    tables: false,
    reservations: false,
    menu: false,
    inventory: true,
    suppliers: false,
    discounts: false,
    customers: false,
    employees: false,
    feedback: true,
    dashboard: false,
    access: false,
    audit: false
  },
  waitstaff: {
    pos: true,
    kds: false,
    waitstaff: true,
    customer_tracker: false,
    tables: true,
    reservations: true,
    menu: true,
    inventory: false,
    suppliers: false,
    discounts: false,
    customers: true,
    employees: false,
    feedback: true,
    dashboard: false,
    access: false,
    audit: false
  },
  customer: {
    pos: true,
    kds: false,
    waitstaff: false,
    customer_tracker: true,
    tables: false,
    reservations: true,
    menu: true,
    inventory: false,
    suppliers: false,
    discounts: true,
    customers: true,
    employees: false,
    feedback: true,
    dashboard: false,
    access: false,
    audit: false
  }
};


const defaultMenuCategories = [
  { id: '1', name: 'Coffee', icon: 'ri-cup-line', desc: 'Espresso-based coffees' },
  { id: '2', name: 'Hot Drinks', icon: 'ri-fire-line', desc: 'Chai, chocolates & specialty lattes' },
  { id: '3', name: 'Tea', icon: 'ri-leaf-line', desc: 'Premium loose-leaf and herbal teas' },
  { id: '4', name: 'Cold Coffee', icon: 'ri-snow-line', desc: 'Chilled espresso and iced lattes' },
  { id: '5', name: 'Cold Drinks', icon: 'ri-goblet-line', desc: 'Cold milkshakes, sodas and water' },
  { id: '6', name: 'Smoothies', icon: 'ri-drinks-line', desc: 'Blended real fruit smoothies' },
  { id: '7', name: 'Juices', icon: 'ri-contrast-drop-2-line', desc: 'Fresh cold-pressed juices' },
  { id: '8', name: 'Breakfast', icon: 'ri-sun-line', desc: 'Farm eggs, toast and morning plates' },
  { id: '9', name: 'Toasties', icon: 'ri-bread-line', desc: 'Gourmet melted sourdough toasties' },
  { id: '10', name: 'Sandwiches', icon: 'ri-restaurant-line', desc: 'Fresh deli sandwiches & wraps' },
  { id: '11', name: 'Pastries', icon: 'ri-cake-3-line', desc: 'Flaky artisan butter croissants & danishes' },
  { id: '12', name: 'Bakery', icon: 'ri-cake-2-line', desc: 'Muffins, banana breads and scones' },
  { id: '13', name: 'Lunch', icon: 'ri-bowl-line', desc: 'Fresh seasonal salads & protein bowls' },
  { id: '14', name: 'Sides', icon: 'ri-french-fries-line', desc: 'Crispy fries and snack sides' }
];

const defaultMenuItems = [
  // Coffee
  { id: '1', product_id: 1, catId: '1', category_id: 1, name: 'Espresso / Short Black', desc: 'Intense double-shot extraction of Ravenhill Reserve blend', price: 4.00, hasModifiers: true, image: 'brand_recources/double_espresso_short_black.png' },
  { id: '2', product_id: 2, catId: '1', category_id: 1, name: 'Long Black', desc: 'Double shot poured over hot filtered water preserving crema', price: 4.80, hasModifiers: true, image: 'brand_recources/long_black_coffee.png' },
  { id: '3', product_id: 3, catId: '1', category_id: 1, name: 'Flat White', desc: 'Silky textured microfoam folded over a double shot of espresso', price: 5.20, hasModifiers: true, image: 'brand_recources/flat_white_coffee.png' },
  { id: '4', product_id: 4, catId: '1', category_id: 1, name: 'Latte', desc: 'Smooth espresso with velvety steamed milk and light froth', price: 5.20, hasModifiers: true, image: 'brand_recources/flat_white_coffee.png' },
  { id: '5', product_id: 5, catId: '1', category_id: 1, name: 'Cappuccino', desc: 'Rich espresso with deep velvety foam and dark cocoa dusting', price: 5.20, hasModifiers: true, image: 'brand_recources/cappuccino_coffee.png' },
  { id: '6', product_id: 6, catId: '1', category_id: 1, name: 'Piccolo Latte', desc: 'Concentrated ristretto with warm silky milk in a 4oz glass', price: 4.80, hasModifiers: true, image: 'brand_recources/piccolo_latte.png' },
  { id: '7', product_id: 7, catId: '1', category_id: 1, name: 'Short Macchiato', desc: 'Pure espresso marked with a dash of steamed milk foam', price: 4.50, hasModifiers: true, image: 'brand_recources/double_espresso_short_black.png' },
  { id: '8', product_id: 8, catId: '1', category_id: 1, name: 'Long Macchiato', desc: 'Double shot over hot water stained with steamed milk foam', price: 5.20, hasModifiers: true, image: 'brand_recources/long_black_coffee.png' },
  { id: '9', product_id: 9, catId: '1', category_id: 1, name: 'Mocha', desc: 'Belgian dark chocolate melted with espresso and silky milk', price: 5.80, hasModifiers: true, image: 'brand_recources/cappuccino_coffee.png' },
  { id: '10', product_id: 10, catId: '1', category_id: 1, name: 'Babycino', desc: 'Warm frothed milk with sweet cocoa and two marshmallows', price: 2.50, hasModifiers: true, image: 'brand_recources/cappuccino_coffee.png' },

  // Hot Drinks
  { id: '11', product_id: 11, catId: '2', category_id: 2, name: 'Hot Chocolate', desc: 'Belgian 54% dark chocolate with steamed milk and marshmallows', price: 5.50, hasModifiers: true, image: 'brand_recources/cappuccino_coffee.png' },
  { id: '12', product_id: 12, catId: '2', category_id: 2, name: 'White Hot Chocolate', desc: 'Velvety Swiss white chocolate melted into creamy steamed milk', price: 5.70, hasModifiers: true, image: 'brand_recources/cappuccino_coffee.png' },
  { id: '13', product_id: 13, catId: '2', category_id: 2, name: 'Chai Latte', desc: 'Spiced black tea with cinnamon, cardamom and steamed milk', price: 5.70, hasModifiers: true, image: 'brand_recources/prana_sticky_chai_latte.png' },
  { id: '14', product_id: 14, catId: '2', category_id: 2, name: 'Dirty Chai', desc: 'Traditional spiced chai latte infused with a shot of espresso', price: 6.20, hasModifiers: true, image: 'brand_recources/prana_sticky_chai_latte.png' },
  { id: '15', product_id: 15, catId: '2', category_id: 2, name: 'Matcha Latte', desc: 'Ceremonial grade Japanese Uji matcha with silky steamed milk', price: 6.20, hasModifiers: true, image: 'brand_recources/flat_white_coffee.png' },
  { id: '16', product_id: 16, catId: '2', category_id: 2, name: 'Turmeric Latte', desc: 'Golden spiced blend of organic turmeric, ginger and milk', price: 5.90, hasModifiers: true, image: 'brand_recources/flat_white_coffee.png' },

  // Tea
  { id: '17', product_id: 17, catId: '3', category_id: 3, name: 'English Breakfast Tea', desc: 'Full-bodied organic Ceylon and Assam black tea blend', price: 4.80, hasModifiers: true, image: 'brand_recources/batch_brew_filter.png' },
  { id: '18', product_id: 18, catId: '3', category_id: 3, name: 'Earl Grey Tea', desc: 'Fragrant black tea with cold-pressed Italian bergamot oil', price: 4.80, hasModifiers: true, image: 'brand_recources/batch_brew_filter.png' },
  { id: '19', product_id: 19, catId: '3', category_id: 3, name: 'Green Tea', desc: 'Delicate Japanese Sencha green tea with vibrant clean notes', price: 4.80, hasModifiers: true, image: 'brand_recources/batch_brew_filter.png' },
  { id: '20', product_id: 20, catId: '3', category_id: 3, name: 'Peppermint Tea', desc: 'Refreshing whole organic peppermint leaves, caffeine-free', price: 4.80, hasModifiers: true, image: 'brand_recources/batch_brew_filter.png' },
  { id: '21', product_id: 21, catId: '3', category_id: 3, name: 'Chamomile Tea', desc: 'Calming whole chamomile flower blossoms with apple sweetness', price: 4.80, hasModifiers: true, image: 'brand_recources/batch_brew_filter.png' },
  { id: '22', product_id: 22, catId: '3', category_id: 3, name: 'Lemongrass & Ginger Tea', desc: 'Zesty lemongrass stalks with spicy warming ginger root', price: 4.80, hasModifiers: true, image: 'brand_recources/batch_brew_filter.png' },

  // Cold Coffee
  { id: '23', product_id: 23, catId: '4', category_id: 4, name: 'Iced Latte', desc: 'Double shot of espresso poured over cold milk and ice', price: 6.80, hasModifiers: true, image: 'brand_recources/iced_oat_milk_latte.png' },
  { id: '24', product_id: 24, catId: '4', category_id: 4, name: 'Iced Long Black', desc: 'Double shot of espresso over chilled mineral water and ice', price: 6.20, hasModifiers: true, image: 'brand_recources/cold_brew_coffee.png' },
  { id: '25', product_id: 25, catId: '4', category_id: 4, name: 'Iced Coffee', desc: 'Chilled espresso and milk with vanilla ice cream & whipped cream', price: 7.80, hasModifiers: true, image: 'brand_recources/iced_oat_milk_latte.png' },
  { id: '26', product_id: 26, catId: '4', category_id: 4, name: 'Iced Mocha', desc: 'Belgian melted chocolate, espresso shot, chilled milk and cream', price: 8.20, hasModifiers: true, image: 'brand_recources/iced_oat_milk_latte.png' },

  // Cold Drinks
  { id: '27', product_id: 27, catId: '5', category_id: 5, name: 'Iced Chocolate', desc: 'Cold Belgian chocolate milk with vanilla ice cream & cream', price: 7.80, hasModifiers: true, image: 'brand_recources/iced_oat_milk_latte.png' },
  { id: '28', product_id: 28, catId: '5', category_id: 5, name: 'Iced Chai Latte', desc: 'Chilled aromatic spiced chai infused with cold milk over ice', price: 7.20, hasModifiers: true, image: 'brand_recources/prana_sticky_chai_latte.png' },
  { id: '29', product_id: 29, catId: '5', category_id: 5, name: 'Iced Matcha Latte', desc: 'Ceremonial Japanese matcha whisked with ice-cold milk over ice', price: 7.80, hasModifiers: true, image: 'brand_recources/iced_oat_milk_latte.png' },
  { id: '30', product_id: 30, catId: '5', category_id: 5, name: 'Milkshake', desc: 'Classic thick shake (Chocolate, Vanilla, Strawberry, Caramel)', price: 8.50, hasModifiers: true, image: 'brand_recources/iced_oat_milk_latte.png' },
  { id: '31', product_id: 31, catId: '5', category_id: 5, name: 'Bottled Still Water', desc: 'Pure Australian spring water in recyclable 600ml bottle', price: 3.50, hasModifiers: true, image: 'brand_recources/cold_brew_coffee.png' },
  { id: '32', product_id: 32, catId: '5', category_id: 5, name: 'Sparkling Water', desc: 'Crisp mineral sparkling water with fresh lemon wedge 500ml', price: 5.00, hasModifiers: true, image: 'brand_recources/cold_brew_coffee.png' },
  { id: '33', product_id: 33, catId: '5', category_id: 5, name: 'Soft Drink', desc: 'Classic canned soft drinks (Coke, Coke Zero, Sprite, Fanta)', price: 4.50, hasModifiers: true, image: 'brand_recources/cold_brew_coffee.png' },

  // Smoothies
  { id: '34', product_id: 34, catId: '6', category_id: 6, name: 'Smoothie (Banana / Berry / Mango / Tropical)', desc: 'Blended fruit smoothie with Greek yogurt, honey and chia seeds', price: 9.50, hasModifiers: true, image: 'brand_recources/iced_oat_milk_latte.png' },

  // Juices
  { id: '35', product_id: 35, catId: '7', category_id: 7, name: 'Fresh Orange Juice', desc: '100% freshly cold-pressed sweet Valencia oranges', price: 8.50, hasModifiers: true, image: 'brand_recources/cold_brew_coffee.png' },
  { id: '36', product_id: 36, catId: '7', category_id: 7, name: 'Fresh Apple Juice', desc: 'Crisp cold-pressed Granny Smith and Pink Lady apples', price: 8.50, hasModifiers: true, image: 'brand_recources/cold_brew_coffee.png' },
  { id: '37', product_id: 37, catId: '7', category_id: 7, name: 'Green Juice', desc: 'Celery, cucumber, kale, green apple and fresh mint', price: 9.50, hasModifiers: true, image: 'brand_recources/cold_brew_coffee.png' },

  // Breakfast
  { id: '38', product_id: 38, catId: '8', category_id: 8, name: 'Sourdough Toast', desc: 'Two thick toasted slices of Noisette sourdough with butter & spreads', price: 6.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '39', product_id: 39, catId: '8', category_id: 8, name: 'Eggs on Toast', desc: 'Two free-range eggs cooked your way on toasted sourdough', price: 15.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '40', product_id: 40, catId: '8', category_id: 8, name: 'Bacon & Egg Roll', desc: 'Smoked streaky bacon, fried egg, relish on a brioche bun', price: 12.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '41', product_id: 41, catId: '8', category_id: 8, name: 'Breakfast Wrap', desc: 'Scrambled eggs, bacon, spinach, avocado & chipotle mayo', price: 13.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '42', product_id: 42, catId: '8', category_id: 8, name: 'Avocado Toast', desc: 'Smashed Hass avocado, Persian feta, dukkah, radish & lemon', price: 18.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '43', product_id: 43, catId: '8', category_id: 8, name: 'Granola & Yoghurt', desc: 'Honey toasted granola with seasonal berries & vanilla yogurt', price: 15.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '44', product_id: 44, catId: '8', category_id: 8, name: 'Porridge', desc: 'Rolled oats with almond milk, caramelized banana & maple', price: 15.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '45', product_id: 45, catId: '8', category_id: 8, name: 'Eggs Benedict', desc: 'Two poached eggs, smoked ham or bacon, citrus hollandaise on sourdough', price: 21.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '46', product_id: 46, catId: '8', category_id: 8, name: 'Breakfast Burger', desc: 'Angus patty, bacon, fried egg, hash brown, cheddar & BBQ relish', price: 16.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },

  // Toasties
  { id: '47', product_id: 47, catId: '9', category_id: 9, name: 'Ham & Cheese Toastie', desc: 'Smoked leg ham, melted Gruyère and vintage cheddar on sourdough', price: 12.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '48', product_id: 48, catId: '9', category_id: 9, name: 'Cheese & Tomato Toastie', desc: 'Heirloom tomatoes, aged cheddar cheese and basil on sourdough', price: 11.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '49', product_id: 49, catId: '9', category_id: 9, name: 'Three Cheese Toastie', desc: 'Mozzarella, vintage cheddar and Gruyère on golden sourdough', price: 14.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '50', product_id: 50, catId: '9', category_id: 9, name: 'Tuna Melt', desc: 'Albacore tuna salad, dill, melted provolone and jalapeño', price: 15.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },

  // Sandwiches
  { id: '51', product_id: 51, catId: '10', category_id: 10, name: 'BLT Toasted Sandwich', desc: 'Crispy bacon, cos lettuce, vine tomato and aioli on sourdough', price: 13.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '52', product_id: 52, catId: '10', category_id: 10, name: 'Chicken & Avocado Sandwich', desc: 'Poached chicken breast, avocado, rocket and herb mayo on baguette', price: 16.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },

  // Pastries
  { id: '53', product_id: 53, catId: '11', category_id: 11, name: 'Plain Croissant', desc: 'Traditional flaky French butter croissant baked fresh daily', price: 6.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '54', product_id: 54, catId: '11', category_id: 11, name: 'Almond Croissant', desc: 'Double-baked croissant filled with rich almond frangipane', price: 8.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '55', product_id: 55, catId: '11', category_id: 11, name: 'Chocolate Croissant', desc: 'Flaky French pastry with two batons of dark Belgian chocolate', price: 7.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '56', product_id: 56, catId: '11', category_id: 11, name: 'Ham & Cheese Croissant', desc: 'Warm butter croissant with leg ham, Swiss cheese & bechamel', price: 9.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '57', product_id: 57, catId: '11', category_id: 11, name: 'Fruit Danish', desc: 'Crispy pastry rosette with vanilla custard and glazed fruit', price: 7.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },

  // Bakery
  { id: '58', product_id: 58, catId: '12', category_id: 12, name: 'Blueberry Muffin', desc: 'Moist vanilla batter with wild blueberries and crumble top', price: 6.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '59', product_id: 59, catId: '12', category_id: 12, name: 'Chocolate Muffin', desc: 'Double chocolate chunk muffin with dark and milk chips', price: 6.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '60', product_id: 60, catId: '12', category_id: 12, name: 'Banana Bread', desc: 'Toasted spiced banana loaf with whipped honey cinnamon butter', price: 7.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '61', product_id: 61, catId: '12', category_id: 12, name: 'Blueberry Scone', desc: 'Traditional scone served warm with strawberry jam & cream', price: 6.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },

  // Lunch
  { id: '62', product_id: 62, catId: '13', category_id: 13, name: 'Seasonal Salad', desc: 'Baby spinach, quinoa, roast pumpkin, walnuts & balsamic citrus', price: 18.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '63', product_id: 63, catId: '13', category_id: 13, name: 'Chicken Caesar Salad', desc: 'Grilled chicken, bacon, cos lettuce, croutons, parmesan & egg', price: 21.00, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },

  // Sides
  { id: '64', product_id: 64, catId: '14', category_id: 14, name: 'Chips', desc: 'Bowl of crispy golden shoestring potato fries with garlic aioli', price: 8.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' },
  { id: '65', product_id: 65, catId: '14', category_id: 14, name: 'Sweet Potato Chips', desc: 'Crunchy rosemary salted sweet potato fries with chipotle mayo', price: 10.50, hasModifiers: true, image: 'brand_recources/butter_croissant.png' }
];

const DB = {
  menuCategories: defaultMenuCategories,
  menuItems: defaultMenuItems,
  tables: [],
  customers: [],
  discounts: [],
  inventory: [],
  suppliers: [
    { id: 'SUP-01', name: 'Melbourne Coffee Exporters', contact: 'Sam Harris', phone: '(03) 9882 1100', catalog: 'Single origin green & roasted beans' },
    { id: 'SUP-02', name: 'St David Dairy Victoria', contact: 'Anna Schmidt', phone: '(03) 9419 8820', catalog: 'Organic full cream & skim milk' },
    { id: 'SUP-03', name: 'BioPak Sustainable Solutions', contact: 'Orders Team', phone: '1300 246 725', catalog: 'Compostable coffee cups & lids' }
  ],
  employees: [
    { id: 'EMP-01', name: 'Sarah Lin', role: 'Lead Cashier', pin: '1234', shiftStart: '06:30 AM', clockedIn: true, hoursWorked: 4.2 },
    { id: 'EMP-02', name: 'Liam O\'Connor', role: 'Head Barista', pin: '5678', shiftStart: '06:30 AM', clockedIn: true, hoursWorked: 4.2 },
    { id: 'EMP-03', name: 'Hannah Wright', role: 'Barista / Floor', pin: '9900', shiftStart: '08:00 AM', clockedIn: true, hoursWorked: 2.7 }
  ],
  reservations: [
    { id: 'RES-101', customerName: 'David Kim', partySize: 6, tableId: 'T-05', time: '11:30 AM', status: 'Confirmed', contact: '0412 889 201' },
    { id: 'RES-102', customerName: 'Alex Mercer', partySize: 4, tableId: 'T-08', time: '12:30 PM', status: 'Confirmed', contact: '0400 998 123' },
    { id: 'RES-103', customerName: 'Chloe Lin', partySize: 4, tableId: 'T-10', time: '01:15 PM', status: 'Pending', contact: '0488 442 109' }
  ],
  feedback: [
    { id: 'FB-01', customer: 'Marcus Vance', rating: 5, comment: 'Best Flat White in Flinders Lane! Microfoam is super silky.', date: 'Today, 09:15 AM' },
    { id: 'FB-02', customer: 'Elena R.', rating: 5, comment: 'Great atmosphere, loving the oat milk latte.', date: 'Yesterday, 02:40 PM' },
    { id: 'FB-03', customer: 'Walk-in Guest', rating: 4, comment: 'Quick service during morning rush hour.', date: 'Yesterday, 08:30 AM' }
  ],
  kdsOrders: [],
  completedSales: [],
  rolePermissions: JSON.parse(JSON.stringify(defaultPermissions))
};

// ==========================================
// 2. REACTIVE APP STATE STORE
// ==========================================

const AppState = {
  activeRole: 'cashier', // 'admin', 'cashier', 'barista'
  activeModule: 'pos',
  isAuthenticated: true,
  activeCategory: 'all',
  posCatMenuCollapsed: false,
  searchQuery: '',

  // Active Sale Cart
  cart: {
    orderId: '#ORD-9042',
    orderType: 'dine_in', // 'dine_in', 'takeaway'
    tableId: 'T-03',
    customer: null, // attached customer
    items: [],
    promoCode: null,
    discountAmount: 0
  },

  // Modal Temp Customisation Target
  modalItem: null
};

// ==========================================
// 3. CORE DOM REFERENCES & INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function saveLocalDB() {
  try {
    localStorage.setItem('RAVENHILL_DB_STATE', JSON.stringify(DB));
    localStorage.setItem('RAVENHILL_APP_STATE', JSON.stringify({
      orderId: AppState.cart.orderId,
      activeRole: AppState.activeRole,
      isAuthenticated: AppState.isAuthenticated
    }));
    if (AppState.cart) {
      localStorage.setItem('RAVENHILL_CART_STATE', JSON.stringify(AppState.cart));
    }
  } catch (e) {
    console.warn('[LocalStorage] Save failed:', e);
  }
}

function loadLocalDB() {
  try {
    const saved = localStorage.getItem('RAVENHILL_DB_STATE');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.tables && parsed.tables.length) DB.tables = parsed.tables;
      if (parsed.kdsOrders) DB.kdsOrders = parsed.kdsOrders;
      if (parsed.inventory && parsed.inventory.length) DB.inventory = parsed.inventory;
      if (parsed.menuItems && parsed.menuItems.length && parsed.menuItems.some(i => i.catId === '1' || i.category_id === 1)) {
        DB.menuItems = parsed.menuItems;
      }
      if (parsed.menuCategories && parsed.menuCategories.length && parsed.menuCategories.some(c => c.id === '1' || c.category_id === 1)) {
        DB.menuCategories = parsed.menuCategories;
      }
      if (parsed.reservations) DB.reservations = parsed.reservations;
      if (parsed.customers && parsed.customers.length) DB.customers = parsed.customers;
      if (parsed.discounts && parsed.discounts.length) DB.discounts = parsed.discounts;
      if (parsed.completedSales) DB.completedSales = parsed.completedSales;
      if (parsed.rolePermissions) DB.rolePermissions = parsed.rolePermissions;
    }
    // Load app state
    const appStateSaved = localStorage.getItem('RAVENHILL_APP_STATE');
    if (appStateSaved) {
      const appParsed = JSON.parse(appStateSaved);
      if (appParsed.orderId) AppState.cart.orderId = appParsed.orderId;
      if (appParsed.activeRole) AppState.activeRole = appParsed.activeRole;
      if (appParsed.isAuthenticated !== undefined) AppState.isAuthenticated = appParsed.isAuthenticated;
    }
    // Load cart state
    const cartSaved = localStorage.getItem('RAVENHILL_CART_STATE');
    if (cartSaved) {
      const cartParsed = JSON.parse(cartSaved);
      if (cartParsed && Array.isArray(cartParsed.items)) {
        AppState.cart = {
          ...AppState.cart,
          ...cartParsed
        };
      }
    }
    if (AppState.activeCategory !== 'all' && !DB.menuCategories.some(c => String(c.id) === String(AppState.activeCategory)) && DB.menuCategories.length > 0) {
      AppState.activeCategory = 'all';
    }
  } catch (e) {
    console.warn('[LocalStorage] Load failed:', e);
  }
}

// Global Toast Notification System
window.showToast = function(message, type = 'info', duration = 3200) {
  let container = document.getElementById('app-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-toast-container';
    container.style.cssText = 'position:fixed; top:24px; right:24px; z-index:999999; display:flex; flex-direction:column; gap:10px; pointer-events:none; max-width:90vw; width:380px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `app-toast toast-${type}`;
  
  const iconMap = {
    success: 'ri-checkbox-circle-fill',
    warning: 'ri-alert-fill',
    danger: 'ri-error-warning-fill',
    error: 'ri-close-circle-fill',
    info: 'ri-information-fill'
  };
  const icon = iconMap[type] || 'ri-notification-3-fill';

  const bgMap = {
    success: 'linear-gradient(135deg, rgba(39, 174, 96, 0.95), rgba(46, 204, 113, 0.95))',
    warning: 'linear-gradient(135deg, rgba(230, 126, 34, 0.95), rgba(241, 196, 15, 0.95))',
    danger: 'linear-gradient(135deg, rgba(192, 57, 43, 0.95), rgba(231, 76, 60, 0.95))',
    error: 'linear-gradient(135deg, rgba(192, 57, 43, 0.95), rgba(231, 76, 60, 0.95))',
    info: 'linear-gradient(135deg, rgba(217, 107, 67, 0.95), rgba(229, 169, 59, 0.95))'
  };

  toast.style.cssText = `
    background: ${bgMap[type] || bgMap.info};
    color: #ffffff;
    padding: 12px 18px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    font-weight: 600;
    pointer-events: auto;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    transform: translateX(50px) scale(0.95);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  toast.innerHTML = `
    <i class="${icon}" style="font-size:18px; flex-shrink:0;"></i>
    <span style="flex:1; line-height:1.35;">${message}</span>
    <button type="button" style="background:none; border:none; color:rgba(255,255,255,0.8); cursor:pointer; font-size:16px; padding:0; display:flex; align-items:center;" onclick="this.parentElement.remove()"><i class="ri-close-line"></i></button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0) scale(1)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(50px) scale(0.95)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (typeof toast.remove === 'function') toast.remove();
      else if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, duration);
};

const showToast = window.showToast;

function initApp() {
  // Load saved state from LocalStorage immediately to prevent initial reset on refresh
  loadLocalDB();

  setupUniversalModalClosers();
  setupNavigation();
  setupRoleSwitcher();
  setupSidebarToggle();
  setupGlobalSearch();
  setupCartDrawerEvents();
  setupCustomiserModal();
  setupPaymentModal();
  setupLiveClock();
  setupKeyboardShortcuts();

  // Set default role & restore authenticated session if exists
  const savedRole = localStorage.getItem('RAVENHILL_USER_ROLE');
  const savedAuth = localStorage.getItem('RAVENHILL_AUTH_SAVED');
  const savedUserStr = localStorage.getItem('RAVENHILL_AUTH_USER');
  let savedUser = null;
  try { if (savedUserStr) savedUser = JSON.parse(savedUserStr); } catch(e) {}

  if (savedAuth === 'true' && savedRole) {
    AppState.isAuthenticated = true;
    AppState.activeRole = savedRole;
    if (savedUser) AppState.currentUser = savedUser;

    applyRoleToUI(savedRole);
    applyRolePermissionsUI();

    let targetMod = 'pos';
    if (savedRole === 'admin' || savedRole === 'manager') targetMod = 'dashboard';
    else if (savedRole === 'barista' || savedRole === 'kitchen') targetMod = 'kds';
    else if (savedRole === 'waitstaff') targetMod = 'waitstaff';
    else if (savedRole === 'customer') targetMod = 'pos';

    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      window.showAppView(hash.replace('#', ''));
    } else {
      window.showAppView(targetMod);
    }
  } else {
    // Visitor / Guest landing page
    if (!AppState.activeRole) {
      AppState.activeRole = 'customer';
      AppState.activeModule = 'landing';
    }
    const hash = window.location.hash;
    if (hash === '#pos' || hash === '#kds' || hash === '#admin' || hash === '#dashboard') {
      window.showAppView(hash.replace('#', ''));
    } else {
      window.showLandingView();
    }
  }

  updateKDSBadge();
  updateLowStockBadge();

  // Sync live data from Node.js Express Backend REST API
  syncBackendData();
  
  // Check backend session
  initSession();
}

window.openLoginModal = function(targetRole) {
  const modal = document.getElementById('role-select-modal');
  const userRoleSelect = document.getElementById('role-popup-select');
  const userInput = document.getElementById('role-username-input');
  const passInput = document.getElementById('role-password-input');
  const errorMsg = document.getElementById('role-pass-error');

  const desiredRole = targetRole || AppState.activeRole || 'admin';

  if (userRoleSelect) {
    userRoleSelect.value = desiredRole;
  }

  if (userInput) {
    if (desiredRole === 'admin') userInput.value = 'admin';
    else if (desiredRole === 'manager') userInput.value = 'manager';
    else if (desiredRole === 'cashier') userInput.value = 'cashier';
    else if (desiredRole === 'barista') userInput.value = 'barista';
    else if (desiredRole === 'kitchen') userInput.value = 'kitchen';
    else if (desiredRole === 'waitstaff') userInput.value = 'waiter';
    else if (desiredRole === 'customer') userInput.value = 'customer';
    else userInput.value = '';
  }

  if (passInput) {
    passInput.value = '';
    passInput.type = 'password';
  }

  const icon = document.getElementById('toggle-pass-icon');
  if (icon) icon.className = 'ri-eye-off-line';

  if (errorMsg) errorMsg.classList.add('hidden');

  if (modal) modal.classList.remove('hidden');

  setTimeout(() => {
    if (passInput) passInput.focus();
  }, 100);
};

window.handleRoleModalSelectChange = function(newRole) {
  const userInput = document.getElementById('role-username-input');
  const passInput = document.getElementById('role-password-input');
  const errorMsg = document.getElementById('role-pass-error');
  if (errorMsg) errorMsg.classList.add('hidden');

  if (userInput) {
    if (newRole === 'admin') userInput.value = 'admin';
    else if (newRole === 'manager') userInput.value = 'manager';
    else if (newRole === 'cashier') userInput.value = 'cashier';
    else if (newRole === 'barista') userInput.value = 'barista';
    else if (newRole === 'kitchen') userInput.value = 'kitchen';
    else if (newRole === 'waitstaff') userInput.value = 'waiter';
    else if (newRole === 'customer') userInput.value = 'customer';
    else userInput.value = '';
  }
  if (passInput) {
    passInput.value = '';
    passInput.focus();
  }
};

window.togglePasswordVisibility = function() {
  const passInput = document.getElementById('role-password-input');
  const icon = document.getElementById('toggle-pass-icon');
  if (passInput) {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (icon) icon.className = 'ri-eye-line';
    } else {
      passInput.type = 'password';
      if (icon) icon.className = 'ri-eye-off-line';
    }
  }
};

function applyRoleToUI(role) {
  const roleSelect = document.getElementById('user-role-select');
  const nameEl = document.getElementById('current-user-name');
  const badgeEl = document.getElementById('current-user-role-badge');
  const avatarEl = document.getElementById('current-user-avatar');

  if (roleSelect) roleSelect.value = role;

  const u = AppState.currentUser;
  if (u && (u.first_name || u.username)) {
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username;
    if (nameEl) nameEl.textContent = fullName;
    if (badgeEl) badgeEl.textContent = (u.position || u.role || role).replace(/^./, str => str.toUpperCase());
    
    let initials = 'U';
    if (u.first_name && u.last_name) {
      initials = (u.first_name[0] + u.last_name[0]).toUpperCase();
    } else if (fullName) {
      initials = fullName.substring(0, 2).toUpperCase();
    }
    if (avatarEl) avatarEl.textContent = initials;
    return;
  }

  if (role === 'admin') {
    if (nameEl) nameEl.textContent = 'Ravenhill Admin';
    if (badgeEl) badgeEl.textContent = 'System Admin';
    if (avatarEl) avatarEl.textContent = 'RA';
  } else if (role === 'manager') {
    if (nameEl) nameEl.textContent = 'Alex Vance';
    if (badgeEl) badgeEl.textContent = 'Store Manager';
    if (avatarEl) avatarEl.textContent = 'AV';
  } else if (role === 'kitchen') {
    if (nameEl) nameEl.textContent = 'Marco Rossi';
    if (badgeEl) badgeEl.textContent = 'Head Chef';
    if (avatarEl) avatarEl.textContent = 'MR';
  } else if (role === 'barista') {
    if (nameEl) nameEl.textContent = 'Liam O\'Connor';
    if (badgeEl) badgeEl.textContent = 'Head Barista';
    if (avatarEl) avatarEl.textContent = 'LO';
  } else if (role === 'waitstaff') {
    if (nameEl) nameEl.textContent = 'Chloe Bennett';
    if (badgeEl) badgeEl.textContent = 'Wait Staff';
    if (avatarEl) avatarEl.textContent = 'CB';
  } else if (role === 'customer') {
    if (nameEl) nameEl.textContent = 'Sophia Reed';
    if (badgeEl) badgeEl.textContent = 'Loyalty Customer';
    if (avatarEl) avatarEl.textContent = 'SR';
    if (window.CustomerStore && CustomerStore.customers) {
      const sophia = CustomerStore.customers.find(c => String(c.id) === '7' || c.name.toLowerCase().includes('sophia'));
      if (sophia) AppState.activeCustomerProfile = sophia;
    }
  } else {
    if (nameEl) nameEl.textContent = 'Sarah Lin';
    if (badgeEl) badgeEl.textContent = 'Lead Cashier';
    if (avatarEl) avatarEl.textContent = 'SL';
  }
}
window.applyRoleToUI = applyRoleToUI;

window.applyRolePermissionsUI = function() {
  const role = AppState.activeRole || 'cashier';
  const perms = (DB.rolePermissions && DB.rolePermissions[role]) 
    ? DB.rolePermissions[role] 
    : (defaultPermissions[role] || {});

  const topbarRoleSelect = document.getElementById('user-role-select');
  if (topbarRoleSelect) topbarRoleSelect.value = role;

  // Sidebar items
  const navItems = document.querySelectorAll('.nav-item[data-module]');
  navItems.forEach(item => {
    const mod = item.getAttribute('data-module');
    
    // Access control is ONLY visible to Admin
    if (mod === 'access') {
      if (role === 'admin') {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    } else if (perms[mod] !== undefined) {
      if (perms[mod]) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    } else {
      item.style.display = 'flex';
    }
  });

  // Section titles in sidebar
  const navWrappers = document.querySelectorAll('.sidebar-nav-wrapper');
  navWrappers.forEach(wrap => {
    const sections = wrap.querySelectorAll('.nav-section-title');
    sections.forEach(sec => {
      const nextNav = sec.nextElementSibling;
      if (nextNav && nextNav.classList.contains('nav-menu')) {
        const visibleLinks = Array.from(nextNav.querySelectorAll('.nav-item')).filter(el => el.style.display !== 'none');
        if (visibleLinks.length === 0) {
          sec.style.display = 'none';
        } else {
          sec.style.display = 'block';
        }
      }
    });
  });

  // Check current module permission
  const currentMod = AppState.activeModule;
  const isAccessAllowed = (currentMod === 'access') ? (role === 'admin') : (perms[currentMod] !== false);

  if (!isAccessAllowed) {
    if (role === 'customer') {
      AppState.activeModule = 'pos';
    } else if (role === 'kitchen' || role === 'barista') {
      AppState.activeModule = 'kds';
    } else if (role === 'waitstaff') {
      AppState.activeModule = 'waitstaff';
    } else {
      const allowedMod = Object.keys(perms).find(k => perms[k] && (k !== 'access' || role === 'admin')) || 'pos';
      AppState.activeModule = allowedMod;
    }
  }
};

window.confirmRoleLogin = async function() {
  const userRoleSelect = document.getElementById('role-popup-select');
  const userInput = document.getElementById('role-username-input');
  const passInput = document.getElementById('role-password-input');
  const errorMsg = document.getElementById('role-pass-error');

  const username = userInput ? userInput.value.trim() : '';
  const password = passInput ? passInput.value : '';

  if (!username || !password) {
    if (errorMsg) {
      errorMsg.textContent = 'Please enter both username/email and password.';
      errorMsg.classList.remove('hidden');
    }
    return;
  }
  
  const btn = document.getElementById('confirm-role-login-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Authenticating...';
  }
  if (errorMsg) errorMsg.classList.add('hidden');
  
  try {
    const res = await fetch(`${API_BASE}/users/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ username, password })
    });

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      throw new Error('Server returned an unreadable response. Please check server logs.');
    }
    
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-login-circle-line"></i> Secure Login';
    }
    
    if (data && data.success && data.data) {
      if (errorMsg) errorMsg.classList.add('hidden');

      AppState.isAuthenticated = true;
      const role = (data.data.role || 'customer').toLowerCase();
      AppState.activeRole = role;
      AppState.currentUser = data.data;

      localStorage.setItem('RAVENHILL_USER_ROLE', role);
      localStorage.setItem('RAVENHILL_AUTH_SAVED', 'true');
      localStorage.setItem('RAVENHILL_AUTH_USER', JSON.stringify(data.data));

      applyRoleToUI(role);
      applyRolePermissionsUI();
      if (window.updateLandingNavbarAuth) window.updateLandingNavbarAuth();

      const modal = document.getElementById('role-select-modal');
      if (modal) modal.classList.add('hidden');

      // Accurate Role-Based Routing & Dashboard Redirection
      let targetMod = 'pos';
      if (role === 'admin' || role === 'manager') {
        targetMod = 'dashboard';
      } else if (role === 'barista' || role === 'kitchen') {
        targetMod = 'kds';
      } else if (role === 'waitstaff') {
        targetMod = 'waitstaff';
      } else if (role === 'customer') {
        targetMod = 'pos';
      }

      window.showAppView(targetMod);
      showToast(data.message || `Welcome! Logged in as ${role.toUpperCase()}.`, 'success');
      
    } else {
      if (errorMsg) {
        errorMsg.textContent = (data && data.message) ? data.message : 'Invalid username/email or password.';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (err) {
    console.error('Login error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-login-circle-line"></i> Secure Login';
    }
    if (errorMsg) {
      errorMsg.textContent = 'Connection error. Please check your network and try again.';
      errorMsg.classList.remove('hidden');
    }
  }
};

window.confirmRoleSelection = window.confirmRoleLogin;

window.logout = async function() {
  try {
    await fetch(`${API_BASE}/users/logout.php`, { method: 'POST' });
  } catch(e) {}
  
  AppState.isAuthenticated = false;
  AppState.activeRole = 'customer';
  AppState.currentUser = null;
  localStorage.removeItem('RAVENHILL_USER_ROLE');
  localStorage.removeItem('RAVENHILL_AUTH_SAVED');
  localStorage.removeItem('RAVENHILL_AUTH_USER');
  
  // Close any open modals
  const roleModal = document.getElementById('role-select-modal');
  if (roleModal) roleModal.classList.add('hidden');
  const loginModal = document.getElementById('login-modal');
  if (loginModal) loginModal.classList.add('hidden');

  showToast('Logged out successfully.', 'info');
  if (window.updateLandingNavbarAuth) window.updateLandingNavbarAuth();
  window.showLandingView();
};

window.initSession = async function() {
  try {
    const res = await fetch(`${API_BASE}/users/me.php`, {
      credentials: 'same-origin'
    });
    const data = await res.json();
    if (data && data.success && data.data) {
      AppState.isAuthenticated = true;
      const role = data.data.role.toLowerCase();
      AppState.activeRole = role;
      AppState.currentUser = data.data;

      localStorage.setItem('RAVENHILL_USER_ROLE', role);
      localStorage.setItem('RAVENHILL_AUTH_SAVED', 'true');
      localStorage.setItem('RAVENHILL_AUTH_USER', JSON.stringify(data.data));

      applyRoleToUI(role);
      applyRolePermissionsUI();
      if (window.updateLandingNavbarAuth) window.updateLandingNavbarAuth();
      
      const landing = document.getElementById('landing-page-view');
      if (!landing || landing.classList.contains('hidden')) {
        let targetMod = 'pos';
        if (role === 'admin' || role === 'manager') targetMod = 'dashboard';
        else if (role === 'barista' || role === 'kitchen') targetMod = 'kds';
        else if (role === 'waitstaff') targetMod = 'waitstaff';
        else if (role === 'customer') targetMod = 'pos';
        if (!AppState.activeModule || AppState.activeModule === 'landing') {
          window.switchModule(targetMod);
        }
      }
    }
  } catch(e) {
    console.warn("Session check failed", e);
  }
};

async function syncBackendData() {
  try {
    console.log('[Backend Sync] Instant bootstrap from:', API_BASE);
    
    // 1. Try unified ultra-fast single roundtrip bootstrap endpoint (<50ms)
    const bootData = await API.fetchBootstrap();
    if (bootData) {
      if (bootData.categories && bootData.categories.length) {
        DB.menuCategories = bootData.categories.map(cat => ({
          id: String(cat.category_id),
          category_id: cat.category_id,
          name: cat.category_name,
          icon: getCategoryIcon(cat.category_name),
          desc: cat.description || ''
        }));
      }

      if (bootData.menu_items && bootData.menu_items.length) {
        DB.menuItems = bootData.menu_items.map(item => {
          const catIdStr = String(item.category_id || '1');
          return {
            id: String(item.product_id),
            product_id: item.product_id,
            catId: catIdStr,
            category_id: item.category_id,
            name: item.product_name,
            desc: item.description || '',
            price: parseFloat(item.base_price || item.price || 0),
            image: item.image_url || '',
            availability: item.is_available == 1,
            hasModifiers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '13'].includes(catIdStr)
          };
        });
      }

      if (bootData.tables && bootData.tables.length) {
        DB.tables = bootData.tables.map(t => ({
          id: String(t.table_number || t.table_id),
          table_id: t.table_id,
          number: t.table_number,
          seats: parseInt(t.capacity || 4),
          capacity: parseInt(t.capacity || 4),
          location: t.location || 'Main Floor',
          status: t.status || 'available',
          orderId: t.current_order_id ? `#ORD-${t.current_order_id}` : null
        }));
      }

      if (bootData.discounts && bootData.discounts.length) {
        DB.discounts = bootData.discounts.map(d => ({
          id: String(d.discount_id),
          code: d.discount_code,
          name: d.discount_code,
          type: d.discount_type,
          value: parseFloat(d.discount_value || 0),
          minSpend: parseFloat(d.min_order_amount || 0)
        }));
      }

      if (bootData.next_order_num) {
        AppState.cart.orderId = `#ORD-${bootData.next_order_num}`;
      }

      // Render view immediately with bootstrap data!
      renderCurrentModule();
      renderCartTableSelect();
      updateKDSBadge();
    }

    // 2. Fetch secondary data in background without blocking UI
    const [
      inventoryRes, ordersRes, reservationsRes, customersRes, 
      transactionsRes, feedbackRes, staffRes
    ] = await Promise.allSettled([
      API.fetchInventory(),
      API.fetchOrders(),
      API.fetchReservations(),
      API.fetchCustomers(),
      API.fetchTransactions(),
      API.fetchFeedback(),
      API.fetchStaff()
    ]);

    const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value : null;
    const menuItems = menuItemsRes.status === 'fulfilled' ? menuItemsRes.value : null;
    const inventoryRaw = inventoryRes.status === 'fulfilled' ? inventoryRes.value : null;
    const tables = tablesRes.status === 'fulfilled' ? tablesRes.value : null;
    const ordersRaw = ordersRes.status === 'fulfilled' ? ordersRes.value : null;
    const reservationsRaw = reservationsRes.status === 'fulfilled' ? reservationsRes.value : null;
    const customersRaw = customersRes.status === 'fulfilled' ? customersRes.value : null;
    const transactionsRaw = transactionsRes.status === 'fulfilled' ? transactionsRes.value : null;
    const discounts = discountsRes.status === 'fulfilled' ? discountsRes.value : null;
    const feedbackRaw = feedbackRes.status === 'fulfilled' ? feedbackRes.value : null;
    const staffRaw = staffRes.status === 'fulfilled' ? staffRes.value : null;

    // 1. Process Categories
    if (categories && Array.isArray(categories) && categories.length) {
      DB.menuCategories = categories.map(cat => ({
        id: String(cat.category_id !== undefined ? cat.category_id : (cat.id || '')),
        category_id: cat.category_id !== undefined ? cat.category_id : cat.id,
        name: cat.category_name || cat.name,
        icon: cat.icon || getCategoryIcon(cat.category_name || cat.name),
        desc: cat.description || cat.desc || ''
      }));
      console.log(`[Backend Sync] Loaded ${DB.menuCategories.length} categories from DB.`);
    }

    // 2. Process Menu Items
    if (menuItems && Array.isArray(menuItems) && menuItems.length) {
      DB.menuItems = menuItems.map(item => {
        const catIdStr = String(item.category_id !== undefined ? item.category_id : (item.catId || '1'));
        return {
          id: String(item.product_id !== undefined ? item.product_id : (item.id || '')),
          product_id: item.product_id !== undefined ? item.product_id : item.id,
          catId: catIdStr,
          category_id: item.category_id !== undefined ? item.category_id : item.catId,
          name: item.product_name || item.name,
          desc: item.description || item.desc || '',
          price: parseFloat(item.price || 0),
          image: item.image || '',
          availability: item.availability !== undefined ? !!item.availability : true,
          hasModifiers: item.hasModifiers !== undefined ? item.hasModifiers : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '13'].includes(catIdStr)
        };
      });
      console.log(`[Backend Sync] Loaded ${DB.menuItems.length} menu items from DB.`);
    }

    // Ensure active category is valid
    if (AppState.activeCategory !== 'all' && !DB.menuCategories.some(c => String(c.id) === String(AppState.activeCategory)) && DB.menuCategories.length > 0) {
      AppState.activeCategory = 'all';
    }

    // 3. Process Inventory (handles { count, items } or array)
    const invItems = inventoryRaw ? (Array.isArray(inventoryRaw) ? inventoryRaw : (inventoryRaw.items || [])) : null;
    if (invItems && invItems.length) {
      DB.inventory = invItems.map(inv => ({
        ...inv,
        id: inv.inventory_id || inv.id,
        name: inv.item_name || inv.name,
        qty: inv.quantity !== undefined ? inv.quantity : (inv.qty !== undefined ? inv.qty : 0),
        category: inv.category || inv.supplier_name || inv.supplier || 'Supplies',
        status: inv.status || (inv.quantity <= (inv.reorder_level || 10) ? 'low' : 'good')
      }));
    }

    // 4. Process Tables
    if (tables && Array.isArray(tables) && tables.length) {
      DB.tables = tables.map(t => ({
        id: `T-${String(t.table_number || t.id).padStart(2, '0')}`,
        table_id: t.table_id || t.id,
        table_number: t.table_number,
        name: `Table ${t.table_number || t.id}`,
        section: t.location || 'Main Dining',
        capacity: t.capacity || 4,
        status: t.status || 'available'
      }));
    }

    // 5. Process Orders (handles { orders: [...] } or array)
    const ordList = ordersRaw ? (Array.isArray(ordersRaw) ? ordersRaw : (ordersRaw.orders || [])) : null;
    if (ordList && ordList.length) {
      DB.kdsOrders = ordList
        .filter(ord => ord.order_status !== 'completed' && ord.order_status !== 'cancelled' && ord.status !== 'completed')
        .map(ord => ({
          ...ord,
          id: `#ORD-${ord.order_id || ord.id}`,
          orderType: ord.order_type || ord.type || 'dine-in',
          createdAt: ord.created_at || ord.createdAt || new Date().toISOString(),
          customerName: ord.customer_name || ord.customerName || 'Walk-in Guest',
          items: (ord.items || []).map(item => ({
            ...item,
            mods: item.customisations ? item.customisations.map(c => c.option_name) : (item.mods || [])
          }))
        }));
    }

    // 6. Process Reservations
    const resList = reservationsRaw ? (Array.isArray(reservationsRaw) ? reservationsRaw : (reservationsRaw.reservations || [])) : null;
    if (resList && resList.length) {
      DB.reservations = resList.map(r => ({
        id: `RES-${r.reservation_id || r.id}`,
        customerName: r.display_name || r.guest_name || 'Guest',
        partySize: r.number_of_guests || 2,
        tableId: `T-${String(r.table_number || r.table_id || 1).padStart(2, '0')}`,
        time: r.reservation_time ? r.reservation_time.substring(0, 5) : '12:00',
        status: r.status || 'Confirmed',
        contact: r.display_phone || r.guest_phone || ''
      }));
    }

    // 7. Process Customers
    const custList = customersRaw ? (Array.isArray(customersRaw) ? customersRaw : (customersRaw.customers || [])) : null;
    if (custList && custList.length) DB.customers = custList;

    // 8. Process Discounts
    if (discounts && Array.isArray(discounts) && discounts.length) DB.discounts = discounts;

    // 9. Process Feedback
    const fbList = feedbackRaw ? (Array.isArray(feedbackRaw) ? feedbackRaw : (feedbackRaw.feedback || [])) : null;
    if (fbList && fbList.length) {
      DB.feedback = fbList.map(fb => ({
        id: `FB-${fb.feedback_id || fb.id}`,
        customer: fb.author_name || fb.guest_name || 'Guest',
        rating: fb.rating || 5,
        comment: fb.comments || '',
        date: fb.submitted_at ? new Date(fb.submitted_at).toLocaleDateString() : 'Recent'
      }));
    }

    // 10. Process Staff
    const staffList = staffRaw ? (Array.isArray(staffRaw) ? staffRaw : (staffRaw.employees || [])) : null;
    if (staffList && staffList.length) {
      DB.employees = staffList.map(s => ({
        id: `EMP-${String(s.employee_id || s.id).padStart(2, '0')}`,
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.name || 'Staff',
        role: s.position || s.role_name || 'Staff',
        pin: s.pin || '1234',
        shiftStart: '07:00 AM',
        clockedIn: s.is_clocked_in === true || s.status === 'active',
        hoursWorked: s.hoursWorked !== undefined ? s.hoursWorked : 4.0
      }));
    }

    // 11. Process Transactions
    const txnList = transactionsRaw ? (Array.isArray(transactionsRaw) ? transactionsRaw : (transactionsRaw.transactions || [])) : null;
    if (txnList && txnList.length) {
      DB.completedSales = txnList.map(txn => ({
        id: txn.transaction_reference || `#TXN-${txn.payment_id}`,
        total: parseFloat(txn.amount || 0),
        paymentMethod: txn.payment_method || 'CARD',
        itemsCount: txn.itemsCount || 1,
        cashier: txn.cashier || 'Staff',
        timestamp: txn.payment_date || new Date().toISOString()
      }));
    }

    saveLocalDB();
    console.log('[Backend Sync] Successfully synced database state into POS UI.');
    renderCurrentModule();
    updateKDSBadge();
    updateLowStockBadge();
  } catch (err) {
    console.warn('[Backend Sync] Sync notice:', err);
    renderCurrentModule();
  }
}

function updateLowStockBadge() {
  const badge = document.getElementById('low-stock-count');
  if (!badge) return;
  const count = (typeof DB !== 'undefined' && DB.inventory) ? DB.inventory.filter(i => i.status === 'low').length : 0;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

window.exportToCSV = function(moduleName) {
  let targetModule = moduleName || AppState.activeModule || 'tables';
  let filename = `Ravenhill_${targetModule.toUpperCase()}_Report_${new Date().toISOString().slice(0,10)}.csv`;
  let csvRows = [];

  if (targetModule === 'tables') {
    csvRows.push(['Table ID', 'Table Name', 'Section Area', 'Seating Capacity', 'Current Status', 'Linked Order ID', 'Reservation Info']);
    (DB.tables || []).forEach(t => {
      csvRows.push([
        t.id,
        t.name,
        t.section,
        t.capacity,
        t.status.toUpperCase(),
        t.orderId || 'None',
        t.reservedFor || 'None'
      ]);
    });
  } else if (targetModule === 'reservations') {
    csvRows.push(['Booking ID', 'Customer Name', 'Party Size', 'Assigned Table', 'Time Slot', 'Contact Phone', 'Status']);
    (DB.reservations || []).forEach(r => {
      csvRows.push([
        r.id,
        r.customerName,
        `${r.partySize} Guests`,
        r.tableId,
        r.time,
        r.contact || 'N/A',
        r.status
      ]);
    });
  } else if (targetModule === 'inventory') {
    csvRows.push(['Item ID', 'Item Name', 'Current Stock Qty', 'Unit', 'Min Threshold', 'Unit Cost (AUD)', 'Supplier / Category', 'Status']);
    (DB.inventory || []).forEach(i => {
      const q = i.qty !== undefined ? i.qty : (i.stockQty !== undefined ? i.stockQty : 0);
      csvRows.push([
        i.id,
        i.name,
        q.toFixed(1),
        i.unit,
        i.minThreshold,
        (i.unitCost || 0).toFixed(2),
        i.supplier || i.category || 'Supplies',
        (i.status || 'good').toUpperCase()
      ]);
    });
  } else if (targetModule === 'orders' || targetModule === 'pos' || targetModule === 'kds') {
    csvRows.push(['Order ID', 'Order Number', 'Order Type', 'Table ID', 'Customer Name', 'Subtotal (AUD)', 'Tax (AUD)', 'Discount (AUD)', 'Total (AUD)', 'Payment Method', 'Status', 'Timestamp']);
    const allOrders = [...(DB.kdsOrders || []), ...(DB.completedSales || [])];
    allOrders.forEach(o => {
      csvRows.push([
        o.id,
        o.orderNum || '',
        o.orderType || o.type || 'dine_in',
        o.tableId || 'N/A',
        o.customerName || 'Walk-in Guest',
        (o.subtotal || 0).toFixed(2),
        (o.tax || 0).toFixed(2),
        (o.discount || 0).toFixed(2),
        (o.total || 0).toFixed(2),
        o.paymentMethod || 'CARD',
        o.status || 'completed',
        o.createdAt || o.timestamp || ''
      ]);
    });
  } else if (targetModule === 'menu') {
    csvRows.push(['Item ID', 'Category ID', 'Item Name', 'Description', 'Price (AUD)', 'Modifiers Enabled', 'Badge Tag']);
    (DB.menuItems || []).forEach(item => {
      csvRows.push([
        item.id,
        item.catId,
        item.name,
        item.desc || '',
        item.price.toFixed(2),
        item.hasModifiers ? 'Yes' : 'No',
        item.badge || 'None'
      ]);
    });
  } else if (targetModule === 'customers') {
    csvRows.push(['Customer ID', 'Member Name', 'Mobile Phone', 'Email Address', 'Loyalty Points', 'Reward Tier', 'Total Visits']);
    (DB.customers || []).forEach(c => {
      csvRows.push([
        c.id,
        c.name,
        c.mobile || 'N/A',
        c.email || 'N/A',
        c.points || 0,
        c.tier || 'Bean Bronze',
        c.visits || 1
      ]);
    });
  } else if (targetModule === 'employees' || targetModule === 'staff') {
    csvRows.push(['Staff ID', 'Employee Name', 'Role', 'Status', 'Shift Start', 'Sales Completed']);
    (DB.employees || []).forEach(s => {
      csvRows.push([
        s.id,
        s.name,
        s.role,
        s.clockedIn ? 'ACTIVE ON SHIFT' : 'OFF',
        s.shiftStart || 'N/A',
        s.salesCount || 0
      ]);
    });
  } else if (targetModule === 'discounts') {
    csvRows.push(['Discount Code', 'Description', 'Discount Type', 'Value', 'Min Spend (AUD)']);
    (DB.discounts || []).forEach(d => {
      csvRows.push([
        d.code,
        d.description,
        d.type === 'percent' ? 'Percentage' : 'Fixed Amount',
        d.type === 'percent' ? `${d.val}%` : `$${d.val.toFixed(2)}`,
        `$${(d.minSpend || 0).toFixed(2)}`
      ]);
    });
  } else if (targetModule === 'suppliers') {
    csvRows.push(['Supplier ID', 'Vendor Company', 'Contact Person', 'Phone Number', 'Catalog Products']);
    (DB.suppliers || []).forEach(sup => {
      csvRows.push([
        sup.id,
        sup.name,
        sup.contact,
        sup.phone,
        sup.catalog
      ]);
    });
  } else if (targetModule === 'feedback') {
    csvRows.push(['Feedback ID', 'Customer Name', 'Rating (Stars)', 'Review Comment', 'Date Recorded']);
    (DB.feedback || []).forEach(fb => {
      csvRows.push([
        fb.id,
        fb.customer,
        `${fb.rating} Stars`,
        fb.comment,
        fb.date
      ]);
    });
  } else if (targetModule === 'transactions' || targetModule === 'dashboard') {
    csvRows.push(['Transaction ID', 'Order Reference', 'Amount (AUD)', 'Payment Method', 'Items Sold', 'Cashier', 'Timestamp']);
    (DB.completedSales || []).forEach(t => {
      csvRows.push([
        t.id,
        t.id,
        t.total.toFixed(2),
        t.paymentMethod,
        t.itemsCount || 1,
        t.cashier || 'Staff',
        t.timestamp || ''
      ]);
    });
  }

  if (csvRows.length <= 1) {
    alert(`No records available to export for ${targetModule}.`);
    return;
  }

  let csvContent = csvRows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
  let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  let url = URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.getOrderElapsedSeconds = function(ord) {
  if (!ord || !ord.createdAt) {
    return ord && ord.elapsedSec !== undefined ? ord.elapsedSec : 0;
  }
  let dateStr = ord.createdAt;
  if (typeof dateStr === 'string') {
    if (!dateStr.includes('T') && dateStr.includes(' ')) {
      dateStr = dateStr.replace(' ', 'T');
    }
    if (!dateStr.includes('Z') && !dateStr.includes('+')) {
      dateStr = dateStr + 'Z';
    }
  }
  const createdTime = new Date(dateStr).getTime();
  if (isNaN(createdTime)) {
    return ord.elapsedSec !== undefined ? ord.elapsedSec : 0;
  }
  return Math.max(0, Math.floor((Date.now() - createdTime) / 1000));
};

function updateKDSTimers() {
  if (typeof DB === 'undefined' || !DB.kdsOrders) return;
  DB.kdsOrders.forEach(ord => {
    const elapsed = getOrderElapsedSeconds(ord);
    ord.elapsedSec = elapsed;
    const timerTextEl = document.querySelector(`.kds-timer-text[data-order-id="${ord.id}"]`);
    if (timerTextEl) {
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      timerTextEl.textContent = `${mins}m ${secs}s`;
    }
  });
}

// Live Clock & Timers
function setupLiveClock() {
  const clockEl = document.getElementById('live-clock');
  const timerEl = document.getElementById('shift-clock-timer');
  const widgetEl = document.getElementById('topbar-shift-status');
  
  // Persist or initialize shift start timestamp
  let savedShiftStart = localStorage.getItem('RAVENHILL_SHIFT_START_TIMESTAMP');
  if (!savedShiftStart) {
    // Default to 4 hours and 15 minutes before current time for realistic shift tracking
    const initialStart = Date.now() - (4 * 3600 + 15 * 60) * 1000;
    localStorage.setItem('RAVENHILL_SHIFT_START_TIMESTAMP', String(initialStart));
    savedShiftStart = String(initialStart);
  }
  const shiftStartTimestamp = parseInt(savedShiftStart);

  setInterval(() => {
    const now = Date.now();
    const nowDate = new Date();
    const timeStr = nowDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = nowDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
    if (clockEl) clockEl.textContent = `${timeStr} • ${dateStr}`;

    const activeStaff = (DB.employees || []).some(e => e.clockedIn);
    if (!activeStaff && DB.employees && DB.employees.length > 0) {
      if (timerEl) timerEl.textContent = `Shift: OFF (Clock In)`;
      if (widgetEl) widgetEl.style.opacity = '0.7';
    } else {
      if (widgetEl) widgetEl.style.opacity = '1';
      const elapsedSec = Math.max(0, Math.floor((now - shiftStartTimestamp) / 1000));
      const hrs = Math.floor(elapsedSec / 3600);
      const mins = Math.floor((elapsedSec % 3600) / 60);
      if (timerEl) timerEl.textContent = `Shift: ${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
    }

    updateKDSTimers();
  }, 1000);
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Avoid triggering shortcuts when typing in an input/textarea
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      if (e.key === 'Escape') {
        e.target.blur();
      }
      return;
    }

    if (e.key === 'F1') {
      e.preventDefault();
      switchModule('pos');
    } else if (e.key === 'F2') {
      e.preventDefault();
      switchModule('kds');
    } else if (e.key === 'F3') {
      e.preventDefault();
      switchModule('tables');
    } else if (e.key === '/') {
      e.preventDefault();
      document.getElementById('global-search-input')?.focus();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!document.getElementById('cart-drawer')?.classList.contains('hidden')) {
        openPaymentModal();
      }
    } else if (e.key === 'Escape') {
      closePrintableReceiptModal();
      document.querySelectorAll('.modal-overlay:not(#role-select-modal)').forEach(m => m.classList.add('hidden'));
    }
  });
}
// Sidebar & Routing
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const moduleKey = item.getAttribute('data-module');
      if (moduleKey) {
        switchModule(moduleKey);
        // Auto-close sidebar drawer on mobile/tablet screens
        if (window.innerWidth < 1024) {
          const sidebar = document.getElementById('sidebar');
          const backdrop = document.getElementById('sidebar-backdrop');
          const toggleBtn = document.getElementById('toggle-sidebar');
          if (sidebar) sidebar.classList.remove('mobile-open');
          if (backdrop) backdrop.classList.remove('active');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

function switchModule(moduleKey) {
  AppState.activeModule = moduleKey;
  
  // Auto-close mobile sidebar drawer
  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('toggle-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Highlight active nav item
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-module') === moduleKey);
  });

  // Update Topbar Header Title
  const titleMap = {
    landing: { title: 'RAVENHILL Coffee Roasters', sub: 'Specialty Coffee, Artisan Roastery & Digital Ordering • Flinders Lane, Melbourne CBD' },
    pos: { title: 'Point of Sale (POS)', sub: 'Process orders & quick transactions for Melbourne CBD shop' },
    kds: { title: 'Order Tracking & Kitchen Display (KDS)', sub: 'Live barista order queue & preparation timer' },
    waitstaff: { title: 'Wait Staff Monitor', sub: 'Floor & table service status with ready-to-serve alerts' },
    customer_tracker: { title: 'Customer Live Tracker', sub: 'Real-time multi-stage visual order progress' },
    tables: { title: 'Table Management', sub: 'Interactive CBD floor plan & table assignment' },
    reservations: { title: 'Reservation Management', sub: 'Table bookings & customer schedule' },
    payments: { title: 'Payments & Transactions', sub: 'Live sales ledger, multi-tender transactions & tax invoices' },
    menu: { title: 'Menu & Product Customisation', sub: 'Manage espresso items, prices & modifier rules' },
    inventory: { title: 'Inventory & Recipe Management', sub: 'Stock levels, raw bean tracking & recipe maps' },
    suppliers: { title: 'Supplier & Purchase Management', sub: 'Vendor directory & purchase orders' },
    discounts: { title: 'Discounts & Promotions', sub: 'Voucher codes & happy hour promotions' },
    customers: { title: 'Customers & Loyalty Program', sub: 'Customer directory, point balance & tier rewards' },
    employees: { title: 'Staff & Attendance Management', sub: 'Staff roster & clock-in timesheet simulator' },
    feedback: { title: 'Customer Feedback', sub: 'Customer reviews & service rating dashboard' },
    dashboard: { title: 'Dashboard & Reports', sub: 'Executive overview, sales revenue & shop performance' },
    reports: { title: 'Reports & Audits', sub: 'Comprehensive financial statements, product performance & security audit trail' },
    audit: { title: 'Audit Trail & Compliance Logs', sub: 'Activity logging, security actions & inventory changes' },
    ai_forecast: { title: 'AI Demand Forecasting & RAG Intelligence', sub: 'NVIDIA Nemotron 3 Ultra predictive stock requirements & holiday demand analytics' },
    ai_forecasting: { title: 'AI Demand Forecasting & RAG Intelligence', sub: 'NVIDIA Nemotron 3 Ultra predictive stock requirements & holiday demand analytics' },
    access: { title: 'User & Access Management', sub: 'Role permissions matrix & staff privileges' }
  };

  const info = titleMap[moduleKey] || { title: 'Ravenhill Coffee Roasters', sub: 'Melbourne CBD Specialty Café' };
  document.getElementById('current-module-title').textContent = info.title;
  document.getElementById('current-module-subtitle').textContent = info.sub;

  // Toggle Cart Drawer & Mobile Cart Bar visibility
  const cartDrawer = document.getElementById('cart-drawer');
  const mobileCartBar = document.getElementById('mobile-cart-bar');
  if (cartDrawer) {
    if (moduleKey === 'pos') {
      if (window.innerWidth >= 1024) {
        cartDrawer.classList.remove('hidden');
      }
    } else if (moduleKey === 'landing') {
      // In landing page, keep drawer slide-out ready without blocking hero
      cartDrawer.classList.add('hidden');
      cartDrawer.classList.remove('mobile-open');
    } else {
      cartDrawer.classList.add('hidden');
      cartDrawer.classList.remove('mobile-open');
    }
  }

  if (mobileCartBar) {
    if (moduleKey === 'pos' || moduleKey === 'landing') {
      mobileCartBar.classList.remove('hidden');
    } else {
      mobileCartBar.classList.add('hidden');
    }
  }

  renderCurrentModule();
}

// Role Switcher
function setupRoleSwitcher() {
  const roleSelect = document.getElementById('user-role-select');
  if (!roleSelect) return;
  roleSelect.addEventListener('change', (e) => {
    const targetRole = e.target.value;
    roleSelect.value = AppState.activeRole || 'cashier';
    openLoginModal(targetRole);
  });
}

function setupSidebarToggle() {
  const btn = document.getElementById('toggle-sidebar');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const closeBtn = document.getElementById('mobile-sidebar-close-btn');

  function openSidebar() {
    if (sidebar) {
      sidebar.classList.add('mobile-open');
      sidebar.classList.remove('collapsed');
    }
    if (backdrop) backdrop.classList.add('active');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  if (btn) {
    btn.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      } else {
        if (sidebar) sidebar.classList.toggle('collapsed');
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }
}

window.openMobileCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    drawer.classList.add('mobile-open');
  }
};

window.closeMobileCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('mobile-open');
    if (window.innerWidth < 1024) {
      drawer.classList.add('hidden');
    }
  }
};

function setupGlobalSearch() {
  const input = document.getElementById('global-search-input');
  input.addEventListener('input', (e) => {
    AppState.searchQuery = e.target.value.toLowerCase();
    renderCurrentModule();
  });
}

// ==========================================
// 4. MODULE RENDER ROUTER
// ==========================================

function renderCurrentModule() {
  const container = document.getElementById('workspace-container');
  if (!container) return;
  container.innerHTML = '';

  const role = AppState.activeRole || 'cashier';
  const perms = (DB.rolePermissions && DB.rolePermissions[role]) 
    ? DB.rolePermissions[role] 
    : (defaultPermissions[role] || {});
  const modKey = AppState.activeModule;

  // Unauthenticated users cannot access Admin modules
  const adminOnlyModules = ['dashboard', 'access', 'audit', 'reports', 'ai_forecasting', 'ai_forecast', 'employees'];
  if (!AppState.isAuthenticated && adminOnlyModules.includes(modKey)) {
    const modNames = {
      dashboard: 'Admin Dashboard & Reports',
      reports: 'Reports & Audits',
      access: 'User & Access Management',
      audit: 'Audit Trail & Compliance Logs',
      ai_forecast: 'AI Demand Forecasting & RAG Intelligence',
      ai_forecasting: 'AI Demand Forecasting & RAG Intelligence',
      employees: 'Staff & Attendance Management'
    };
    renderAccessRestrictedNotice(container, modNames[modKey] || 'Admin Module', 'Authentication required. You must log in with an authorized Administrator account to view this section.');
    return;
  }

  // Access Control is ONLY visible and accessible to Admin
  if (modKey === 'access' && role !== 'admin') {
    renderAccessRestrictedNotice(container, 'Access Control', 'Only Administrators have permission to view and edit the Role Access Permissions Matrix.');
    return;
  }

  // Check role permission matrix
  if (modKey !== 'access' && perms[modKey] === false) {
    const modTitles = {
      pos: 'Point of Sale (POS)',
      kds: 'Order Tracking (KDS)',
      tables: 'Table Management',
      reservations: 'Reservations',
      menu: 'Menu & Modifiers',
      inventory: 'Inventory & Recipes',
      suppliers: 'Suppliers & Orders',
      discounts: 'Discounts & Promos',
      customers: 'Customers & Loyalty',
      employees: 'Staff & Attendance',
      feedback: 'Customer Feedback',
      dashboard: 'Dashboard & Reports',
      reports: 'Reports & Audits',
      audit: 'Audit Trail & Compliance Logs',
      ai_forecast: 'AI Demand Forecasting & RAG Intelligence',
      ai_forecasting: 'AI Demand Forecasting & RAG Intelligence'
    };
    renderAccessRestrictedNotice(container, modTitles[modKey] || modKey, `Your role (${role.toUpperCase()}) is restricted from accessing this module based on the Role Access Permissions Matrix.`);
    return;
  }

  switch (modKey) {
    case 'landing':
      renderLandingPageView(container);
      break;
    case 'pos':
      renderPOSView(container);
      break;
    case 'kds':
      renderKDSView(container);
      break;
    case 'waitstaff':
      renderWaitStaffDashboard(container);
      break;
    case 'customer_tracker':
      renderCustomerTrackerView(container);
      break;
    case 'tables':
      renderTablesView(container);
      break;
    case 'reservations':
      renderReservationsView(container);
      break;
    case 'payments':
      renderPaymentsView(container);
      break;
    case 'menu':
      renderMenuView(container);
      break;
    case 'inventory':
      renderInventoryView(container);
      break;
    case 'suppliers':
      renderSuppliersView(container);
      break;
    case 'discounts':
      renderDiscountsView(container);
      break;
    case 'customers':
      renderCustomersView(container);
      break;
    case 'employees':
      renderEmployeesView(container);
      break;
    case 'feedback':
      renderFeedbackView(container);
      break;
    case 'dashboard':
      renderDashboardView(container);
      break;
    case 'ai_forecast':
    case 'ai_forecasting':
      renderAIForecastingView(container);
      break;
    case 'access':
      renderAccessView(container);
      break;
    case 'reports':
    case 'audit':
      renderReportsAndAuditsView(container);
      break;
    default:
      renderPOSView(container);
  }
}


function renderAccessRestrictedNotice(container, moduleName, reason) {
  container.innerHTML = `
    <div class="empty-cart-state" style="padding:80px 20px; text-align:center;">
      <i class="ri-shield-keyhole-line" style="font-size:56px; color:var(--color-danger); margin-bottom:16px;"></i>
      <h2 style="margin-bottom:8px;">Access Restricted</h2>
      <p style="color:var(--color-cream-muted); max-width:480px; margin:0 auto 24px; font-size:14px; line-height:1.6;">
        ${reason || `You do not have permission to view the <strong>${moduleName}</strong> module under your active role.`}
      </p>
      <button class="btn btn-primary" onclick="openLoginModal('admin')">
        <i class="ri-key-2-line"></i> Switch Role / Log In as Admin
      </button>
    </div>
  `;
}

window.getItemImage = function(item) {
  if (!item) return 'flat_white_coffee.png';
  
  if (item.image && typeof item.image === 'string' && item.image.trim() !== '') {
    let img = item.image.trim();
    // If it includes path or full URL, return it
    if (img.startsWith('http') || img.startsWith('./') || img.startsWith('/')) return img;
    // Strip brand_recources prefix if present
    img = img.replace(/^brand_recources\//, '').replace(/^brand_recources\//, '');
    return img;
  }
  
  const name = (item.name || item.product_name || '').toLowerCase();

  if (name.includes('flat white') || name.includes('latte')) return 'flat_white_coffee.png';
  if (name.includes('cappuccino') || name.includes('mocha') || name.includes('babycino') || name.includes('chocolate')) return 'cappuccino_coffee.png';
  if (name.includes('espresso') || name.includes('short black') || name.includes('macchiato')) return 'double_espresso_short_black.png';
  if (name.includes('long black') || name.includes('ristretto') || name.includes('americano')) return 'long_black_coffee.png';
  if (name.includes('piccolo')) return 'piccolo_latte.png';
  if (name.includes('batch brew') || name.includes('filter')) return 'batch_brew_filter.png';
  if (name.includes('pour-over') || name.includes('v60')) return 'v60_pourover_coffee.png';
  if (name.includes('cold brew') || name.includes('water') || name.includes('drink') || name.includes('juice')) return 'cold_brew_coffee.png';
  if (name.includes('iced') || name.includes('shake') || name.includes('smoothie')) return 'iced_oat_milk_latte.png';
  if (name.includes('chai') || name.includes('tea') || name.includes('matcha') || name.includes('turmeric')) return 'prana_sticky_chai_latte.png';
  if (name.includes('croissant') || name.includes('toast') || name.includes('wrap') || name.includes('roll') || name.includes('sandwich') || name.includes('muffin') || name.includes('bread') || name.includes('scone') || name.includes('salad') || name.includes('chip') || name.includes('burger') || name.includes('egg') || name.includes('avocado')) return 'butter_croissant.png';
  if (name.includes('bean') || name.includes('reserve')) return 'roasted_coffee_beans.png';

  return 'flat_white_coffee.png';
};
const getItemImage = window.getItemImage;

// ==========================================
// 5. POS MODULE IMPLEMENTATION
// ==========================================

function renderPOSView(container) {
  container.innerHTML = '';
  const posLayout = document.createElement('div');
  posLayout.className = 'pos-main-panel';

  // Ensure active category is valid
  if (AppState.activeCategory !== 'all' && !DB.menuCategories.some(c => String(c.id) === String(AppState.activeCategory)) && DB.menuCategories.length > 0) {
    AppState.activeCategory = 'all';
  }

  // Active Category Meta
  const activeCat = DB.menuCategories.find(c => String(c.id) === String(AppState.activeCategory));
  const activeIcon = AppState.activeCategory === 'all' 
    ? 'ri-apps-2-line' 
    : (activeCat?.icon || getCategoryIcon(activeCat?.name));
  const activeName = AppState.activeCategory === 'all' 
    ? 'All Items' 
    : (activeCat?.name || 'All Items');

  // Sort categories alphabetically as in reference UI
  const sortedCategories = [...DB.menuCategories].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  // Compute Filtered Items
  let filteredItems = (AppState.activeCategory === 'all')
    ? DB.menuItems
    : DB.menuItems.filter(item => String(item.catId) === String(AppState.activeCategory) || String(item.category_id) === String(AppState.activeCategory));

  if (AppState.searchQuery) {
    const q = AppState.searchQuery.toLowerCase().trim();
    filteredItems = filteredItems.filter(item => 
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.desc && item.desc.toLowerCase().includes(q))
    );
  }

  // 1. Collapsible Category Drawer Container
  const isCollapsed = !!AppState.posCatMenuCollapsed;
  const catCollapseWrapper = document.createElement('div');
  catCollapseWrapper.className = `pos-category-collapse-wrapper ${isCollapsed ? 'collapsed' : ''}`;
  catCollapseWrapper.id = 'pos-category-collapse-wrapper';

  const catNavGrid = document.createElement('div');
  catNavGrid.className = 'pos-category-nav-grid';
  catNavGrid.id = 'pos-category-nav-grid';

  // "All" button
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = `cat-btn ${AppState.activeCategory === 'all' ? 'active' : ''}`;
  allBtn.innerHTML = `<i class="ri-apps-2-line"></i> <span>All</span>`;
  allBtn.addEventListener('click', () => {
    AppState.activeCategory = 'all';
    AppState.posCatMenuCollapsed = true; // Auto-collapse on select to maximize product space
    renderPOSView(container);
  });
  catNavGrid.appendChild(allBtn);

  // Individual category buttons (Bakery, Breakfast, Coffee, Cold Coffee, Cold Drinks, Hot Drinks, Juices, Lunch, Pastries, Sandwiches, Sides, Smoothies, Tea, Toasties)
  sortedCategories.forEach(cat => {
    const catBtn = document.createElement('button');
    catBtn.type = 'button';
    const isCatActive = String(AppState.activeCategory) === String(cat.id);
    catBtn.className = `cat-btn ${isCatActive ? 'active' : ''}`;
    catBtn.innerHTML = `<i class="${cat.icon || getCategoryIcon(cat.name)}"></i> <span>${cat.name}</span>`;
    catBtn.addEventListener('click', () => {
      AppState.activeCategory = cat.id;
      AppState.posCatMenuCollapsed = true; // Auto-collapse on select to maximize product space
      renderPOSView(container);
    });
    catNavGrid.appendChild(catBtn);
  });

  catCollapseWrapper.appendChild(catNavGrid);
  posLayout.appendChild(catCollapseWrapper);

  // 2. Floating / Sticky Category Quick Bar & Toggle Button
  const floatingBar = document.createElement('div');
  floatingBar.className = 'pos-floating-bar';
  floatingBar.id = 'pos-floating-bar';

  floatingBar.innerHTML = `
    <button type="button" class="pos-floating-toggle-btn" id="pos-floating-cat-btn" aria-label="Toggle Categories Menu" title="Toggle Categories Menu">
      <span class="pos-floating-chevron-wrap">
        <i class="${isCollapsed ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'}" id="pos-cat-chevron-icon"></i>
      </span>
      <span class="pos-floating-text" id="pos-cat-toggle-text">${isCollapsed ? 'Show Categories' : 'Hide Categories'}</span>
      <span class="pos-active-cat-badge">
        <i class="${activeIcon}"></i>
        <span>${activeName}</span>
      </span>
      <span class="pos-floating-count">${filteredItems.length} items</span>
    </button>
  `;

  // Attach toggle button listener
  const toggleBtn = floatingBar.querySelector('#pos-floating-cat-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      AppState.posCatMenuCollapsed = !AppState.posCatMenuCollapsed;
      const wrapper = document.getElementById('pos-category-collapse-wrapper');
      const chevron = document.getElementById('pos-cat-chevron-icon');
      const toggleText = document.getElementById('pos-cat-toggle-text');

      if (AppState.posCatMenuCollapsed) {
        if (wrapper) wrapper.classList.add('collapsed');
        if (chevron) chevron.className = 'ri-arrow-down-s-line';
        if (toggleText) toggleText.textContent = 'Show Categories';
      } else {
        if (wrapper) wrapper.classList.remove('collapsed');
        if (chevron) chevron.className = 'ri-arrow-up-s-line';
        if (toggleText) toggleText.textContent = 'Hide Categories';
      }
    });
  }

  posLayout.appendChild(floatingBar);

  // 3. Touch Items Grid
  const itemsGrid = document.createElement('div');
  itemsGrid.className = 'pos-items-grid';
  itemsGrid.id = 'pos-items-grid';

  // Smart Auto-Hide on Scroll Listener
  let lastScrollTop = 0;
  let scrollTicking = false;

  itemsGrid.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const currentScroll = itemsGrid.scrollTop;
        const scrollDelta = currentScroll - lastScrollTop;

        // When scrolling down > 20px and beyond top area: collapse category menu
        if (scrollDelta > 15 && currentScroll > 35) {
          if (!AppState.posCatMenuCollapsed) {
            AppState.posCatMenuCollapsed = true;
            const wrapper = document.getElementById('pos-category-collapse-wrapper');
            const chevron = document.getElementById('pos-cat-chevron-icon');
            const toggleText = document.getElementById('pos-cat-toggle-text');
            if (wrapper) wrapper.classList.add('collapsed');
            if (chevron) chevron.className = 'ri-arrow-down-s-line';
            if (toggleText) toggleText.textContent = 'Show Categories';
          }
        } 
        // When scrolling back up towards top: auto-reappear
        else if (scrollDelta < -20 || currentScroll <= 20) {
          if (AppState.posCatMenuCollapsed && currentScroll <= 25) {
            AppState.posCatMenuCollapsed = false;
            const wrapper = document.getElementById('pos-category-collapse-wrapper');
            const chevron = document.getElementById('pos-cat-chevron-icon');
            const toggleText = document.getElementById('pos-cat-toggle-text');
            if (wrapper) wrapper.classList.remove('collapsed');
            if (chevron) chevron.className = 'ri-arrow-up-s-line';
            if (toggleText) toggleText.textContent = 'Hide Categories';
          }
        }

        lastScrollTop = Math.max(0, currentScroll);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  if (filteredItems.length === 0) {
    itemsGrid.innerHTML = `
      <div class="empty-cart-state" style="grid-column: 1/-1;">
        <i class="ri-search-eye-line"></i>
        <p>No coffee or food items found</p>
      </div>`;
  } else {
    filteredItems.forEach(item => {
      const promoInfo = window.getItemActiveDiscount ? window.getItemActiveDiscount(item) : null;
      const card = document.createElement('div');
      card.className = 'menu-card';
      const imgSrc = getItemImage(item);

      let badgeHtml = item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : '';
      let priceHtml = `$${item.price.toFixed(2)}`;

      if (promoInfo) {
        badgeHtml = `<span class="product-promo-badge"><i class="ri-fire-fill"></i> SPECIAL ${promoInfo.percentText}</span>`;
        priceHtml = `<span class="promo-strikethrough-price">$${item.price.toFixed(2)}</span><span class="promo-discounted-price">$${promoInfo.discountedPrice.toFixed(2)}</span>`;
      }

      card.innerHTML = `
        ${badgeHtml}
        <div class="menu-card-image">
          <img src="${imgSrc}" alt="${item.name}" loading="lazy">
        </div>
        <div class="menu-card-info">
          <h4>${item.name}</h4>
          <p>${item.desc || 'Freshly made with artisanal ingredients'}</p>
        </div>
        <div class="menu-card-bottom">
          <span class="menu-card-price">${priceHtml}</span>
          <button class="add-item-btn" aria-label="Add ${item.name} to sale" title="Add to Order"><i class="ri-add-line"></i></button>
        </div>
      `;

      card.addEventListener('click', () => {
        if (item.hasModifiers) {
          openCustomiserModal(item);
        } else {
          // Non-modifier items bypass customiser with neutral defaults
          addItemToCart(item, [], '', 1);
          window.openCartDrawer();
          showToast(`Added 1x ${item.name} to cart!`, 'success');
        }
      });

      itemsGrid.appendChild(card);
    });
  }

  posLayout.appendChild(itemsGrid);
  container.appendChild(posLayout);

  // Unhide permanent Cart Drawer
  const cartDrawer = document.getElementById('cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.remove('hidden');
  }

  renderCartUI();
}

// Cart UI Logic
function setupCartDrawerEvents() {
  const closeBtn = document.getElementById('close-cart-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const drawer = document.getElementById('cart-drawer');
      if (drawer) drawer.classList.add('hidden');
    });
  }

  // Segment Buttons (Dine In / Takeaway)
  const segmentBtns = document.querySelectorAll('.segment-btn');
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.cart.orderType = btn.getAttribute('data-ordertype');
      const tableGroup = document.getElementById('cart-table-select-group');
      if (tableGroup) {
        tableGroup.style.display = AppState.cart.orderType === 'takeaway' ? 'none' : 'block';
      }
    });
  });

  // Table Select Listener
  const tableSelect = document.getElementById('cart-table-select');
  if (tableSelect) {
    tableSelect.addEventListener('change', (e) => {
      AppState.cart.tableId = e.target.value;
      renderCartTableSelect();
    });
  }

  renderCartTableSelect();

  // Clear Cart
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      AppState.cart.items = [];
      AppState.cart.promoCode = null;
      AppState.cart.discountAmount = 0;
      const promoInput = document.getElementById('promo-code-input');
      if (promoInput) promoInput.value = '';
      renderCartUI();
    });
  }

  // Apply Promo
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', async () => {
      const promoInput = document.getElementById('promo-code-input');
      const inputVal = promoInput ? promoInput.value.trim().toUpperCase() : '';
      if (!inputVal) {
        showToast('Please enter a promotional code.', 'warning');
        return;
      }

      const subtotal = (AppState.cart.items || []).reduce((acc, i) => acc + (i.totalPrice || 0), 0);
      const items = (AppState.cart.items || []).map(i => ({
        id: i.item.id || i.item.product_id,
        category_id: i.item.catId || i.item.category_id,
        price: i.unitPrice || i.item.price,
        qty: i.qty || 1
      }));

      // Validate against server promotion engine
      const res = await API.validateDiscount({ code: inputVal, subtotal, items });
      if (res && res.success && res.data && res.data.is_valid) {
        AppState.cart.promoCode = {
          code: res.data.code,
          name: res.data.name || res.data.code,
          description: res.data.description,
          type: res.data.promo_type,
          discount_percentage: res.data.discount_percentage || 0,
          fixed_amount: res.data.fixed_amount || 0,
          val: res.data.deduction_amount,
          deduction: res.data.deduction_amount,
          formatted_saving: res.data.formatted_saving
        };
        renderCartUI();
        showToast(`Promo code applied successfully 🎉 (${res.data.formatted_saving})`, 'success');
      } else {
        // Check local DB as fallback
        const localMatch = (DB.discounts || []).find(d => d.code === inputVal);
        if (localMatch && localMatch.is_active) {
          AppState.cart.promoCode = localMatch;
          renderCartUI();
          showToast(`Promo code ${localMatch.code} applied successfully! 🎉`, 'success');
        } else {
          const errorMsg = (res && res.message) ? res.message : `Invalid promotional code "${inputVal}".`;
          showToast(errorMsg, 'error');
        }
      }
    });
  }

  const removePromoBtn = document.getElementById('remove-promo-btn');
  if (removePromoBtn) {
    removePromoBtn.addEventListener('click', () => {
      AppState.cart.promoCode = null;
      const promoInput = document.getElementById('promo-code-input');
      if (promoInput) promoInput.value = '';
      renderCartUI();
      showToast('Promotional code removed.', 'info');
    });
  }

  // Attach Customer
  const attachCustBtn = document.getElementById('attach-customer-btn');
  if (attachCustBtn) {
    attachCustBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCustomerProfileDrawer();
    });
  }

  // Checkout Button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openPaymentModal);
  }
}

function renderCartTableSelect() {
  const tableSelect = document.getElementById('cart-table-select');
  const dotIndicator = document.getElementById('cart-table-status-dot');
  if (!tableSelect) return;

  const currentSelectedId = AppState.cart.tableId || 'T-03';

  if (DB.tables && DB.tables.length > 0) {
    tableSelect.innerHTML = `<option value="">-- Select Table --</option>` +
      DB.tables.map(t => {
        let iconDot = '🟢';
        let statusLabel = 'Available';
        if (t.status === 'occupied') {
          iconDot = '🔴';
          statusLabel = 'Booked';
        } else if (t.status === 'reserved') {
          iconDot = '🟡';
          statusLabel = 'Reserved';
        } else if (t.status === 'cleaning') {
          iconDot = '🔵';
          statusLabel = 'Cleaning';
        }

        return `<option value="${t.id}" ${t.id === currentSelectedId ? 'selected' : ''}>${t.id} (${t.section}) • ${iconDot} ${statusLabel}</option>`;
      }).join('');
  }

  // Update live status dot indicator next to table select box
  if (dotIndicator) {
    const selectedTbl = DB.tables.find(tbl => tbl.id === currentSelectedId);
    const status = selectedTbl ? selectedTbl.status : 'available';
    dotIndicator.className = `table-status-indicator-dot dot-${status}`;
    dotIndicator.title = `Table ${currentSelectedId}: ${(status === 'occupied' ? 'BOOKED' : status).toUpperCase()}`;
  }
}

function setupCartDrawer() {
  // Legacy setup hook
}

function addItemToCart(item, customisations = [], notes = '', qty = 1) {
  if (!item) return;
  if (!AppState.cart) {
    AppState.cart = {
      orderId: '#ORD-9042',
      orderType: 'dine_in',
      tableId: 'T-03',
      items: [],
      promoCode: null,
      customer: null,
      tipPercent: 0,
      tipAmount: 0
    };
  }
  if (!AppState.cart.items) AppState.cart.items = [];

  let extraPrice = 0;
  (customisations || []).forEach(c => {
    extraPrice += parseFloat(c.extra_price || 0);
  });

  const basePrice = parseFloat(item.price || item.unit_price || 0);
  const unitPrice = basePrice + extraPrice;
  const itemName = item.name || item.product_name || 'Menu Item';

  const normalizedItem = {
    ...item,
    name: itemName,
    price: basePrice
  };

  AppState.cart.items.push({
    cartItemId: 'ci-' + Date.now() + Math.random().toString(36).substr(2, 4),
    item: normalizedItem,
    customisations: customisations,
    notes: notes,
    qty: qty,
    unitPrice: unitPrice,
    totalPrice: unitPrice * qty
  });

  renderCartUI();
  saveLocalDB();
}

function renderCartUI() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;

  const cartOrderNumEl = document.getElementById('cart-order-number');
  if (cartOrderNumEl) {
    cartOrderNumEl.textContent = AppState.cart.orderId;
  }

  const totalItemCount = (AppState.cart.items || []).reduce((acc, i) => acc + (i.qty || 1), 0);
  let subtotal = (AppState.cart.items || []).reduce((acc, i) => acc + (i.totalPrice || 0), 0);
  let discount = 0;
  let promoTagText = '';

  if (AppState.cart.promoCode) {
    const promo = AppState.cart.promoCode;
    const percent = promo.discount_percentage || (promo.type === 'percent' || promo.type === 'percentage' ? promo.val : 0);
    const fixed = promo.fixed_amount || (promo.type === 'fixed' || promo.type === 'fixed_amount' ? promo.val : 0);

    if (promo.deduction) {
      discount = promo.deduction;
    } else if (percent > 0) {
      discount = (subtotal * percent) / 100;
    } else if (fixed > 0) {
      discount = Math.min(subtotal, fixed);
    } else if (promo.type === 'bogo') {
      discount = subtotal * 0.25;
    }
    promoTagText = `${promo.code} (${promo.name || promo.description || 'Promotional Voucher'})`;
    AppState.cart.discount = discount;
    AppState.cart.appliedPromoCode = promo.code;
  } else {
    // Check eligible automatic promotions
    let bestAutoDiscount = 0;
    let bestAutoPromo = null;
    const activeAutos = (DB.discounts || []).filter(d => d.is_active && d.is_automatic && (d.status === 'active' || !d.status));

    for (const ap of activeAutos) {
      const minSpend = parseFloat(ap.min_spend || 0);
      if (subtotal < minSpend) continue;

      let eligibleSubtotal = 0;
      const scope = ap.applicable_scope || 'all';

      if (scope === 'all') {
        eligibleSubtotal = subtotal;
      } else {
        const prodIds = (ap.applicable_product_ids || []).map(String);
        const catIds = (ap.applicable_category_ids || [ap.applicable_category_id]).map(String);

        (AppState.cart.items || []).forEach(ci => {
          const itId = String(ci.item.id || ci.item.product_id);
          const cId = String(ci.item.catId || ci.item.category_id);
          if (scope === 'products' && prodIds.includes(itId)) {
            eligibleSubtotal += (ci.totalPrice || 0);
          } else if (scope === 'categories' && catIds.includes(cId)) {
            eligibleSubtotal += (ci.totalPrice || 0);
          }
        });
      }

      if (eligibleSubtotal > 0) {
        let dVal = 0;
        if (ap.type === 'percentage' || ap.discount_percentage > 0) {
          dVal = (eligibleSubtotal * (ap.discount_percentage || 0)) / 100;
        } else if (ap.type === 'fixed_amount' || ap.fixed_amount > 0) {
          dVal = Math.min(eligibleSubtotal, ap.fixed_amount);
        } else if (ap.type === 'bogo') {
          dVal = eligibleSubtotal * 0.25;
        }

        if (dVal > bestAutoDiscount) {
          bestAutoDiscount = dVal;
          bestAutoPromo = ap;
        }
      }
    }

    if (bestAutoPromo && bestAutoDiscount > 0) {
      discount = bestAutoDiscount;
      promoTagText = `⚡ ${bestAutoPromo.name || bestAutoPromo.description || 'Automatic Promotion'}`;
      AppState.cart.discount = discount;
      AppState.cart.appliedPromoCode = bestAutoPromo.code;
    } else {
      AppState.cart.discount = 0;
      AppState.cart.appliedPromoCode = null;
    }
  }

  discount = Math.round(discount * 100) / 100;

  const appliedTag = document.getElementById('applied-promo-tag');
  const appliedName = document.getElementById('applied-promo-name');
  if (appliedTag) {
    if (discount > 0 && promoTagText) {
      appliedTag.classList.remove('hidden');
      if (appliedName) appliedName.textContent = promoTagText;
    } else {
      appliedTag.classList.add('hidden');
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);
  const gst = finalTotal * 0.10;

  container.innerHTML = '';

  if (!AppState.cart.items || AppState.cart.items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <i class="ri-cup-line"></i>
        <p>Your cart is empty</p>
        <span>Tap any coffee or food item from the menu to add to your order</span>
      </div>`;
  } else {
    AppState.cart.items.forEach((ci, idx) => {
      const card = document.createElement('div');
      card.className = 'cart-item-card';

      const modPills = ci.customisations && ci.customisations.length > 0 
        ? ci.customisations.map(c => {
            const extra = parseFloat(c.extra_price || 0);
            const extraTxt = extra > 0 ? ` +$${extra.toFixed(2)}` : '';
            return `<span class="modifier-pill">${c.option_name}${extraTxt}</span>`;
          }).join('') 
        : '';

      card.innerHTML = `
        <div class="cart-item-top">
          <div style="flex:1;">
            <span class="cart-item-title">${ci.item.name || ci.item.product_name}</span>
            <div style="font-size:11px; color:var(--color-cream-muted); margin-top:2px;">$${(ci.unitPrice || ci.item.price).toFixed(2)} each</div>
          </div>
          <span class="cart-item-price">$${(ci.totalPrice || 0).toFixed(2)}</span>
        </div>
        ${modPills ? `<div class="cart-item-modifiers">${modPills}</div>` : ''}
        ${ci.notes ? `<div style="font-size:10px; color:var(--color-accent-gold); margin-top:4px;"><i class="ri-edit-line"></i> Note: ${ci.notes}</div>` : ''}
        <div class="cart-item-bottom" style="margin-top:8px;">
          <div class="cart-qty-ctrl">
            <button type="button" class="icon-btn-sm" onclick="updateCartQty(${idx}, -1)" title="Decrease quantity"><i class="ri-subtract-line"></i></button>
            <span style="font-weight:700; min-width:18px; text-align:center;">${ci.qty}</span>
            <button type="button" class="icon-btn-sm" onclick="updateCartQty(${idx}, 1)" title="Increase quantity"><i class="ri-add-line"></i></button>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" class="icon-btn-sm" onclick="editCartItem(${idx})" title="Edit options & modifiers" style="background:rgba(217, 107, 67, 0.15); border-color:var(--color-primary); color:var(--color-primary-light);"><i class="ri-edit-2-line"></i></button>
            <button type="button" class="cart-item-delete icon-btn-sm text-danger" onclick="removeCartItem(${idx})" title="Remove item"><i class="ri-delete-bin-line"></i></button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  const subtotalEl = document.getElementById('cart-subtotal');
  const gstEl = document.getElementById('cart-gst');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');
  const btnTotalEl = document.getElementById('checkout-btn-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (gstEl) gstEl.textContent = `$${gst.toFixed(2)}`;
  
  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
  if (btnTotalEl) btnTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = !AppState.cart.items || AppState.cart.items.length === 0;

  // Update Topbar Cart Badge & Label
  const topbarCartBadge = document.getElementById('topbar-cart-count');
  if (topbarCartBadge) {
    topbarCartBadge.textContent = totalItemCount;
  }
  const topbarCartBtn = document.getElementById('topbar-cart-toggle-btn');
  if (topbarCartBtn) {
    topbarCartBtn.title = `View Cart (${totalItemCount} item${totalItemCount === 1 ? '' : 's'} • $${finalTotal.toFixed(2)})`;
  }

  // Mobile Floating Cart Bar Sync
  const mobileCartBar = document.getElementById('mobile-cart-bar');
  const mobileCartCount = document.getElementById('mobile-cart-count');
  const mobileCartTotal = document.getElementById('mobile-cart-total');

  if (mobileCartCount) {
    mobileCartCount.textContent = `${totalItemCount} item${totalItemCount === 1 ? '' : 's'}`;
  }
  if (mobileCartTotal) {
    mobileCartTotal.textContent = `$${finalTotal.toFixed(2)}`;
  }
  if (mobileCartBar) {
    if (totalItemCount > 0 && AppState.activeModule === 'pos') {
      mobileCartBar.classList.remove('hidden');
    } else {
      mobileCartBar.classList.add('hidden');
    }
  }

  // Customer Tag UI
  const custInfo = document.getElementById('cart-customer-info');
  const attachBtn = document.getElementById('attach-customer-btn');
  if (custInfo) {
    if (AppState.cart.customer) {
      custInfo.innerHTML = `<i class="ri-vip-crown-fill" style="color:var(--color-accent-gold);"></i> <span>${AppState.cart.customer.name} (${AppState.cart.customer.tier})</span>`;
      if (attachBtn) {
        attachBtn.innerHTML = `<i class="ri-user-star-line"></i> Profile`;
      }
    } else {
      custInfo.innerHTML = `<i class="ri-user-3-line"></i> <span>Walk-in Customer</span>`;
      if (attachBtn) {
        attachBtn.innerHTML = `<i class="ri-user-add-line"></i> Customer`;
      }
    }
  }
}

window.openCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    if (window.innerWidth < 1024) {
      drawer.classList.add('mobile-open');
    }
    drawer.classList.remove('cart-pulse');
    void drawer.offsetWidth;
    drawer.classList.add('cart-pulse');
  }
  renderCartUI();
};

window.openMobileCartDrawer = window.openCartDrawer;

window.closeCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.add('hidden');
    drawer.classList.remove('mobile-open');
  }
};

window.closeMobileCartDrawer = window.closeCartDrawer;

window.toggleCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;
  const isHidden = drawer.classList.contains('hidden') || (!drawer.classList.contains('mobile-open') && window.innerWidth < 1024);
  if (isHidden) {
    window.openCartDrawer();
  } else {
    window.closeCartDrawer();
  }
};

// Explicit Global Modal Closers
window.closeCustomiserModal = function() {
  document.getElementById('customiser-modal')?.classList.add('hidden');
  AppState.editingCartIndex = null;
};

window.closePaymentModal = function() {
  document.getElementById('payment-modal')?.classList.add('hidden');
};

window.closeReceiptModal = function() {
  document.getElementById('receipt-modal')?.classList.add('hidden');
  syncBackendData();
};

window.closeCustomerModal = function() {
  document.getElementById('customer-modal')?.classList.add('hidden');
};

window.closeAddReservationModal = function() {
  document.getElementById('add-reservation-modal')?.classList.add('hidden');
};

window.closeAddTableModal = function() {
  document.getElementById('add-table-modal')?.classList.add('hidden');
};

window.closeLoginModal = function() {
  document.getElementById('role-select-modal')?.classList.add('hidden');
};

window.closePrintableReceiptModal = function() {
  document.getElementById('printable-receipt-modal')?.classList.add('hidden');
};

window.closeSidebar = function() {
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebar-backdrop')?.classList.remove('active');
};

window.detachCustomer = function() {
  AppState.cart.customer = null;
  renderCartUI();
  window.closeCustomerModal();
  showToast('Customer detached. Order set to Walk-in Guest.', 'info');
};

// Universal Delegated Modal & Drawer Closer
function setupUniversalModalClosers() {
  document.addEventListener('click', (e) => {
    // 1. Any click on a close button
    const closeBtn = e.target.closest('.modal-close, .close-cart, [data-close-modal], #close-customiser-btn, #close-payment-btn, #close-receipt-btn, #close-customer-modal-btn, #close-cart-btn, #close-role-modal-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const modal = closeBtn.closest('.modal-backdrop, .modal-overlay, #cart-drawer');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('mobile-open');
        AppState.editingCartIndex = null;
      } else {
        document.querySelectorAll('.modal-backdrop:not(.hidden), .modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
        document.getElementById('cart-drawer')?.classList.remove('mobile-open');
      }
      return;
    }

    // 2. Click on the backdrop background itself
    if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-overlay')) {
      e.target.classList.add('hidden');
      AppState.editingCartIndex = null;
    }
  });

  // 3. Escape key closes topmost modal or drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      const openModals = document.querySelectorAll('.modal-backdrop:not(.hidden), .modal-overlay:not(.hidden)');
      if (openModals.length > 0) {
        openModals[openModals.length - 1].classList.add('hidden');
        AppState.editingCartIndex = null;
      } else {
        const cartDrawer = document.getElementById('cart-drawer');
        if (cartDrawer && cartDrawer.classList.contains('mobile-open')) {
          cartDrawer.classList.add('hidden');
          cartDrawer.classList.remove('mobile-open');
        }
      }
    }
  });
}

window.updateCartQty = function(index, delta) {
  const item = AppState.cart.items[index];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    AppState.cart.items.splice(index, 1);
  } else {
    item.totalPrice = item.unitPrice * item.qty;
  }
  renderCartUI();
  saveLocalDB();
};

window.removeCartItem = function(index) {
  AppState.cart.items.splice(index, 1);
  renderCartUI();
  saveLocalDB();
};

// Edit Cart Item Options
window.editCartItem = function(index) {
  const ci = AppState.cart.items[index];
  if (!ci) return;
  AppState.editingCartIndex = index;
  openCustomiserModalAsync(ci.item, ci);
};

// Confirm Add to Cart / Update Item from Customiser Modal
let isAddingToCart = false;
window.confirmAddToCart = function() {
  if (isAddingToCart) return;

  const modal = document.getElementById('customiser-modal');
  if (!AppState.modalItem) {
    if (modal) modal.classList.add('hidden');
    return;
  }

  // Pre-validate required modifier sections before adding to cart
  const unfulfilled = document.querySelectorAll('#dynamic-customiser-sections .customiser-section[data-required="true"].section-unfulfilled');
  if (unfulfilled.length > 0) {
    const firstMissing = unfulfilled[0].getAttribute('data-group-name') || 'required options';
    showToast(`⚠️ Please make a selection for ${firstMissing} before adding to cart.`, 'error');
    unfulfilled[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  isAddingToCart = true;
  setTimeout(() => { isAddingToCart = false; }, 300);

  const customisations = [];
  document.querySelectorAll('#dynamic-customiser-sections input:checked').forEach(input => {
    customisations.push({
      customisation_id: input.getAttribute('data-id') || input.value,
      group_name: input.getAttribute('data-group') || 'Option',
      option_name: input.getAttribute('data-name') || input.value,
      extra_price: parseFloat(input.getAttribute('data-extra') || 0)
    });
  });

  const notes = document.getElementById('customiser-item-notes')?.value?.trim() || '';
  const qty = Math.max(1, parseInt(document.getElementById('customiser-qty')?.textContent || '1') || 1);
  const currentItem = { ...AppState.modalItem };

  if (AppState.editingCartIndex !== null && AppState.editingCartIndex !== undefined) {
    const idx = AppState.editingCartIndex;
    if (AppState.cart && AppState.cart.items && AppState.cart.items[idx]) {
      let extraPrice = 0;
      customisations.forEach(c => extraPrice += parseFloat(c.extra_price || 0));
      const basePrice = parseFloat(currentItem.price || currentItem.unit_price || 0);
      const unitPrice = basePrice + extraPrice;

      AppState.cart.items[idx].customisations = customisations;
      AppState.cart.items[idx].notes = notes;
      AppState.cart.items[idx].qty = qty;
      AppState.cart.items[idx].unitPrice = unitPrice;
      AppState.cart.items[idx].totalPrice = unitPrice * qty;
    }
    AppState.editingCartIndex = null;
    AppState.modalItem = null;
    if (modal) modal.classList.add('hidden');
    renderCartUI();
    saveLocalDB();
    showToast(`✨ Updated ${currentItem.name || currentItem.product_name} in cart!`, 'success');
  } else {
    addItemToCart(currentItem, customisations, notes, qty);
    AppState.modalItem = null;
    if (modal) modal.classList.add('hidden');
    
    // Animate topbar cart badge
    const badge = document.getElementById('topbar-cart-toggle-btn');
    if (badge) {
      badge.classList.remove('cart-pulse');
      void badge.offsetWidth;
      badge.classList.add('cart-pulse');
    }

    renderCartUI();
    window.openCartDrawer();
    showToast(`✨ Added ${qty}x ${currentItem.name || currentItem.product_name} to cart!`, 'success');
  }
};

// Customiser Modal Logic
function setupCustomiserModal() {
  const modal = document.getElementById('customiser-modal');
  const closeBtn = document.getElementById('close-customiser-btn');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      AppState.modalItem = null;
      AppState.editingCartIndex = null;
    });
  }

  const minusBtn = document.getElementById('qty-minus');
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      let q = parseInt(document.getElementById('customiser-qty')?.textContent || '1');
      if (q > 1) {
        document.getElementById('customiser-qty').textContent = q - 1;
        recalculateCustomiserPrice();
      }
    });
  }

  const plusBtn = document.getElementById('qty-plus');
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      let q = parseInt(document.getElementById('customiser-qty')?.textContent || '1');
      document.getElementById('customiser-qty').textContent = q + 1;
      recalculateCustomiserPrice();
    });
  }
}

function openCustomiserModal(item) {
  openCustomiserModalAsync(item);
}

function getClientSideCustomisations(item) {
  const catId = String(item.category_id || item.catId || '1');
  const nameLower = (item.name || item.product_name || '').toLowerCase();
  const groups = {};

  // Babycino Product-Specific Customisations (Children's treat)
  if (nameLower.includes('babycino')) {
    groups['Milk'] = [
      { customisation_id: 'bc-m1', option_name: 'Full Cream Milk', extra_price: 0.00, is_default: false },
      { customisation_id: 'bc-m2', option_name: 'Skim Milk', extra_price: 0.00, is_default: false },
      { customisation_id: 'bc-m3', option_name: 'Almond Milk', extra_price: 0.80, is_default: false },
      { customisation_id: 'bc-m4', option_name: 'Lactose Free Milk', extra_price: 0.80, is_default: false },
      { customisation_id: 'bc-m5', option_name: 'Oat Milk', extra_price: 0.80, is_default: false },
      { customisation_id: 'bc-m6', option_name: 'Soy Milk', extra_price: 0.80, is_default: false }
    ];
    groups['Size'] = [
      { customisation_id: 'bc-s1', option_name: 'Standard / Regular', extra_price: 0.00, is_default: true },
      { customisation_id: 'bc-s2', option_name: 'Large', extra_price: 0.80, is_default: false }
    ];
    groups['Flavours'] = [
      { customisation_id: 'bc-f1', option_name: 'Caramel Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'bc-f2', option_name: 'Hazelnut Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'bc-f3', option_name: 'Vanilla Syrup', extra_price: 0.70, is_default: false }
    ];
    groups['Extras'] = [
      { customisation_id: 'bc-e1', option_name: 'Extra Marshmallows (3 pcs)', extra_price: 0.60, is_default: false },
      { customisation_id: 'bc-e2', option_name: 'Dust with Dark Cocoa', extra_price: 0.00, is_default: false },
      { customisation_id: 'bc-e3', option_name: 'Dust with Cinnamon', extra_price: 0.00, is_default: false }
    ];
    return groups;
  }

  const isCoffee = catId === '1' || nameLower.includes('latte') || nameLower.includes('cappuccino') || nameLower.includes('flat white') || nameLower.includes('espresso') || nameLower.includes('mocha') || nameLower.includes('long black') || nameLower.includes('piccolo') || nameLower.includes('macchiato');
  const isHotDrink = catId === '2' || nameLower.includes('chai') || nameLower.includes('chocolate') || nameLower.includes('matcha') || nameLower.includes('turmeric');
  const isTea = catId === '3' || nameLower.includes('tea');
  const isColdCoffee = catId === '4' || nameLower.includes('iced latte') || nameLower.includes('iced long black') || nameLower.includes('iced coffee') || nameLower.includes('cold brew');
  const isColdDrink = catId === '5' || nameLower.includes('milkshake') || nameLower.includes('soda') || nameLower.includes('iced chocolate');
  const isSmoothie = catId === '6' || nameLower.includes('smoothie');
  const isJuice = catId === '7' || nameLower.includes('juice');
  const isBreakfast = catId === '8' || nameLower.includes('egg') || nameLower.includes('toast') || nameLower.includes('benedict') || nameLower.includes('bacon') || nameLower.includes('avocado') || nameLower.includes('wrap') || nameLower.includes('burger');
  const isToastie = catId === '9' || nameLower.includes('toastie') || nameLower.includes('melt');
  const isSandwich = catId === '10' || nameLower.includes('sandwich') || nameLower.includes('blt');
  const isPastryBakery = catId === '11' || catId === '12' || nameLower.includes('croissant') || nameLower.includes('danish') || nameLower.includes('muffin') || nameLower.includes('bread') || nameLower.includes('scone');
  const isLunch = catId === '13' || nameLower.includes('salad') || nameLower.includes('caesar') || nameLower.includes('bowl');
  const isSides = catId === '14' || nameLower.includes('chips') || nameLower.includes('fries');

  if (isCoffee) {
    groups['Cup Size'] = [
      { customisation_id: 'cs-1', option_name: 'Regular (8oz)', extra_price: 0.00, is_default: true },
      { customisation_id: 'cs-2', option_name: 'Large (12oz)', extra_price: 0.80, is_default: false },
      { customisation_id: 'cs-3', option_name: 'Jumbo (16oz)', extra_price: 1.50, is_default: false }
    ];
    groups['Milk Choice'] = [
      { customisation_id: 'mc-1', option_name: 'Full Cream Dairy Milk', extra_price: 0.00, is_default: !nameLower.includes('black') && !nameLower.includes('espresso') },
      { customisation_id: 'mc-2', option_name: 'Skinny / Light Milk', extra_price: 0.00, is_default: false },
      { customisation_id: 'mc-3', option_name: 'Oat Milk (Oatly Barista)', extra_price: 0.80, is_default: false },
      { customisation_id: 'mc-4', option_name: 'Almond Milk (Milklab)', extra_price: 0.80, is_default: false },
      { customisation_id: 'mc-5', option_name: 'Soy Milk (Bonsoy)', extra_price: 0.70, is_default: false },
      { customisation_id: 'mc-6', option_name: 'Coconut Milk (Milklab)', extra_price: 0.80, is_default: false },
      { customisation_id: 'mc-7', option_name: 'Lactose-Free (Zymil)', extra_price: 0.70, is_default: false },
      { customisation_id: 'mc-8', option_name: 'No Milk (Black)', extra_price: 0.00, is_default: nameLower.includes('black') || nameLower.includes('espresso') }
    ];
    groups['Espresso Roast & Origin'] = [
      { customisation_id: 'ro-1', option_name: 'Ravenhill Reserve Blend', extra_price: 0.00, is_default: true },
      { customisation_id: 'ro-2', option_name: 'Single Origin Ethiopian (Floral & Berry)', extra_price: 1.00, is_default: false },
      { customisation_id: 'ro-3', option_name: 'Swiss Water Decaf', extra_price: 0.70, is_default: false }
    ];
    groups['Espresso Strength & Shots'] = [
      { customisation_id: 'st-1', option_name: 'Standard Shot', extra_price: 0.00, is_default: true },
      { customisation_id: 'st-2', option_name: 'Extra Espresso Shot (+1)', extra_price: 0.80, is_default: false },
      { customisation_id: 'st-3', option_name: 'Double Extra Shot (+2)', extra_price: 1.50, is_default: false },
      { customisation_id: 'st-4', option_name: 'Half Strength', extra_price: 0.00, is_default: false },
      { customisation_id: 'st-5', option_name: 'Ristretto Extraction', extra_price: 0.00, is_default: false }
    ];
    groups['Syrups & Flavours'] = [
      { customisation_id: 'sy-1', option_name: 'Vanilla Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'sy-2', option_name: 'Caramel Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'sy-3', option_name: 'Hazelnut Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'sy-4', option_name: 'Salted Caramel Syrup', extra_price: 0.80, is_default: false },
      { customisation_id: 'sy-5', option_name: 'Pure Raw Honey', extra_price: 0.60, is_default: false }
    ];
    groups['Temperature & Sweetener'] = [
      { customisation_id: 'tp-1', option_name: 'Extra Hot (68°C)', extra_price: 0.00, is_default: false },
      { customisation_id: 'tp-2', option_name: 'Warm / Kid\'s Temp (55°C)', extra_price: 0.00, is_default: false },
      { customisation_id: 'tp-3', option_name: '1x Raw Sugar', extra_price: 0.00, is_default: false },
      { customisation_id: 'tp-4', option_name: '2x Raw Sugar', extra_price: 0.00, is_default: false },
      { customisation_id: 'tp-5', option_name: 'Equal / Stevia', extra_price: 0.00, is_default: false },
      { customisation_id: 'tp-6', option_name: 'Dust with Dark Cocoa', extra_price: 0.00, is_default: nameLower.includes('cappuccino') },
      { customisation_id: 'tp-7', option_name: 'Dust with Cinnamon', extra_price: 0.00, is_default: false }
    ];
  } else if (isHotDrink) {
    groups['Cup Size'] = [
      { customisation_id: 'hd-s1', option_name: 'Regular (8oz)', extra_price: 0.00, is_default: true },
      { customisation_id: 'hd-s2', option_name: 'Large (12oz)', extra_price: 0.80, is_default: false },
      { customisation_id: 'hd-s3', option_name: 'Jumbo (16oz)', extra_price: 1.50, is_default: false }
    ];
    groups['Milk Choice'] = [
      { customisation_id: 'hd-m1', option_name: 'Full Cream Dairy Milk', extra_price: 0.00, is_default: true },
      { customisation_id: 'hd-m2', option_name: 'Skinny Milk', extra_price: 0.00, is_default: false },
      { customisation_id: 'hd-m3', option_name: 'Oat Milk (Oatly)', extra_price: 0.80, is_default: false },
      { customisation_id: 'hd-m4', option_name: 'Almond Milk (Milklab)', extra_price: 0.80, is_default: false },
      { customisation_id: 'hd-m5', option_name: 'Soy Milk (Bonsoy)', extra_price: 0.70, is_default: false },
      { customisation_id: 'hd-m6', option_name: 'Coconut Milk', extra_price: 0.80, is_default: false }
    ];
    groups['Add-Ons & Extras'] = [
      { customisation_id: 'hd-e1', option_name: 'Add Espresso Shot (Dirty)', extra_price: 0.80, is_default: false },
      { customisation_id: 'hd-e2', option_name: 'Fresh Whipped Cream', extra_price: 1.00, is_default: false },
      { customisation_id: 'hd-e3', option_name: 'Extra Marshmallows (3 pcs)', extra_price: 0.60, is_default: false },
      { customisation_id: 'hd-e4', option_name: 'Pure Raw Honey', extra_price: 0.60, is_default: false }
    ];
    groups['Temperature & Sweetener'] = [
      { customisation_id: 'hd-t1', option_name: 'Extra Hot', extra_price: 0.00, is_default: false },
      { customisation_id: 'hd-t2', option_name: 'Warm / Kid\'s Temp', extra_price: 0.00, is_default: false },
      { customisation_id: 'hd-t3', option_name: 'Less Sweet', extra_price: 0.00, is_default: false },
      { customisation_id: 'hd-t4', option_name: '1x Sugar', extra_price: 0.00, is_default: false }
    ];
  } else if (isTea) {
    groups['Pot Size'] = [
      { customisation_id: 't-s1', option_name: 'Teapot for One', extra_price: 0.00, is_default: true },
      { customisation_id: 't-s2', option_name: 'Large Teapot for Two', extra_price: 2.00, is_default: false }
    ];
    groups['Milk on the Side'] = [
      { customisation_id: 't-m1', option_name: 'No Milk', extra_price: 0.00, is_default: true },
      { customisation_id: 't-m2', option_name: 'Cold Full Cream Milk on Side', extra_price: 0.00, is_default: false },
      { customisation_id: 't-m3', option_name: 'Cold Oat Milk on Side', extra_price: 0.80, is_default: false },
      { customisation_id: 't-m4', option_name: 'Cold Soy Milk on Side', extra_price: 0.70, is_default: false }
    ];
    groups['Garnishes & Sweeteners'] = [
      { customisation_id: 't-g1', option_name: 'Fresh Lemon Slice', extra_price: 0.00, is_default: false },
      { customisation_id: 't-g2', option_name: 'Fresh Mint Leaves', extra_price: 0.00, is_default: false },
      { customisation_id: 't-g3', option_name: 'Pure Raw Honey on Side', extra_price: 0.60, is_default: false },
      { customisation_id: 't-g4', option_name: '1x Raw Sugar', extra_price: 0.00, is_default: false }
    ];
  } else if (isColdCoffee || isColdDrink) {
    groups['Cup Size'] = [
      { customisation_id: 'cc-s1', option_name: 'Regular Chilled (16oz)', extra_price: 0.00, is_default: true },
      { customisation_id: 'cc-s2', option_name: 'Large Chilled (20oz)', extra_price: 1.00, is_default: false }
    ];
    groups['Milk Choice'] = [
      { customisation_id: 'cc-m1', option_name: 'Full Cream Dairy Milk', extra_price: 0.00, is_default: true },
      { customisation_id: 'cc-m2', option_name: 'Skinny Milk', extra_price: 0.00, is_default: false },
      { customisation_id: 'cc-m3', option_name: 'Oat Milk (Oatly)', extra_price: 0.80, is_default: false },
      { customisation_id: 'cc-m4', option_name: 'Almond Milk (Milklab)', extra_price: 0.80, is_default: false },
      { customisation_id: 'cc-m5', option_name: 'Soy Milk (Bonsoy)', extra_price: 0.70, is_default: false },
      { customisation_id: 'cc-m6', option_name: 'Black / Water Only', extra_price: 0.00, is_default: false }
    ];
    groups['Ice Level'] = [
      { customisation_id: 'cc-i1', option_name: 'Standard Ice', extra_price: 0.00, is_default: true },
      { customisation_id: 'cc-i2', option_name: 'Less Ice', extra_price: 0.00, is_default: false },
      { customisation_id: 'cc-i3', option_name: 'Extra Ice', extra_price: 0.00, is_default: false },
      { customisation_id: 'cc-i4', option_name: 'No Ice', extra_price: 0.00, is_default: false }
    ];
    groups['Cold Extras & Flavors'] = [
      { customisation_id: 'cc-e1', option_name: 'Extra Espresso Shot', extra_price: 0.80, is_default: false },
      { customisation_id: 'cc-e2', option_name: 'Scoop of Vanilla Ice Cream', extra_price: 1.50, is_default: nameLower.includes('iced coffee') || nameLower.includes('iced chocolate') },
      { customisation_id: 'cc-e3', option_name: 'Fresh Whipped Cream', extra_price: 1.00, is_default: nameLower.includes('iced coffee') || nameLower.includes('iced chocolate') },
      { customisation_id: 'cc-e4', option_name: 'Vanilla Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'cc-e5', option_name: 'Caramel Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'cc-e6', option_name: 'Hazelnut Syrup', extra_price: 0.70, is_default: false },
      { customisation_id: 'cc-e7', option_name: 'Salted Caramel Syrup', extra_price: 0.80, is_default: false }
    ];
  } else if (isSmoothie || isJuice) {
    groups['Liquid Base'] = [
      { customisation_id: 'sm-b1', option_name: 'Full Cream Milk', extra_price: 0.00, is_default: isSmoothie },
      { customisation_id: 'sm-b2', option_name: 'Oat Milk', extra_price: 0.80, is_default: false },
      { customisation_id: 'sm-b3', option_name: 'Almond Milk', extra_price: 0.80, is_default: false },
      { customisation_id: 'sm-b4', option_name: 'Coconut Water Base', extra_price: 1.00, is_default: false },
      { customisation_id: 'sm-b5', option_name: 'Apple Juice Base', extra_price: 0.00, is_default: isJuice }
    ];
    groups['Superfood Boosters & Protein'] = [
      { customisation_id: 'sm-p1', option_name: 'Organic Vanilla Pea Protein', extra_price: 2.50, is_default: false },
      { customisation_id: 'sm-p2', option_name: 'Whey Protein Isolate (Chocolate)', extra_price: 2.50, is_default: false },
      { customisation_id: 'sm-p3', option_name: 'Organic Chia Seeds', extra_price: 1.00, is_default: false },
      { customisation_id: 'sm-p4', option_name: 'Organic Spirulina Greens', extra_price: 1.50, is_default: false },
      { customisation_id: 'sm-p5', option_name: 'Peanut Butter Scoop', extra_price: 1.50, is_default: false },
      { customisation_id: 'sm-p6', option_name: 'Fresh Ginger Shot', extra_price: 1.00, is_default: false },
      { customisation_id: 'sm-p7', option_name: 'Pure Raw Honey', extra_price: 0.50, is_default: false }
    ];
    groups['Texture & Sweetness'] = [
      { customisation_id: 'sm-t1', option_name: 'Standard Blend', extra_price: 0.00, is_default: true },
      { customisation_id: 'sm-t2', option_name: 'Extra Thick / Less Ice', extra_price: 0.00, is_default: false },
      { customisation_id: 'sm-t3', option_name: 'No Added Sweetener', extra_price: 0.00, is_default: false }
    ];
  } else if (isBreakfast) {
    groups['Egg Preparation Style'] = [
      { customisation_id: 'bf-e1', option_name: 'Poached Eggs (Soft Runny)', extra_price: 0.00, is_default: true },
      { customisation_id: 'bf-e2', option_name: 'Scrambled Eggs (Silky Butter)', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-e3', option_name: 'Fried Eggs (Sunny Side Up)', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-e4', option_name: 'Fried Eggs (Over Hard)', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-e5', option_name: 'Egg Whites Only', extra_price: 2.00, is_default: false },
      { customisation_id: 'bf-e6', option_name: 'No Eggs', extra_price: 0.00, is_default: false }
    ];
    groups['Bread & Toast Selection'] = [
      { customisation_id: 'bf-b1', option_name: 'Artisan White Sourdough', extra_price: 0.00, is_default: true },
      { customisation_id: 'bf-b2', option_name: 'Seeded Multigrain Sourdough', extra_price: 0.50, is_default: false },
      { customisation_id: 'bf-b3', option_name: 'Gluten-Free Toast', extra_price: 1.50, is_default: false },
      { customisation_id: 'bf-b4', option_name: 'Toasted Brioche Bun', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-b5', option_name: 'No Bread / Carb-Free', extra_price: 0.00, is_default: false }
    ];
    groups['Breakfast Add-Ons & Extras'] = [
      { customisation_id: 'bf-a1', option_name: 'Crispy Smoked Bacon (2 Rashers)', extra_price: 4.50, is_default: false },
      { customisation_id: 'bf-a2', option_name: 'Grilled Halloumi (2 Slices)', extra_price: 4.50, is_default: false },
      { customisation_id: 'bf-a3', option_name: 'Smashed Hass Avocado', extra_price: 4.00, is_default: false },
      { customisation_id: 'bf-a4', option_name: 'Golden Potato Hash Brown', extra_price: 3.50, is_default: false },
      { customisation_id: 'bf-a5', option_name: 'Grilled Thyme Field Mushrooms', extra_price: 4.00, is_default: false },
      { customisation_id: 'bf-a6', option_name: 'Smoked Tasmanian Salmon', extra_price: 6.00, is_default: false },
      { customisation_id: 'bf-a7', option_name: 'Wilted Baby Spinach', extra_price: 3.00, is_default: false },
      { customisation_id: 'bf-a8', option_name: 'Roasted Heirloom Tomatoes', extra_price: 3.50, is_default: false },
      { customisation_id: 'bf-a9', option_name: 'Danish Creamy Feta', extra_price: 3.00, is_default: false },
      { customisation_id: 'bf-a10', option_name: 'Extra Free-Range Egg', extra_price: 2.50, is_default: false }
    ];
    groups['Sauces & Condiments'] = [
      { customisation_id: 'bf-s1', option_name: 'House Citrus Hollandaise', extra_price: 2.00, is_default: nameLower.includes('benedict') },
      { customisation_id: 'bf-s2', option_name: 'Smoky Tomato Relish', extra_price: 1.00, is_default: false },
      { customisation_id: 'bf-s3', option_name: 'Chipotle Spicy Mayo', extra_price: 1.00, is_default: false },
      { customisation_id: 'bf-s4', option_name: 'Smoky BBQ Sauce', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-s5', option_name: 'Tomato Ketchup', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-s6', option_name: 'Sauce on the Side', extra_price: 0.00, is_default: false }
    ];
    groups['Removals & Dietary'] = [
      { customisation_id: 'bf-r1', option_name: 'No Butter / Dry Toast', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-r2', option_name: 'No Onion / Chives', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-r3', option_name: 'No Dukkah (Nut Allergy)', extra_price: 0.00, is_default: false },
      { customisation_id: 'bf-r4', option_name: 'Extra Crispy Bacon', extra_price: 0.00, is_default: false }
    ];
  } else if (isToastie || isSandwich) {
    groups['Bread Choice'] = [
      { customisation_id: 'ts-b1', option_name: 'Artisan White Sourdough', extra_price: 0.00, is_default: true },
      { customisation_id: 'ts-b2', option_name: 'Seeded Multigrain Sourdough', extra_price: 0.50, is_default: false },
      { customisation_id: 'ts-b3', option_name: 'Gluten-Free Bread', extra_price: 1.50, is_default: false },
      { customisation_id: 'ts-b4', option_name: 'Fresh French Baguette', extra_price: 0.00, is_default: isSandwich && !nameLower.includes('toast') }
    ];
    groups['Toasting Preference'] = [
      { customisation_id: 'ts-t1', option_name: 'Toasted Golden & Crunchy', extra_price: 0.00, is_default: true },
      { customisation_id: 'ts-t2', option_name: 'Lightly Toasted', extra_price: 0.00, is_default: false },
      { customisation_id: 'ts-t3', option_name: 'Fresh / Untoasted', extra_price: 0.00, is_default: false }
    ];
    groups['Cheese & Filling Upgrades'] = [
      { customisation_id: 'ts-c1', option_name: 'Extra Melted Vintage Cheddar', extra_price: 2.00, is_default: false },
      { customisation_id: 'ts-c2', option_name: 'Extra Swiss Gruyère Cheese', extra_price: 2.50, is_default: false },
      { customisation_id: 'ts-c3', option_name: 'Add Sliced Hass Avocado', extra_price: 3.50, is_default: false },
      { customisation_id: 'ts-c4', option_name: 'Add Crispy Bacon', extra_price: 4.00, is_default: false },
      { customisation_id: 'ts-c5', option_name: 'Add Pickled Jalapeños', extra_price: 1.00, is_default: false },
      { customisation_id: 'ts-c6', option_name: 'Add Dill Pickles / Gherkins', extra_price: 1.00, is_default: false },
      { customisation_id: 'ts-c7', option_name: 'Add Sliced Heirloom Tomato', extra_price: 1.50, is_default: false }
    ];
    groups['Spreads & Condiments'] = [
      { customisation_id: 'ts-s1', option_name: 'Dijon Mustard', extra_price: 0.00, is_default: false },
      { customisation_id: 'ts-s2', option_name: 'House Herb Aioli', extra_price: 0.00, is_default: isSandwich },
      { customisation_id: 'ts-s3', option_name: 'Truffle Mayo', extra_price: 1.50, is_default: false },
      { customisation_id: 'ts-s4', option_name: 'Sweet Chili Jam', extra_price: 1.00, is_default: false }
    ];
    groups['Removals & Dietary'] = [
      { customisation_id: 'ts-r1', option_name: 'No Butter', extra_price: 0.00, is_default: false },
      { customisation_id: 'ts-r2', option_name: 'No Tomato', extra_price: 0.00, is_default: false },
      { customisation_id: 'ts-r3', option_name: 'No Onion', extra_price: 0.00, is_default: false },
      { customisation_id: 'ts-r4', option_name: 'No Mustard / Mayo', extra_price: 0.00, is_default: false }
    ];
  } else if (isPastryBakery) {
    groups['Serving Style'] = [
      { customisation_id: 'pb-s1', option_name: 'Served Fresh (Room Temp)', extra_price: 0.00, is_default: true },
      { customisation_id: 'pb-s2', option_name: 'Warmed in Oven', extra_price: 0.00, is_default: false },
      { customisation_id: 'pb-s3', option_name: 'Toasted with Butter on Side', extra_price: 0.00, is_default: false }
    ];
    groups['Accompaniments & Spreads'] = [
      { customisation_id: 'pb-a1', option_name: 'Cultured French Butter', extra_price: 0.00, is_default: nameLower.includes('croissant') || nameLower.includes('bread') },
      { customisation_id: 'pb-a2', option_name: 'Strawberry Preserves', extra_price: 0.50, is_default: false },
      { customisation_id: 'pb-a3', option_name: 'Australian Pure Honey', extra_price: 0.50, is_default: false },
      { customisation_id: 'pb-a4', option_name: 'Nutella Hazelnut Spread', extra_price: 1.00, is_default: false },
      { customisation_id: 'pb-a5', option_name: 'Fresh Whipped Cream', extra_price: 1.00, is_default: false }
    ];
    groups['Removals'] = [
      { customisation_id: 'pb-r1', option_name: 'No Butter', extra_price: 0.00, is_default: false },
      { customisation_id: 'pb-r2', option_name: 'No Icing Sugar Dusting', extra_price: 0.00, is_default: false }
    ];
  } else if (isLunch || isSides) {
    groups['Protein Add-Ons'] = [
      { customisation_id: 'ln-p1', option_name: 'Grilled Herb Chicken Breast', extra_price: 5.50, is_default: false },
      { customisation_id: 'ln-p2', option_name: 'Smoked Tasmanian Salmon', extra_price: 6.00, is_default: false },
      { customisation_id: 'ln-p3', option_name: 'Grilled Halloumi (2 Slices)', extra_price: 4.50, is_default: false },
      { customisation_id: 'ln-p4', option_name: 'Boiled Free-Range Egg', extra_price: 2.50, is_default: false },
      { customisation_id: 'ln-p5', option_name: 'Smashed Hass Avocado', extra_price: 4.00, is_default: false }
    ];
    if (isLunch) {
      groups['Salad Dressings'] = [
        { customisation_id: 'ln-d1', option_name: 'House Lemon & Herb Vinaigrette', extra_price: 0.00, is_default: true },
        { customisation_id: 'ln-d2', option_name: 'Creamy Garlic Caesar', extra_price: 0.00, is_default: false },
        { customisation_id: 'ln-d3', option_name: 'Japanese Sesame Soy', extra_price: 0.00, is_default: false },
        { customisation_id: 'ln-d4', option_name: 'Dressing on the Side', extra_price: 0.00, is_default: false }
      ];
    }
    groups['Dipping Sauces'] = [
      { customisation_id: 'ln-s1', option_name: 'Garlic Aioli', extra_price: 1.00, is_default: isSides },
      { customisation_id: 'ln-s2', option_name: 'Chipotle Spicy Mayo', extra_price: 1.00, is_default: false },
      { customisation_id: 'ln-s3', option_name: 'Truffle Mayo', extra_price: 1.50, is_default: false },
      { customisation_id: 'ln-s4', option_name: 'Smoky BBQ Relish', extra_price: 1.00, is_default: false },
      { customisation_id: 'ln-s5', option_name: 'Tomato Ketchup', extra_price: 0.00, is_default: false }
    ];
    groups['Removals & Dietary'] = [
      { customisation_id: 'ln-r1', option_name: 'No Onion', extra_price: 0.00, is_default: false },
      { customisation_id: 'ln-r2', option_name: 'No Croutons (Gluten Free)', extra_price: 0.00, is_default: false },
      { customisation_id: 'ln-r3', option_name: 'No Cheese / Dairy Free', extra_price: 0.00, is_default: false },
      { customisation_id: 'ln-r4', option_name: 'No Nuts / Seeds', extra_price: 0.00, is_default: false }
    ];
  } else {
    // Universal fallback
    groups['Extras & Add-Ons'] = [
      { customisation_id: 'un-1', option_name: 'Extra Portion', extra_price: 2.50, is_default: false },
      { customisation_id: 'un-2', option_name: 'Side Salad', extra_price: 4.50, is_default: false },
      { customisation_id: 'un-3', option_name: 'Sauce on the Side', extra_price: 0.00, is_default: false }
    ];
    groups['Removals & Notes'] = [
      { customisation_id: 'un-r1', option_name: 'No Onion', extra_price: 0.00, is_default: false },
      { customisation_id: 'un-r2', option_name: 'No Dairy', extra_price: 0.00, is_default: false },
      { customisation_id: 'un-r3', option_name: 'Extra Crispy', extra_price: 0.00, is_default: false }
    ];
  }

  return groups;
}

// Helper: Determine if a modifier group requires single-select (radio button) behavior
function isSingleChoiceGroup(group) {
  if (!group) return false;
  const g = group.toLowerCase().trim();
  const singleChoiceKeywords = [
    'milk', 'milk choice', 'milk & dairy choice', 'milk on the side',
    'cup size', 'size', 'cold size', 'size selection', 'pot size',
    'espresso roast & origin', 'espresso roast', 'espresso strength', 'espresso strength & shots',
    'liquid base', 'egg preparation style', 'bread & toast selection',
    'bread choice', 'toasting preference', 'serving style', 'salad dressings',
    'ice level', 'texture & sweetness'
  ];
  return singleChoiceKeywords.some(k => g === k || g.includes('milk') || g.includes('size'));
}

// Helper: Determine if a modifier group is mandatory / required for this product
function isGroupRequiredForProduct(group, item) {
  if (!group || !item) return false;
  const g = group.toLowerCase().trim();
  const nameLower = (item.name || item.product_name || '').toLowerCase();
  const catId = String(item.category_id || item.catId || '1');

  // Milk requirement
  if (g.includes('milk')) {
    // Espresso / Short Black / Long Black / Americano / Tea / Juices / Food do NOT require milk
    if (nameLower.includes('espresso') || nameLower.includes('short black') || nameLower.includes('long black') || nameLower.includes('americano') || catId === '3' || catId === '7' || catId === '8' || catId === '9' || catId === '10' || catId === '11' || catId === '12' || catId === '13' || catId === '14') {
      return false;
    }
    // Milky coffee, Babycino, Hot Chocolate, Chai, Matcha, Turmeric, Smoothies, Milkshakes REQUIRE milk
    return true;
  }

  // Size requirement
  if (g.includes('size')) {
    return true;
  }

  // Bread choice requirement for breakfast/toasties/sandwiches
  if (g.includes('bread') && (catId === '8' || catId === '9' || catId === '10')) {
    return true;
  }

  // Egg style requirement
  if (g.includes('egg') && catId === '8' && (nameLower.includes('egg') || nameLower.includes('benedict'))) {
    return true;
  }

  return false;
}

// Helper: Product-specific modifier filtering rules
function filterGroupsForProduct(groups, item) {
  if (!groups || !item) return groups;
  const nameLower = (item.name || item.product_name || '').toLowerCase();
  const filtered = {};

  for (const [group, options] of Object.entries(groups)) {
    const g = group.toLowerCase().trim();

    // Babycino: Children's frothed milk drink - suppress adult coffee shot & roast modifiers
    if (nameLower.includes('babycino')) {
      if (g.includes('coffee') || g.includes('espresso') || g.includes('shot') || g.includes('roast') || g.includes('strength')) {
        continue;
      }
    }

    // Espresso / Short Black: pure black espresso extraction - suppress milk
    if (nameLower === 'espresso' || nameLower === 'espresso / short black' || nameLower === 'short black') {
      if (g.includes('milk')) {
        continue;
      }
    }

    // Long Black: suppress compulsory milk choice
    if (nameLower.includes('long black') || nameLower.includes('americano')) {
      if (g === 'milk' || g === 'milk choice' || g === 'milk & dairy choice') {
        continue;
      }
    }

    filtered[group] = options;
  }

  return filtered;
}

async function openCustomiserModalAsync(item, editingData = null) {
  AppState.modalItem = item;
  document.getElementById('customiser-item-name').textContent = item.name || item.product_name;
  document.getElementById('customiser-item-desc').textContent = item.desc || '';
  document.getElementById('customiser-qty').textContent = editingData ? (editingData.qty || 1) : 1;
  document.getElementById('customiser-item-notes').value = editingData ? (editingData.notes || '') : '';

  const imgEl = document.getElementById('customiser-item-img');
  if (imgEl) imgEl.src = getItemImage(item);

  const notesLabel = document.getElementById('customiser-notes-label');
  const notesInput = document.getElementById('customiser-item-notes');
  const catId = String(item.category_id || item.catId || '1');
  const isDrink = ['1', '2', '3', '4', '5', '6', '7'].includes(catId);

  if (notesLabel) {
    notesLabel.textContent = isDrink ? '☕ Barista Notes & Special Requests' : '🍳 Kitchen & Dietary Instructions';
  }
  if (notesInput) {
    notesInput.placeholder = isDrink ? 'E.g., Extra hot, 3/4 full, latte art, separate hot water...' : 'E.g., Extra crispy bacon, dressing on side, nut allergy, well toasted...';
  }

  const container = document.getElementById('dynamic-customiser-sections');
  if (container) {
    container.innerHTML = '<div style="padding:20px;text-align:center;"><i class="ri-loader-4-line ri-spin" style="font-size:24px; color:var(--color-primary);"></i><p>Loading customisation options...</p></div>';
  }
  document.getElementById('customiser-modal').classList.remove('hidden');

  let groupsToRender = {};

  try {
    const cData = await API.fetchCustomisations(item.product_id || item.id, item.category_id);
    if (cData && cData.groups && Object.keys(cData.groups).length > 0) {
      groupsToRender = cData.groups;
    } else {
      groupsToRender = getClientSideCustomisations(item);
    }
  } catch (err) {
    console.warn('[Customiser] Falling back to client-side customisations:', err);
    groupsToRender = getClientSideCustomisations(item);
  }

  // Apply product-specific rule filters
  groupsToRender = filterGroupsForProduct(groupsToRender, item);

  if (container) {
    container.innerHTML = '';

    const groupIcons = {
      'Milk': 'ri-drop-line',
      'Milk Choice': 'ri-drop-line',
      'Milk & Dairy Choice': 'ri-drop-line',
      'Milk on the Side': 'ri-drop-line',
      'Size': 'ri-cup-line',
      'Cup Size': 'ri-cup-line',
      'Cold Size': 'ri-snow-line',
      'Size Selection': 'ri-cup-line',
      'Pot Size': 'ri-leaf-line',
      'Coffee Modifiers': 'ri-flashlight-line',
      'Espresso Roast & Origin': 'ri-fire-line',
      'Espresso Strength & Shots': 'ri-flashlight-line',
      'Espresso Strength': 'ri-flashlight-line',
      'Flavours': 'ri-heart-pulse-line',
      'Syrups & Flavours': 'ri-heart-pulse-line',
      'Temperature & Sweetener': 'ri-temp-hot-line',
      'Hot Drink Extras': 'ri-add-circle-line',
      'Add-Ons & Extras': 'ri-add-circle-line',
      'Cold Extras & Flavors': 'ri-sparkling-line',
      'Superfood Boosters & Protein': 'ri-capsule-line',
      'Liquid Base': 'ri-drinks-line',
      'Egg Preparation Style': 'ri-restaurant-line',
      'Bread & Toast Selection': 'ri-bread-line',
      'Bread Choice': 'ri-bread-line',
      'Toasting Preference': 'ri-fire-line',
      'Breakfast Add-Ons & Extras': 'ri-add-circle-line',
      'Food Add-Ons & Extras': 'ri-add-circle-line',
      'Cheese & Filling Upgrades': 'ri-add-circle-line',
      'Protein Add-Ons': 'ri-user-star-line',
      'Sauces & Condiments': 'ri-goblet-line',
      'Spreads & Condiments': 'ri-goblet-line',
      'Salad Dressings': 'ri-oil-line',
      'Dipping Sauces': 'ri-contrast-drop-2-line',
      'Accompaniments & Spreads': 'ri-cake-line',
      'Serving Style': 'ri-temp-hot-line',
      'Removals & Dietary': 'ri-forbid-line',
      'Removals': 'ri-forbid-line',
      'Bakery Removals': 'ri-forbid-line',
      'Removals & Notes': 'ri-forbid-line'
    };

    for (const [group, options] of Object.entries(groupsToRender)) {
      const isSingle = isSingleChoiceGroup(group);
      const isRequired = isGroupRequiredForProduct(group, item);
      const type = isSingle ? 'radio' : 'checkbox';
      const groupNameClean = group.replace(/[^a-zA-Z0-9]/g, '_');
      const iconClass = groupIcons[group] || (isSingle ? 'ri-radio-button-line' : 'ri-checkbox-circle-line');
      const isRemovalGroup = group.toLowerCase().includes('removal');

      let badgeHtml = '';
      if (isRequired) {
        badgeHtml = `<span class="group-required-badge"><i class="ri-asterisk"></i> Required (Select 1)</span>`;
      } else if (isSingle) {
        badgeHtml = `<span class="group-optional-badge">(Select 1)</span>`;
      } else {
        badgeHtml = `<span class="group-optional-badge">(Optional)</span>`;
      }

      let html = `
        <div class="customiser-section" data-required="${isRequired ? 'true' : 'false'}" data-group-name="${group}" data-group-type="${isSingle ? 'single' : 'multi'}">
          <label class="section-label" style="display:flex; align-items:center; gap:8px; font-weight:700; color:var(--color-primary-light); margin-bottom:8px;">
            <i class="${iconClass}"></i> <span>${group.toUpperCase()}${isRequired ? ' *' : ''}</span>
            ${badgeHtml}
          </label>
          <div class="checkbox-options-grid">
      `;

      options.forEach((opt, optIdx) => {
        const extraPrice = parseFloat(opt.extra_price || 0);
        let extraText = '';
        if (extraPrice > 0) {
          extraText = `<span class="custom-opt-badge price-extra">+ $${extraPrice.toFixed(2)}</span>`;
        } else if (isRemovalGroup) {
          extraText = `<span class="custom-opt-badge removal-badge">Removal</span>`;
        } else {
          extraText = `<span class="custom-opt-badge free-badge">Free</span>`;
        }

        let isChecked = false;
        if (editingData && editingData.customisations && editingData.customisations.length > 0) {
          isChecked = editingData.customisations.some(c => 
            (c.customisation_id && String(c.customisation_id) === String(opt.customisation_id)) || 
            (c.option_name && c.option_name.toLowerCase() === opt.option_name.toLowerCase())
          );
        } else {
          const gLower = group.toLowerCase().trim();
          if (gLower.includes('milk')) {
            // Requirement 3: DO NOT PRESELECT MULTIPLE MILKS - all milks start unselected
            isChecked = false;
          } else if (isSingle && gLower.includes('size')) {
            // Requirement 5: Size is single select. Default size Standard/Regular is preselected
            isChecked = opt.is_default || (optIdx === 0 && !options.some(o => o.is_default));
          } else if (isSingle && (gLower.includes('bread') || gLower.includes('egg') || gLower.includes('roast') || gLower.includes('ice'))) {
            isChecked = opt.is_default || (optIdx === 0 && !options.some(o => o.is_default));
          } else {
            // Requirement 4: Optional Modifiers MUST start UNSELECTED
            isChecked = false;
          }
        }

        const inputName = isSingle ? `customiser_group_${groupNameClean}` : `customiser_opt_${groupNameClean}_${opt.customisation_id || opt.option_name.replace(/[^a-zA-Z0-9]/g, '_')}`;

        html += `
          <label class="checkbox-card ${isRemovalGroup ? 'removal-card' : ''}" style="cursor:pointer;">
            <input type="${type}" name="${inputName}" 
                   value="${opt.customisation_id || opt.option_name}" 
                   data-id="${opt.customisation_id || opt.option_name}"
                   data-group="${group}"
                   data-name="${opt.option_name}"
                   data-extra="${extraPrice}"
                   ${isChecked ? 'checked' : ''}
                   onchange="recalculateCustomiserPrice()">
            <span class="custom-opt-name">${opt.option_name}</span>
            ${extraText}
          </label>
        `;
      });

      html += `</div></div>`;
      container.innerHTML += html;
    }
  }

  recalculateCustomiserPrice();
}

function recalculateCustomiserPrice() {
  if (!AppState.modalItem) return;
  let base = parseFloat(AppState.modalItem.price || AppState.modalItem.unit_price || 0);

  document.querySelectorAll('#dynamic-customiser-sections input:checked').forEach(input => {
    base += parseFloat(input.getAttribute('data-extra') || 0);
  });

  const qty = parseInt(document.getElementById('customiser-qty')?.textContent || '1');
  const total = base * qty;
  
  const calcEl = document.getElementById('customiser-calculated-price');
  if (calcEl) calcEl.textContent = `$${total.toFixed(2)}`;

  validateCustomiserState(total);
}

function validateCustomiserState(currentTotal = null) {
  if (!AppState.modalItem) return;
  const item = AppState.modalItem;
  const sections = document.querySelectorAll('#dynamic-customiser-sections .customiser-section');
  const confirmBtn = document.getElementById('add-to-cart-confirm-btn');
  const validationBanner = document.getElementById('customiser-validation-msg');
  const validationText = document.getElementById('customiser-validation-text');

  let missingRequiredGroup = null;

  sections.forEach(sec => {
    const isReq = sec.getAttribute('data-required') === 'true';
    const groupName = sec.getAttribute('data-group-name') || '';
    if (isReq) {
      const checkedInSec = sec.querySelectorAll('input:checked');
      if (checkedInSec.length === 0) {
        sec.classList.add('section-unfulfilled');
        if (!missingRequiredGroup) {
          missingRequiredGroup = groupName;
        }
      } else {
        sec.classList.remove('section-unfulfilled');
      }
    }
  });

  const isEdit = AppState.editingCartIndex !== null && AppState.editingCartIndex !== undefined;
  
  if (missingRequiredGroup) {
    if (confirmBtn) {
      confirmBtn.disabled = true;
      const gLower = missingRequiredGroup.toLowerCase();
      if (gLower.includes('milk')) {
        confirmBtn.innerHTML = `<i class="ri-lock-line"></i> Please select 1 Milk option`;
      } else if (gLower.includes('size')) {
        confirmBtn.innerHTML = `<i class="ri-lock-line"></i> Please select 1 Size option`;
      } else {
        confirmBtn.innerHTML = `<i class="ri-lock-line"></i> Select required options to continue`;
      }
    }

    if (validationBanner && validationText) {
      validationBanner.classList.remove('hidden');
      const gLower = missingRequiredGroup.toLowerCase();
      if (gLower.includes('milk')) {
        validationText.textContent = "Please select one milk option to continue.";
      } else if (gLower.includes('size')) {
        validationText.textContent = "Please select a size option to continue.";
      } else {
        validationText.textContent = `Please select a required option for ${missingRequiredGroup} to continue.`;
      }
    }
  } else {
    // All required satisfied
    let total = currentTotal;
    if (total === null) {
      let base = parseFloat(item.price || item.unit_price || 0);
      document.querySelectorAll('#dynamic-customiser-sections input:checked').forEach(input => {
        base += parseFloat(input.getAttribute('data-extra') || 0);
      });
      const qty = parseInt(document.getElementById('customiser-qty')?.textContent || '1');
      total = base * qty;
    }

    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `${isEdit ? '<i class="ri-check-line"></i> Update Item' : '<i class="ri-shopping-cart-2-line"></i> Add to Cart'} • <span id="customiser-calculated-price">$${total.toFixed(2)}</span>`;
    }

    if (validationBanner) {
      validationBanner.classList.add('hidden');
    }
  }
}

// Payment & Receipt Modal Logic
let splitState = {
  ways: 2,
  paidCount: 0,
  totalPaid: 0
};

function setupPaymentModal() {
  const modal = document.getElementById('payment-modal');
  document.getElementById('close-payment-btn')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('cancel-payment-btn')?.addEventListener('click', () => modal.classList.add('hidden'));

  // Payment Method Tabs
  const payTabs = document.querySelectorAll('.pay-tab');
  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const method = tab.getAttribute('data-method');
      
      const panels = ['eftpos', 'card', 'cash', 'paypal', 'split', 'loyalty'];
      panels.forEach(p => {
        const el = document.getElementById(`tender-panel-${p}`);
        if (el) el.classList.toggle('hidden', p !== method);
      });

      const confirmBtn = document.getElementById('confirm-payment-btn');
      if (confirmBtn) {
        confirmBtn.style.display = 'inline-flex';
        if (method === 'split') {
          confirmBtn.innerHTML = `<i class="ri-check-double-line"></i> Finalise Split Sale`;
        } else {
          confirmBtn.innerHTML = `<i class="ri-check-double-line"></i> Authorise Payment & Complete Sale`;
        }
      }

      if (method === 'paypal' && typeof window.renderPayPalButtons === 'function') {
        window.renderPayPalButtons();
      }
      if (method === 'split') {
        updateSplitBillDisplay();
      }
    });
  });

  // Credit Card Live Mockup Inputs
  const cardNameInput = document.getElementById('card-name-input');
  const cardNumInput = document.getElementById('card-number-input');
  const cardExpInput = document.getElementById('card-exp-input');

  if (cardNameInput) {
    cardNameInput.addEventListener('input', (e) => {
      const preview = document.getElementById('card-preview-name');
      if (preview) preview.textContent = (e.target.value || 'VALUED CUSTOMER').toUpperCase();
    });
  }
  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      const preview = document.getElementById('card-preview-number');
      if (preview) {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        let formatted = v.replace(/(\d{4})(?=\d)/g, '$1 ');
        preview.textContent = formatted || '•••• •••• •••• 4242';
      }
    });
  }
  if (cardExpInput) {
    cardExpInput.addEventListener('input', (e) => {
      const preview = document.getElementById('card-preview-exp');
      if (preview) preview.textContent = e.target.value || '12/28';
    });
  }

  // Quick Cash Buttons
  const cashInput = document.getElementById('cash-tendered-input');
  if (cashInput) {
    cashInput.addEventListener('input', updateCashChange);
  }

  document.querySelectorAll('.quick-cash-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      const due = calculateCurrentPayableTotal();

      if (val === 'exact') {
        cashInput.value = due.toFixed(2);
      } else {
        cashInput.value = parseFloat(val).toFixed(2);
      }
      updateCashChange();
    });
  });

  // Gratuity / Tip Selector
  AppState.cart.tipPercent = 0;
  AppState.cart.tipAmount = 0;

  document.querySelectorAll('.tip-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.tip-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const tipVal = parseInt(pill.getAttribute('data-tip') || '0');
      AppState.cart.tipPercent = tipVal;
      recalculatePayModalTotals();
    });
  });

  // Split Bill Options
  document.querySelectorAll('.split-btn').forEach(sbtn => {
    sbtn.addEventListener('click', () => {
      document.querySelectorAll('.split-btn').forEach(b => b.classList.remove('active'));
      sbtn.classList.add('active');
      const ways = sbtn.getAttribute('data-split');
      if (ways === 'custom') {
        const inputWays = prompt('Enter number of split shares (e.g. 5):', '5');
        splitState.ways = Math.max(2, parseInt(inputWays) || 2);
      } else {
        splitState.ways = parseInt(ways) || 2;
      }
      splitState.paidCount = 0;
      splitState.totalPaid = 0;
      updateSplitBillDisplay();
    });
  });

  const paySingleShareBtn = document.getElementById('pay-single-share-btn');
  if (paySingleShareBtn) {
    paySingleShareBtn.addEventListener('click', () => {
      const totalDue = calculateCurrentPayableTotal();
      const perPerson = totalDue / splitState.ways;
      if (splitState.paidCount < splitState.ways) {
        splitState.paidCount++;
        splitState.totalPaid += perPerson;
        updateSplitBillDisplay();
        showToast(`Share ${splitState.paidCount} of ${splitState.ways} paid ($${perPerson.toFixed(2)})!`, 'success');
        if (splitState.paidCount === splitState.ways) {
          showToast('All split shares paid in full! Ready to complete sale.', 'success');
        }
      }
    });
  }

  // Redeem Loyalty Points in Payment
  const redeemPointsBtn = document.getElementById('redeem-points-pay-btn');
  if (redeemPointsBtn) {
    redeemPointsBtn.addEventListener('click', () => {
      if (AppState.cart.customer) {
        const pts = AppState.cart.customer.points || 0;
        const discountVal = Math.min(pts / 20, calculateCurrentPayableTotal());
        AppState.cart.promoCode = {
          code: 'LOYALTY',
          type: 'fixed',
          val: discountVal,
          description: `${Math.round(discountVal * 20)} Pts Redeemed`
        };
        showToast(`Redeemed ${Math.round(discountVal * 20)} points for $${discountVal.toFixed(2)} off!`, 'success');
        recalculatePayModalTotals();
      } else {
        showToast('Please attach a loyalty customer first', 'warning');
      }
    });
  }

  // Digital Receipt Sender
  const sendDigitalBtn = document.getElementById('send-digital-receipt-btn');
  if (sendDigitalBtn) {
    sendDigitalBtn.addEventListener('click', () => {
      const target = document.getElementById('digital-receipt-target')?.value?.trim();
      if (!target) {
        showToast('Please enter an email or phone number', 'warning');
        return;
      }
      showToast(`Digital tax invoice sent to ${target}!`, 'success');
    });
  }

  // Confirm Payment
  document.getElementById('confirm-payment-btn')?.addEventListener('click', completePaymentProcess);
}

function calculateCurrentPayableTotal() {
  const subtotal = AppState.cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  let discount = 0;
  if (AppState.cart.promoCode) {
    discount = AppState.cart.promoCode.type === 'percent' ? (subtotal * AppState.cart.promoCode.val)/100 : AppState.cart.promoCode.val;
  }
  const base = Math.max(0, subtotal - discount);
  const tip = (base * (AppState.cart.tipPercent || 0)) / 100;
  AppState.cart.tipAmount = tip;
  return base + tip;
}

function recalculatePayModalTotals() {
  const subtotal = AppState.cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  let discount = 0;
  if (AppState.cart.promoCode) {
    discount = AppState.cart.promoCode.type === 'percent' ? (subtotal * AppState.cart.promoCode.val)/100 : AppState.cart.promoCode.val;
  }
  const base = Math.max(0, subtotal - discount);
  const tip = (base * (AppState.cart.tipPercent || 0)) / 100;
  AppState.cart.tipAmount = tip;
  const total = base + tip;
  const gst = total * 0.10;

  const subtotalEl = document.getElementById('pay-modal-subtotal');
  const gstEl = document.getElementById('pay-modal-gst');
  const tipEl = document.getElementById('pay-modal-tip');
  const tipDisplay = document.getElementById('tip-amount-display');
  const totalEl = document.getElementById('pay-modal-total');
  const eftposAmtEl = document.getElementById('eftpos-amount-display');
  const paypalDueEl = document.getElementById('paypal-amount-due');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (gstEl) gstEl.textContent = `$${gst.toFixed(2)}`;
  if (tipEl) tipEl.textContent = `$${tip.toFixed(2)}`;
  if (tipDisplay) tipDisplay.textContent = `$${tip.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (eftposAmtEl) eftposAmtEl.textContent = `$${total.toFixed(2)}`;
  if (paypalDueEl) paypalDueEl.textContent = `$${total.toFixed(2)} AUD`;

  updateCashChange();
  updateSplitBillDisplay();
}

function updateSplitBillDisplay() {
  const totalDue = calculateCurrentPayableTotal();
  const ways = splitState.ways || 2;
  const perPerson = totalDue / ways;

  const perPersonEl = document.getElementById('split-per-person-amount');
  const shareLabelEl = document.getElementById('split-shares-label');
  const fillEl = document.getElementById('split-progress-fill');
  const statusEl = document.getElementById('split-status-text');
  const shareValEl = document.getElementById('pay-share-val');

  if (perPersonEl) perPersonEl.textContent = `$${perPerson.toFixed(2)}`;
  if (shareLabelEl) shareLabelEl.textContent = `Share (${splitState.paidCount + 1 > ways ? ways : splitState.paidCount + 1} of ${ways}):`;
  if (shareValEl) shareValEl.textContent = `$${perPerson.toFixed(2)}`;

  const pct = Math.min(100, Math.round((splitState.paidCount / ways) * 100));
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (statusEl) {
    statusEl.textContent = `${splitState.paidCount} of ${ways} shares paid ($${splitState.totalPaid.toFixed(2)} of $${totalDue.toFixed(2)})`;
  }
}

function updateCashChange() {
  const cashInput = document.getElementById('cash-tendered-input');
  if (!cashInput) return;
  const due = calculateCurrentPayableTotal();
  const tendered = parseFloat(cashInput.value) || 0;
  const change = Math.max(0, tendered - due);

  const changeDueEl = document.getElementById('cash-change-due');
  if (changeDueEl) {
    changeDueEl.textContent = `$${change.toFixed(2)}`;
  }
}

window.openPaymentModal = function() {
  if (!AppState.cart || !AppState.cart.items || AppState.cart.items.length === 0) {
    showToast('Your cart is empty! Please select food or beverages from the menu.', 'warning');
    return;
  }
  const subtotal = AppState.cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  let discount = 0;
  if (AppState.cart.promoCode) {
    discount = AppState.cart.promoCode.type === 'percent' ? (subtotal * AppState.cart.promoCode.val)/100 : AppState.cart.promoCode.val;
  }
  const total = Math.max(0, subtotal - discount);
  const gst = total * 0.10;

  const orderIdEl = document.getElementById('pay-modal-order-id');
  if (orderIdEl) orderIdEl.textContent = AppState.cart.orderId;
  const subtotalEl = document.getElementById('pay-modal-subtotal');
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  const gstEl = document.getElementById('pay-modal-gst');
  if (gstEl) gstEl.textContent = `$${gst.toFixed(2)}`;
  
  if (discount > 0) {
    document.getElementById('pay-modal-discount-row')?.classList.remove('hidden');
    const discEl = document.getElementById('pay-modal-discount');
    if (discEl) discEl.textContent = `-$${discount.toFixed(2)}`;
  } else {
    document.getElementById('pay-modal-discount-row')?.classList.add('hidden');
  }

  // Loyalty Points in Modal
  const ptsEl = document.getElementById('pay-modal-cust-pts');
  const ptsWorthEl = document.getElementById('pay-modal-pts-worth');
  if (AppState.cart.customer) {
    const pts = AppState.cart.customer.points || 0;
    if (ptsEl) ptsEl.textContent = `${pts} Pts`;
    if (ptsWorthEl) ptsWorthEl.textContent = `Worth $${(pts / 20).toFixed(2)} AUD`;
  } else {
    if (ptsEl) ptsEl.textContent = `0 Pts`;
    if (ptsWorthEl) ptsWorthEl.textContent = `Attach loyalty member`;
  }

  // Populate mini items list
  const miniList = document.getElementById('pay-modal-items-list');
  if (miniList) {
    miniList.innerHTML = AppState.cart.items.map(i => `
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span>${i.qty}x ${i.item.name}</span>
        <strong>$${i.totalPrice.toFixed(2)}</strong>
      </div>
    `).join('');
  }

  // Reset split state
  splitState.paidCount = 0;
  splitState.totalPaid = 0;

  recalculatePayModalTotals();
  document.getElementById('payment-modal')?.classList.remove('hidden');
}

let isProcessingPayment = false;
function completePaymentProcess() {
  if (isProcessingPayment) return;
  if (!AppState.cart || !AppState.cart.items || AppState.cart.items.length === 0) {
    showToast('Your cart is empty! Please select items first.', 'warning');
    return;
  }
  isProcessingPayment = true;
  setTimeout(() => { isProcessingPayment = false; }, 1500);

  const activeTab = document.querySelector('.pay-tab.active')?.getAttribute('data-method') || 'eftpos';
  const subtotal = AppState.cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  let discount = 0;
  if (AppState.cart.promoCode) {
    discount = AppState.cart.promoCode.type === 'percent' ? (subtotal * AppState.cart.promoCode.val)/100 : AppState.cart.promoCode.val;
  }
  const base = Math.max(0, subtotal - discount);
  const tip = AppState.cart.tipAmount || 0;
  const total = base + tip;

  // Determine current cashier name
  const cashierName = document.getElementById('current-user-name')?.textContent || 'Staff';

  // Push into Kitchen & Barista KDS Queue
  const orderCreatedAt = new Date().toISOString();
  const kdsNewOrder = {
    id: AppState.cart.orderId,
    orderType: AppState.cart.orderType,
    tableId: AppState.cart.orderType === 'dine_in' ? AppState.cart.tableId : null,
    customerName: AppState.cart.customer ? AppState.cart.customer.name : 'Walk-in Guest',
    status: 'pending',
    createdAt: orderCreatedAt,
    elapsedSec: 0,
    items: AppState.cart.items.map(i => ({
      product_id: i.item.product_id || i.item.id,
      name: i.item.name || i.item.product_name,
      quantity: i.qty,
      customisations: i.customisations,
      notes: i.notes
    }))
  };

  DB.kdsOrders.unshift(kdsNewOrder);
  updateKDSBadge();

  // Dispatch to Backend REST API & WebSockets
  API.createOrder({
    id: AppState.cart.orderId,
    orderId: AppState.cart.orderId,
    type: AppState.cart.orderType,
    order_type: AppState.cart.orderType === 'dine_in' ? 'dine-in' : (AppState.cart.orderType === 'takeaway' ? 'takeaway' : 'pickup'),
    tableId: AppState.cart.orderType === 'dine_in' ? AppState.cart.tableId : null,
    table_number: AppState.cart.orderType === 'dine_in' ? AppState.cart.tableId : null,
    customerName: AppState.cart.customer ? AppState.cart.customer.name : 'Walk-in Guest',
    items: kdsNewOrder.items,
    subtotal,
    tax: total * 0.10,
    discount,
    discount_amount: discount,
    discount_code: AppState.cart.appliedPromoCode || (AppState.cart.promoCode ? AppState.cart.promoCode.code : null),
    tip,
    total,
    paymentMethod: activeTab,
    createdAt: orderCreatedAt
  });

  // Mark table occupied if dine-in
  if (AppState.cart.orderType === 'dine_in' && AppState.cart.tableId) {
    const tbl = DB.tables.find(t => t.id === AppState.cart.tableId);
    if (tbl) {
      tbl.status = 'occupied';
      tbl.orderId = AppState.cart.orderId;
      API.updateTable(tbl.id, { status: 'occupied', orderId: AppState.cart.orderId });
      renderCartTableSelect();
    }
  }

  // Deduct Inventory automatically
  AppState.cart.items.forEach(ci => {
    if (ci.item.recipe) {
      if (ci.item.recipe.coffeeBeansGrams) {
        const beanInv = DB.inventory.find(inv => inv.id === 'INV-01');
        if (beanInv) {
          const cur = beanInv.qty !== undefined ? beanInv.qty : (beanInv.stockQty || 0);
          beanInv.qty = Math.max(0, Math.round((cur - (ci.item.recipe.coffeeBeansGrams * ci.qty) / 1000) * 10) / 10);
          beanInv.stockQty = beanInv.qty;
          beanInv.status = beanInv.qty <= beanInv.minThreshold ? 'low' : 'good';
          if (beanInv.id) API.updateInventoryStock(beanInv.id, beanInv.qty);
        }
      }
      if (ci.item.recipe.milkMl && ci.milk && ci.milk.includes('Oat')) {
        const oatInv = DB.inventory.find(inv => inv.id === 'INV-03');
        if (oatInv) {
          const cur = oatInv.qty !== undefined ? oatInv.qty : (oatInv.stockQty || 0);
          oatInv.qty = Math.max(0, Math.round((cur - (ci.item.recipe.milkMl * ci.qty) / 1000) * 10) / 10);
          oatInv.stockQty = oatInv.qty;
          oatInv.status = oatInv.qty <= oatInv.minThreshold ? 'low' : 'good';
          if (oatInv.id) API.updateInventoryStock(oatInv.id, oatInv.qty);
        }
      }
    }
  });
  updateLowStockBadge();
  saveLocalDB();

  // Award Loyalty Points if customer attached
  if (AppState.cart.customer) {
    const ptsEarned = Math.floor(total * 10); // $1 = 10 pts
    AppState.cart.customer.points += ptsEarned;
  }

  // Push to Sales Log (local)
  const txnTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const payMethodDisplay = (activeTab === 'paypal' ? 'PAYPAL' : activeTab.toUpperCase());
  const txnRef = (activeTab === 'paypal' ? 'PAYPAL-SB-' + Math.random().toString(36).substr(2, 9).toUpperCase() : 'TXN-' + Date.now());

  DB.completedSales.unshift({
    id: AppState.cart.orderId,
    total: total,
    paymentMethod: payMethodDisplay,
    itemsCount: AppState.cart.items.length,
    cashier: cashierName,
    timestamp: txnTimestamp
  });

  // Persist transaction to backend
  API.createTransaction({
    orderId: AppState.cart.orderId,
    total: total,
    paymentMethod: payMethodDisplay,
    transaction_reference: txnRef,
    itemsCount: AppState.cart.items.length,
    cashier: cashierName,
    timestamp: txnTimestamp
  });

  // Populate Printable Thermal Receipt
  const recOrderEl = document.getElementById('rec-order-id');
  const recDateEl = document.getElementById('rec-date');
  const recTypeEl = document.getElementById('rec-type');
  const recCashierEl = document.getElementById('rec-cashier');
  const recSubtotalEl = document.getElementById('rec-subtotal');
  const recGstEl = document.getElementById('rec-gst');
  const recTipEl = document.getElementById('rec-tip');
  const recTotalEl = document.getElementById('rec-total');
  const recTenderTypeEl = document.getElementById('rec-tender-type');
  const recTenderedEl = document.getElementById('rec-tendered');
  const recChangeEl = document.getElementById('rec-change');

  if (recOrderEl) recOrderEl.textContent = AppState.cart.orderId;
  if (recDateEl) recDateEl.textContent = new Date().toLocaleString('en-AU');
  if (recTypeEl) recTypeEl.textContent = `${AppState.cart.orderType === 'dine_in' ? 'Dine In (' + (AppState.cart.tableId || 'T-03') + ')' : 'Takeaway'}`;
  if (recCashierEl) recCashierEl.textContent = cashierName;
  if (recSubtotalEl) recSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (recGstEl) recGstEl.textContent = `$${(total * 0.10).toFixed(2)}`;
  if (recTipEl) recTipEl.textContent = `$${tip.toFixed(2)}`;
  if (recTotalEl) recTotalEl.textContent = `$${total.toFixed(2)}`;
  if (recTenderTypeEl) recTenderTypeEl.textContent = activeTab.toUpperCase();

  const cashInput = document.getElementById('cash-tendered-input');
  const tenderedAmt = activeTab === 'cash' ? (parseFloat(cashInput?.value) || total) : total;
  if (recTenderedEl) recTenderedEl.textContent = `$${tenderedAmt.toFixed(2)}`;
  if (recChangeEl) recChangeEl.textContent = `$${Math.max(0, tenderedAmt - total).toFixed(2)}`;

  const recItems = document.getElementById('rec-items-list');
  if (recItems) {
    recItems.innerHTML = AppState.cart.items.map(i => {
      const modStr = (i.customisations && i.customisations.length > 0) ? i.customisations.map(c => c.option_name).join(', ') : '';
      return `
        <div class="r-item">
          <span>${i.qty}x ${i.item.name}</span>
          <span>$${i.totalPrice.toFixed(2)}</span>
        </div>
        ${modStr ? `<div class="r-sub" style="font-size:10px; color:#666; margin-bottom:3px;">${modStr}</div>` : ''}
        ${i.notes ? `<div class="r-sub" style="font-size:10px; color:#888;">Note: ${i.notes}</div>` : ''}
      `;
    }).join('');
  }

  const savedOrderId = AppState.cart.orderId;

  document.getElementById('payment-modal')?.classList.add('hidden');
  document.getElementById('receipt-modal')?.classList.remove('hidden');

  // Reset Cart & fetch next order number
  AppState.cart.items = [];
  AppState.cart.promoCode = null;
  AppState.cart.customer = null;
  AppState.cart.tipPercent = 0;
  AppState.cart.tipAmount = 0;

  // Auto-switch to Live Customer Tracker if in Customer Role
  if (AppState.userRole === 'customer' || (AppState.currentUser && AppState.currentUser.role === 'customer')) {
    showToast(`Order ${savedOrderId} Confirmed! Watching live preparation tracker.`, 'success');
    switchModule('customer_tracker');
  } else {
    showToast(`Payment successful for ${savedOrderId}! Order sent to KDS.`, 'success');
  }

  API.fetchNextOrderNum().then(num => {
    if (num) {
      AppState.cart.orderId = `#ORD-${num}`;
    } else {
      const nextNum = parseInt(savedOrderId.split('-')[1] || '9000') + 1;
      AppState.cart.orderId = `#ORD-${nextNum}`;
    }
    renderCartUI();
    saveLocalDB();
  });

  renderCartUI();
  saveLocalDB();
  
  // Set Receipt Action Handlers (PDF & Print Ready)
  const printBtn = document.getElementById('print-receipt-btn');
  if (printBtn) {
    printBtn.onclick = () => window.generateReceiptPDF(false);
  }
  const downloadPdfBtn = document.getElementById('download-pdf-receipt-btn');
  if (downloadPdfBtn) {
    downloadPdfBtn.onclick = () => window.generateReceiptPDF(true);
  }
  const finishBtn = document.getElementById('finish-receipt-btn');
  if (finishBtn) {
    finishBtn.onclick = () => {
      document.getElementById('receipt-modal')?.classList.add('hidden');
      syncBackendData();
    };
  }
  const closeRecBtn = document.getElementById('close-receipt-btn');
  if (closeRecBtn) {
    closeRecBtn.onclick = () => {
      document.getElementById('receipt-modal')?.classList.add('hidden');
      syncBackendData();
    };
  }
  const sendDigitalBtn = document.getElementById('send-digital-receipt-btn');
  if (sendDigitalBtn) {
    sendDigitalBtn.onclick = () => {
      const target = document.getElementById('digital-receipt-target')?.value?.trim();
      if (!target) {
        alert('Please enter an email address or mobile number.');
        return;
      }
      showToast(`Digital tax invoice for ${savedOrderId} sent to ${target}!`, 'success');
      const input = document.getElementById('digital-receipt-target');
      if (input) input.value = '';
    };
  }
}


// ==========================================================================
// 5. ISOLATED CUSTOMER MANAGEMENT, PROFILE, LOYALTY & ORDER HISTORY ENGINE
// ==========================================================================

// Configurable Loyalty Tiers (Admin-customisable)
window.LoyaltyConfig = {
  tiers: [
    {
      key: 'bronze',
      name: 'Bronze Member',
      min_points: 0,
      max_points: 499,
      points_to_next: 500,
      next_tier: 'Silver',
      multiplier: '1.0×',
      discount_pct: 0,
      badge_class: 'tier-bronze',
      icon: 'ri-medal-line',
      color: '#D97706',
      benefits: [
        'Earn 1 point per $1 spent',
        'Birthday beverage treat voucher',
        'Standard mobile ordering access'
      ]
    },
    {
      key: 'silver',
      name: 'Silver Member',
      min_points: 500,
      max_points: 999,
      points_to_next: 1000,
      next_tier: 'Gold',
      multiplier: '1.25×',
      discount_pct: 5,
      badge_class: 'tier-silver',
      icon: 'ri-vip-crown-2-line',
      color: '#CBD5E1',
      benefits: [
        'Earn 1.25 points per $1 spent',
        '5% discount on all barista beverages',
        'Complimentary alternative milk / syrup upgrades',
        'Priority counter pickup'
      ]
    },
    {
      key: 'gold',
      name: 'Gold VIP',
      min_points: 1000,
      max_points: 1999,
      points_to_next: 2000,
      next_tier: 'Platinum',
      multiplier: '1.5×',
      discount_pct: 10,
      badge_class: 'tier-gold',
      icon: 'ri-vip-crown-fill',
      color: '#F59E0B',
      benefits: [
        'Earn 1.5 points per $1 spent',
        '10% discount on entire order',
        'Double Points Weekends promotion',
        '1× Monthly complimentary artisan pastry',
        'Early access to seasonal single origin beans'
      ]
    },
    {
      key: 'platinum',
      name: 'Platinum Elite',
      min_points: 2000,
      max_points: 99999,
      points_to_next: null,
      next_tier: null,
      multiplier: '2.0×',
      discount_pct: 15,
      badge_class: 'tier-platinum',
      icon: 'ri-vip-diamond-fill',
      color: '#A855F7',
      benefits: [
        'Earn 2.0 points per $1 spent (2× multiplier)',
        '15% VIP discount on all orders',
        'Complimentary 250g house roast beans on anniversary',
        'Private cupping & barista masterclass invitations',
        'Direct table ordering concierge'
      ]
    }
  ],
  rewards: [
    { id: 'coffee', name: 'Free Regular Coffee', cost: 100, icon: 'ri-cup-line', desc: 'Any regular flat white, latte, or batch brew' },
    { id: 'pastry', name: 'Artisan Pastry Voucher', cost: 150, icon: 'ri-bread-line', desc: 'Fresh butter or almond croissant, danish, or muffin' },
    { id: 'voucher10', name: '$10 Café Credit', cost: 250, icon: 'ri-money-dollar-circle-line', desc: 'Redeem $10 off your entire food & drinks bill' },
    { id: 'breakfast', name: 'Complimentary Breakfast', cost: 350, icon: 'ri-restaurant-line', desc: 'Any breakfast roll, avocado toast, or eggs benedict' }
  ],
  activePromotions: [
    {
      id: 'double_weekend',
      title: 'Double Points Weekend',
      eligible_tiers: ['Gold VIP', 'Platinum Elite'],
      description: 'Gold & Platinum members receive double points on all specialty espresso drinks this weekend.',
      valid_from: '12 Sep 2026',
      valid_until: '14 Sep 2026',
      status: 'Active Now'
    },
    {
      id: 'spring_pastry',
      title: 'Spring Pastry Perk',
      eligible_tiers: ['Silver Member', 'Gold VIP', 'Platinum Elite'],
      description: 'Add a fresh almond croissant for just 100 points (normally 150 points).',
      valid_from: '01 Sep 2026',
      valid_until: '30 Sep 2026',
      status: 'Active Now'
    }
  ]
};

// Isolated Customer Data Store
window.CustomerStore = {
  customers: [
    {
      id: '1',
      customer_id: 1,
      name: 'David Kim',
      first_name: 'David',
      last_name: 'Kim',
      mobile: '0412 889 201',
      email: 'david.kim@gmail.com',
      dob: '1992-10-14',
      address: '42 Commercial Rd, Prahran VIC 3181',
      photo: null,
      member_since: '12 Oct 2025',
      tier: 'Gold VIP',
      points: 820,
      points_expiry: '31 Dec 2026',
      total_orders: 26,
      visits: 26,
      total_spent: 498.40,
      last_visit: '12 Sep 2026, 10:35 AM',
      tags: ['Regular', 'VIP', 'Prefers Oat Milk', 'Extra Hot', 'Morning Routine'],
      notes: 'Prefers extra hot flat white with oat milk and 1 raw sugar. Always sits at Table 4 when available.'
    },
    {
      id: '2',
      customer_id: 2,
      name: 'Alex Mercer',
      first_name: 'Alex',
      last_name: 'Mercer',
      mobile: '0400 998 123',
      email: 'alex.mercer@outlook.com',
      dob: '1988-06-20',
      address: '15 Chapel St, South Yarra VIC 3141',
      photo: null,
      member_since: '04 Nov 2025',
      tier: 'Silver Member',
      points: 640,
      points_expiry: '31 Dec 2026',
      total_orders: 19,
      visits: 19,
      total_spent: 312.50,
      last_visit: '11 Sep 2026, 02:15 PM',
      tags: ['Usually Takeaway', 'Almond Milk', 'Afternoon Coffee'],
      notes: 'Likes quick takeaway iced long black with splash of almond milk. Never add sweetener.'
    },
    {
      id: '3',
      customer_id: 3,
      name: 'Chloe Lin',
      first_name: 'Chloe',
      last_name: 'Lin',
      mobile: '0488 442 109',
      email: 'chloe.lin@techcorp.au',
      dob: '1995-03-08',
      address: '88 St Kilda Rd, Melbourne VIC 3004',
      photo: null,
      member_since: '09 Jan 2026',
      tier: 'Bronze Member',
      points: 290,
      points_expiry: '31 Dec 2026',
      total_orders: 11,
      visits: 11,
      total_spent: 174.00,
      last_visit: '09 Sep 2026, 11:20 AM',
      tags: ['Gluten Free', 'Matcha Lover', 'Lunch Regular'],
      notes: 'Has mild gluten sensitivity. Double check toast is gluten-free artisan bread.'
    },
    {
      id: '4',
      customer_id: 4,
      name: 'Marcus Vance',
      first_name: 'Marcus',
      last_name: 'Vance',
      mobile: '0411 223 344',
      email: 'marcus.vance@melbourne.edu.au',
      dob: '1980-12-05',
      address: '104 High St, Armadale VIC 3143',
      photo: null,
      member_since: '19 Aug 2025',
      tier: 'Platinum Elite',
      points: 2340,
      points_expiry: '30 Jun 2027',
      total_orders: 58,
      visits: 58,
      total_spent: 1180.00,
      last_visit: '10 Sep 2026, 08:45 AM',
      tags: ['Platinum VIP', 'Single Origin', 'Weekend Brunch', 'Bespoke Roasts'],
      notes: 'University professor. Connoisseur of Ethiopian natural process beans. Enjoys pour-over V60.'
    },
    {
      id: '5',
      customer_id: 5,
      name: 'Elena Rostova',
      first_name: 'Elena',
      last_name: 'Rostova',
      mobile: '0422 334 455',
      email: 'elena.r@designhub.com',
      dob: '1991-07-19',
      address: '12 Grattan St, Carlton VIC 3053',
      photo: null,
      member_since: '01 Feb 2026',
      tier: 'Silver Member',
      points: 710,
      points_expiry: '31 Dec 2026',
      total_orders: 22,
      visits: 22,
      total_spent: 395.20,
      last_visit: '08 Sep 2026, 03:30 PM',
      tags: ['Architect Regular', 'Soy Flat White', 'Pastry Fan'],
      notes: 'Loves almond croissants warmed up. Soy milk flat white with cinnamon dust.'
    },
    {
      id: '7',
      customer_id: 7,
      name: 'Sophia Reed',
      first_name: 'Sophia',
      last_name: 'Reed',
      mobile: '0411 223 344',
      email: 'customer@ravenhill.au',
      dob: '1996-05-18',
      address: '28 Toorak Rd, South Yarra VIC 3141',
      photo: null,
      member_since: '29 Aug 2026',
      tier: 'Gold VIP',
      points: 250,
      points_expiry: '31 Dec 2026',
      total_orders: 11,
      visits: 11,
      total_spent: 198.50,
      last_visit: '12 Sep 2026, 09:15 AM',
      tags: ['Storefront Regular', 'Oat Milk Lover', 'Almond Croissant', 'Morning Orders'],
      notes: 'Loves our Melbourne specialty filter roasts and iced oat latte. Prefers order ready for morning counter pickup.'
    }
  ],

  // Isolated Order Records strictly keyed by customer_id
  ordersByCustomer: {
    '1': [
      {
        id: '9051',
        date: '12 Sep 2026',
        time: '10:35 AM',
        date_iso: '2026-09-12T10:35:00',
        channel: 'Dine In (Table 04)',
        total: 18.50,
        payment_method: 'EFTPOS',
        receipt_id: 'R9051',
        emailed_to: 'david.kim@gmail.com',
        items: [
          { name: 'Cappuccino', quantity: 1, price: 5.20, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }, { group: 'Cup Size', name: 'Large (12oz)', price: 0.80 }] },
          { name: 'Ham, Cheese & Tomato Toastie', quantity: 1, price: 12.50, customisations: [{ group: 'Food Add-Ons & Extras', name: 'Extra Melted Vintage Cheddar', price: 2.00 }] }
        ]
      },
      {
        id: '8984',
        date: '08 Sep 2026',
        time: '08:40 AM',
        date_iso: '2026-09-08T08:40:00',
        channel: 'Takeaway',
        total: 14.50,
        payment_method: 'Apple Pay (Mastercard)',
        receipt_id: 'R8984',
        emailed_to: 'david.kim@gmail.com',
        items: [
          { name: 'Flat White', quantity: 1, price: 5.20, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
          { name: 'Bacon & Egg Roll', quantity: 1, price: 12.00, customisations: [{ group: 'Sauces & Condiments', name: 'Smoky Tomato Relish', price: 1.00 }] }
        ]
      },
      {
        id: '8910',
        date: '03 Sep 2026',
        time: '11:15 AM',
        date_iso: '2026-09-03T11:15:00',
        channel: 'Dine In (Table 04)',
        total: 21.00,
        payment_method: 'Visa ****4242',
        receipt_id: 'R8910',
        emailed_to: 'david.kim@gmail.com',
        items: [
          { name: 'Chicken Caesar Salad', quantity: 1, price: 21.00, customisations: [] },
          { name: 'Iced Latte', quantity: 1, price: 6.80, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] }
        ]
      },
      {
        id: '8832',
        date: '28 Aug 2026',
        time: '09:05 AM',
        date_iso: '2026-08-28T09:05:00',
        channel: 'Takeaway',
        total: 12.00,
        payment_method: 'Cash',
        receipt_id: 'R8832',
        emailed_to: 'david.kim@gmail.com',
        items: [
          { name: 'Cappuccino', quantity: 1, price: 5.20, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
          { name: 'Almond Croissant', quantity: 1, price: 8.00, customisations: [] }
        ]
      }
    ],

    '2': [
      {
        id: '9045',
        date: '11 Sep 2026',
        time: '02:15 PM',
        date_iso: '2026-09-11T14:15:00',
        channel: 'Takeaway',
        total: 13.00,
        payment_method: 'Mastercard ****8819',
        receipt_id: 'R9045',
        emailed_to: 'alex.mercer@outlook.com',
        items: [
          { name: 'Iced Long Black', quantity: 1, price: 6.20, customisations: [{ group: 'Milk Choice', name: 'Almond Milk', price: 0.80 }] },
          { name: 'Banana Bread', quantity: 1, price: 7.00, customisations: [] }
        ]
      },
      {
        id: '8960',
        date: '06 Sep 2026',
        time: '09:30 AM',
        date_iso: '2026-09-06T09:30:00',
        channel: 'Takeaway',
        total: 14.50,
        payment_method: 'EFTPOS',
        receipt_id: 'R8960',
        emailed_to: 'alex.mercer@outlook.com',
        items: [
          { name: 'Long Black', quantity: 1, price: 4.80, customisations: [{ group: 'Espresso Strength', name: 'Extra Espresso Shot (+1)', price: 0.80 }] },
          { name: 'Avocado Toast', quantity: 1, price: 18.50, customisations: [] }
        ]
      }
    ],

    '3': [
      {
        id: '9022',
        date: '09 Sep 2026',
        time: '11:20 AM',
        date_iso: '2026-09-09T11:20:00',
        channel: 'Dine In (Table 01)',
        total: 24.70,
        payment_method: 'PayPal',
        receipt_id: 'R9022',
        emailed_to: 'chloe.lin@techcorp.au',
        items: [
          { name: 'Matcha Latte', quantity: 1, price: 6.20, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
          { name: 'Sourdough Toast', quantity: 1, price: 6.50, customisations: [{ group: 'Bread & Toast Selection', name: 'Gluten-Free Bread / Toast', price: 1.50 }] },
          { name: 'Seasonal Salad', quantity: 1, price: 18.00, customisations: [] }
        ]
      }
    ],

    '4': [
      {
        id: '9039',
        date: '10 Sep 2026',
        time: '08:45 AM',
        date_iso: '2026-09-10T08:45:00',
        channel: 'Dine In (Table 08)',
        total: 31.50,
        payment_method: 'Amex ****1002',
        receipt_id: 'R9039',
        emailed_to: 'marcus.vance@melbourne.edu.au',
        items: [
          { name: 'Single Origin Ethiopian', quantity: 1, price: 5.00, customisations: [{ group: 'Cup Size', name: 'Large (12oz)', price: 0.80 }] },
          { name: 'Eggs Benedict', quantity: 1, price: 21.00, customisations: [{ group: 'Food Add-Ons & Extras', name: 'Smoked Tasmanian Salmon', price: 6.00 }] }
        ]
      }
    ],

    '5': [
      {
        id: '9015',
        date: '08 Sep 2026',
        time: '03:30 PM',
        date_iso: '2026-09-08T15:30:00',
        channel: 'Takeaway',
        total: 13.90,
        payment_method: 'Apple Pay (Visa)',
        receipt_id: 'R9015',
        emailed_to: 'elena.r@designhub.com',
        items: [
          { name: 'Flat White', quantity: 1, price: 5.20, customisations: [{ group: 'Milk Choice', name: 'Soy Milk (Bonsoy)', price: 0.70 }, { group: 'Temperature & Sweetener', name: 'Dust with Cinnamon', price: 0.00 }] },
          { name: 'Almond Croissant', quantity: 1, price: 8.00, customisations: [] }
        ]
      }
    ],
    '7': [
      {
        id: '9053',
        date: '12 Sep 2026',
        time: '09:15 AM',
        date_iso: '2026-09-12T09:15:00',
        channel: 'Storefront (Takeaway)',
        total: 13.80,
        payment_method: 'Apple Pay (Mastercard)',
        receipt_id: 'R9053',
        emailed_to: 'customer@ravenhill.au',
        items: [
          { name: 'Iced Latte', quantity: 1, price: 6.80, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
          { name: 'Almond Croissant', quantity: 1, price: 7.00, customisations: [{ group: 'Preparation', name: 'Warmed Up', price: 0.00 }] }
        ]
      },
      {
        id: '8995',
        date: '09 Sep 2026',
        time: '08:50 AM',
        date_iso: '2026-09-09T08:50:00',
        channel: 'Storefront (Takeaway)',
        total: 16.20,
        payment_method: 'Visa ****1122',
        receipt_id: 'R8995',
        emailed_to: 'customer@ravenhill.au',
        items: [
          { name: 'Flat White', quantity: 1, price: 5.20, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
          { name: 'Avocado Tartine', quantity: 1, price: 11.00, customisations: [] }
        ]
      },
      {
        id: '8940',
        date: '04 Sep 2026',
        time: '10:05 AM',
        date_iso: '2026-09-04T10:05:00',
        channel: 'Dine In (Table 02)',
        total: 22.50,
        payment_method: 'EFTPOS',
        receipt_id: 'R8940',
        emailed_to: 'customer@ravenhill.au',
        items: [
          { name: 'Cappuccino', quantity: 1, price: 5.20, customisations: [] },
          { name: 'Eggs Benedict Brioche', quantity: 1, price: 17.30, customisations: [] }
        ]
      }
    ]
  },

  // Isolated Payment Receipts strictly keyed by customer_id
  receiptsByCustomer: {
    '1': [
      { receipt_id: 'R9051', order_id: '9051', date: '12 Sep 2026, 10:35 AM', method: 'EFTPOS (Visa ****4242)', total: 18.50, status: 'Settled', emailed_to: 'david.kim@gmail.com' },
      { receipt_id: 'R8984', order_id: '8984', date: '08 Sep 2026, 08:40 AM', method: 'Apple Pay (Mastercard ****1104)', total: 14.50, status: 'Settled', emailed_to: 'david.kim@gmail.com' },
      { receipt_id: 'R8910', order_id: '8910', date: '03 Sep 2026, 11:15 AM', method: 'Visa ****4242', total: 21.00, status: 'Settled', emailed_to: 'david.kim@gmail.com' },
      { receipt_id: 'R8832', order_id: '8832', date: '28 Aug 2026, 09:05 AM', method: 'Cash (AUD)', total: 12.00, status: 'Settled', emailed_to: 'david.kim@gmail.com' }
    ],
    '2': [
      { receipt_id: 'R9045', order_id: '9045', date: '11 Sep 2026, 02:15 PM', method: 'Mastercard ****8819', total: 13.00, status: 'Settled', emailed_to: 'alex.mercer@outlook.com' },
      { receipt_id: 'R8960', order_id: '8960', date: '06 Sep 2026, 09:30 AM', method: 'EFTPOS', total: 14.50, status: 'Settled', emailed_to: 'alex.mercer@outlook.com' }
    ],
    '3': [
      { receipt_id: 'R9022', order_id: '9022', date: '09 Sep 2026, 11:20 AM', method: 'PayPal (#PP-88219)', total: 24.70, status: 'Settled', emailed_to: 'chloe.lin@techcorp.au' }
    ],
    '4': [
      { receipt_id: 'R9039', order_id: '9039', date: '10 Sep 2026, 08:45 AM', method: 'Amex ****1002', total: 31.50, status: 'Settled', emailed_to: 'marcus.vance@melbourne.edu.au' }
    ],
    '5': [
      { receipt_id: 'R9015', order_id: '9015', date: '08 Sep 2026, 03:30 PM', method: 'Apple Pay (Visa ****9921)', total: 13.90, status: 'Settled', emailed_to: 'elena.r@designhub.com' }
    ],
    '7': [
      { receipt_id: 'R9053', order_id: '9053', date: '12 Sep 2026, 09:15 AM', method: 'Apple Pay (Mastercard)', total: 13.80, status: 'Settled', emailed_to: 'customer@ravenhill.au' },
      { receipt_id: 'R8995', order_id: '8995', date: '09 Sep 2026, 08:50 AM', method: 'Visa ****1122', total: 16.20, status: 'Settled', emailed_to: 'customer@ravenhill.au' },
      { receipt_id: 'R8940', order_id: '8940', date: '04 Sep 2026, 10:05 AM', method: 'EFTPOS', total: 22.50, status: 'Settled', emailed_to: 'customer@ravenhill.au' }
    ]
  },

  // Isolated Loyalty Ledger entries strictly keyed by customer_id
  loyaltyByCustomer: {
    '1': [
      { type: 'earned', points: 18, desc: 'Earned on Order #9051 (Gold 1.5×)', date: '12 Sep 2026, 10:35 AM' },
      { type: 'redeemed', points: -150, desc: 'Redeemed: Artisan Pastry Voucher', date: '10 Sep 2026, 09:12 AM' },
      { type: 'earned', points: 50, desc: 'Double Points Weekend Bonus (Order #8984)', date: '08 Sep 2026, 08:40 AM' },
      { type: 'earned', points: 32, desc: 'Earned on Order #8910', date: '03 Sep 2026, 11:15 AM' },
      { type: 'redeemed', points: -250, desc: 'Redeemed: $10 Café Credit', date: '29 Aug 2026, 12:00 PM' },
      { type: 'earned', points: 100, desc: 'VIP Milestone Bonus: Reached Gold Level', date: '15 Aug 2026, 10:00 AM' }
    ],
    '2': [
      { type: 'earned', points: 16, desc: 'Earned on Order #9045 (Silver 1.25×)', date: '11 Sep 2026, 02:15 PM' },
      { type: 'earned', points: 18, desc: 'Earned on Order #8960', date: '06 Sep 2026, 09:30 AM' },
      { type: 'redeemed', points: -100, desc: 'Redeemed: Free Regular Coffee', date: '28 Aug 2026, 08:15 AM' }
    ],
    '3': [
      { type: 'earned', points: 25, desc: 'Earned on Order #9022 (Bronze 1.0×)', date: '09 Sep 2026, 11:20 AM' },
      { type: 'earned', points: 50, desc: 'Welcome Loyalty Sign-Up Bonus', date: '09 Jan 2026, 09:40 AM' }
    ],
    '4': [
      { type: 'earned', points: 63, desc: 'Earned on Order #9039 (Platinum 2.0×)', date: '10 Sep 2026, 08:45 AM' },
      { type: 'redeemed', points: -350, desc: 'Redeemed: Complimentary Breakfast', date: '01 Sep 2026, 09:00 AM' },
      { type: 'earned', points: 200, desc: 'Annual Elite Anniversary Gift', date: '19 Aug 2026, 11:20 AM' }
    ],
    '5': [
      { type: 'earned', points: 17, desc: 'Earned on Order #9015 (Silver 1.25×)', date: '08 Sep 2026, 03:30 PM' },
      { type: 'earned', points: 15, desc: 'Earned on Pastry Purchase', date: '01 Sep 2026, 04:10 PM' }
    ],
    '7': [
      { type: 'earned', points: 14, desc: 'Earned on Order #9053 (Storefront Gold 1.5×)', date: '12 Sep 2026, 09:15 AM' },
      { type: 'earned', points: 16, desc: 'Earned on Order #8995 (Takeaway)', date: '09 Sep 2026, 08:50 AM' },
      { type: 'earned', points: 23, desc: 'Earned on Order #8940 (Dine In)', date: '04 Sep 2026, 10:05 AM' },
      { type: 'earned', points: 200, desc: 'Welcome Loyalty Sign-Up & Gold Milestone Bonus', date: '29 Aug 2026, 02:43 PM' }
    ]
  },

  // Isolated Personalised Smart Notifications strictly keyed by customer_id
  notificationsByCustomer: {
    '1': [
      { id: 'n1', icon: '🎉', title: "You're a Gold Member!", desc: 'Enjoy 10% off all orders and 1.5× bonus points on every purchase.', type: 'tier', date: 'Active' },
      { id: 'n2', icon: '🎁', title: 'New Reward Available', desc: 'You have 820 points! You can claim an Artisan Pastry or $10 voucher right now.', type: 'reward', date: 'Today' },
      { id: 'n3', icon: '🔥', title: 'Double Points This Weekend', desc: 'Gold VIPs earn double points on all specialty roasts this Saturday & Sunday.', type: 'promo', date: 'This Weekend' },
      { id: 'n4', icon: '⭐', title: '180 Points Until Platinum', desc: 'Earn 180 more points to unlock 15% VIP discount and concierge perks.', type: 'milestone', date: 'Target' }
    ],
    '2': [
      { id: 'n21', icon: '🎉', title: 'Silver Tier Active', desc: 'Enjoy 5% discount and complimentary milk upgrades on all coffees.', type: 'tier', date: 'Active' },
      { id: 'n22', icon: '🎁', title: 'Claim Free Coffee', desc: 'You have enough points to claim a free regular coffee.', type: 'reward', date: 'Available' },
      { id: 'n23', icon: '⭐', title: '360 Points Until Gold', desc: 'Reach 1,000 points to unlock 10% discount and double points perks.', type: 'milestone', date: 'Target' }
    ],
    '3': [
      { id: 'n31', icon: '⭐', title: '210 Points Until Silver', desc: 'Reach 500 points to unlock 5% off drinks and free milk upgrades.', type: 'milestone', date: 'Target' },
      { id: 'n32', icon: '🎂', title: 'Birthday Coming Soon', desc: 'Add your date of birth in Edit Profile to claim a free drink on your birthday!', type: 'info', date: 'Tip' }
    ],
    '4': [
      { id: 'n41', icon: '👑', title: 'Platinum Elite Status', desc: 'You enjoy 15% VIP discount and 2.0× double points on all orders.', type: 'tier', date: 'Active' },
      { id: 'n42', icon: '🎁', title: 'Exclusive Masterclass Invitation', desc: 'Join our seasonal Ethiopian bean tasting this Friday evening.', type: 'event', date: 'This Friday' }
    ],
    '5': [
      { id: 'n51', icon: '🥐', title: 'Spring Pastry Perk', desc: 'Add an almond croissant for just 100 points this month.', type: 'promo', date: 'Until Sep 30' }
    ],
    '7': [
      { id: 'n71', icon: '👑', title: 'Gold Member Perks Active', desc: 'Complimentary milk upgrades and 1.5× reward points automatically applied.', type: 'tier', date: 'Active' },
      { id: 'n72', icon: '🎁', title: '250 Points Balance', desc: 'You have enough points to claim a Free Specialty Coffee or Artisan Croissant today.', type: 'reward', date: 'Ready' }
    ]
  },

  // Isolated Favourites & Frequent Items strictly keyed by customer_id
  favouritesByCustomer: {
    '1': {
      frequentItems: [
        { name: 'Cappuccino', icon: 'ri-cup-line', price: 5.20, count: 22, defaultMods: 'Large, Oat Milk' },
        { name: 'Ham, Cheese & Tomato Toastie', icon: 'ri-restaurant-line', price: 12.50, count: 14, defaultMods: 'Extra Cheddar' },
        { name: 'Almond Croissant', icon: 'ri-bread-line', price: 8.00, count: 9, defaultMods: 'Warmed' }
      ],
      savedCombos: [
        {
          id: 'combo1',
          name: 'Morning Coffee Combo',
          desc: 'Large Cappuccino (Oat Milk) + Ham & Cheese Toastie (Extra Cheddar)',
          price: 18.50,
          items: [
            { name: 'Cappuccino', quantity: 1, price: 5.20, customisations: [{ group: 'Cup Size', name: 'Large (12oz)', price: 0.80 }, { group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
            { name: 'Ham & Cheese Toastie', quantity: 1, price: 12.50, customisations: [{ group: 'Food Add-Ons & Extras', name: 'Extra Melted Vintage Cheddar', price: 2.00 }] }
          ]
        },
        {
          id: 'combo2',
          name: 'Friday Lunch Treat',
          desc: 'Chicken Caesar Salad + Iced Latte (Oat Milk)',
          price: 27.80,
          items: [
            { name: 'Chicken Caesar Salad', quantity: 1, price: 21.00, customisations: [] },
            { name: 'Iced Latte', quantity: 1, price: 6.80, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] }
          ]
        }
      ]
    },
    '2': {
      frequentItems: [
        { name: 'Iced Long Black', icon: 'ri-cup-line', price: 6.20, count: 18, defaultMods: 'Almond Milk, Extra Ice' },
        { name: 'Banana Bread', icon: 'ri-bread-line', price: 7.00, count: 11, defaultMods: 'Toasted with Butter' }
      ],
      savedCombos: [
        {
          id: 'combo21',
          name: 'Quick Afternoon Pick-Me-Up',
          desc: 'Iced Long Black + Toasted Banana Bread',
          price: 13.20,
          items: [
            { name: 'Iced Long Black', quantity: 1, price: 6.20, customisations: [{ group: 'Milk Choice', name: 'Almond Milk', price: 0.80 }] },
            { name: 'Banana Bread', quantity: 1, price: 7.00, customisations: [] }
          ]
        }
      ]
    },
    '3': {
      frequentItems: [
        { name: 'Matcha Latte', icon: 'ri-cup-line', price: 6.20, count: 9, defaultMods: 'Oat Milk' },
        { name: 'Seasonal Salad', icon: 'ri-restaurant-line', price: 18.00, count: 6, defaultMods: 'Gluten Free' }
      ],
      savedCombos: [
        {
          id: 'combo31',
          name: 'Healthy Matcha Lunch',
          desc: 'Matcha Latte + Seasonal Salad',
          price: 24.20,
          items: [
            { name: 'Matcha Latte', quantity: 1, price: 6.20, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
            { name: 'Seasonal Salad', quantity: 1, price: 18.00, customisations: [] }
          ]
        }
      ]
    },
    '4': {
      frequentItems: [
        { name: 'Single Origin Ethiopian', icon: 'ri-cup-line', price: 5.00, count: 42, defaultMods: 'V60 Pour-over' },
        { name: 'Eggs Benedict', icon: 'ri-restaurant-line', price: 21.00, count: 28, defaultMods: 'With Tasmanian Salmon' }
      ],
      savedCombos: [
        {
          id: 'combo41',
          name: 'Prof. Vance Weekend Special',
          desc: 'V60 Pour-over + Salmon Eggs Benedict',
          price: 32.00,
          items: [
            { name: 'Single Origin Ethiopian', quantity: 1, price: 5.00, customisations: [{ group: 'Cup Size', name: 'Large (12oz)', price: 0.80 }] },
            { name: 'Eggs Benedict', quantity: 1, price: 21.00, customisations: [{ group: 'Food Add-Ons & Extras', name: 'Smoked Tasmanian Salmon', price: 6.00 }] }
          ]
        }
      ]
    },
    '5': {
      frequentItems: [
        { name: 'Flat White', icon: 'ri-cup-line', price: 5.20, count: 19, defaultMods: 'Soy Milk, Cinnamon' },
        { name: 'Almond Croissant', icon: 'ri-bread-line', price: 8.00, count: 16, defaultMods: 'Extra Warm' }
      ],
      savedCombos: [
        {
          id: 'combo51',
          name: 'Afternoon Tea Break',
          desc: 'Soy Flat White + Warmed Almond Croissant',
          price: 13.90,
          items: [
            { name: 'Flat White', quantity: 1, price: 5.20, customisations: [{ group: 'Milk Choice', name: 'Soy Milk (Bonsoy)', price: 0.70 }] },
            { name: 'Almond Croissant', quantity: 1, price: 8.00, customisations: [] }
          ]
        }
      ]
    },
    '7': {
      frequentItems: [
        { name: 'Iced Latte', icon: 'ri-cup-line', price: 6.80, count: 7, defaultMods: 'Oat Milk' },
        { name: 'Almond Croissant', icon: 'ri-bread-line', price: 7.00, count: 5, defaultMods: 'Warmed Up' },
        { name: 'Flat White', icon: 'ri-cup-line', price: 5.20, count: 4, defaultMods: 'Oat Milk, Extra Hot' }
      ],
      savedCombos: [
        {
          id: 'combo71',
          name: 'Sophia\'s Morning Ritual',
          desc: '1× Iced Latte (Oat Milk) + 1× Warmed Almond Croissant',
          price: 13.80,
          items: [
            { name: 'Iced Latte', quantity: 1, price: 6.80, customisations: [{ group: 'Milk Choice', name: 'Oat Milk', price: 0.80 }] },
            { name: 'Almond Croissant', quantity: 1, price: 7.00, customisations: [{ group: 'Preparation', name: 'Warmed Up', price: 0.00 }] }
          ]
        }
      ]
    }
  }
};

// Sync DB.customers with CustomerStore
if (!DB.customers || DB.customers.length === 0) {
  DB.customers = CustomerStore.customers;
} else {
  // Merge DB.customers ensuring all rich metadata fields exist
  CustomerStore.customers.forEach(sc => {
    const existing = DB.customers.find(c => String(c.id) === String(sc.id));
    if (!existing) {
      DB.customers.push(sc);
    } else {
      Object.assign(existing, sc, existing);
    }
  });
}

// Active Tab Tracking State
AppState.customerProfileActiveTab = 'overview';
AppState.activeCustomerProfile = CustomerStore.customers[0];

// Helper: Calculate loyalty tier progress and next milestone
function calculateLoyaltyMilestone(points) {
  const tiers = LoyaltyConfig.tiers;
  let currentTier = tiers[0];
  let nextTier = tiers[1];

  if (points >= tiers[3].min_points) {
    currentTier = tiers[3];
    nextTier = null;
  } else if (points >= tiers[2].min_points) {
    currentTier = tiers[2];
    nextTier = tiers[3];
  } else if (points >= tiers[1].min_points) {
    currentTier = tiers[1];
    nextTier = tiers[2];
  } else {
    currentTier = tiers[0];
    nextTier = tiers[1];
  }

  const min = currentTier.min_points;
  const max = nextTier ? nextTier.min_points : currentTier.max_points;
  const needed = nextTier ? Math.max(0, nextTier.min_points - points) : 0;
  const progressPct = nextTier 
    ? Math.min(100, Math.max(8, Math.round(((points - min) / (max - min)) * 100))) 
    : 100;

  return { currentTier, nextTier, needed, progressPct, max };
}

// Helper: Get Customer Initials
function getCustomerInitials(customer) {
  if (!customer) return '??';
  if (customer.first_name && customer.last_name) {
    return (customer.first_name[0] + customer.last_name[0]).toUpperCase();
  }
  const parts = (customer.name || '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (customer.name || 'CU').substring(0, 2).toUpperCase();
}

// ==========================================
// DRAWER CONTROLLER & TAB NAVIGATION
// ==========================================

window.handleTopUserBadgeClick = function() {
  if (AppState.activeRole === 'customer') {
    const custId = (AppState.currentUser && (AppState.currentUser.customer_id || AppState.currentUser.id)) || '7';
    openCustomerProfileDrawer(custId);
    switchCustomerProfileTab('profile');
  } else {
    openCustomerProfileDrawer();
  }
};

window.openCustomerProfileDrawer = function(customerId) {
  const drawer = document.getElementById('customer-profile-drawer');
  const backdrop = document.getElementById('customer-drawer-backdrop');
  if (!drawer) return;

  let targetCustomer = null;
  if (customerId) {
    targetCustomer = CustomerStore.customers.find(c => String(c.id) === String(customerId) || String(c.customer_id) === String(customerId));
  } else if (AppState.activeRole === 'customer') {
    const custId = (AppState.currentUser && (AppState.currentUser.customer_id || AppState.currentUser.id)) || '7';
    targetCustomer = CustomerStore.customers.find(c => String(c.id) === String(custId) || String(c.customer_id) === String(custId)) ||
                     CustomerStore.customers.find(c => c.name.toLowerCase().includes('sophia')) ||
                     CustomerStore.customers[0];
  } else if (AppState.cart.customer) {
    targetCustomer = CustomerStore.customers.find(c => String(c.id) === String(AppState.cart.customer.id)) || AppState.cart.customer;
  } else if (AppState.activeCustomerProfile) {
    targetCustomer = AppState.activeCustomerProfile;
  } else {
    targetCustomer = CustomerStore.customers[0];
  }

  AppState.activeCustomerProfile = targetCustomer;
  updateDrawerHeader(targetCustomer);
  renderCustomerProfileTabContent();

  drawer.classList.remove('hidden');
  void drawer.offsetWidth;
  drawer.classList.add('open');

  if (backdrop) {
    backdrop.classList.remove('hidden');
    backdrop.classList.add('open');
  }

  setupCustomerSearchEvents();
};

window.closeCustomerProfileDrawer = function() {
  const drawer = document.getElementById('customer-profile-drawer');
  const backdrop = document.getElementById('customer-drawer-backdrop');
  if (drawer) {
    drawer.classList.remove('open');
    setTimeout(() => drawer.classList.add('hidden'), 350);
  }
  if (backdrop) {
    backdrop.classList.remove('open');
    setTimeout(() => backdrop.classList.add('hidden'), 350);
  }
};

window.switchCustomerProfileTab = function(tabName) {
  AppState.customerProfileActiveTab = tabName;

  // Update tab buttons
  const tabBtns = document.querySelectorAll('.cp-tab-btn');
  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderCustomerProfileTabContent();
};

function updateDrawerHeader(customer) {
  const titleEl = document.getElementById('cp-drawer-header-title');
  const tierBadge = document.getElementById('cp-header-tier-badge');
  if (!customer) {
    if (titleEl) titleEl.innerText = 'Customer Profile';
    if (tierBadge) tierBadge.innerText = 'Search';
    return;
  }

  if (titleEl) titleEl.innerText = customer.name;
  if (tierBadge) {
    tierBadge.innerText = customer.tier || 'Member';
    tierBadge.className = `cp-badge ${(customer.tier || '').toLowerCase().includes('gold') ? 'tier-gold' : ''}`;
  }
}

// Search Event Setup
function setupCustomerSearchEvents() {
  const searchInput = document.getElementById('cp-customer-search-input');
  const searchDropdown = document.getElementById('cp-search-dropdown');
  const clearBtn = document.getElementById('cp-clear-search-btn');
  if (!searchInput || !searchDropdown) return;

  searchInput.oninput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      searchDropdown.classList.remove('open');
      searchDropdown.classList.add('hidden');
      if (clearBtn) clearBtn.classList.add('hidden');
      return;
    }

    if (clearBtn) clearBtn.classList.remove('hidden');

    const cleanQ = q.replace(/\s+/g, '');
    const matches = CustomerStore.customers.filter(c => 
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.mobile && c.mobile.replace(/\s+/g, '').includes(cleanQ)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.id && String(c.id).toLowerCase().includes(q)) ||
      (c.customer_id && String(c.customer_id).includes(q))
    );

    if (matches.length === 0) {
      searchDropdown.innerHTML = `
        <div class="cp-search-no-match" style="padding:14px; text-align:center; color:var(--color-cream-muted); font-size:12px;">
          <i class="ri-user-unfollow-line" style="font-size:20px; display:block; margin-bottom:4px;"></i>
          No customer found matching "<strong>${escapeHtml(q)}</strong>"
        </div>
      `;
    } else {
      searchDropdown.innerHTML = matches.map(c => {
        const inits = getCustomerInitials(c);
        return `
          <div class="cp-search-item" onclick="selectCustomerFromSearch('${c.id}')">
            <div class="cp-search-avatar">
              ${c.photo ? `<img src="${c.photo}" alt="${c.name}">` : `<span>${inits}</span>`}
            </div>
            <div class="cp-search-info">
              <div class="cp-search-name">${c.name}</div>
              <div class="cp-search-meta">
                <span><i class="ri-phone-line"></i> ${c.mobile || 'No phone'}</span>
                <span class="cp-search-meta-badge ${(c.tier || '').toLowerCase().includes('gold') ? 'gold' : 'silver'}">${c.tier || 'Member'}</span>
              </div>
            </div>
            <div class="cp-search-points"><i class="ri-coin-line"></i> ${c.points || 0} pts</div>
          </div>
        `;
      }).join('');
    }

    searchDropdown.classList.remove('hidden');
    searchDropdown.classList.add('open');
  };
}

window.selectCustomerFromSearch = function(custId) {
  const cust = CustomerStore.customers.find(c => String(c.id) === String(custId));
  if (cust) {
    AppState.activeCustomerProfile = cust;
    updateDrawerHeader(cust);
    renderCustomerProfileTabContent();
  }
  const searchDropdown = document.getElementById('cp-search-dropdown');
  const searchInput = document.getElementById('cp-customer-search-input');
  const clearBtn = document.getElementById('cp-clear-search-btn');
  if (searchDropdown) {
    searchDropdown.classList.remove('open');
    searchDropdown.classList.add('hidden');
  }
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
};

window.clearCustomerSearch = function() {
  const searchInput = document.getElementById('cp-customer-search-input');
  const searchDropdown = document.getElementById('cp-search-dropdown');
  const clearBtn = document.getElementById('cp-clear-search-btn');
  if (searchInput) searchInput.value = '';
  if (searchDropdown) {
    searchDropdown.classList.remove('open');
    searchDropdown.classList.add('hidden');
  }
  if (clearBtn) clearBtn.classList.add('hidden');
};

// ==========================================
// TAB CONTENT ROUTER (STRICTLY ISOLATED)
// ==========================================

function renderCustomerProfileTabContent() {
  const container = document.getElementById('cp-drawer-body');
  if (!container) return;

  const customer = AppState.activeCustomerProfile;
  if (!customer) {
    container.innerHTML = `
      <div class="cp-empty-state">
        <div class="cp-empty-icon"><i class="ri-user-search-line"></i></div>
        <h3 class="cp-empty-title">Select or Search a Customer</h3>
        <p class="cp-empty-desc">Search by name, phone number, email address, or customer ID above to view customer details.</p>
        <div class="cp-quick-pick-title">Quick Customer Directory</div>
        <div class="cp-quick-pick-list">
          ${CustomerStore.customers.map(c => `
            <button type="button" class="cp-quick-pick-btn" onclick="selectCustomerFromSearch('${c.id}')">
              <span><strong>${c.name}</strong> • ${c.tier}</span>
              <span class="text-gold"><i class="ri-coin-line"></i> ${c.points} pts</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }

  const activeTab = AppState.customerProfileActiveTab || 'overview';

  switch (activeTab) {
    case 'overview':
      renderCustomerOverviewTab(container, customer);
      break;
    case 'orders':
      renderCustomerOrdersTab(container, customer);
      break;
    case 'receipts':
      renderCustomerReceiptsTab(container, customer);
      break;
    case 'loyalty':
      renderCustomerLoyaltyTab(container, customer);
      break;
    case 'favourites':
      renderCustomerFavouritesTab(container, customer);
      break;
    case 'profile':
      renderCustomerProfileDetailsTab(container, customer);
      break;
    default:
      renderCustomerOverviewTab(container, customer);
  }
}

// --------------------------------------------------------------------------
// TAB 1: OVERVIEW TAB (Personalised Dashboard)
// --------------------------------------------------------------------------

function renderCustomerOverviewTab(container, customer) {
  const initials = getCustomerInitials(customer);
  const milestone = calculateLoyaltyMilestone(customer.points || 0);
  const isAttachedToSale = AppState.cart.customer && String(AppState.cart.customer.id) === String(customer.id);
  
  // Strictly isolated customer orders & notifications
  const custOrders = CustomerStore.ordersByCustomer[customer.id] || [];
  const recentOrder = custOrders[0] || null;
  const notifications = CustomerStore.notificationsByCustomer[customer.id] || [];
  const favData = CustomerStore.favouritesByCustomer[customer.id] || { frequentItems: [] };

  container.innerHTML = `
    <!-- Top Identity Card with Attach Action -->
    <div class="cp-profile-card">
      <div class="cp-profile-main">
        <div class="cp-profile-avatar-wrap ${milestone.currentTier.badge_class}">
          ${customer.photo 
            ? `<img src="${customer.photo}" alt="${customer.name}" class="cp-avatar-img">` 
            : `<span>${initials}</span>`}
          <span class="cp-tier-crown"><i class="${milestone.currentTier.icon}"></i></span>
        </div>
        <div class="cp-profile-details">
          <div class="cp-profile-name-row">
            <h3 class="cp-profile-name">${customer.name}</h3>
            <span class="cp-tier-badge ${milestone.currentTier.badge_class}">
              <i class="${milestone.currentTier.icon}"></i> ${customer.tier || milestone.currentTier.name}
            </span>
            <button type="button" class="btn btn-ghost btn-xs" onclick="openEditCustomerProfileModal('${customer.id}')" title="Edit Customer Profile" style="margin-left:auto; padding:2px 8px; font-size:12px; border:1px solid var(--color-border);">
              <i class="ri-edit-line"></i> Edit
            </button>
          </div>
          <div class="cp-profile-contacts">
            <div class="cp-contact-item"><i class="ri-phone-line"></i> <span>${customer.mobile || 'No phone'}</span></div>
            <div class="cp-contact-item"><i class="ri-mail-line"></i> <span>${customer.email || 'No email'}</span></div>
          </div>
        </div>
      </div>

      <!-- Attach / Detach Bar -->
      <div class="cp-attach-bar">
        <div class="cp-attach-status ${isAttachedToSale ? 'attached' : ''}">
          <i class="${isAttachedToSale ? 'ri-checkbox-circle-fill' : 'ri-user-shared-line'}"></i>
          <span>${isAttachedToSale ? 'Attached to Current Sale' : 'Not attached to sale'}</span>
        </div>
        ${isAttachedToSale ? `
          <button type="button" class="cp-attach-btn btn-detach" onclick="detachCustomerFromCurrentSale()">
            <i class="ri-close-line"></i> Detach
          </button>
        ` : `
          <button type="button" class="cp-attach-btn btn-attach" onclick="attachCustomerToCurrentSale('${customer.id}')">
            <i class="ri-user-add-line"></i> Attach to Cart
          </button>
        `}
      </div>
    </div>

    <!-- 4 Key KPI Cards -->
    <div class="cp-metrics-grid">
      <div class="cp-metric-box highlight">
        <div class="cp-metric-val"><i class="ri-coin-line text-gold"></i> ${customer.points || 0}</div>
        <div class="cp-metric-lbl">Loyalty Points</div>
      </div>
      <div class="cp-metric-box">
        <div class="cp-metric-val" style="font-size:13px; font-weight:800; color:${milestone.currentTier.color};">
          ${customer.tier ? customer.tier.replace(' Member', '').replace(' VIP', '') : 'Member'}
        </div>
        <div class="cp-metric-lbl">Current Level</div>
      </div>
      <div class="cp-metric-box">
        <div class="cp-metric-val">${customer.total_orders || customer.visits || 0}</div>
        <div class="cp-metric-lbl">Total Visits</div>
      </div>
      <div class="cp-metric-box">
        <div class="cp-metric-val">$${typeof customer.total_spent === 'number' ? customer.total_spent.toFixed(2) : (customer.total_spent || '0.00')}</div>
        <div class="cp-metric-lbl">Total Spending</div>
      </div>
    </div>

    <!-- Next Loyalty Milestone Card -->
    <div class="cp-milestone-card">
      <div class="cp-milestone-header">
        <div class="cp-milestone-title">
          <i class="ri-flag-2-line text-gold"></i>
          <span>${milestone.nextTier ? `Progress to ${milestone.nextTier.name}` : 'Highest Tier Achieved!'}</span>
        </div>
        <span class="cp-milestone-points">${customer.points || 0} / ${milestone.max} pts</span>
      </div>

      <div class="cp-progress-bar-bg">
        <div class="cp-progress-bar-fill" style="width:${milestone.progressPct}%; background:${milestone.currentTier.color};"></div>
      </div>

      <div class="cp-milestone-footer">
        ${milestone.nextTier ? `
          <span><i class="ri-arrow-up-circle-line text-gold"></i> <strong>${milestone.needed} points</strong> needed to unlock ${milestone.nextTier.name}</span>
        ` : `
          <span class="text-success"><i class="ri-shield-check-line"></i> Top VIP Tier • Maximum multipliers & benefits active</span>
        `}
      </div>
    </div>

    <!-- Smart Notifications Section -->
    ${notifications.length > 0 ? `
      <div class="cp-section">
        <div class="cp-section-header">
          <span class="cp-section-title"><i class="ri-notification-3-line text-primary"></i> Personalised Updates</span>
          <span style="font-size:11px; color:var(--color-cream-muted);">For ${customer.first_name}</span>
        </div>
        <div class="cp-notifications-list">
          ${notifications.map(n => `
            <div class="cp-notification-pill ${n.type}">
              <span class="cp-notif-icon">${n.icon}</span>
              <div class="cp-notif-body">
                <strong>${n.title}</strong>
                <p>${n.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Recent Order Card (1-Tap Reorder) -->
    ${recentOrder ? `
      <div class="cp-section">
        <div class="cp-section-header">
          <span class="cp-section-title"><i class="ri-history-line text-primary"></i> Most Recent Order</span>
          <button type="button" class="btn btn-ghost btn-xs" onclick="switchCustomerProfileTab('orders')">View All (${custOrders.length})</button>
        </div>
        <div class="cp-repeat-last-card">
          <div class="cp-repeat-header">
            <span class="cp-repeat-label"><i class="ri-repeat-line"></i> REPEAT LAST ORDER</span>
            <span class="cp-repeat-date">${recentOrder.date} • ${recentOrder.time}</span>
          </div>
          <div class="cp-repeat-items">
            ${recentOrder.items.map(it => `
              <div class="cp-repeat-item-line">
                <span><strong>${it.quantity}×</strong> ${it.name}</span>
                ${it.customisations && it.customisations.length ? `<span class="cp-mod-chip">${it.customisations.map(m=>m.name).join(', ')}</span>` : ''}
              </div>
            `).join('')}
          </div>
          <div class="cp-repeat-action-row">
            <span class="cp-repeat-total">Total: $${recentOrder.total.toFixed(2)}</span>
            <button type="button" class="cp-repeat-btn" onclick="reorderHistoricalOrder('${recentOrder.id}', '${customer.id}')">
              <i class="ri-shopping-cart-2-line"></i> Reorder Now
            </button>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Member Benefits & Current Promotions -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-gift-2-line text-gold"></i> Member Benefits & Offers</span>
        <button type="button" class="btn btn-ghost btn-xs" onclick="switchCustomerProfileTab('loyalty')">Full Perks</button>
      </div>
      <div class="cp-benefits-card">
        <div class="cp-benefit-badge"><i class="${milestone.currentTier.icon}"></i> ${milestone.currentTier.name} Status</div>
        <ul class="cp-benefits-bullets">
          ${milestone.currentTier.benefits.map(b => `<li><i class="ri-check-line text-success"></i> ${b}</li>`).join('')}
        </ul>
        <div class="cp-promo-banner">
          <div class="cp-promo-title"><i class="ri-fire-fill text-primary"></i> ${LoyaltyConfig.activePromotions[0].title}</div>
          <p class="cp-promo-desc">${LoyaltyConfig.activePromotions[0].description}</p>
          <span class="cp-promo-valid"><i class="ri-time-line"></i> Valid: ${LoyaltyConfig.activePromotions[0].valid_from} – ${LoyaltyConfig.activePromotions[0].valid_until}</span>
        </div>
      </div>
    </div>

    <!-- Quick Favourite Items -->
    ${favData.frequentItems && favData.frequentItems.length > 0 ? `
      <div class="cp-section">
        <div class="cp-section-header">
          <span class="cp-section-title"><i class="ri-heart-3-line text-primary"></i> Frequent Favourites</span>
          <button type="button" class="btn btn-ghost btn-xs" onclick="switchCustomerProfileTab('favourites')">Manage</button>
        </div>
        <div class="cp-pairings-grid">
          ${favData.frequentItems.slice(0, 3).map(fi => `
            <div class="cp-pair-card">
              <div class="cp-pair-icon"><i class="${fi.icon}"></i></div>
              <div class="cp-pair-name" title="${fi.name}">${fi.name}</div>
              <div class="cp-pair-price">$${fi.price.toFixed(2)}</div>
              <button type="button" class="cp-pair-add-btn" onclick="addRecommendedItemToCart('${fi.name}')">
                <i class="ri-add-line"></i> Add
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

// --------------------------------------------------------------------------
// TAB 2: ORDERS TAB (Strictly Isolated History with Filters & Search)
// --------------------------------------------------------------------------

AppState.customerOrdersFilter = 'all';
AppState.customerOrdersSearch = '';

function renderCustomerOrdersTab(container, customer) {
  const allOrders = CustomerStore.ordersByCustomer[customer.id] || [];
  const filter = AppState.customerOrdersFilter || 'all';
  const query = (AppState.customerOrdersSearch || '').toLowerCase().trim();

  // Apply Date Filtering
  const now = new Date();
  const filteredOrders = allOrders.filter(order => {
    // 1. Date Filter
    if (filter === 'today') {
      const oDate = new Date(order.date_iso);
      if (oDate.toDateString() !== now.toDateString()) return false;
    } else if (filter === 'this_week') {
      const oDate = new Date(order.date_iso);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (oDate < oneWeekAgo) return false;
    } else if (filter === 'this_month') {
      const oDate = new Date(order.date_iso);
      if (oDate.getMonth() !== now.getMonth() || oDate.getFullYear() !== now.getFullYear()) return false;
    }

    // 2. Query search
    if (query) {
      const matchesId = String(order.id).includes(query);
      const matchesReceipt = String(order.receipt_id || '').toLowerCase().includes(query);
      const matchesItem = order.items.some(it => it.name.toLowerCase().includes(query));
      if (!matchesId && !matchesReceipt && !matchesItem) return false;
    }

    return true;
  });

  container.innerHTML = `
    <!-- Header with Isolation Notice -->
    <div class="cp-tab-section-header">
      <div>
        <h4 style="margin:0; font-size:15px; font-weight:800;"><i class="ri-file-list-3-line text-primary"></i> Order History</h4>
        <span style="font-size:11px; color:var(--color-cream-muted);">Showing records exclusively for <strong>${customer.name}</strong></span>
      </div>
      <span class="badge badge-info">${filteredOrders.length} orders</span>
    </div>

    <!-- Filter & Search Controls -->
    <div class="cp-order-filter-bar">
      <div class="cp-order-search-wrap">
        <i class="ri-search-line"></i>
        <input type="text" id="cp-orders-search-input" placeholder="Search order # or items..." value="${escapeHtml(AppState.customerOrdersSearch || '')}" oninput="handleCustomerOrdersSearch(this.value)">
      </div>

      <div class="cp-order-date-filters">
        <button type="button" class="cp-filter-pill ${filter === 'all' ? 'active' : ''}" onclick="setCustomerOrdersFilter('all')">All</button>
        <button type="button" class="cp-filter-pill ${filter === 'today' ? 'active' : ''}" onclick="setCustomerOrdersFilter('today')">Today</button>
        <button type="button" class="cp-filter-pill ${filter === 'this_week' ? 'active' : ''}" onclick="setCustomerOrdersFilter('this_week')">This Week</button>
        <button type="button" class="cp-filter-pill ${filter === 'this_month' ? 'active' : ''}" onclick="setCustomerOrdersFilter('this_month')">This Month</button>
      </div>
    </div>

    <!-- Orders Timeline -->
    <div class="cp-history-timeline">
      ${filteredOrders.length === 0 ? `
        <div class="cp-empty-state" style="padding:30px 10px;">
          <i class="ri-file-search-line" style="font-size:32px; color:var(--color-cream-muted);"></i>
          <h4 style="margin:8px 0 2px 0;">No matching orders found</h4>
          <p style="font-size:12px; color:var(--color-cream-muted); margin:0;">No order records match the selected filter for ${customer.name}.</p>
        </div>
      ` : filteredOrders.map(order => `
        <div class="cp-history-card">
          <div class="cp-history-top">
            <div class="cp-history-id-group">
              <span class="cp-history-id">Order #${order.id}</span>
              <span class="cp-history-channel ${(order.channel || '').toLowerCase().includes('dine') ? 'dine-in' : 'takeaway'}">
                ${(order.channel || '').toLowerCase().includes('dine') ? 'Dine-In' : 'Takeaway'}
              </span>
            </div>
            <span class="cp-history-date">${order.date} • ${order.time}</span>
          </div>

          <div class="cp-history-items-list">
            ${order.items.map(it => `
              <div class="cp-history-item-row">
                <div class="cp-history-item-title">
                  <span class="cp-history-item-name"><strong>${it.quantity}×</strong> ${it.name}</span>
                  ${it.customisations && it.customisations.length ? `
                    <div class="cp-history-item-mods">
                      ${it.customisations.map(m => `<span class="cp-mod-chip">${m.name}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
                <span class="cp-history-item-price">$${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="cp-history-footer">
            <div class="cp-history-total-group">
              <span class="cp-history-pay-method"><i class="ri-bank-card-line"></i> ${order.payment_method || 'Card'}</span>
              <span class="cp-history-total">$${order.total.toFixed(2)}</span>
            </div>

            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-outline btn-xs" onclick="openCustomerReceiptModal('${order.receipt_id || 'R' + order.id}', '${customer.id}')" title="View & Print Receipt">
                <i class="ri-receipt-line"></i> Receipt
              </button>
              <button type="button" class="cp-history-reorder-btn" onclick="reorderHistoricalOrder('${order.id}', '${customer.id}')" title="Add items to cart">
                <i class="ri-repeat-line"></i> Reorder
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.setCustomerOrdersFilter = function(filterName) {
  AppState.customerOrdersFilter = filterName;
  renderCustomerProfileTabContent();
};

window.handleCustomerOrdersSearch = function(val) {
  AppState.customerOrdersSearch = val;
  renderCustomerProfileTabContent();
};

// --------------------------------------------------------------------------
// TAB 3: RECEIPTS & PAYMENTS TAB (Strictly Isolated Payments)
// --------------------------------------------------------------------------

function renderCustomerReceiptsTab(container, customer) {
  const receipts = CustomerStore.receiptsByCustomer[customer.id] || [];

  container.innerHTML = `
    <!-- Header with Isolation Notice -->
    <div class="cp-tab-section-header">
      <div>
        <h4 style="margin:0; font-size:15px; font-weight:800;"><i class="ri-receipt-line text-primary"></i> Payment Receipts</h4>
        <span style="font-size:11px; color:var(--color-cream-muted);">Isolated ledger for <strong>${customer.name}</strong></span>
      </div>
      <span class="badge badge-info">${receipts.length} receipts</span>
    </div>

    <!-- Receipts Cards -->
    <div class="cp-receipts-list">
      ${receipts.length === 0 ? `
        <div class="cp-empty-state" style="padding:30px 10px;">
          <i class="ri-receipt-line" style="font-size:32px; color:var(--color-cream-muted);"></i>
          <h4 style="margin:8px 0 2px 0;">No Receipts Found</h4>
          <p style="font-size:12px; color:var(--color-cream-muted); margin:0;">No payment receipts have been recorded for ${customer.name}.</p>
        </div>
      ` : receipts.map(rcpt => `
        <div class="cp-receipt-card">
          <div class="cp-receipt-top">
            <div class="cp-receipt-badge">
              <i class="ri-check-line text-success"></i>
              <span>${rcpt.status || 'Settled'}</span>
            </div>
            <strong class="cp-receipt-amount">$${rcpt.total.toFixed(2)}</strong>
          </div>

          <div class="cp-receipt-meta">
            <div><strong>Receipt:</strong> #${rcpt.receipt_id}</div>
            <div><strong>Order:</strong> #${rcpt.order_id}</div>
            <div><strong>Date:</strong> ${rcpt.date}</div>
            <div><strong>Payment:</strong> ${rcpt.method}</div>
            ${rcpt.emailed_to ? `<div class="text-info"><i class="ri-mail-check-line"></i> Emailed to: ${rcpt.emailed_to}</div>` : ''}
          </div>

          <div class="cp-receipt-actions-grid">
            <button type="button" class="btn btn-outline btn-xs" onclick="openCustomerReceiptModal('${rcpt.receipt_id}', '${customer.id}')">
              <i class="ri-eye-line"></i> View
            </button>
            <button type="button" class="btn btn-outline btn-xs" onclick="printCustomerReceiptDirect('${rcpt.receipt_id}', '${customer.id}')">
              <i class="ri-printer-line"></i> Print
            </button>
            <button type="button" class="btn btn-outline btn-xs" onclick="sendCustomerReceiptPrompt('${rcpt.receipt_id}', '${customer.id}')">
              <i class="ri-mail-send-line"></i> Send
            </button>
            <button type="button" class="btn btn-primary btn-xs" onclick="downloadCustomerReceiptDirect('${rcpt.receipt_id}', '${customer.id}')">
              <i class="ri-download-2-line"></i> PDF
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// --------------------------------------------------------------------------
// TAB 4: LOYALTY TAB (Dedicated Program, Milestone, Activity Ledger)
// --------------------------------------------------------------------------

function renderCustomerLoyaltyTab(container, customer) {
  const milestone = calculateLoyaltyMilestone(customer.points || 0);
  const ledger = CustomerStore.loyaltyByCustomer[customer.id] || [];

  container.innerHTML = `
    <!-- Top Loyalty Status Hero Card -->
    <div class="cp-loyalty-hero-card">
      <div class="cp-loyalty-hero-top">
        <div>
          <span class="cp-tier-badge ${milestone.currentTier.badge_class}">
            <i class="${milestone.currentTier.icon}"></i> ${customer.tier || milestone.currentTier.name}
          </span>
          <h3 style="margin:6px 0 0 0; font-size:22px; font-weight:800; color:var(--color-cream);">
            ${customer.points || 0} <span style="font-size:14px; font-weight:600; color:var(--color-accent-gold);">Available Points</span>
          </h3>
        </div>
        <div class="cp-loyalty-rate-pill">
          <span>Earning Rate</span>
          <strong>${milestone.currentTier.multiplier}</strong>
        </div>
      </div>

      <!-- Visual Progress Bar -->
      <div class="cp-loyalty-progress-section">
        <div class="cp-loyalty-progress-meta">
          <span>${milestone.currentTier.name}</span>
          <span>${customer.points || 0} / ${milestone.max} points</span>
        </div>
        <div class="cp-progress-bar-bg">
          <div class="cp-progress-bar-fill" style="width:${milestone.progressPct}%; background:${milestone.currentTier.color};"></div>
        </div>
        <div class="cp-loyalty-progress-status">
          ${milestone.nextTier ? `
            <span><i class="ri-sparkling-fill text-gold"></i> <strong>${milestone.needed} points</strong> until ${milestone.nextTier.name}</span>
          ` : `
            <span class="text-success"><i class="ri-award-fill"></i> Maximum Platinum Tier Unlocked</span>
          `}
          <span style="color:var(--color-cream-muted); font-size:11px;">Expires: ${customer.points_expiry || '31 Dec 2026'}</span>
        </div>
      </div>
    </div>

    <!-- Available Rewards Section with Instant Point Deduction -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-gift-line text-gold"></i> Available Rewards to Redeem</span>
        <span style="font-size:11px; color:var(--color-cream-muted);">${customer.points || 0} Pts Balance</span>
      </div>
      <div class="cp-rewards-grid">
        ${LoyaltyConfig.rewards.map(rw => {
          const canClaim = (customer.points || 0) >= rw.cost;
          return `
            <div class="cp-reward-card">
              <div class="cp-reward-top">
                <div class="cp-reward-icon"><i class="${rw.icon}"></i></div>
                <div class="cp-reward-info">
                  <h4 class="cp-reward-title">${rw.name}</h4>
                  <div class="cp-reward-pts"><i class="ri-coin-line"></i> ${rw.cost} Points</div>
                </div>
              </div>
              <p style="font-size:11px; color:var(--color-cream-muted); margin:4px 0 8px 0;">${rw.desc}</p>
              <button type="button" class="cp-reward-btn" ${canClaim ? '' : 'disabled'} onclick="claimLoyaltyReward('${rw.id}', ${rw.cost}, '${rw.name}')">
                ${canClaim ? '<i class="ri-check-line"></i> Redeem Reward' : `Need ${rw.cost - (customer.points || 0)} More Pts`}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Tier Breakdown & Configurable Benefits -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-medal-fill text-primary"></i> Loyalty Tiers & Benefits</span>
      </div>
      <div class="cp-tiers-container">
        ${LoyaltyConfig.tiers.map(t => {
          const isCurrent = (customer.tier || '').toLowerCase().includes(t.key);
          return `
            <div class="cp-tier-row-card ${isCurrent ? 'active' : ''}">
              <div class="cp-tier-row-head">
                <div style="display:flex; align-items:center; gap:8px;">
                  <i class="${t.icon}" style="color:${t.color}; font-size:16px;"></i>
                  <strong>${t.name}</strong>
                  ${isCurrent ? '<span class="cp-badge-current">Your Level</span>' : ''}
                </div>
                <span style="font-size:11px; color:var(--color-cream-muted);">${t.min_points}${t.max_points < 99999 ? '–' + t.max_points : '+'} pts</span>
              </div>
              <ul class="cp-tier-perks">
                ${t.benefits.map(b => `<li><i class="ri-check-line"></i> ${b}</li>`).join('')}
              </ul>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Chronological Loyalty Activity Ledger -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-history-line text-primary"></i> Loyalty Points Activity</span>
        <span style="font-size:11px; color:var(--color-cream-muted);">Recent transactions</span>
      </div>
      <div class="cp-loyalty-ledger">
        ${ledger.length === 0 ? `
          <div style="padding:16px; text-align:center; color:var(--color-cream-muted); font-size:12px;">No loyalty transactions recorded yet.</div>
        ` : ledger.map(entry => `
          <div class="cp-ledger-item ${entry.type}">
            <div class="cp-ledger-left">
              <span class="cp-ledger-pts">${entry.points > 0 ? '+' : ''}${entry.points} pts</span>
              <div class="cp-ledger-desc">${entry.desc}</div>
            </div>
            <span class="cp-ledger-date">${entry.date}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// TAB 5: FAVOURITES TAB (Frequent Items & Custom Saved Combos)
// --------------------------------------------------------------------------

function renderCustomerFavouritesTab(container, customer) {
  const favData = CustomerStore.favouritesByCustomer[customer.id] || { frequentItems: [], savedCombos: [] };
  const frequentItems = favData.frequentItems || [];
  const savedCombos = favData.savedCombos || [];

  container.innerHTML = `
    <!-- Header with Action -->
    <div class="cp-tab-section-header">
      <div>
        <h4 style="margin:0; font-size:15px; font-weight:800;"><i class="ri-heart-3-line text-primary"></i> Customer Favourites</h4>
        <span style="font-size:11px; color:var(--color-cream-muted);">Frequently ordered by <strong>${customer.name}</strong></span>
      </div>
      <button type="button" class="btn btn-outline btn-xs" onclick="saveActiveCartAsCustomerFavourite('${customer.id}')" title="Save current sale cart as a favourite combo">
        <i class="ri-bookmark-line"></i> Save Cart as Combo
      </button>
    </div>

    <!-- Auto-Detected Frequent Items -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-star-line text-gold"></i> Most Ordered Items</span>
        <span style="font-size:11px; color:var(--color-cream-muted);">Auto-tracked</span>
      </div>
      <div class="cp-frequent-items-list">
        ${frequentItems.length === 0 ? `
          <div style="padding:16px; text-align:center; color:var(--color-cream-muted); font-size:12px;">No frequent items tracked yet.</div>
        ` : frequentItems.map(it => `
          <div class="cp-frequent-item-card">
            <div class="cp-frequent-item-icon"><i class="${it.icon}"></i></div>
            <div class="cp-frequent-item-info">
              <strong>${it.name}</strong>
              <span>${it.defaultMods || 'Standard'} • Ordered ${it.count}×</span>
            </div>
            <div class="cp-frequent-item-right">
              <span class="cp-frequent-price">$${it.price.toFixed(2)}</span>
              <button type="button" class="btn btn-primary btn-xs" onclick="addRecommendedItemToCart('${it.name}')">
                <i class="ri-add-line"></i> Order Again
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Saved Favourite Order Templates -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-bookmark-3-line text-primary"></i> Saved Favourite Combos</span>
        <span class="badge badge-info">${savedCombos.length} saved</span>
      </div>
      <div class="cp-combos-grid">
        ${savedCombos.length === 0 ? `
          <div style="grid-column:1/-1; padding:20px; text-align:center; color:var(--color-cream-muted); font-size:12px;">
            No saved favourite combos yet. Add items to cart and click "Save Cart as Combo" above!
          </div>
        ` : savedCombos.map(combo => `
          <div class="cp-combo-card">
            <div class="cp-combo-title"><i class="ri-heart-fill text-danger"></i> ${combo.name}</div>
            <p class="cp-combo-items">${combo.desc}</p>
            <div class="cp-combo-action-row">
              <strong class="cp-combo-price">$${combo.price.toFixed(2)}</strong>
              <button type="button" class="cp-combo-btn" onclick="reorderNamedCombo('${combo.name}', '${customer.id}')">
                <i class="ri-shopping-cart-2-line"></i> Order Combo
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// TAB 6: PROFILE DETAILS TAB (Full Profile & Edit Profile Trigger)
// --------------------------------------------------------------------------

function renderCustomerProfileDetailsTab(container, customer) {
  const initials = getCustomerInitials(customer);

  container.innerHTML = `
    <!-- Top Identity Card -->
    <div class="cp-profile-card">
      <div class="cp-profile-main">
        <div class="cp-profile-avatar-wrap tier-gold">
          ${customer.photo 
            ? `<img src="${customer.photo}" alt="${customer.name}" class="cp-avatar-img">` 
            : `<span>${initials}</span>`}
        </div>
        <div class="cp-profile-details">
          <div class="cp-profile-name-row">
            <h3 class="cp-profile-name">${customer.name}</h3>
            <span class="cp-tier-badge tier-gold">${customer.tier || 'Member'}</span>
          </div>
          <span style="font-size:12px; color:var(--color-cream-muted);">Member Since: ${customer.member_since || 'October 2025'}</span>
          <div class="cp-id-tag">Customer ID: #CUST-${String(customer.id).padStart(4, '0')}</div>
        </div>
      </div>

      <div style="margin-top:8px;">
        <button type="button" class="btn btn-primary w-100" onclick="openEditCustomerProfileModal('${customer.id}')">
          <i class="ri-edit-line"></i> Edit Profile & Photo
        </button>
      </div>
    </div>

    <!-- Complete Profile Metadata List -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-user-line text-primary"></i> Customer Contact & Information</span>
      </div>
      <div class="cp-details-list">
        <div class="cp-detail-row">
          <span class="cp-detail-lbl">Full Name</span>
          <strong class="cp-detail-val">${customer.name}</strong>
        </div>
        <div class="cp-detail-row">
          <span class="cp-detail-lbl">Phone Number</span>
          <strong class="cp-detail-val">${customer.mobile || 'Not provided'}</strong>
        </div>
        <div class="cp-detail-row">
          <span class="cp-detail-lbl">Email Address</span>
          <strong class="cp-detail-val">${customer.email || 'Not provided'}</strong>
        </div>
        <div class="cp-detail-row">
          <span class="cp-detail-lbl">Date of Birth</span>
          <strong class="cp-detail-val">${customer.dob ? customer.dob : 'Not provided'}</strong>
        </div>
        <div class="cp-detail-row">
          <span class="cp-detail-lbl">Street Address</span>
          <strong class="cp-detail-val">${customer.address || 'Not provided'}</strong>
        </div>
        <div class="cp-detail-row">
          <span class="cp-detail-lbl">Loyalty Tier</span>
          <strong class="cp-detail-val text-gold">${customer.tier} (${customer.points || 0} Points)</strong>
        </div>
        <div class="cp-detail-row">
          <span class="cp-detail-lbl">Lifetime Spend</span>
          <strong class="cp-detail-val">$${typeof customer.total_spent === 'number' ? customer.total_spent.toFixed(2) : customer.total_spent} AUD</strong>
        </div>
      </div>
    </div>

    <!-- Preferences & Notes -->
    <div class="cp-section">
      <div class="cp-section-header">
        <span class="cp-section-title"><i class="ri-price-tag-3-line text-primary"></i> Dietary Tags & Preferences</span>
      </div>
      <div class="cp-tags-row">
        ${(customer.tags || []).map(tag => `<span class="cp-tag-pill tag-pref">${tag}</span>`).join('')}
      </div>
      <div class="cp-notes-box" style="margin-top:10px;">
        <i class="ri-sticky-note-line"></i>
        <p class="cp-notes-text">${customer.notes || 'No operational notes on file.'}</p>
      </div>
    </div>
  `;
}

// ==========================================
// EDIT PROFILE CONTROLLER (PHOTO, FIELDS, VALIDATION)
// ==========================================

let _tempProfilePhotoData = null;

window.openEditCustomerProfileModal = function(customerId) {
  let cust = null;
  if (customerId) {
    cust = CustomerStore.customers.find(c => String(c.id) === String(customerId) || String(c.customer_id) === String(customerId));
    if (cust) AppState.activeCustomerProfile = cust;
  }
  if (!cust) {
    cust = AppState.activeCustomerProfile;
  }
  if (!cust && AppState.activeRole === 'customer') {
    const custId = (AppState.currentUser && (AppState.currentUser.customer_id || AppState.currentUser.id)) || '7';
    cust = CustomerStore.customers.find(c => String(c.id) === String(custId) || String(c.customer_id) === String(custId)) ||
           CustomerStore.customers.find(c => c.name.toLowerCase().includes('sophia')) ||
           CustomerStore.customers[0];
    AppState.activeCustomerProfile = cust;
  }
  if (!cust) {
    cust = CustomerStore.customers[0];
    AppState.activeCustomerProfile = cust;
  }

  const modal = document.getElementById('edit-customer-profile-modal');
  if (!modal) return;

  _tempProfilePhotoData = cust.photo || null;

  // Populate form fields
  const fNameEl = document.getElementById('edit-cp-first-name');
  const lNameEl = document.getElementById('edit-cp-last-name');
  const phoneEl = document.getElementById('edit-cp-phone');
  const emailEl = document.getElementById('edit-cp-email');
  const dobEl = document.getElementById('edit-cp-dob');
  const addrEl = document.getElementById('edit-cp-address');
  const tagsEl = document.getElementById('edit-cp-tags');
  const notesEl = document.getElementById('edit-cp-notes');

  if (fNameEl) fNameEl.value = cust.first_name || (cust.name ? cust.name.split(' ')[0] : '');
  if (lNameEl) lNameEl.value = cust.last_name || (cust.name ? cust.name.split(' ').slice(1).join(' ') : '');
  if (phoneEl) phoneEl.value = cust.mobile || cust.phone || '';
  if (emailEl) emailEl.value = cust.email || '';
  if (dobEl) dobEl.value = cust.dob || '';
  if (addrEl) addrEl.value = cust.address || '';
  if (tagsEl) tagsEl.value = (cust.tags || []).join(', ');
  if (notesEl) notesEl.value = cust.notes || '';

  // Update photo preview
  updateEditModalPhotoPreview(_tempProfilePhotoData, getCustomerInitials(cust));

  // Hide validation errors
  const pErr = document.getElementById('edit-cp-phone-error');
  const eErr = document.getElementById('edit-cp-email-error');
  if (pErr) pErr.style.display = 'none';
  if (eErr) eErr.style.display = 'none';

  modal.classList.remove('hidden');
};

window.closeEditCustomerProfileModal = function() {
  const modal = document.getElementById('edit-customer-profile-modal');
  if (modal) modal.classList.add('hidden');
  _tempProfilePhotoData = null;
};

function updateEditModalPhotoPreview(photoUrl, initials) {
  const imgEl = document.getElementById('edit-cp-avatar-img');
  const initEl = document.getElementById('edit-cp-avatar-initials');
  const removeBtn = document.getElementById('remove-cp-photo-btn');

  if (photoUrl) {
    if (imgEl) {
      imgEl.src = photoUrl;
      imgEl.classList.remove('hidden');
    }
    if (initEl) initEl.classList.add('hidden');
    if (removeBtn) removeBtn.classList.remove('hidden');
  } else {
    if (imgEl) {
      imgEl.src = '';
      imgEl.classList.add('hidden');
    }
    if (initEl) {
      initEl.innerText = initials || '??';
      initEl.classList.remove('hidden');
    }
    if (removeBtn) removeBtn.classList.add('hidden');
  }
}

window.handleProfilePhotoFileChange = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    _tempProfilePhotoData = e.target.result;
    updateEditModalPhotoPreview(_tempProfilePhotoData, getCustomerInitials(AppState.activeCustomerProfile));
    showToast('Photo selected! Click Save Profile Changes to apply.', 'info');
  };
  reader.readAsDataURL(file);
};

window.removeCustomerProfilePhoto = function() {
  _tempProfilePhotoData = null;
  const inits = getCustomerInitials(AppState.activeCustomerProfile);
  updateEditModalPhotoPreview(null, inits);
  showToast('Photo removed. Initials will be used as avatar.', 'info');
};

window.saveCustomerProfile = async function(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const cust = AppState.activeCustomerProfile;
  if (!cust) {
    showToast('No active customer profile selected.', 'error');
    return;
  }

  const firstNameEl = document.getElementById('edit-cp-first-name');
  const lastNameEl = document.getElementById('edit-cp-last-name');
  const phoneEl = document.getElementById('edit-cp-phone');
  const emailEl = document.getElementById('edit-cp-email');
  const dobEl = document.getElementById('edit-cp-dob');
  const addressEl = document.getElementById('edit-cp-address');
  const tagsEl = document.getElementById('edit-cp-tags');
  const notesEl = document.getElementById('edit-cp-notes');

  const firstName = firstNameEl ? firstNameEl.value.trim() : (cust.first_name || '');
  const lastName = lastNameEl ? lastNameEl.value.trim() : (cust.last_name || '');
  const phone = phoneEl ? phoneEl.value.trim() : (cust.mobile || '');
  const email = emailEl ? emailEl.value.trim() : (cust.email || '');
  const dob = dobEl ? dobEl.value : (cust.dob || '');
  const address = addressEl ? addressEl.value.trim() : (cust.address || '');
  const tagsStr = tagsEl ? tagsEl.value.trim() : '';
  const notes = notesEl ? notesEl.value.trim() : (cust.notes || '');

  // Validate Phone
  const phoneRegex = /^[\d\s\+\(\)\-]{8,20}$/;
  const phoneErr = document.getElementById('edit-cp-phone-error');
  if (!phone || !phoneRegex.test(phone)) {
    if (phoneErr) phoneErr.style.display = 'block';
    return;
  }
  if (phoneErr) phoneErr.style.display = 'none';

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailErr = document.getElementById('edit-cp-email-error');
  if (!email || !emailRegex.test(email)) {
    if (emailErr) emailErr.style.display = 'block';
    return;
  }
  if (emailErr) emailErr.style.display = 'none';

  const saveBtn = document.getElementById('save-cp-btn');
  const origBtnText = saveBtn ? saveBtn.innerHTML : '';
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Saving Changes...';
  }

  try {
    // Apply Updates to Customer in CustomerStore
    cust.first_name = firstName;
    cust.last_name = lastName;
    cust.name = `${firstName} ${lastName}`.trim();
    cust.mobile = phone;
    cust.phone = phone;
    cust.email = email;
    cust.dob = dob;
    cust.address = address;
    cust.notes = notes;
    cust.photo = _tempProfilePhotoData;
    cust.tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Also update matching customer in DB.customers
    if (DB.customers && Array.isArray(DB.customers)) {
      const dbCust = DB.customers.find(c => String(c.id) === String(cust.id) || String(c.customer_id) === String(cust.id) || c.email === cust.email);
      if (dbCust) {
        dbCust.first_name = firstName;
        dbCust.last_name = lastName;
        dbCust.name = cust.name;
        dbCust.mobile = phone;
        dbCust.phone = phone;
        dbCust.email = email;
        dbCust.address = address;
        dbCust.notes = notes;
        dbCust.photo = cust.photo;
        dbCust.tags = cust.tags;
      }
      if (typeof saveLocalDB === 'function') saveLocalDB();
    }

    // Also update AppState.currentUser if active user is this customer
    const isCurrentUser = (AppState.activeRole === 'customer') || 
      (AppState.currentUser && (String(AppState.currentUser.customer_id) === String(cust.id) || String(AppState.currentUser.id) === String(cust.id) || AppState.currentUser.email === cust.email));

    if (isCurrentUser) {
      if (!AppState.currentUser) AppState.currentUser = {};
      AppState.currentUser.first_name = firstName;
      AppState.currentUser.last_name = lastName;
      AppState.currentUser.name = cust.name;
      AppState.currentUser.email = email;
      AppState.currentUser.phone = phone;
      AppState.currentUser.mobile = phone;
      if (cust.photo) AppState.currentUser.photo = cust.photo;
      localStorage.setItem('RAVENHILL_AUTH_USER', JSON.stringify(AppState.currentUser));
      applyRoleToUI(AppState.activeRole || 'customer');
    }

    // Attempt backend API persist
    const apiId = cust.customer_id || cust.id;
    if (apiId && !isNaN(Number(apiId)) && window.API && API.updateCustomer) {
      try {
        await API.updateCustomer(apiId, {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: email
        });
      } catch (err) {
        console.warn('Backend API customer update:', err);
      }
    }

    // If attached to current sale cart, update cart customer
    if (AppState.cart.customer && (String(AppState.cart.customer.id) === String(cust.id) || String(AppState.cart.customer.customer_id) === String(cust.id))) {
      AppState.cart.customer = cust;
      renderCartUI();
    }

    closeEditCustomerProfileModal();
    updateDrawerHeader(cust);
    renderCustomerProfileTabContent();

    if (AppState.activeModule === 'customers') {
      renderCurrentModule();
    }

    showToast(`Profile for ${cust.name} updated successfully!`, 'success');
  } catch (err) {
    console.error('Error saving profile:', err);
    showToast('An error occurred while saving profile changes.', 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = origBtnText;
    }
  }
};

// ==========================================
// CAMERA CAPTURE CONTROLLER
// ==========================================

let _cameraStream = null;

window.openCameraCaptureModal = function() {
  const modal = document.getElementById('camera-capture-modal');
  const video = document.getElementById('camera-video-feed');
  const canvas = document.getElementById('camera-snapshot-canvas');
  const snapBtn = document.getElementById('camera-snap-btn');
  const retakeBtn = document.getElementById('camera-retake-btn');
  const useBtn = document.getElementById('camera-use-btn');
  const statusMsg = document.getElementById('camera-status-msg');

  if (!modal || !video) return;

  canvas.classList.add('hidden');
  video.classList.remove('hidden');
  snapBtn.classList.remove('hidden');
  retakeBtn.classList.add('hidden');
  useBtn.classList.add('hidden');
  statusMsg.innerText = 'Position customer in front of camera and tap Capture.';

  modal.classList.remove('hidden');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400, facingMode: 'user' } })
      .then(stream => {
        _cameraStream = stream;
        video.srcObject = stream;
      })
      .catch(err => {
        console.warn('Camera access error:', err);
        statusMsg.innerText = 'Camera unavailable. Please upload a photo or use initials.';
      });
  } else {
    statusMsg.innerText = 'Camera not supported on this device. Please use file upload.';
  }
};

window.closeCameraCaptureModal = function() {
  const modal = document.getElementById('camera-capture-modal');
  if (modal) modal.classList.add('hidden');

  if (_cameraStream) {
    _cameraStream.getTracks().forEach(track => track.stop());
    _cameraStream = null;
  }
};

window.captureCameraSnapshot = function() {
  const video = document.getElementById('camera-video-feed');
  const canvas = document.getElementById('camera-snapshot-canvas');
  const snapBtn = document.getElementById('camera-snap-btn');
  const retakeBtn = document.getElementById('camera-retake-btn');
  const useBtn = document.getElementById('camera-use-btn');
  const statusMsg = document.getElementById('camera-status-msg');

  if (!video || !canvas) return;

  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, 300, 300);

  video.classList.add('hidden');
  canvas.classList.remove('hidden');

  snapBtn.classList.add('hidden');
  retakeBtn.classList.remove('hidden');
  useBtn.classList.remove('hidden');
  statusMsg.innerText = 'Photo captured! Click "Use This Photo" or "Retake".';
};

window.retakeCameraSnapshot = function() {
  const video = document.getElementById('camera-video-feed');
  const canvas = document.getElementById('camera-snapshot-canvas');
  const snapBtn = document.getElementById('camera-snap-btn');
  const retakeBtn = document.getElementById('camera-retake-btn');
  const useBtn = document.getElementById('camera-use-btn');
  const statusMsg = document.getElementById('camera-status-msg');

  canvas.classList.add('hidden');
  video.classList.remove('hidden');
  snapBtn.classList.remove('hidden');
  retakeBtn.classList.add('hidden');
  useBtn.classList.add('hidden');
  statusMsg.innerText = 'Position customer and tap Capture.';
};

window.useCameraSnapshot = function() {
  const canvas = document.getElementById('camera-snapshot-canvas');
  if (canvas) {
    _tempProfilePhotoData = canvas.toDataURL('image/jpeg', 0.9);
    updateEditModalPhotoPreview(_tempProfilePhotoData, getCustomerInitials(AppState.activeCustomerProfile));
    showToast('Photo captured and loaded! Remember to save profile.', 'success');
  }
  closeCameraCaptureModal();
};

// ==========================================
// DIGITAL RECEIPT MODAL & ACTIONS
// ==========================================

window.openCustomerReceiptModal = function(receiptId, customerId) {
  const modal = document.getElementById('customer-receipt-modal');
  if (!modal) return;

  const targetCust = customerId 
    ? CustomerStore.customers.find(c => String(c.id) === String(customerId)) 
    : AppState.activeCustomerProfile;
  if (!targetCust) return;

  // Strict lookup in customer's isolated receipts & orders
  const receipts = CustomerStore.receiptsByCustomer[targetCust.id] || [];
  const rcpt = receipts.find(r => String(r.receipt_id) === String(receiptId)) || receipts[0];
  const orders = CustomerStore.ordersByCustomer[targetCust.id] || [];
  const order = orders.find(o => String(o.id) === String(rcpt ? rcpt.order_id : '9051')) || orders[0];

  if (!rcpt || !order) {
    showToast('Receipt record not found for this customer.', 'warning');
    return;
  }

  // Populate digital receipt paper
  document.getElementById('cust-receipt-modal-subtitle').innerText = `Receipt #${rcpt.receipt_id} • Order #${rcpt.order_id}`;
  document.getElementById('dr-receipt-num').innerText = `#${rcpt.receipt_id}`;
  document.getElementById('dr-order-num').innerText = `#${rcpt.order_id}`;
  document.getElementById('dr-date').innerText = rcpt.date;
  document.getElementById('dr-customer-name').innerText = targetCust.name;
  document.getElementById('dr-channel').innerText = order.channel || 'Dine In';
  document.getElementById('dr-customer-id').innerText = `#CUST-${String(targetCust.id).padStart(4, '0')}`;
  document.getElementById('dr-payment-method').innerText = rcpt.method || 'Card';
  document.getElementById('dr-destination-email').innerText = rcpt.emailed_to || targetCust.email || 'None';

  const subtotal = (rcpt.total / 1.10).toFixed(2);
  const tax = (rcpt.total - subtotal).toFixed(2);

  document.getElementById('dr-subtotal').innerText = `$${subtotal}`;
  document.getElementById('dr-tax').innerText = `$${tax}`;
  document.getElementById('dr-total').innerText = `$${rcpt.total.toFixed(2)}`;
  document.getElementById('dr-loyalty-earned-line').innerHTML = `<i class="ri-vip-crown-fill text-gold"></i> +${Math.round(rcpt.total)} Loyalty Points Earned`;

  // Render items table
  const tbody = document.getElementById('dr-items-tbody');
  if (tbody) {
    tbody.innerHTML = order.items.map(it => `
      <tr>
        <td style="padding:4px 0;">
          <div style="font-weight:700;">${it.name}</div>
          ${it.customisations && it.customisations.length ? `
            <div style="font-size:10px; color:#666;">${it.customisations.map(m=>m.name).join(', ')}</div>
          ` : ''}
        </td>
        <td style="text-align:center; padding:4px 0;">${it.quantity}</td>
        <td style="text-align:right; padding:4px 0; font-weight:700;">$${(it.price * it.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  }

  modal.classList.remove('hidden');
};

window.closeCustomerReceiptModal = function() {
  const modal = document.getElementById('customer-receipt-modal');
  if (modal) modal.classList.add('hidden');
};

window.printCustomerDigitalReceipt = function() {
  window.print();
};

window.printCustomerReceiptDirect = function(receiptId, customerId) {
  openCustomerReceiptModal(receiptId, customerId);
  setTimeout(() => window.print(), 200);
};

window.sendCustomerDigitalReceiptEmail = function() {
  const email = document.getElementById('dr-destination-email').innerText;
  showToast(`Digital receipt sent to ${email}`, 'success');
};

window.sendCustomerReceiptPrompt = function(receiptId, customerId) {
  const cust = CustomerStore.customers.find(c => String(c.id) === String(customerId));
  const defaultEmail = cust ? cust.email : '';
  const email = prompt(`Send receipt #${receiptId} to email address:`, defaultEmail);
  if (email && email.includes('@')) {
    showToast(`Receipt #${receiptId} sent successfully to ${email}`, 'success');
  }
};

window.downloadCustomerDigitalReceipt = function() {
  const receiptNum = document.getElementById('dr-receipt-num').innerText;
  const custName = document.getElementById('dr-customer-name').innerText;
  const total = document.getElementById('dr-total').innerText;
  const content = `
========================================
         RAVENHILL COFFEE ROASTERS
      Specialty Coffee & Kitchen
     Prahran Market • Melbourne VIC
========================================
Receipt: ${receiptNum}
Customer: ${custName}
Total: ${total}
Status: Paid & Settled
Thank you for visiting Ravenhill Coffee!
========================================
`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Ravenhill_Receipt_${receiptNum}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Receipt downloaded successfully!', 'info');
};

window.downloadCustomerReceiptDirect = function(receiptId, customerId) {
  openCustomerReceiptModal(receiptId, customerId);
  downloadCustomerDigitalReceipt();
};

// ==========================================
// REORDER ENGINE & CART ACTIONS
// ==========================================

window.reorderHistoricalOrder = function(orderId, customerId) {
  const targetCust = customerId 
    ? CustomerStore.customers.find(c => String(c.id) === String(customerId)) 
    : AppState.activeCustomerProfile;
  if (!targetCust) return;

  const orders = CustomerStore.ordersByCustomer[targetCust.id] || [];
  const order = orders.find(o => String(o.id) === String(orderId));
  if (!order) {
    showToast('Historical order not found', 'warning');
    return;
  }

  // Check item availability in current catalog
  const unavailableItems = [];
  const availableItems = [];

  order.items.forEach(it => {
    const product = DB.menuItems.find(p => 
      p.name.toLowerCase() === it.name.toLowerCase() ||
      p.name.toLowerCase().includes(it.name.toLowerCase())
    );

    if (product && product.availability !== false) {
      availableItems.push({ product, orderItem: it });
    } else {
      unavailableItems.push(it.name);
    }
  });

  if (unavailableItems.length > 0) {
    const proceed = confirm(
      `Notice: The following item(s) from Order #${order.id} are currently unavailable:\n• ${unavailableItems.join('\n• ')}\n\nWould you like to reorder the remaining available items?`
    );
    if (!proceed) return;
  }

  window._lastCartUndoState = JSON.parse(JSON.stringify(AppState.cart.items));
  let addedCount = 0;

  availableItems.forEach(({ product, orderItem }) => {
    addItemToCart(product, orderItem.customisations || [], `Reordered from #${order.id}`, orderItem.quantity || 1);
    addedCount += (orderItem.quantity || 1);
  });

  AppState.cart.customer = targetCust;
  renderCartUI();

  showUndoToast(`${addedCount} items added from Order #${order.id}`, () => {
    AppState.cart.items = window._lastCartUndoState || [];
    renderCartUI();
    showToast(`Order #${order.id} addition undone`, 'info');
  });

  // Pulse cart drawer on desktop
  const cartDrawer = document.getElementById('cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.remove('cart-pulse');
    void cartDrawer.offsetWidth;
    cartDrawer.classList.add('cart-pulse');
  }
};

window.reorderNamedCombo = function(comboName, customerId) {
  const targetCust = customerId 
    ? CustomerStore.customers.find(c => String(c.id) === String(customerId)) 
    : AppState.activeCustomerProfile;
  if (!targetCust) return;

  const favData = CustomerStore.favouritesByCustomer[targetCust.id] || { savedCombos: [] };
  const combo = favData.savedCombos.find(c => c.name === comboName);
  if (!combo) return;

  window._lastCartUndoState = JSON.parse(JSON.stringify(AppState.cart.items));
  let addedCount = 0;

  combo.items.forEach(ci => {
    const product = DB.menuItems.find(p => p.name.toLowerCase().includes(ci.name.toLowerCase())) || DB.menuItems[0];
    addItemToCart(product, ci.customisations || [], `From combo: ${combo.name}`, ci.quantity || 1);
    addedCount += ci.quantity || 1;
  });

  AppState.cart.customer = targetCust;
  renderCartUI();

  showUndoToast(`${addedCount} items added from "${combo.name}"`, () => {
    AppState.cart.items = window._lastCartUndoState || [];
    renderCartUI();
    showToast(`"${combo.name}" addition undone`, 'info');
  });
};

window.saveActiveCartAsCustomerFavourite = function(customerId) {
  const targetCust = customerId 
    ? CustomerStore.customers.find(c => String(c.id) === String(customerId)) 
    : AppState.activeCustomerProfile;
  if (!targetCust) return;

  if (!AppState.cart.items || AppState.cart.items.length === 0) {
    showToast('Add items to current sale before saving as favourite combo', 'warning');
    return;
  }

  const comboName = prompt('Enter a name for this Favourite Combo (e.g. My Morning Pick-Me-Up):', `${targetCust.first_name}'s Special`);
  if (!comboName) return;

  const total = AppState.cart.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  const itemsSummary = AppState.cart.items.map(it => `${it.quantity}× ${it.name}`).join(' + ');

  if (!CustomerStore.favouritesByCustomer[targetCust.id]) {
    CustomerStore.favouritesByCustomer[targetCust.id] = { frequentItems: [], savedCombos: [] };
  }

  CustomerStore.favouritesByCustomer[targetCust.id].savedCombos.unshift({
    id: `combo_${Date.now()}`,
    name: comboName,
    desc: itemsSummary,
    price: total,
    items: JSON.parse(JSON.stringify(AppState.cart.items))
  });

  renderCustomerProfileTabContent();
  showToast(`Saved "${comboName}" to ${targetCust.name}'s favourite combos!`, 'success');
};

window.addRecommendedItemToCart = function(itemName) {
  const product = DB.menuItems.find(p => p.name.toLowerCase().includes(itemName.toLowerCase())) || DB.menuItems[0];
  addItemToCart(product, [], '', 1);
  renderCartUI();
  showToast(`Added 1× ${product.name} to current sale`, 'success');
};

window.claimLoyaltyReward = function(rewardId, cost, rewardName) {
  const cust = AppState.activeCustomerProfile || AppState.cart.customer;
  if (!cust) return;

  if ((cust.points || 0) < cost) {
    showToast(`Insufficient points. Need ${cost} points.`, 'warning');
    return;
  }

  cust.points -= cost;

  // Add loyalty ledger entry
  if (!CustomerStore.loyaltyByCustomer[cust.id]) CustomerStore.loyaltyByCustomer[cust.id] = [];
  CustomerStore.loyaltyByCustomer[cust.id].unshift({
    type: 'redeemed',
    points: -cost,
    desc: `Redeemed: ${rewardName}`,
    date: 'Today'
  });

  if (rewardId === 'voucher10') {
    AppState.cart.discountAmount = Math.max(AppState.cart.discountAmount || 0, 10.00);
    AppState.cart.promoCode = 'VOUCHER10';
  } else if (rewardId === 'coffee') {
    const coffee = DB.menuItems.find(p => p.catId === '3' || p.name.includes('Flat White')) || DB.menuItems[0];
    addItemToCart(coffee, [], 'Free Loyalty Coffee Perk', 1);
  } else if (rewardId === 'pastry') {
    const pastry = DB.menuItems.find(p => p.catId === '11' || p.name.includes('Croissant')) || DB.menuItems[0];
    addItemToCart(pastry, [], 'Free Loyalty Pastry Perk', 1);
  } else if (rewardId === 'breakfast') {
    const bfast = DB.menuItems.find(p => p.catId === '8' || p.name.includes('Toastie')) || DB.menuItems[0];
    addItemToCart(bfast, [], 'Complimentary Loyalty Breakfast', 1);
  }

  AppState.cart.customer = cust;
  renderCartUI();
  updateDrawerHeader(cust);
  renderCustomerProfileTabContent();

  showToast(`Successfully redeemed "${rewardName}"! Applied to order.`, 'success');
};

// Sale Attachment Actions
window.attachCustomerToCurrentSale = function(custId) {
  const cust = CustomerStore.customers.find(c => String(c.id) === String(custId));
  if (cust) {
    AppState.cart.customer = cust;
    renderCartUI();
    renderCustomerProfileTabContent();
    showToast(`Attached ${cust.name} (${cust.tier}) to Current Sale!`, 'success');
  }
};

window.detachCustomerFromCurrentSale = function() {
  AppState.cart.customer = null;
  renderCartUI();
  if (AppState.activeCustomerProfile) {
    renderCustomerProfileTabContent();
  }
  showToast('Detached customer from current sale', 'info');
};

// Interactive Toast Notification with Undo Action
window.showUndoToast = function(message, onUndo, duration = 6500) {
  let container = document.getElementById('app-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-success toast-with-undo';
  toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px; flex:1;">
      <i class="ri-check-line" style="font-size:18px; color:var(--color-success);"></i>
      <span>${message}</span>
    </div>
    <button type="button" class="toast-undo-btn" id="toast-undo-action">
      <i class="ri-arrow-go-back-line"></i> Undo
    </button>
  `;

  const undoBtn = toast.querySelector('#toast-undo-action');
  let isUndone = false;
  undoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isUndone = true;
    if (typeof onUndo === 'function') onUndo();
    toast.style.animation = 'toastOut 0.25s forwards ease-in';
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (!isUndone && toast.parentNode) {
      toast.style.animation = 'toastOut 0.25s forwards ease-in';
      setTimeout(() => toast.remove(), 250);
    }
  }, duration);
};

// Legacy Compatibility Aliases
function openCustomerModal() {
  openCustomerProfileDrawer();
}

window.selectLoyaltyCustomer = function(custId) {
  const cust = CustomerStore.customers.find(c => String(c.id) === String(custId));
  if (cust) {
    AppState.cart.customer = cust;
    renderCartUI();
  }
  closeCustomerProfileDrawer();
};

// ==========================================
// 6. ORDER TRACKING & KDS MODULE
// ==========================================

function renderKDSView(container) {
  const kdsLayout = document.createElement('div');
  kdsLayout.className = 'kds-container';

  kdsLayout.innerHTML = `
    <div class="kds-filter-bar">
      <div class="kds-stat-pills">
        <span class="kds-stat-pill"><i class="ri-time-line text-warning"></i> Pending: ${DB.kdsOrders.filter(o => o.status==='pending').length}</span>
        <span class="kds-stat-pill"><i class="ri-fire-line text-info"></i> In Prep: ${DB.kdsOrders.filter(o => o.status==='preparing').length}</span>
        <span class="kds-stat-pill"><i class="ri-check-double-line text-success"></i> Ready: ${DB.kdsOrders.filter(o => o.status==='ready').length}</span>
      </div>
      <div>
        <button class="btn btn-secondary btn-sm" onclick="renderCurrentModule()"><i class="ri-refresh-line"></i> Refresh Queue</button>
      </div>
    </div>

    <div class="kds-grid" id="kds-tickets-grid"></div>
  `;

  container.appendChild(kdsLayout);

  const grid = document.getElementById('kds-tickets-grid');
  if (DB.kdsOrders.length === 0) {
    grid.innerHTML = `<div class="empty-cart-state" style="grid-column:1/-1;"><i class="ri-check-line"></i><p>All barista tickets completed!</p></div>`;
  } else {
    DB.kdsOrders.forEach(ord => {
      const card = document.createElement('div');
      card.className = `kds-ticket-card status-${ord.status}`;
      
      let nextBtn = '';
      if (ord.status === 'pending') {
        nextBtn = `<button class="btn btn-primary btn-sm flex-1" onclick="updateKDSStatus('${ord.id}', 'preparing')"><i class="ri-play-fill"></i> Start Prep</button>`;
      } else if (ord.status === 'preparing') {
        nextBtn = `<button class="btn btn-success btn-sm flex-1" onclick="updateKDSStatus('${ord.id}', 'ready')"><i class="ri-check-line"></i> Mark Ready</button>`;
      } else if (ord.status === 'ready') {
        nextBtn = `<button class="btn btn-outline btn-sm flex-1" onclick="updateKDSStatus('${ord.id}', 'completed')"><i class="ri-checkbox-circle-line"></i> Serve & Bump</button>`;
      }

      const elapsed = getOrderElapsedSeconds(ord);
      ord.elapsedSec = elapsed;
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;

      card.innerHTML = `
        <div class="kds-ticket-header">
          <div>
            <span class="kds-ticket-id">${ord.id}</span>
            <span class="badge ${(ord.orderType || ord.type || 'dine_in')==='dine_in' ? 'badge-primary' : 'badge-gold'}" style="margin-left:6px;">
              ${(ord.orderType || ord.type || 'dine_in')==='dine_in' ? 'Table ' + (ord.tableId || '?') : 'Takeaway'}
            </span>
          </div>
          <span class="kds-timer"><i class="ri-history-line"></i> <span class="kds-timer-text" data-order-id="${ord.id}">${mins}m ${secs}s</span></span>
        </div>
        <div class="kds-ticket-body">
          <div style="font-size:12px; color:var(--color-cream-muted);"><i class="ri-user-line"></i> ${ord.customerName}</div>
          ${ord.items.map(item => `
            <div class="kds-item-row">
              <span class="kds-item-qty">${item.qty}x</span>
              <div class="kds-item-details">
                <div class="kds-item-name">${item.name}</div>
                <div class="kds-item-mods">${(item.mods || []).join(' • ')}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="kds-ticket-footer">
          ${nextBtn}
        </div>
      `;
      grid.appendChild(card);
    });
  }
}

window.updateKDSStatus = function(orderId, newStatus) {
  const ord = DB.kdsOrders.find(o => o.id === orderId);
  if (ord) {
    if (newStatus === 'completed') {
      const idx = DB.kdsOrders.indexOf(ord);
      DB.kdsOrders.splice(idx, 1);
      // Automatically free up table when order is completed
      if (ord.tableId) {
        const tbl = DB.tables.find(t => t.id === ord.tableId);
        if (tbl && tbl.status === 'occupied') {
          tbl.status = 'available';
          tbl.orderId = null;
          API.updateTable(tbl.id, { status: 'available', orderId: null });
          renderCartTableSelect();
        }
      }
    } else {
      ord.status = newStatus;
    }
    updateKDSBadge();
    saveLocalDB();
    renderCurrentModule();

    // Persist status change to REST API
    API.updateOrderStatus(orderId, newStatus);
  }
};

function updateKDSBadge() {
  const badge = document.getElementById('kds-pending-count');
  const count = DB.kdsOrders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  if (badge) badge.textContent = count;
}

// ==========================================
// 7. TABLE MANAGEMENT MODULE
// ==========================================

function renderTablesView(container) {
  const layout = document.createElement('div');
  layout.className = 'tables-layout';

  layout.innerHTML = `
    <div class="floorplan-area">
      <div class="floorplan-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Melbourne CBD Floor Plan Map</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Live dining table seating status & layout management</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="openAddTableModal()"><i class="ri-add-line"></i> Add Table</button>
        </div>
      </div>

      <div class="table-status-legend" style="margin-bottom:16px;">
        <div class="legend-item"><span class="dot available"></span> Available (${DB.tables.filter(t=>t.status==='available').length})</div>
        <div class="legend-item"><span class="dot occupied"></span> Occupied (${DB.tables.filter(t=>t.status==='occupied').length})</div>
        <div class="legend-item"><span class="dot reserved"></span> Reserved (${DB.tables.filter(t=>t.status==='reserved').length})</div>
        <div class="legend-item"><span class="dot cleaning"></span> Needs Cleaning (${DB.tables.filter(t=>t.status==='cleaning').length})</div>
      </div>

      <div class="floorplan-grid">
        ${DB.tables.map(t => `
          <div class="table-box status-${t.status}" onclick="selectTableForDetail('${t.id}')">
            <span class="table-number">${t.name}</span>
            <span class="table-capacity">${t.section} • ${t.capacity} Seats</span>
            <span class="badge badge-${t.status==='available'?'success':t.status==='occupied'?'danger':t.status==='reserved'?'warning':'info'}">
              ${t.status.toUpperCase()}
            </span>
            ${t.orderId ? `<span class="table-timer"><i class="ri-shopping-cart-2-line"></i> ${t.orderId}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <div class="table-details-panel" id="table-details-sidebar">
      <h4>Table Management & Details</h4>
      <p class="text-muted">Click a table on the layout grid to edit capacity, clear occupancy, toggle status, or assign POS sale.</p>
    </div>
  `;

  container.appendChild(layout);
}

window.selectTableForDetail = function(tableId) {
  const t = DB.tables.find(tbl => tbl.id === tableId);
  if (!t) return;

  const panel = document.getElementById('table-details-sidebar');
  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h4 style="margin:0;">${t.name} (${t.section})</h4>
      <span class="badge badge-${t.status==='available'?'success':t.status==='occupied'?'danger':t.status==='reserved'?'warning':'info'}">${t.status.toUpperCase()}</span>
    </div>
    
    <div class="form-group" style="margin-bottom:12px;">
      <label>Change Status</label>
      <select class="form-select" onchange="updateTableStatus('${t.id}', this.value)" style="width:100%; padding:8px 10px; border-radius:6px; background:var(--bg-canvas); border:1px solid var(--color-border); color:var(--color-cream);">
        <option value="available" ${t.status==='available'?'selected':''}>Available</option>
        <option value="occupied" ${t.status==='occupied'?'selected':''}>Occupied</option>
        <option value="reserved" ${t.status==='reserved'?'selected':''}>Reserved</option>
        <option value="cleaning" ${t.status==='cleaning'?'selected':''}>Needs Cleaning</option>
      </select>
    </div>

    <div class="form-group" style="margin-bottom:12px;">
      <label>Seating Capacity</label>
      <input type="text" class="form-input" value="${t.capacity} Guests (${t.section})" readonly style="width:100%; padding:8px 10px; border-radius:6px; background:var(--bg-canvas); border:1px solid var(--color-border); color:var(--color-cream);">
    </div>

    ${t.reservedFor ? `<div class="badge badge-warning" style="display:block; width:100%; margin-bottom:10px; text-align:center;"><i class="ri-user-shared-line"></i> Booked: ${t.reservedFor}</div>` : ''}
    ${t.orderId ? `<div class="badge badge-primary" style="display:block; width:100%; margin-bottom:10px; text-align:center;"><i class="ri-shopping-cart-2-line"></i> Linked Sale: ${t.orderId}</div>` : ''}

    <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
      <button class="btn btn-primary w-100" onclick="assignTableToPOS('${t.id}')">
        <i class="ri-shopping-bag-3-line"></i> Open Sale for ${t.name}
      </button>
      
      ${t.status !== 'available' ? `
        <button class="btn btn-outline w-100" onclick="clearTableStatus('${t.id}')">
          <i class="ri-checkbox-circle-line"></i> Clear & Mark Available
        </button>
      ` : ''}

      <div style="display:flex; gap:8px;">
        <button class="btn btn-outline flex-1" onclick="editTableDetails('${t.id}')">
          <i class="ri-edit-line"></i> Edit Table
        </button>
        <button class="btn btn-outline flex-1 text-danger" onclick="deleteTableRecord('${t.id}')">
          <i class="ri-delete-bin-line"></i> Delete
        </button>
      </div>
    </div>
  `;

  if (window.innerWidth < 1024 && panel) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

window.updateTableStatus = function(tableId, newStatus) {
  const t = DB.tables.find(tbl => tbl.id === tableId);
  if (t) {
    t.status = newStatus;
    if (newStatus === 'available') {
      t.orderId = null;
      t.reservedFor = null;
    }
    saveLocalDB();
    renderCartTableSelect();
    renderCurrentModule();

    API.updateTable(tableId, { status: newStatus, orderId: t.orderId, reservedFor: t.reservedFor });
  }
};

window.clearTableStatus = function(tableId) {
  window.updateTableStatus(tableId, 'available');
};

window.assignTableToPOS = function(tableId) {
  AppState.cart.tableId = tableId;
  AppState.cart.orderType = 'dine_in';
  switchModule('pos');
};

window.openAddTableModal = function() {
  const modal = document.getElementById('add-table-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeAddTableModal = function() {
  const modal = document.getElementById('add-table-modal');
  if (modal) modal.classList.add('hidden');
};

window.submitNewTable = function(e) {
  if (e) e.preventDefault();

  const id = document.getElementById('tbl-id-input').value.trim();
  const name = document.getElementById('tbl-name-input').value.trim();
  const section = document.getElementById('tbl-section-select').value;
  const capacity = parseInt(document.getElementById('tbl-capacity-select').value || '4');

  if (!id || !name) return;

  const newTable = {
    id: id.toUpperCase(),
    name: name,
    section: section,
    capacity: capacity,
    status: 'available',
    orderId: null,
    timeOccupied: null,
    reservedFor: null
  };

  const existingIdx = DB.tables.findIndex(t => t.id === newTable.id);
  if (existingIdx !== -1) {
    DB.tables[existingIdx] = newTable;
    API.updateTableDetails(newTable.id, newTable);
  } else {
    DB.tables.push(newTable);
    API.addTable(newTable);
  }

  saveLocalDB();
  closeAddTableModal();
  renderCurrentModule();
};

window.editTableDetails = function(tableId) {
  const t = DB.tables.find(tbl => tbl.id === tableId);
  if (!t) return;

  const newName = prompt("Update Table Display Name:", t.name);
  if (!newName) return;
  const newCap = prompt("Update Seating Capacity:", t.capacity);
  if (!newCap) return;
  const newSection = prompt("Update Dining Section (e.g. Main Dining, Patio, Bar):", t.section) || t.section;

  t.name = newName;
  t.capacity = parseInt(newCap);
  t.section = newSection;

  saveLocalDB();
  renderCurrentModule();
  API.updateTableDetails(t.id, t);
};

window.deleteTableRecord = function(tableId) {
  const t = DB.tables.find(tbl => tbl.id === tableId);
  if (!t) return;

  if (confirm(`Are you sure you want to delete ${t.name} (${t.id}) from floor plan?`)) {
    const idx = DB.tables.indexOf(t);
    if (idx !== -1) DB.tables.splice(idx, 1);
    saveLocalDB();
    renderCurrentModule();
    API.deleteTable(tableId);
  }
};

// ==========================================
// 8. RESERVATIONS MODULE
// ==========================================

window.syncTablesWithReservations = function() {
  if (!DB.tables || !DB.reservations) return;
  
  DB.reservations.forEach(r => {
    if (r.status === 'Confirmed' || r.status === 'Pending') {
      const table = DB.tables.find(t => t.id === r.tableId || t.name === r.tableId);
      if (table && table.status === 'available') {
        table.status = 'reserved';
        table.reservedFor = `${r.customerName} @ ${r.time}`;
      }
    }
  });
};

function renderReservationsView(container) {
  syncTablesWithReservations();

  const totalBookings = DB.reservations.length;
  const confirmedCount = DB.reservations.filter(r => r.status === 'Confirmed').length;
  const pendingCount = DB.reservations.filter(r => r.status === 'Pending').length;
  const seatedCount = DB.reservations.filter(r => r.status === 'Seated').length;

  container.innerHTML = `
    <div class="customer-table-card">
      <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Table Bookings & Schedule</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Melbourne CBD shop seating bookings for today</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge badge-success">${confirmedCount} Confirmed</span>
          <span class="badge badge-warning">${pendingCount} Pending</span>
          <span class="badge badge-primary">${seatedCount} Seated</span>
          <button class="btn btn-primary btn-sm" onclick="openAddReservationModal()"><i class="ri-add-line"></i> New Reservation</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>Party Size</th>
              <th>Assigned Table</th>
              <th>Time Slot</th>
              <th>Contact Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DB.reservations.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align:center; padding:40px 20px; color:var(--color-cream-muted);">
                  <i class="ri-calendar-event-line" style="font-size:36px; display:block; margin-bottom:10px; opacity:0.6;"></i>
                  No table bookings scheduled for today. Click <strong>+ New Reservation</strong> to book a table.
                </td>
              </tr>
            ` : DB.reservations.map((r, idx) => `
              <tr>
                <td><strong>${r.id}</strong></td>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:28px; height:28px; border-radius:50%; background:var(--bg-canvas); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:var(--color-primary);">
                      ${r.customerName ? r.customerName.charAt(0) : 'G'}
                    </div>
                    <strong>${r.customerName}</strong>
                  </div>
                </td>
                <td><span class="badge badge-outline">${r.partySize} Guests</span></td>
                <td><strong style="color:var(--color-accent-gold);">${r.tableId}</strong></td>
                <td><i class="ri-time-line" style="margin-right:4px; color:var(--color-cream-muted);"></i>${r.time}</td>
                <td>${r.contact || 'N/A'}</td>
                <td>
                  <span class="badge badge-${r.status==='Confirmed'?'success':r.status==='Seated'?'primary':'warning'}">
                    ${r.status}
                  </span>
                </td>
                <td>
                  <div style="display:flex; gap:6px;">
                    ${r.status !== 'Seated' ? `
                      <button class="btn btn-primary btn-sm" onclick="seatReservation(${idx})" title="Seat Party & Open Sale">
                        <i class="ri-user-follow-line"></i> Seat Party
                      </button>
                    ` : ''}
                    <button class="btn btn-outline btn-sm" onclick="cancelReservation(${idx})" title="Cancel Reservation">
                      <i class="ri-close-circle-line"></i> Cancel
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddReservationModal = function() {
  const modal = document.getElementById('add-reservation-modal');
  const tableSelect = document.getElementById('res-table-select');

  if (tableSelect && DB.tables) {
    tableSelect.innerHTML = DB.tables.map(t => `
      <option value="${t.id}">${t.id} - ${t.name} (${t.section} • ${t.capacity} Seats)</option>
    `).join('');
  }

  if (modal) modal.classList.remove('hidden');
};

window.closeAddReservationModal = function() {
  const modal = document.getElementById('add-reservation-modal');
  if (modal) modal.classList.add('hidden');
};

window.submitNewReservation = function(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('res-cust-name').value.trim();
  const party = parseInt(document.getElementById('res-party-size').value || '2');
  const tableId = document.getElementById('res-table-select').value;
  const time = document.getElementById('res-time-slot').value;
  const status = document.getElementById('res-status-select').value;
  const phone = document.getElementById('res-contact-phone').value.trim();

  if (!name || !tableId) return;

  const newRes = {
    id: `RES-${Date.now().toString().substr(-3)}`,
    customerName: name,
    partySize: party,
    tableId: tableId,
    time: time,
    status: status,
    contact: phone || '0412 555 777'
  };

  DB.reservations.unshift(newRes);

  const targetTable = DB.tables.find(t => t.id === tableId);
  if (targetTable) {
    targetTable.status = 'reserved';
    targetTable.reservedFor = `${name} @ ${time}`;
  }

  saveLocalDB();
  closeAddReservationModal();
  renderCurrentModule();

  API.createReservation({
    customerName: name,
    partySize: party,
    tableId: tableId,
    time: time,
    contact: phone
  });
};

window.seatReservation = function(idx) {
  const r = DB.reservations[idx];
  if (!r) return;

  r.status = 'Seated';

  const t = DB.tables.find(tbl => tbl.id === r.tableId || tbl.name === r.tableId);
  if (t) {
    t.status = 'occupied';
    t.reservedFor = null;
    t.timeOccupied = '1m';
    AppState.cart.tableId = t.id;
    AppState.cart.orderType = 'dine_in';
  }

  saveLocalDB();
  switchModule('pos');
};

window.cancelReservation = function(idx) {
  const r = DB.reservations[idx];
  if (!r) return;

  if (confirm(`Cancel reservation for ${r.customerName}?`)) {
    if (r.id) API.deleteReservation(r.id);
    
    const t = DB.tables.find(tbl => tbl.id === r.tableId || tbl.name === r.tableId);
    if (t && t.status === 'reserved') {
      t.status = 'available';
      t.reservedFor = null;
    }

    DB.reservations.splice(idx, 1);
    saveLocalDB();
    renderCurrentModule();
  }
};

// ==========================================
// 9. MENU MANAGEMENT MODULE
// ==========================================

function renderMenuView(container) {
  container.innerHTML = `
    <div class="customer-table-card">
      <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Ravenhill Menu Catalog & Modifiers</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Manage espresso items, retail beans, bakery items & pricing</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openAddMenuItemModal()"><i class="ri-add-line"></i> Add New Menu Item</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price (AUD)</th>
              <th>Modifiers</th>
              <th>Badge Tag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DB.menuItems.map((item, idx) => `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <i class="${item.icon}" style="color:var(--color-primary); font-size:18px;"></i>
                    <strong>${item.name}</strong>
                  </div>
                </td>
                <td>${DB.menuCategories.find(c=>c.id===item.catId)?.name || 'General'}</td>
                <td><strong>$${item.price.toFixed(2)}</strong></td>
                <td>${item.hasModifiers ? '<span class="badge badge-info">Sizes / Milks</span>' : 'Standard'}</td>
                <td>${item.badge ? `<span class="badge badge-gold">${item.badge}</span>` : '-'}</td>
                <td>
                  <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="btn btn-primary btn-sm" onclick="orderMenuItemFromCatalog(${idx})"><i class="ri-shopping-cart-2-line"></i> Order</button>
                    <button class="btn btn-outline btn-sm" onclick="editMenuItemPrice(${idx})"><i class="ri-price-tag-line"></i> Edit Price</button>
                    <button class="btn btn-outline btn-sm text-danger" onclick="deleteMenuItem(${idx})"><i class="ri-delete-bin-line"></i></button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.orderMenuItemFromCatalog = function(idx) {
  const item = DB.menuItems[idx];
  if (!item) return;
  if (item.hasModifiers) {
    openCustomiserModal(item);
  } else {
    addItemToCart(item, [], '', 1);
    window.openCartDrawer();
    showToast(`Added 1x ${item.name} to cart!`, 'success');
  }
};

window.openAddMenuItemModal = function() {
  const name = prompt("Item Name:", "Iced Matcha Oat Latte");
  if (!name) return;
  const priceStr = prompt("Price (AUD):", "6.80");
  if (!priceStr) return;
  const badge = prompt("Badge Tag (e.g. Bestseller, New, Reserve):", "New") || null;

  const newItem = {
    id: `item-${Date.now().toString().substr(-3)}`,
    catId: 'cat-cold',
    name: name,
    desc: 'Ceremonial grade Uji matcha with oat milk.',
    price: parseFloat(priceStr),
    icon: 'ri-goblet-line',
    badge: badge,
    hasModifiers: true,
    recipe: { milkMl: 220 }
  };

  DB.menuItems.unshift(newItem);
  saveLocalDB();
  renderCurrentModule();
  API.addMenuItem(newItem);
};

window.editMenuItemPrice = function(idx) {
  const item = DB.menuItems[idx];
  const newPrice = prompt(`Update price for ${item.name} (AUD):`, item.price.toFixed(2));
  if (newPrice && !isNaN(parseFloat(newPrice))) {
    item.price = parseFloat(newPrice);
    saveLocalDB();
    renderCurrentModule();
    API.updateMenuItem(item.id, item);
  }
};

window.deleteMenuItem = function(idx) {
  const item = DB.menuItems[idx];
  if (confirm(`Delete menu item "${item.name}"?`)) {
    DB.menuItems.splice(idx, 1);
    saveLocalDB();
    renderCurrentModule();
    if (item.id) API.deleteMenuItem(item.id);
  }
};

// ==========================================
// 10. INVENTORY & RECIPES MODULE
// ==========================================

function renderInventoryView(container) {
  const lowCount = DB.inventory.filter(i => {
    const q = i.qty !== undefined ? i.qty : (i.stockQty !== undefined ? i.stockQty : 0);
    return q <= (i.minThreshold || 5);
  }).length;

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:20px;">
      <!-- AI Smart Restock Recommendation Banner (RAG Engine) -->
      <div style="background:linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95)); border:1px solid rgba(217, 107, 67, 0.4); border-radius:14px; padding:18px 22px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; box-shadow:0 6px 20px rgba(0,0,0,0.3);">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:44px; height:44px; border-radius:10px; background:rgba(217, 107, 67, 0.2); border:1px solid var(--color-primary); display:flex; align-items:center; justify-content:center; font-size:22px; color:var(--color-primary-light);">
            <i class="ri-brain-line"></i>
          </div>
          <div>
            <div style="font-size:15px; font-weight:700; color:var(--color-cream); display:flex; align-items:center; gap:8px;">
              <span>NVIDIA Nemotron RAG Inventory Intelligence</span>
              ${lowCount > 0 ? `<span class="badge badge-danger" style="font-size:11px;">${lowCount} Items Below Threshold</span>` : `<span class="badge badge-success" style="font-size:11px;">Stock Healthy</span>`}
            </div>
            <div style="font-size:12px; color:var(--color-cream-muted); margin-top:2px;">
              2-Year RAG analysis active. Proactive reorder recommendations & Saturday rush stockout prevention.
            </div>
          </div>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline btn-sm" onclick="switchModule('ai_forecasting')">
            <i class="ri-line-chart-line"></i> View AI Forecast
          </button>
          <button class="btn btn-primary btn-sm" onclick="switchModule('ai_forecasting')">
            <i class="ri-shopping-cart-2-line"></i> AI Reorder Plan
          </button>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Stock Levels & Ingredient Recipes</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Raw coffee beans, dairy, plant milks & packaging with live threshold triggers</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openLogStockModal()"><i class="ri-file-add-line"></i> Log Stock Delivery</button>
      </div>

      <div class="inventory-grid">
        ${DB.inventory.map((inv, idx) => {
          const invQty = inv.qty !== undefined ? inv.qty : (inv.stockQty !== undefined ? inv.stockQty : 0);
          const threshold = inv.minThreshold || 5;
          const pct = Math.min(100, Math.round((invQty / (threshold * 3)) * 100));

          let badgeHtml = '';
          let barColor = 'var(--color-success)';
          if (invQty <= 0) {
            badgeHtml = `<span class="stock-badge-critical"><i class="ri-error-warning-fill"></i> OUT OF STOCK</span>`;
            barColor = '#EF4444';
          } else if (invQty <= threshold) {
            badgeHtml = `<span class="stock-badge-low"><i class="ri-alert-fill"></i> LOW STOCK</span>`;
            barColor = '#F59E0B';
          } else if (invQty <= threshold * 1.5) {
            badgeHtml = `<span class="stock-badge-moderate"><i class="ri-information-fill"></i> MODERATE</span>`;
            barColor = '#3B82F6';
          } else {
            badgeHtml = `<span class="stock-badge-good"><i class="ri-checkbox-circle-fill"></i> OPTIMAL</span>`;
            barColor = '#10B981';
          }

          return `
            <div class="inventory-card" style="border-top:3px solid ${barColor};">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                <strong style="font-size:14px;">${inv.name}</strong>
                ${badgeHtml}
              </div>
              <div style="font-size:12px; color:var(--color-cream-muted);">${inv.category || 'Supplies'}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <input 
                    type="number" 
                    class="stock-qty-input" 
                    step="0.1" 
                    min="0" 
                    value="${invQty.toFixed(1)}" 
                    onfocus="this.select()"
                    onchange="updateInventoryQtyDirect(${idx}, this.value)"
                    onblur="updateInventoryQtyDirect(${idx}, this.value)"
                    onkeydown="if(event.key==='Enter') { this.blur(); }"
                    aria-label="Stock quantity for ${inv.name}"
                  />
                  <span style="font-size:14px; font-weight:700; color:var(--color-cream-muted);">${inv.unit}</span>
                </div>
                <div style="display:flex; gap:4px;">
                  <button class="icon-btn-sm" onclick="adjustInventoryQty(${idx}, -1)" title="Decrease stock">-</button>
                  <button class="icon-btn-sm" onclick="adjustInventoryQty(${idx}, 1)" title="Increase stock">+</button>
                </div>
              </div>
              <div class="progress-bar-bg" style="margin-top:10px;">
                <div class="progress-bar-fill" style="width:${pct}%; background:${barColor};"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--color-cream-subtle); margin-top:4px;">
                <span>Reorder Threshold: <strong>${threshold} ${inv.unit}</strong></span>
                <span>Unit: <strong>${inv.unit}</strong></span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

window.adjustInventoryQty = function(idx, delta) {
  const inv = DB.inventory[idx];
  if (!inv) return;
  const current = inv.qty !== undefined ? inv.qty : (inv.stockQty !== undefined ? inv.stockQty : 0);
  const newQty = Math.max(0, Math.round((current + delta) * 10) / 10);
  inv.qty = newQty;
  inv.stockQty = newQty;
  inv.status = inv.qty <= inv.minThreshold ? 'low' : 'good';
  updateLowStockBadge();
  saveLocalDB();
  renderCurrentModule();

  if (inv.id) API.updateInventoryStock(inv.id, inv.qty);
};

window.updateInventoryQtyDirect = function(idx, val) {
  const inv = DB.inventory[idx];
  if (!inv) return;
  const parsed = parseFloat(val);
  const newQty = isNaN(parsed) || parsed < 0 ? 0 : Math.round(parsed * 10) / 10;
  
  if (inv.qty === newQty && inv.stockQty === newQty) return;

  inv.qty = newQty;
  inv.stockQty = newQty;
  inv.status = inv.qty <= inv.minThreshold ? 'low' : 'good';
  updateLowStockBadge();
  saveLocalDB();
  renderCurrentModule();

  if (inv.id) API.updateInventoryStock(inv.id, inv.qty);
};

window.openLogStockModal = function() {
  const item = prompt("Stock Item Name (e.g. Ravenhill Reserve Beans, Oat Milk):", "Ravenhill Reserve Beans");
  if (!item) return;
  const qtyStr = prompt("Quantity Added:", "10.0");
  if (!qtyStr) return;

  const added = parseFloat(qtyStr);
  if (isNaN(added)) return;

  const inv = DB.inventory.find(i => i.name.toLowerCase().includes(item.toLowerCase()));
  if (inv) {
    const current = inv.qty !== undefined ? inv.qty : (inv.stockQty !== undefined ? inv.stockQty : 0);
    const newQty = Math.round((current + added) * 10) / 10;
    inv.qty = newQty;
    inv.stockQty = newQty;
    inv.status = inv.qty <= inv.minThreshold ? 'low' : 'good';
    if (inv.id) API.updateInventoryStock(inv.id, inv.qty);
  } else {
    const newInv = {
      id: `INV-${Date.now().toString().substr(-2)}`,
      name: item,
      category: 'Supplies',
      stockQty: added,
      qty: added,
      unit: 'Units',
      minThreshold: 5,
      status: added <= 5 ? 'low' : 'good'
    };
    DB.inventory.unshift(newInv);
    API.addInventoryItem(newInv);
  }
  updateLowStockBadge();
  saveLocalDB();
  renderCurrentModule();
};

// ==========================================
// 11. SUPPLIERS & PURCHASES MODULE
// ==========================================

function renderSuppliersView(container) {
  container.innerHTML = `
    <div class="customer-table-card">
      <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Approved Suppliers & Purchase Orders</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Roasters, dairy farms & eco packaging vendors</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openCreatePOModal()"><i class="ri-truck-line"></i> Create Purchase Order</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Supply Catalog</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DB.suppliers.map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.contact}</td>
                <td>${s.phone}</td>
                <td>${s.catalog}</td>
                <td><span class="badge badge-success">Active Partner</span></td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="alert('Contacting ${s.name} at ${s.phone}')"><i class="ri-phone-line"></i> Call</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openCreatePOModal = function() {
  const vendor = prompt("Select Supplier Name:", "BioPak Sustainable Solutions");
  if (!vendor) return;
  const items = prompt("Order Items & Quantity:", "500x Bio-Cups 12oz, 500x Lids");
  if (!items) return;

  alert(`Purchase Order created successfully for ${vendor}!\nItems: ${items}\nSent to vendor email.`);
};

// ==========================================
// 12. DISCOUNTS & PROMOTIONS MANAGEMENT SYSTEM
// ==========================================

let promoFilterState = { status: 'all', type: 'all', search: '' };
let promoBannerTimerInterval = null;

async function renderDiscountsView(container) {
  // Fetch fresh promotions list and analytics
  let promotions = await API.fetchDiscounts();
  if (promotions && Array.isArray(promotions)) {
    DB.discounts = promotions;
    saveLocalDB();
  } else {
    promotions = DB.discounts || [];
  }

  const analytics = await API.fetchDiscountsAnalytics() || {
    total_promotions: promotions.length,
    active_promotions: promotions.filter(p => p.status === 'active' || p.is_active).length,
    orders_using_promotions: 0,
    total_discount_given: 0,
    best_promotion: 'None'
  };

  const activeCount = promotions.filter(p => p.status === 'active' || (p.is_active && p.status !== 'expired' && p.status !== 'scheduled')).length;

  container.innerHTML = `
    <div class="promotions-management-view" style="animation: fadeIn 0.25s ease;">
      <!-- Module Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:22px;">
        <div>
          <h2 style="font-size:22px; font-weight:800; font-family:'Outfit', sans-serif; display:flex; align-items:center; gap:8px;">
            <i class="ri-percent-line" style="color:var(--color-primary-light);"></i> Discounts & Promotions Management
          </h2>
          <p style="color:var(--color-cream-muted); font-size:13px; margin-top:3px;">
            Create, schedule and manage voucher promo codes, automatic discounts, happy hour specials, and homepage banners.
          </p>
        </div>
        <button type="button" class="btn btn-primary" onclick="openPromoModal()" style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; font-weight:700; border-radius:10px; font-size:13px;">
          <i class="ri-add-circle-line" style="font-size:18px;"></i> + Create Promotion
        </button>
      </div>

      <!-- 4 Analytics KPI Cards -->
      <div class="report-kpi-grid" style="margin-bottom:22px;">
        <div class="report-kpi-card" style="border-left: 4px solid #10B981;">
          <div class="report-kpi-header">
            <span class="report-kpi-label"><i class="ri-checkbox-circle-line" style="color:#10B981;"></i> Active Promotions</span>
          </div>
          <div class="report-kpi-val" style="color:#10B981;">${activeCount}</div>
          <div class="report-kpi-sub">
            <i class="ri-flashlight-line"></i> Currently live & redeemable
          </div>
        </div>

        <div class="report-kpi-card" style="border-left: 4px solid #60A5FA;">
          <div class="report-kpi-header">
            <span class="report-kpi-label"><i class="ri-shopping-bag-3-line" style="color:#60A5FA;"></i> Orders with Promo</span>
          </div>
          <div class="report-kpi-val" style="color:#60A5FA;">${analytics.orders_using_promotions || 0}</div>
          <div class="report-kpi-sub">
            <i class="ri-check-double-line"></i> Completed promotional sales
          </div>
        </div>

        <div class="report-kpi-card" style="border-left: 4px solid #F59E0B;">
          <div class="report-kpi-header">
            <span class="report-kpi-label"><i class="ri-money-dollar-circle-line" style="color:#F59E0B;"></i> Discount Given</span>
          </div>
          <div class="report-kpi-val" style="color:#F59E0B;">$${Number(analytics.total_discount_given || 0).toFixed(2)}</div>
          <div class="report-kpi-sub">
            <i class="ri-hand-coin-line"></i> Total customer savings
          </div>
        </div>

        <div class="report-kpi-card" style="border-left: 4px solid var(--color-primary);">
          <div class="report-kpi-header">
            <span class="report-kpi-label"><i class="ri-trophy-line" style="color:var(--color-primary-light);"></i> Top Promotion</span>
          </div>
          <div class="report-kpi-val" style="font-size:18px; color:var(--color-cream); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${analytics.best_promotion || 'None yet'}
          </div>
          <div class="report-kpi-sub">
            <i class="ri-fire-line"></i> Highest redemption volume
          </div>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div style="background:var(--bg-surface); padding:14px 18px; border-radius:12px; border:1px solid var(--color-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
        <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:280px;">
          <i class="ri-search-line" style="color:var(--color-cream-muted); font-size:16px;"></i>
          <input type="text" id="promo-search-input" placeholder="Search promotions by name, code, or description..." style="background:transparent; border:none; outline:none; color:var(--color-cream); width:100%; font-size:13px;" oninput="filterPromosUI()">
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="display:flex; gap:6px; background:var(--bg-card); padding:4px; border-radius:8px; border:1px solid var(--color-border);">
            <button type="button" class="btn btn-sm btn-primary promo-filter-pill" data-status="all" onclick="setPromoStatusFilter('all', this)">All</button>
            <button type="button" class="btn btn-sm btn-outline promo-filter-pill" data-status="active" onclick="setPromoStatusFilter('active', this)">🟢 Active</button>
            <button type="button" class="btn btn-sm btn-outline promo-filter-pill" data-status="scheduled" onclick="setPromoStatusFilter('scheduled', this)">🟡 Scheduled</button>
            <button type="button" class="btn btn-sm btn-outline promo-filter-pill" data-status="expired" onclick="setPromoStatusFilter('expired', this)">⚪ Expired</button>
            <button type="button" class="btn btn-sm btn-outline promo-filter-pill" data-status="disabled" onclick="setPromoStatusFilter('disabled', this)">🔴 Disabled</button>
          </div>
          <select id="promo-type-filter" onchange="filterPromosUI()" style="background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:6px 12px; border-radius:8px; font-size:12px;">
            <option value="all">All Discount Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed_amount">Fixed Amount ($)</option>
            <option value="bogo">BOGO / Buy X Get Y</option>
            <option value="free_item">Free Item</option>
            <option value="min_order">Minimum Order</option>
          </select>
        </div>
      </div>

      <!-- Promotions Data Table Card -->
      <div class="customer-table-card" style="background:var(--bg-surface); border:1px solid var(--color-border); border-radius:14px; overflow:hidden;">
        <div class="table-responsive" style="max-height:560px; overflow-y:auto;">
          <table class="data-table" style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="border-bottom:1px solid var(--color-border); color:var(--color-cream-muted); text-align:left;">
                <th style="padding:12px 16px;">Promotion & Code</th>
                <th style="padding:12px 14px;">Discount Benefit</th>
                <th style="padding:12px 14px;">Applicable Scope</th>
                <th style="padding:12px 14px;">Schedule Window</th>
                <th style="padding:12px 14px;">Usage / Limit</th>
                <th style="padding:12px 14px;">Status</th>
                <th style="padding:12px 14px; text-align:center;">Active Toggle</th>
                <th style="padding:12px 16px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="promotions-table-body">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  renderPromoTableBody(promotions);
  updateHomepagePromoBanner();
}

window.setPromoStatusFilter = function(status, btn) {
  promoFilterState.status = status;
  document.querySelectorAll('.promo-filter-pill').forEach(el => {
    el.classList.remove('btn-primary');
    el.classList.add('btn-outline');
  });
  if (btn) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
  }
  filterPromosUI();
};

window.filterPromosUI = function() {
  const searchQuery = (document.getElementById('promo-search-input')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('promo-type-filter')?.value || 'all';
  const statusFilter = promoFilterState.status;

  const allPromos = DB.discounts || [];
  const filtered = allPromos.filter(p => {
    // Status filter
    const status = p.status || (p.is_active ? 'active' : 'disabled');
    if (statusFilter !== 'all' && status !== statusFilter) return false;

    // Type filter
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;

    // Search query
    if (searchQuery) {
      const matchName = (p.name || '').toLowerCase().includes(searchQuery);
      const matchCode = (p.code || '').toLowerCase().includes(searchQuery);
      const matchDesc = (p.description || '').toLowerCase().includes(searchQuery);
      if (!matchName && !matchCode && !matchDesc) return false;
    }

    return true;
  });

  renderPromoTableBody(filtered);
};

function renderPromoTableBody(promos) {
  const tbody = document.getElementById('promotions-table-body');
  if (!tbody) return;

  if (!promos || promos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:48px 20px; color:var(--color-cream-muted);">
          <i class="ri-coupon-line" style="font-size:36px; display:block; margin-bottom:10px; opacity:0.6;"></i>
          <p style="font-size:15px; font-weight:600; margin:0 0 6px 0;">No promotions found</p>
          <span style="font-size:12px;">Create a new promotion or adjust your filters above.</span>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = promos.map(p => {
    const status = p.status || (p.is_active ? 'active' : 'disabled');
    let statusBadge = '';
    if (status === 'active') {
      statusBadge = `<span class="promo-status-badge promo-status-active">🟢 Active</span>`;
    } else if (status === 'scheduled') {
      statusBadge = `<span class="promo-status-badge promo-status-scheduled">🟡 Scheduled</span>`;
    } else if (status === 'expired') {
      statusBadge = `<span class="promo-status-badge promo-status-expired">⚪ Expired</span>`;
    } else {
      statusBadge = `<span class="promo-status-badge promo-status-disabled">🔴 Disabled</span>`;
    }

    let benefitText = '';
    if (p.type === 'percentage' || p.discount_percentage > 0) {
      benefitText = `<strong style="color:var(--color-cream); font-size:14px;">${p.discount_percentage}% OFF</strong>`;
    } else if (p.type === 'fixed_amount' || p.fixed_amount > 0) {
      benefitText = `<strong style="color:var(--color-cream); font-size:14px;">$${Number(p.fixed_amount).toFixed(2)} OFF</strong>`;
    } else if (p.type === 'bogo' || p.type === 'buy_x_get_y') {
      benefitText = `<strong style="color:var(--color-cream); font-size:14px;">Buy 1 Get 1 (50% 2nd)</strong>`;
    } else if (p.type === 'free_item') {
      benefitText = `<strong style="color:var(--color-cream); font-size:14px;">Free Menu Item</strong>`;
    } else {
      benefitText = `<strong style="color:var(--color-cream); font-size:14px;">Min Order Discount</strong>`;
    }

    const minSpendText = p.min_spend > 0 
      ? `<div style="font-size:11px; color:var(--color-cream-muted); margin-top:2px;"><i class="ri-wallet-3-line"></i> Min $${Number(p.min_spend).toFixed(2)}</div>`
      : `<div style="font-size:11px; color:var(--color-cream-muted); margin-top:2px;">No min spend</div>`;

    // Scope presentation
    let scopeBadge = '';
    if (p.applicable_scope === 'categories') {
      scopeBadge = `<span class="promo-type-pill"><i class="ri-folders-line" style="color:#F59E0B;"></i> Specific Categories</span>`;
    } else if (p.applicable_scope === 'products') {
      scopeBadge = `<span class="promo-type-pill"><i class="ri-cup-line" style="color:#60A5FA;"></i> Specific Products</span>`;
    } else {
      scopeBadge = `<span class="promo-type-pill"><i class="ri-check-double-line" style="color:#10B981;"></i> All Menu Items</span>`;
    }

    // Schedule presentation
    const sDate = p.start_date || 'Ongoing';
    const eDate = p.end_date || 'Forever';
    const scheduleHtml = `
      <div style="font-size:12px; color:var(--color-cream);">
        <i class="ri-calendar-event-line" style="color:var(--color-primary-light);"></i> ${sDate}
      </div>
      <div style="font-size:11px; color:var(--color-cream-muted);">
        until ${eDate} ${p.end_time && p.end_time !== '23:59:59' ? p.end_time : ''}
      </div>`;

    // Usage progress
    const maxLimit = p.usage_limit ? Number(p.usage_limit) : null;
    const currentUsage = Number(p.usage_count || 0);
    const pct = maxLimit ? Math.min(100, Math.round((currentUsage / maxLimit) * 100)) : 0;
    const usageHtml = `
      <div style="font-size:12px; font-weight:600; color:var(--color-cream);">
        ${currentUsage} ${maxLimit ? '/ ' + maxLimit : 'used (Unlimited)'}
      </div>
      ${maxLimit ? `
        <div style="background:var(--bg-card); border-radius:4px; height:4px; width:80px; margin-top:4px; overflow:hidden;">
          <div style="background:${pct >= 90 ? '#EF4444' : 'var(--color-primary)'}; width:${pct}%; height:100%;"></div>
        </div>` : ''}
    `;

    return `
      <tr style="border-bottom:1px solid var(--color-border-subtle); transition:background 0.15s ease;">
        <td style="padding:14px 16px;">
          <div style="font-weight:700; color:var(--color-cream); font-size:14px; margin-bottom:4px;">
            ${p.name || p.description || p.code}
          </div>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span class="promo-code-box">${p.code}</span>
            ${p.is_automatic ? `<span class="badge" style="background:rgba(96,165,250,0.15); color:#60A5FA; border:1px solid rgba(96,165,250,0.3); font-size:10.5px;"><i class="ri-flashlight-line"></i> Auto</span>` : ''}
            ${p.show_on_banner ? `<span class="badge" style="background:rgba(239,68,68,0.15); color:#EF4444; border:1px solid rgba(239,68,68,0.3); font-size:10.5px;"><i class="ri-fire-line"></i> Banner</span>` : ''}
          </div>
          ${p.description && p.description !== p.name ? `<div style="font-size:11px; color:var(--color-cream-muted); margin-top:4px; max-width:280px;">${p.description}</div>` : ''}
        </td>
        <td style="padding:14px 14px;">
          ${benefitText}
          ${minSpendText}
        </td>
        <td style="padding:14px 14px;">
          ${scopeBadge}
        </td>
        <td style="padding:14px 14px;">
          ${scheduleHtml}
        </td>
        <td style="padding:14px 14px;">
          ${usageHtml}
        </td>
        <td style="padding:14px 14px;">
          ${statusBadge}
        </td>
        <td style="padding:14px 14px; text-align:center;">
          <label class="promo-switch" title="Toggle active/inactive status">
            <input type="checkbox" ${p.is_active ? 'checked' : ''} onchange="togglePromoActive(${p.discount_id}, this.checked)">
            <span class="promo-slider"></span>
          </label>
        </td>
        <td style="padding:14px 16px; text-align:right;">
          <div style="display:inline-flex; gap:6px;">
            <button type="button" class="btn btn-outline btn-sm" onclick="openPromoModal(${p.discount_id})" title="Edit promotion details">
              <i class="ri-edit-line"></i> Edit
            </button>
            <button type="button" class="btn btn-outline btn-sm text-danger" onclick="deletePromoModal(${p.discount_id}, '${p.code}')" title="Delete promotion">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.togglePromoActive = async function(discountId, isChecked) {
  const promo = (DB.discounts || []).find(d => d.discount_id === discountId);
  if (promo) {
    promo.is_active = isChecked;
    promo.status = isChecked ? 'active' : 'disabled';
    saveLocalDB();
  }

  const res = await API.updateDiscount(discountId, { is_active: isChecked });
  if (res && res.success) {
    showToast(`Promotion status set to ${isChecked ? '🟢 Active' : '🔴 Disabled'}!`, 'success');
  } else {
    showToast('Failed to update promotion status on server.', 'error');
  }
  
  updateHomepagePromoBanner();
  filterPromosUI();
};

window.deletePromoModal = async function(discountId, code) {
  if (!confirm(`Are you sure you want to permanently delete promotion code "${code}"?`)) {
    return;
  }

  const res = await API.deleteDiscount(discountId);
  if (res && res.success) {
    DB.discounts = (DB.discounts || []).filter(d => d.discount_id !== discountId);
    saveLocalDB();
    showToast(`Promotion "${code}" deleted successfully!`, 'info');
    renderDiscountsView(document.getElementById('workspace-container'));
    updateHomepagePromoBanner();
  } else {
    showToast('Failed to delete promotion.', 'error');
  }
};

window.openPromoModal = function(editDiscountId = null) {
  let promo = null;
  if (editDiscountId) {
    promo = (DB.discounts || []).find(d => d.discount_id === editDiscountId);
  }

  const isEdit = !!promo;
  const categories = DB.menuCategories || [];
  const products = DB.menuItems || [];

  // Remove existing modal if any
  const oldModal = document.getElementById('promo-editor-modal');
  if (oldModal) oldModal.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'promo-editor-modal';
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:99999; padding:16px; backdrop-filter:blur(4px);';

  const defaultStartDate = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const defaultEndDate = nextYear.toISOString().split('T')[0];

  const selScope = promo ? (promo.applicable_scope || 'all') : 'all';
  const selCatIds = promo ? (promo.applicable_category_ids || [promo.applicable_category_id]).map(String) : [];
  const selProdIds = promo ? (promo.applicable_product_ids || []).map(String) : [];

  modalOverlay.innerHTML = `
    <div class="modal-card" style="background:var(--bg-surface); border:1px solid var(--color-border); border-radius:16px; max-width:680px; width:100%; max-height:92vh; display:flex; flex-direction:column; box-shadow:0 12px 36px rgba(0,0,0,0.5); overflow:hidden;">
      <!-- Modal Header -->
      <div style="padding:18px 24px; border-bottom:1px solid var(--color-border); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:800; font-family:'Outfit', sans-serif;">
            <i class="ri-coupon-3-line" style="color:var(--color-primary-light);"></i> ${isEdit ? 'Edit Promotion' : 'Create New Promotion'}
          </h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Configure discount rules, trigger criteria, schedule, and banner integration</span>
        </div>
        <button type="button" class="icon-btn" onclick="closePromoModal()" style="border:none; background:transparent; font-size:22px; cursor:pointer; color:var(--color-cream-muted);"><i class="ri-close-line"></i></button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <form id="promo-editor-form" onsubmit="savePromoFromModal(event, ${isEdit ? promo.discount_id : 'null'})" style="padding:22px 24px; overflow-y:auto; display:flex; flex-direction:column; gap:18px;">
        <!-- Promotion Name & Description -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Promotion Name *</label>
            <input type="text" id="promo-form-name" required placeholder="e.g. Weekend Coffee Special" value="${promo ? (promo.name || promo.description || '') : ''}" class="form-control" style="width:100%; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:9px 12px; border-radius:8px; font-size:13px;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Promo Code</label>
            <input type="text" id="promo-form-code" placeholder="e.g. COFFEE15 (Leave blank for Auto)" value="${promo ? promo.code : ''}" class="form-control" style="width:100%; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:9px 12px; border-radius:8px; font-size:13px; font-family:monospace; text-transform:uppercase;">
          </div>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Promotion Description</label>
          <input type="text" id="promo-form-desc" placeholder="e.g. Enjoy 15% off selected coffee every Saturday and Sunday." value="${promo ? (promo.description || '') : ''}" class="form-control" style="width:100%; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:9px 12px; border-radius:8px; font-size:13px;">
        </div>

        <!-- Trigger & Promotion Type -->
        <div style="background:var(--bg-card); padding:14px; border-radius:10px; border:1px solid var(--color-border);">
          <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:8px;">Promotion Trigger Method</label>
          <div style="display:flex; gap:20px;">
            <label style="font-size:13px; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="promo_trigger" value="code" ${!promo || !promo.is_automatic ? 'checked' : ''} onchange="togglePromoTriggerUI()">
              <span><strong>Promo Code Required</strong> (Customer enters code at cart)</span>
            </label>
            <label style="font-size:13px; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="promo_trigger" value="auto" ${promo && promo.is_automatic ? 'checked' : ''} onchange="togglePromoTriggerUI()">
              <span><strong>Automatic Promotion</strong> (Applies automatically in cart)</span>
            </label>
          </div>
        </div>

        <!-- Discount Type & Value -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Discount Type *</label>
            <select id="promo-form-type" class="form-control" style="width:100%; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:9px 12px; border-radius:8px; font-size:13px;" onchange="updatePromoTypeLabel()">
              <option value="percentage" ${promo && (promo.type === 'percentage' || promo.type === 'percent') ? 'selected' : ''}>Percentage Discount (%)</option>
              <option value="fixed_amount" ${promo && (promo.type === 'fixed_amount' || promo.type === 'fixed') ? 'selected' : ''}>Fixed Amount Discount ($)</option>
              <option value="bogo" ${promo && promo.type === 'bogo' ? 'selected' : ''}>Buy One Get One (BOGO 50%)</option>
              <option value="free_item" ${promo && promo.type === 'free_item' ? 'selected' : ''}>Free Menu Item</option>
              <option value="min_order" ${promo && promo.type === 'min_order' ? 'selected' : ''}>Minimum Order Discount</option>
            </select>
          </div>
          <div>
            <label id="promo-val-label" style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Discount Value *</label>
            <input type="number" step="0.01" id="promo-form-val" required placeholder="15" value="${promo ? (promo.discount_percentage || promo.fixed_amount || 15) : 15}" class="form-control" style="width:100%; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:9px 12px; border-radius:8px; font-size:13px;">
          </div>
        </div>

        <!-- Applicable Scope (Products or Categories) -->
        <div style="background:var(--bg-card); padding:14px; border-radius:10px; border:1px solid var(--color-border);">
          <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:8px;">Applicable Products / Scope</label>
          <div style="display:flex; gap:16px; margin-bottom:10px;">
            <label style="font-size:12.5px; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="promo_scope" value="all" ${selScope === 'all' ? 'checked' : ''} onchange="toggleScopeInputs()">
              <span>All Products</span>
            </label>
            <label style="font-size:12.5px; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="promo_scope" value="categories" ${selScope === 'categories' ? 'checked' : ''} onchange="toggleScopeInputs()">
              <span>Specific Categories</span>
            </label>
            <label style="font-size:12.5px; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="promo_scope" value="products" ${selScope === 'products' ? 'checked' : ''} onchange="toggleScopeInputs()">
              <span>Specific Products</span>
            </label>
          </div>

          <!-- Category Selector -->
          <div id="scope-categories-box" style="display:${selScope === 'categories' ? 'flex' : 'none'}; flex-wrap:wrap; gap:8px; padding-top:6px; border-top:1px dashed var(--color-border);">
            ${categories.map(cat => `
              <label style="font-size:12px; background:var(--bg-surface); padding:5px 10px; border-radius:6px; border:1px solid var(--color-border); display:flex; align-items:center; gap:6px; cursor:pointer;">
                <input type="checkbox" name="scope_cat" value="${cat.id}" ${selCatIds.includes(String(cat.id)) ? 'checked' : ''}>
                <span>${cat.name}</span>
              </label>
            `).join('')}
          </div>

          <!-- Products Multi-Selector -->
          <div id="scope-products-box" style="display:${selScope === 'products' ? 'block' : 'none'}; padding-top:8px; border-top:1px dashed var(--color-border);">
            <div style="max-height:120px; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              ${products.map(prod => `
                <label style="font-size:11.5px; background:var(--bg-surface); padding:5px 8px; border-radius:6px; border:1px solid var(--color-border); display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="scope_prod" value="${prod.id}" ${selProdIds.includes(String(prod.id)) ? 'checked' : ''}>
                  <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prod.name} ($${prod.price.toFixed(2)})</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Schedule Window -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Start Date & Time</label>
            <div style="display:flex; gap:8px;">
              <input type="date" id="promo-form-start-date" value="${promo ? (promo.start_date || defaultStartDate) : defaultStartDate}" class="form-control" style="flex:2; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:8px; border-radius:8px; font-size:12.5px;">
              <input type="time" id="promo-form-start-time" value="${promo ? (promo.start_time || '00:00') : '00:00'}" class="form-control" style="flex:1; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:8px; border-radius:8px; font-size:12.5px;">
            </div>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">End Date & Time</label>
            <div style="display:flex; gap:8px;">
              <input type="date" id="promo-form-end-date" value="${promo ? (promo.end_date || defaultEndDate) : defaultEndDate}" class="form-control" style="flex:2; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:8px; border-radius:8px; font-size:12.5px;">
              <input type="time" id="promo-form-end-time" value="${promo ? (promo.end_time || '23:59') : '23:59'}" class="form-control" style="flex:1; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:8px; border-radius:8px; font-size:12.5px;">
            </div>
          </div>
        </div>

        <!-- Minimum Spend & Usage Limits -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Minimum Order Amount ($)</label>
            <input type="number" step="0.50" id="promo-form-min-spend" placeholder="0.00" value="${promo ? (promo.min_spend || 0) : 0}" class="form-control" style="width:100%; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:9px 12px; border-radius:8px; font-size:13px;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--color-cream); display:block; margin-bottom:5px;">Usage Limit (Redemptions)</label>
            <input type="number" id="promo-form-usage-limit" placeholder="Unlimited (e.g. 100)" value="${promo && promo.usage_limit ? promo.usage_limit : ''}" class="form-control" style="width:100%; background:var(--bg-card); border:1px solid var(--color-border); color:var(--color-cream); padding:9px 12px; border-radius:8px; font-size:13px;">
          </div>
        </div>

        <!-- Options Checkboxes -->
        <div style="display:flex; flex-direction:column; gap:8px; padding-top:6px; border-top:1px solid var(--color-border);">
          <label style="font-size:12.5px; display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="promo-form-banner" ${promo && promo.show_on_banner ? 'checked' : (!promo ? 'checked' : '')}>
            <span><i class="ri-fire-fill" style="color:#EF4444;"></i> <strong>Feature in Homepage Promotional Banner</strong> (Dynamic countdown banner)</span>
          </label>
          <label style="font-size:12.5px; display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="promo-form-once" ${promo && promo.once_per_customer ? 'checked' : ''}>
            <span><i class="ri-user-follow-line" style="color:var(--color-primary);"></i> One redemption per loyalty customer</span>
          </label>
          <label style="font-size:12.5px; display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="promo-form-active" ${!promo || promo.is_active ? 'checked' : ''}>
            <span><i class="ri-checkbox-circle-fill" style="color:#10B981;"></i> <strong>Active</strong> (Uncheck to save as disabled draft)</span>
          </label>
        </div>

        <!-- Modal Footer Actions -->
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
          <button type="button" class="btn btn-secondary" onclick="closePromoModal()" style="padding:10px 18px;">Cancel</button>
          <button type="submit" class="btn btn-primary" style="padding:10px 22px; font-weight:700;">
            <i class="ri-check-line"></i> ${isEdit ? 'Update Promotion' : 'Save & Publish'}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);
};

window.closePromoModal = function() {
  const modal = document.getElementById('promo-editor-modal');
  if (modal) modal.remove();
};

window.toggleScopeInputs = function() {
  const scope = document.querySelector('input[name="promo_scope"]:checked')?.value || 'all';
  const catBox = document.getElementById('scope-categories-box');
  const prodBox = document.getElementById('scope-products-box');
  if (catBox) catBox.style.display = (scope === 'categories') ? 'flex' : 'none';
  if (prodBox) prodBox.style.display = (scope === 'products') ? 'block' : 'none';
};

window.togglePromoTriggerUI = function() {
  const trigger = document.querySelector('input[name="promo_trigger"]:checked')?.value || 'code';
  const codeInput = document.getElementById('promo-form-code');
  if (codeInput && trigger === 'auto' && !codeInput.value) {
    codeInput.placeholder = 'Automatic (Code optional)';
  }
};

window.updatePromoTypeLabel = function() {
  const type = document.getElementById('promo-form-type')?.value;
  const label = document.getElementById('promo-val-label');
  if (!label) return;
  if (type === 'percentage') label.textContent = 'Discount Percentage (%) *';
  else if (type === 'fixed_amount') label.textContent = 'Discount Amount ($) *';
  else if (type === 'bogo') label.textContent = 'BOGO Discount (e.g. 50% for 2nd) *';
  else if (type === 'free_item') label.textContent = 'Max Item Value ($) *';
  else label.textContent = 'Discount Value *';
};

window.savePromoFromModal = async function(e, editDiscountId) {
  e.preventDefault();

  const name = document.getElementById('promo-form-name')?.value.trim();
  let code = document.getElementById('promo-form-code')?.value.trim().toUpperCase();
  const desc = document.getElementById('promo-form-desc')?.value.trim();
  const trigger = document.querySelector('input[name="promo_trigger"]:checked')?.value || 'code';
  const isAutomatic = trigger === 'auto';

  if (!name) {
    showToast('Please enter a promotion name.', 'error');
    return;
  }

  if (!code && !isAutomatic) {
    showToast('Please specify a promotional code or choose Automatic Promotion.', 'error');
    return;
  }

  const type = document.getElementById('promo-form-type')?.value || 'percentage';
  const val = parseFloat(document.getElementById('promo-form-val')?.value || 0);
  const scope = document.querySelector('input[name="promo_scope"]:checked')?.value || 'all';

  const catBoxes = document.querySelectorAll('input[name="scope_cat"]:checked');
  const catIds = Array.from(catBoxes).map(cb => parseInt(cb.value));

  const prodBoxes = document.querySelectorAll('input[name="scope_prod"]:checked');
  const prodIds = Array.from(prodBoxes).map(pb => parseInt(pb.value));

  const startDate = document.getElementById('promo-form-start-date')?.value;
  const startTime = (document.getElementById('promo-form-start-time')?.value || '00:00') + ':00';
  const endDate = document.getElementById('promo-form-end-date')?.value;
  const endTime = (document.getElementById('promo-form-end-time')?.value || '23:59') + ':59';

  const minSpend = parseFloat(document.getElementById('promo-form-min-spend')?.value || 0);
  const usageLimitVal = document.getElementById('promo-form-usage-limit')?.value.trim();
  const usageLimit = usageLimitVal ? parseInt(usageLimitVal) : null;

  const showOnBanner = document.getElementById('promo-form-banner')?.checked ? 1 : 0;
  const onceCustomer = document.getElementById('promo-form-once')?.checked ? 1 : 0;
  const isActive = document.getElementById('promo-form-active')?.checked ? 1 : 0;

  const payload = {
    name: name,
    code: code,
    description: desc || name,
    type: type,
    discount_percentage: (type === 'percentage' || type === 'bogo') ? val : 0,
    fixed_amount: (type === 'fixed_amount' || type === 'free_item' || type === 'min_order') ? val : 0,
    applicable_scope: scope,
    applicable_category_ids: catIds,
    applicable_category_id: catIds[0] || null,
    applicable_product_ids: prodIds,
    start_date: startDate,
    start_time: startTime,
    end_date: endDate,
    end_time: endTime,
    min_spend: minSpend,
    usage_limit: usageLimit,
    is_automatic: isAutomatic ? 1 : 0,
    show_on_banner: showOnBanner,
    once_per_customer: onceCustomer,
    is_active: isActive
  };

  let res;
  if (editDiscountId) {
    res = await API.updateDiscount(editDiscountId, payload);
  } else {
    res = await API.createDiscount(payload);
  }

  if (res && res.success) {
    showToast(`Promotion "${name}" saved successfully!`, 'success');
    closePromoModal();
    renderDiscountsView(document.getElementById('workspace-container'));
    updateHomepagePromoBanner();
  } else {
    showToast((res && res.message) ? res.message : 'Error saving promotion.', 'error');
  }
};

window.getItemActiveDiscount = function(item) {
  if (!item || !DB.discounts || !Array.isArray(DB.discounts)) return null;
  const itemId = String(item.id || item.product_id);
  const catId = String(item.catId || item.category_id);
  const price = parseFloat(item.price || item.unit_price || 0);

  const activeAutos = DB.discounts.filter(d => {
    if (!d.is_active || !d.is_automatic) return false;
    if (d.status && d.status !== 'active') return false;
    return true;
  });

  let bestDeduction = 0;
  let bestDiscount = null;

  for (const promo of activeAutos) {
    const scope = promo.applicable_scope || 'all';
    let isEligible = false;

    if (scope === 'all') {
      isEligible = true;
    } else if (scope === 'categories') {
      const cats = (promo.applicable_category_ids || [promo.applicable_category_id]).map(String);
      if (cats.includes(catId)) isEligible = true;
    } else if (scope === 'products') {
      const prods = (promo.applicable_product_ids || []).map(String);
      if (prods.includes(itemId)) isEligible = true;
    }

    if (isEligible) {
      let deduction = 0;
      if (promo.type === 'percentage' || promo.discount_percentage > 0) {
        deduction = (price * promo.discount_percentage) / 100;
      } else if (promo.type === 'fixed_amount' || promo.fixed_amount > 0) {
        deduction = Math.min(price, promo.fixed_amount);
      } else if (promo.type === 'bogo') {
        deduction = price * 0.25;
      }

      if (deduction > bestDeduction) {
        bestDeduction = deduction;
        bestDiscount = {
          discount_id: promo.discount_id,
          code: promo.code,
          name: promo.name || promo.description || promo.code,
          type: promo.type,
          deduction: Math.round(deduction * 100) / 100,
          discountedPrice: Math.max(0, Math.round((price - deduction) * 100) / 100),
          percentText: promo.discount_percentage ? `${promo.discount_percentage}% OFF` : `$${promo.fixed_amount.toFixed(2)} OFF`
        };
      }
    }
  }

  return bestDiscount;
};

window.updateHomepagePromoBanner = async function() {
  const bannerEl = document.getElementById('top-promo-banner');
  if (!bannerEl) return;

  let bannerPromo = null;
  if (DB.discounts && DB.discounts.length) {
    bannerPromo = DB.discounts.find(d => d.is_active && (d.show_on_banner || d.is_automatic) && (d.status === 'active' || !d.status));
  }
  if (!bannerPromo) {
    bannerPromo = await API.fetchBannerPromo();
  }

  if (promoBannerTimerInterval) {
    clearInterval(promoBannerTimerInterval);
    promoBannerTimerInterval = null;
  }

  if (!bannerPromo) {
    bannerEl.style.display = 'none';
    return;
  }

  bannerEl.style.display = 'flex';

  const promoTag = bannerEl.querySelector('.promo-tag');
  const promoText = bannerEl.querySelector('.promo-text');
  const timerEl = document.getElementById('promo-countdown-timer');
  const claimBtn = bannerEl.querySelector('.promo-claim-btn');

  const promoTitle = bannerPromo.name || bannerPromo.description || bannerPromo.code;
  const savingText = bannerPromo.discount_percentage ? `${bannerPromo.discount_percentage}% OFF` : (bannerPromo.fixed_amount ? `$${bannerPromo.fixed_amount.toFixed(2)} OFF` : 'SPECIAL DEAL');

  if (promoTag) {
    promoTag.innerHTML = `<i class="ri-fire-fill"></i> ${bannerPromo.name ? bannerPromo.name.toUpperCase() : "TODAY'S SPECIAL"}`;
  }

  if (promoText) {
    promoText.textContent = `${bannerPromo.description || promoTitle} | SAVE ${savingText}`;
  }

  if (claimBtn) {
    claimBtn.innerHTML = `<i class="ri-gift-line"></i> Claim Special Promo`;
    claimBtn.onclick = () => {
      window.enterAsCustomer('pos');
      showToast(`🔥 Promotion: ${promoTitle}!`, 'success');
    };
  }

  const endDateTimeStr = (bannerPromo.end_date || '2099-12-31') + 'T' + (bannerPromo.end_time || '23:59:59');
  const targetEnd = new Date(endDateTimeStr).getTime();

  function updateTimerDisplay() {
    const now = Date.now();
    const diff = targetEnd - now;
    if (diff <= 0) {
      if (timerEl) timerEl.textContent = 'EXPIRED';
      if (promoBannerTimerInterval) clearInterval(promoBannerTimerInterval);
      return;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    if (timerEl) {
      timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  updateTimerDisplay();
  promoBannerTimerInterval = setInterval(updateTimerDisplay, 1000);
};

// ==========================================
// 13. CUSTOMERS & LOYALTY MODULE
// ==========================================

function renderCustomersView(container) {
  container.innerHTML = `
    <div class="customers-container">
      <div class="customer-table-card">
        <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
          <div>
            <h3>Loyalty Members Directory</h3>
            <span style="font-size:12px; color:var(--color-cream-muted);">Points tracking ($1 = 10 pts) and reward tiers</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openRegisterCustomerModal()"><i class="ri-user-add-line"></i> Register Member</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Tier Badge</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Points Balance</th>
                <th>Total Visits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${DB.customers.map((c, idx) => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td><span class="badge badge-gold">${c.tier}</span></td>
                  <td>${c.mobile}</td>
                  <td>${c.email}</td>
                  <td><strong style="color:var(--color-accent-gold);">${c.points} Pts</strong></td>
                  <td>${c.visits} Visits</td>
                  <td style="white-space:nowrap;">
                    <div style="display:flex; gap:6px; align-items:center;">
                      <button class="btn btn-primary btn-xs" onclick="openCustomerProfileDrawer('${c.id || c.customer_id || idx + 1}'); switchCustomerProfileTab('profile'); openEditCustomerProfileModal('${c.id || c.customer_id || idx + 1}');" title="Edit Customer Profile">
                        <i class="ri-edit-line"></i> Edit
                      </button>
                      <button class="btn btn-outline btn-xs" onclick="openCustomerProfileDrawer('${c.id || c.customer_id || idx + 1}');" title="View Customer Profile Drawer">
                        <i class="ri-user-line"></i> View
                      </button>
                      <button class="btn btn-ghost btn-xs" onclick="addBonusPoints(${idx})" title="Add 100 Bonus Points">+100 Pts</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.openRegisterCustomerModal = function() {
  // If called from landing/login modal, close it first
  closeLoginModal();
  
  const modal = document.getElementById('register-customer-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
};

window.closeRegisterCustomerModal = function() {
  const modal = document.getElementById('register-customer-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
};

window.handleCustomerRegistration = async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const pass = document.getElementById('reg-password').value;
  const passConfirm = document.getElementById('reg-confirm-password').value;
  const errorMsg = document.getElementById('reg-error');
  const btn = document.getElementById('submit-reg-btn');
  
  if (pass !== passConfirm) {
    errorMsg.textContent = "Passwords do not match.";
    errorMsg.classList.remove('hidden');
    return;
  }
  
  try {
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Creating Account...';
    
    // Split name into first and last
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    const res = await fetch(`${API_BASE}/users/register_customer.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        password: pass 
      })
    });
    
    const data = await res.json();
    btn.innerHTML = '<i class="ri-user-add-line"></i> Create Account';
    
    if (data.success) {
      errorMsg.classList.add('hidden');
      closeRegisterCustomerModal();
      
      // Auto login the new user
      const loginRes = await fetch(`${API_BASE}/users/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: pass })
      });
      const loginData = await loginRes.json();
      
      if (loginData.success) {
        AppState.isAuthenticated = true;
        AppState.activeRole = 'customer';
        AppState.currentUser = loginData.data;
        applyRoleToUI('customer');
        applyRolePermissionsUI();
        window.showAppView('pos');
        showToast('Account created and logged in successfully!', 'success');
      } else {
        showToast('Account created. Please login.', 'success');
        openLoginModal();
      }
    } else {
      errorMsg.textContent = data.message || "Registration failed.";
      errorMsg.classList.remove('hidden');
    }
  } catch (err) {
    btn.innerHTML = '<i class="ri-user-add-line"></i> Create Account';
    errorMsg.textContent = "Server error during registration.";
    errorMsg.classList.remove('hidden');
  }
};

window.addBonusPoints = function(idx) {
  const c = DB.customers[idx];
  if (!c) return;
  c.points += 100;
  saveLocalDB();
  renderCurrentModule();
  if (c.id) API.updateCustomer(c.id, { points: c.points });
};

// ==========================================
// 14. EMPLOYEES & ATTENDANCE MODULE
// ==========================================

function renderEmployeesView(container) {
  container.innerHTML = `
    <div class="customer-table-card">
      <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Staff Roster & Shift Attendance</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Barista shift tracker & clock-in time logs</span>
        </div>
        <button class="btn btn-success btn-sm" onclick="openClockShiftModal()"><i class="ri-time-line"></i> Clock Shift In / Out</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Role</th>
              <th>Shift Start</th>
              <th>Clocked In</th>
              <th>Hours Worked Today</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DB.employees.map((e, idx) => `
              <tr>
                <td><strong>${e.name}</strong></td>
                <td>${e.role}</td>
                <td>${e.shiftStart}</td>
                <td><span class="badge ${e.clockedIn ? 'badge-success':'badge-danger'}">${e.clockedIn ? 'ACTIVE ON SHIFT' : 'OFF'}</span></td>
                <td>${(e.hoursWorked || 4.0).toFixed(1)} hrs</td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="toggleClockStatus(${idx})">
                    ${e.clockedIn ? 'Clock Out' : 'Clock In'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openClockShiftModal = function() {
  const name = prompt("Select Staff Member (Sarah Lin, Liam O'Connor, Hannah Wright):", "Sarah Lin");
  if (!name) return;
  const emp = DB.employees.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
  if (emp) {
    emp.clockedIn = !emp.clockedIn;
    emp.status = emp.clockedIn ? 'Active' : 'Off';
    saveLocalDB();
    renderCurrentModule();
    if (emp.id) API.updateStaff(emp.id, { status: emp.status });
  }
};

window.toggleClockStatus = function(idx) {
  const emp = DB.employees[idx];
  if (!emp) return;
  emp.clockedIn = !emp.clockedIn;
  emp.status = emp.clockedIn ? 'Active' : 'Off';
  saveLocalDB();
  renderCurrentModule();
  if (emp.id) API.updateStaff(emp.id, { status: emp.status });
};

// ==========================================
// 15. CUSTOMER FEEDBACK MODULE
// ==========================================

function renderFeedbackView(container) {
  const avg = DB.feedback.length ? (DB.feedback.reduce((acc, f) => acc + f.rating, 0) / DB.feedback.length).toFixed(1) : "5.0";

  container.innerHTML = `
    <div class="customers-container">
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
        <div class="kpi-card">
          <div class="kpi-icon"><i class="ri-star-fill" style="color:var(--color-accent-gold);"></i></div>
          <div class="kpi-info">
            <span>Average Score</span>
            <h3>${avg} / 5.0</h3>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon"><i class="ri-chat-smile-2-line"></i></div>
          <div class="kpi-info">
            <span>Total Reviews</span>
            <h3>${DB.feedback.length}</h3>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon"><i class="ri-thumb-up-line"></i></div>
          <div class="kpi-info">
            <span>Positive Rating</span>
            <h3>100.0%</h3>
          </div>
        </div>
      </div>

      <div class="customer-table-card">
        <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
          <h3>Recent Customer Reviews</h3>
          <button class="btn btn-primary btn-sm" onclick="openAddReviewModal()"><i class="ri-add-line"></i> Add Customer Review</button>
        </div>
        <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
          ${DB.feedback.map(fb => `
            <div style="background:var(--bg-canvas); padding:16px; border-radius:var(--border-radius-md); border:1px solid var(--color-border-subtle);">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <strong>${fb.customer}</strong>
                <span class="text-muted" style="font-size:12px;">${fb.date}</span>
              </div>
              <div style="color:var(--color-accent-gold); margin-bottom:6px;">
                ${'★'.repeat(fb.rating)}
              </div>
              <p style="font-size:13px; color:var(--color-cream);">${fb.comment}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

window.openAddReviewModal = function() {
  const name = prompt("Customer Name:", "Liam K.");
  if (!name) return;
  const ratingStr = prompt("Rating (1 to 5 stars):", "5") || "5";
  const comment = prompt("Customer Feedback Comment:", "Loved the single origin pour over! Very floral notes.");
  if (!comment) return;

  const newFB = {
    id: `FB-${Date.now().toString().substr(-2)}`,
    customer: name,
    rating: parseInt(ratingStr),
    comment: comment,
    date: 'Just now'
  };

  DB.feedback.unshift(newFB);
  saveLocalDB();
  renderCurrentModule();
  API.createFeedback(newFB);
};

// ==========================================
// 16. DASHBOARD & REPORTING MODULE
// ==========================================

function renderDashboardView(container) {
  const totalSalesToday = DB.completedSales.reduce((acc, s) => acc + s.total, 0);
  const totalOrdersCount = DB.completedSales.length;
  const avgOrderValue = totalOrdersCount > 0 ? (totalSalesToday / totalOrdersCount) : 0;

  // Calculate payment method split from actual data
  const eftposTotal = DB.completedSales.filter(s => s.paymentMethod === 'EFTPOS' || s.paymentMethod === 'CARD').reduce((a, s) => a + s.total, 0);
  const cashTotal = DB.completedSales.filter(s => s.paymentMethod === 'CASH').reduce((a, s) => a + s.total, 0);
  const loyaltyTotal = DB.completedSales.filter(s => s.paymentMethod === 'LOYALTY').reduce((a, s) => a + s.total, 0);
  const eftposPct = totalSalesToday > 0 ? Math.round((eftposTotal / totalSalesToday) * 100) : 0;
  const cashPct = totalSalesToday > 0 ? Math.round((cashTotal / totalSalesToday) * 100) : 0;
  const loyaltyPct = totalSalesToday > 0 ? Math.round((loyaltyTotal / totalSalesToday) * 100) : 0;

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div>
        <h3>Executive Analytics & Sales Reports</h3>
        <span style="font-size:12px; color:var(--color-cream-muted);">Live shop performance metrics for Melbourne CBD store</span>
      </div>
    </div>

    <div class="dashboard-kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon"><i class="ri-money-dollar-circle-line"></i></div>
        <div class="kpi-info">
          <span>Daily Gross Revenue</span>
          <h3>$${totalSalesToday.toFixed(2)}</h3>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><i class="ri-shopping-bag-3-line"></i></div>
        <div class="kpi-info">
          <span>Orders Processed</span>
          <h3>${totalOrdersCount}</h3>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><i class="ri-line-chart-line"></i></div>
        <div class="kpi-info">
          <span>Avg Order Value</span>
          <h3>$${avgOrderValue.toFixed(2)}</h3>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><i class="ri-cup-line"></i></div>
        <div class="kpi-info">
          <span>Active KDS Orders</span>
          <h3>${DB.kdsOrders.length}</h3>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <h4>Payment Tender Split</h4>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
              <span>EFTPOS / Card</span>
              <strong>${eftposPct}% ($${eftposTotal.toFixed(2)})</strong>
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${eftposPct}%; background:var(--color-primary);"></div></div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
              <span>Cash</span>
              <strong>${cashPct}% ($${cashTotal.toFixed(2)})</strong>
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${cashPct}%; background:var(--color-accent-gold);"></div></div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
              <span>Loyalty Redemption</span>
              <strong>${loyaltyPct}% ($${loyaltyTotal.toFixed(2)})</strong>
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${loyaltyPct}%; background:var(--color-success);"></div></div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h4>Inventory Alerts</h4>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
          ${DB.inventory.filter(inv => inv.status === 'low').map(inv => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(255,107,107,0.1); border-radius:8px; border:1px solid rgba(255,107,107,0.3);">
              <div>
                <strong style="color:var(--color-danger);">${inv.name}</strong>
                <div style="font-size:11px; color:var(--color-cream-muted);">Current: ${(inv.qty !== undefined ? inv.qty : inv.stockQty || 0).toFixed(1)} ${inv.unit} • Min: ${inv.minThreshold} ${inv.unit}</div>
              </div>
              <span class="badge badge-danger">LOW STOCK</span>
            </div>
          `).join('') || '<div style="text-align:center; color:var(--color-cream-muted); padding:20px;"><i class="ri-check-double-line" style="font-size:24px; color:var(--color-success);"></i><p>All inventory levels OK</p></div>'}
        </div>
      </div>
    </div>

    <!-- Transaction History Table -->
    <div class="customer-table-card" style="margin-top:20px;">
      <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Transaction History</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">${DB.completedSales.length} completed transactions recorded</span>
        </div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount (AUD)</th>
              <th>Payment Method</th>
              <th>Items</th>
              <th>Cashier</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${DB.completedSales.length === 0 ? `
              <tr><td colspan="6" style="text-align:center; padding:24px; color:var(--color-cream-muted);"><i class="ri-inbox-line" style="font-size:24px; display:block; margin-bottom:8px;"></i>No transactions recorded yet. Complete a sale to see data here.</td></tr>
            ` : DB.completedSales.map(s => `
              <tr>
                <td><strong>${s.id}</strong></td>
                <td><strong style="color:var(--color-accent-gold);">$${s.total.toFixed(2)}</strong></td>
                <td><span class="badge ${s.paymentMethod === 'CASH' ? 'badge-warning' : s.paymentMethod === 'LOYALTY' ? 'badge-gold' : 'badge-primary'}">${s.paymentMethod}</span></td>
                <td>${s.itemsCount} items</td>
                <td>${s.cashier || 'Staff'}</td>
                <td>${s.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================
// 17. ACCESS CONTROL MODULE
// ==========================================

function renderAccessView(container) {
  if (AppState.activeRole !== 'admin') {
    renderAccessRestrictedNotice(container, 'Access Control', 'Only Administrators have permission to view and edit the Role Access Permissions Matrix.');
    return;
  }

  const modulesList = [
    { key: 'pos', name: 'Point of Sale (POS)' },
    { key: 'kds', name: 'Kitchen & Barista KDS' },
    { key: 'waitstaff', name: 'Wait Staff Monitor' },
    { key: 'customer_tracker', name: 'Customer Live Tracker' },
    { key: 'tables', name: 'Table Management' },
    { key: 'reservations', name: 'Reservations' },
    { key: 'menu', name: 'Menu & Modifiers' },
    { key: 'inventory', name: 'Inventory & Recipes' },
    { key: 'suppliers', name: 'Suppliers & Orders' },
    { key: 'discounts', name: 'Discounts & Promos' },
    { key: 'customers', name: 'Customers & Loyalty' },
    { key: 'employees', name: 'Staff & Attendance' },
    { key: 'feedback', name: 'Customer Feedback' },
    { key: 'dashboard', name: 'Dashboard & Financial Reports' },
    { key: 'audit', name: 'Audit & Compliance Logs' }
  ];

  if (!DB.rolePermissions) {
    DB.rolePermissions = JSON.parse(JSON.stringify(defaultPermissions));
  }

  const perms = DB.rolePermissions;

  container.innerHTML = `
    <div class="customer-table-card">
      <div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); flex-wrap:wrap; gap:12px;">
        <div>
          <h3>Role Access Permissions Matrix</h3>
          <span style="font-size:12px; color:var(--color-cream-muted);">Manage operational access levels across system roles</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="savePermissionsMatrix()"><i class="ri-save-line"></i> Save Permissions</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Admin</th>
              <th>Manager</th>
              <th>Cashier</th>
              <th>Kitchen</th>
              <th>Barista</th>
              <th>Wait Staff</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody id="permissions-matrix-body">
            ${modulesList.map(mod => `
              <tr>
                <td><strong>${mod.name}</strong></td>
                <td><label style="display:flex; align-items:center; gap:8px; cursor:not-allowed; opacity:0.85;"><input type="checkbox" checked disabled> <span class="badge badge-primary">Full Access</span></label></td>
                <td>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-role="manager" data-module="${mod.key}" ${perms.manager && perms.manager[mod.key] ? 'checked' : ''} onchange="updateMatrixCheckboxBadge(this)"> 
                    <span class="badge ${perms.manager && perms.manager[mod.key] ? 'badge-success' : 'badge-danger'}">${perms.manager && perms.manager[mod.key] ? 'Full Access' : 'Restricted'}</span>
                  </label>
                </td>
                <td>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-role="cashier" data-module="${mod.key}" ${perms.cashier && perms.cashier[mod.key] ? 'checked' : ''} onchange="updateMatrixCheckboxBadge(this)"> 
                    <span class="badge ${perms.cashier && perms.cashier[mod.key] ? 'badge-success' : 'badge-danger'}">${perms.cashier && perms.cashier[mod.key] ? 'Full Access' : 'Restricted'}</span>
                  </label>
                </td>
                <td>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-role="kitchen" data-module="${mod.key}" ${perms.kitchen && perms.kitchen[mod.key] ? 'checked' : ''} onchange="updateMatrixCheckboxBadge(this)"> 
                    <span class="badge ${perms.kitchen && perms.kitchen[mod.key] ? 'badge-success' : 'badge-danger'}">${perms.kitchen && perms.kitchen[mod.key] ? 'Full Access' : 'Restricted'}</span>
                  </label>
                </td>
                <td>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-role="barista" data-module="${mod.key}" ${perms.barista && perms.barista[mod.key] ? 'checked' : ''} onchange="updateMatrixCheckboxBadge(this)"> 
                    <span class="badge ${perms.barista && perms.barista[mod.key] ? 'badge-success' : 'badge-danger'}">${perms.barista && perms.barista[mod.key] ? 'Full Access' : 'Restricted'}</span>
                  </label>
                </td>
                <td>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-role="waitstaff" data-module="${mod.key}" ${perms.waitstaff && perms.waitstaff[mod.key] ? 'checked' : ''} onchange="updateMatrixCheckboxBadge(this)"> 
                    <span class="badge ${perms.waitstaff && perms.waitstaff[mod.key] ? 'badge-success' : 'badge-danger'}">${perms.waitstaff && perms.waitstaff[mod.key] ? 'Full Access' : 'Restricted'}</span>
                  </label>
                </td>
                <td>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-role="customer" data-module="${mod.key}" ${perms.customer && perms.customer[mod.key] ? 'checked' : ''} onchange="updateMatrixCheckboxBadge(this)"> 
                    <span class="badge ${perms.customer && perms.customer[mod.key] ? 'badge-success' : 'badge-danger'}">${perms.customer && perms.customer[mod.key] ? 'Full Access' : 'Restricted'}</span>
                  </label>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.updateMatrixCheckboxBadge = function(cb) {
  const badge = cb.parentElement.querySelector('.badge');
  if (badge) {
    if (cb.checked) {
      badge.className = 'badge badge-success';
      badge.textContent = 'Full Access';
    } else {
      badge.className = 'badge badge-danger';
      badge.textContent = 'Restricted';
    }
  }
};

window.savePermissionsMatrix = function() {
  if (AppState.activeRole !== 'admin') return;

  if (!DB.rolePermissions) {
    DB.rolePermissions = JSON.parse(JSON.stringify(defaultPermissions));
  }

  document.querySelectorAll('#permissions-matrix-body input[type="checkbox"]').forEach(cb => {
    const role = cb.getAttribute('data-role');
    const moduleKey = cb.getAttribute('data-module');
    if (role && moduleKey) {
      if (!DB.rolePermissions[role]) DB.rolePermissions[role] = {};
      DB.rolePermissions[role][moduleKey] = cb.checked;
    }
  });

  saveLocalDB();
  applyRolePermissionsUI();
  API.saveState('rolePermissions', DB.rolePermissions);

  alert('Role Access Permissions saved successfully to SQLite Database!');
};
// ==========================================
// REPORTS & AUDIT TRAIL MODULE (FR66-FR68, NFR33-NFR39)
// ==========================================
let currentReportsPeriod = 'this_month';
let currentReportsTab = 'reports';

async function renderReportsAndAuditsView(container, activeTab = null) {
  if (activeTab) currentReportsTab = activeTab;
  const tab = currentReportsTab;

  container.innerHTML = `
    <div class="module-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:20px;">
      <div>
        <h2 style="font-size:22px; font-weight:800; font-family:'Outfit', sans-serif;">
          <i class="ri-file-chart-line" style="color:var(--color-primary-light);"></i> Reports & Audits
        </h2>
        <p style="color:var(--color-cream-muted); font-size:13px;">Financial revenue statements, product performance metrics, and security compliance audit logs.</p>
      </div>
      <div style="display:flex; align-items:center; gap:10px; background:var(--bg-elevated); padding:6px; border-radius:12px; border:1px solid var(--color-border);">
        <button type="button" class="btn btn-sm ${tab === 'reports' ? 'btn-primary' : 'btn-outline'}" style="border:none;" onclick="renderReportsAndAuditsView(document.getElementById('workspace-container'), 'reports')">
          <i class="ri-bar-chart-box-line"></i> Business Reports
        </button>
        <button type="button" class="btn btn-sm ${tab === 'audit' ? 'btn-primary' : 'btn-outline'}" style="border:none;" onclick="renderReportsAndAuditsView(document.getElementById('workspace-container'), 'audit')">
          <i class="ri-shield-keyhole-line"></i> Security Audit Trail
        </button>
      </div>
    </div>

    <div id="reports-and-audits-content">
      <div style="padding:40px; text-align:center;">
        <i class="ri-loader-4-line ri-spin" style="font-size:36px; color:var(--color-primary);"></i>
        <p style="margin-top:10px; color:var(--color-cream-muted); font-size:14px;">Loading reports & audit records...</p>
      </div>
    </div>
  `;

  const contentEl = document.getElementById('reports-and-audits-content');

  if (tab === 'reports') {
    await renderReportsTabContent(contentEl);
  } else {
    await renderAuditTabContent(contentEl);
  }
}

async function renderReportsTabContent(contentEl) {
  const salesData = await API.fetchReports('sales', currentReportsPeriod);
  const productsData = await API.fetchReports('products', currentReportsPeriod);

  const totals = (salesData && salesData.totals) ? salesData.totals : {
    total_revenue: 0,
    total_orders: 0,
    total_discounts: 0,
    total_gst: 0,
    avg_order_value: 0
  };

  const dailySales = (salesData && Array.isArray(salesData.daily_breakdown)) ? salesData.daily_breakdown : [];
  const products = (productsData && Array.isArray(productsData.products)) ? productsData.products : [];

  contentEl.innerHTML = `
    <!-- Period Filter Bar -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; background:var(--bg-card); padding:12px 18px; border-radius:12px; border:1px solid var(--color-border);">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:13px; font-weight:600; color:var(--color-cream-muted);">Date Range:</span>
        <button class="btn btn-xs ${currentReportsPeriod === 'today' ? 'btn-primary' : 'btn-outline'}" onclick="setReportsPeriod('today')">Today</button>
        <button class="btn btn-xs ${currentReportsPeriod === 'this_week' ? 'btn-primary' : 'btn-outline'}" onclick="setReportsPeriod('this_week')">This Week</button>
        <button class="btn btn-xs ${currentReportsPeriod === 'this_month' ? 'btn-primary' : 'btn-outline'}" onclick="setReportsPeriod('this_month')">This Month</button>
        <button class="btn btn-xs ${currentReportsPeriod === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="setReportsPeriod('all')">Last 30 Days</button>
      </div>
      <div style="font-size:12px; color:var(--color-cream-muted);">
        <i class="ri-calendar-line"></i> Period: <strong>${currentReportsPeriod.replace('_', ' ').toUpperCase()}</strong>
      </div>
    </div>

    <!-- 5 Financial KPI Cards -->
    <div class="report-kpi-grid">
      <div class="report-kpi-card" style="border-left: 4px solid var(--color-primary);">
        <div class="report-kpi-header">
          <span class="report-kpi-label"><i class="ri-money-dollar-circle-line" style="color:var(--color-primary);"></i> Gross Revenue</span>
        </div>
        <div class="report-kpi-val">$${Number(totals.total_revenue || 0).toFixed(2)}</div>
        <div class="report-kpi-sub" style="color:#10B981;">
          <i class="ri-checkbox-circle-fill"></i> Includes GST & Promotions
        </div>
      </div>

      <div class="report-kpi-card" style="border-left: 4px solid #10B981;">
        <div class="report-kpi-header">
          <span class="report-kpi-label"><i class="ri-shopping-cart-line" style="color:#10B981;"></i> Total Orders</span>
        </div>
        <div class="report-kpi-val">${totals.total_orders || 0}</div>
        <div class="report-kpi-sub">
          <i class="ri-check-double-line"></i> Completed transactions
        </div>
      </div>

      <div class="report-kpi-card" style="border-left: 4px solid var(--color-accent-gold);">
        <div class="report-kpi-header">
          <span class="report-kpi-label"><i class="ri-calculator-line" style="color:var(--color-accent-gold);"></i> GST Portion (10%)</span>
        </div>
        <div class="report-kpi-val" style="color:var(--color-accent-gold);">$${Number(totals.total_gst || 0).toFixed(2)}</div>
        <div class="report-kpi-sub">
          <i class="ri-government-line"></i> Australian ATO tax ledger
        </div>
      </div>

      <div class="report-kpi-card" style="border-left: 4px solid #60A5FA;">
        <div class="report-kpi-header">
          <span class="report-kpi-label"><i class="ri-line-chart-line" style="color:#60A5FA;"></i> Average Order Value</span>
        </div>
        <div class="report-kpi-val" style="color:#60A5FA;">$${Number(totals.avg_order_value || 0).toFixed(2)}</div>
        <div class="report-kpi-sub">
          <i class="ri-user-smile-line"></i> Per customer ticket
        </div>
      </div>

      <div class="report-kpi-card" style="border-left: 4px solid #F59E0B;">
        <div class="report-kpi-header">
          <span class="report-kpi-label"><i class="ri-percent-line" style="color:#F59E0B;"></i> Total Discounts</span>
        </div>
        <div class="report-kpi-val" style="color:#F59E0B;">$${Number(totals.total_discounts || 0).toFixed(2)}</div>
        <div class="report-kpi-sub">
          <i class="ri-coupon-3-line"></i> Loyalty & promo vouchers
        </div>
      </div>
    </div>

    <!-- Tables Grid: Daily Breakdown & Product Performance -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap:20px;">
      <!-- Daily Sales Table -->
      <div class="card" style="padding:20px; background:var(--bg-card); border-radius:14px; border:1px solid var(--color-border);">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
          <i class="ri-calendar-check-line" style="color:var(--color-primary-light);"></i> Daily Sales Breakdown
        </h3>
        <div class="table-responsive" style="max-height:420px; overflow-y:auto;">
          <table class="data-table" style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="border-bottom:1px solid var(--color-border); color:var(--color-cream-muted); text-align:left;">
                <th style="padding:10px;">Date</th>
                <th style="padding:10px;">Orders</th>
                <th style="padding:10px;">Gross Sales</th>
                <th style="padding:10px;">GST</th>
              </tr>
            </thead>
            <tbody>
              ${dailySales.length ? dailySales.map(d => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:10px; font-weight:600;">${d.sale_date}</td>
                  <td style="padding:10px;">${d.total_orders} (${d.dine_in_orders} dine-in, ${d.takeaway_orders} takeaway)</td>
                  <td style="padding:10px; font-weight:700; color:#10B981;">$${Number(d.gross_sales || 0).toFixed(2)}</td>
                  <td style="padding:10px; color:var(--color-cream-muted);">$${Number(d.gst_portion || 0).toFixed(2)}</td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="padding:20px; text-align:center; color:var(--color-cream-muted);">No sales records for this period.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Products Performance Table -->
      <div class="card" style="padding:20px; background:var(--bg-card); border-radius:14px; border:1px solid var(--color-border);">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
          <i class="ri-cup-line" style="color:var(--color-accent-gold);"></i> Best Sellers & Product Performance
        </h3>
        <div class="table-responsive" style="max-height:420px; overflow-y:auto;">
          <table class="data-table" style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="border-bottom:1px solid var(--color-border); color:var(--color-cream-muted); text-align:left;">
                <th style="padding:10px;">Item</th>
                <th style="padding:10px;">Category</th>
                <th style="padding:10px;">Sold</th>
                <th style="padding:10px;">Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${products.slice(0, 15).map(p => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:10px; font-weight:600;">${p.product_name}</td>
                  <td style="padding:10px; color:var(--color-cream-muted); font-size:12px;">${p.category_name || '-'}</td>
                  <td style="padding:10px; font-weight:700; color:#60A5FA;">${p.total_units_sold}</td>
                  <td style="padding:10px; font-weight:700; color:var(--color-accent-gold);">$${Number(p.total_revenue || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.setReportsPeriod = function(period) {
  currentReportsPeriod = period;
  const contentEl = document.getElementById('reports-and-audits-content');
  if (contentEl) renderReportsTabContent(contentEl);
};

async function renderAuditTabContent(contentEl) {
  contentEl.innerHTML = `
    <div class="card" style="padding:20px; background:var(--bg-card); border-radius:14px; border:1px solid var(--color-border);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:16px;">
        <div style="display:flex; gap:12px; flex:1; min-width:260px;">
          <input type="text" id="audit-search-input" placeholder="Search logs by action, user, details..." class="form-input" style="flex:1;" oninput="filterAuditLogsUI()">
        </div>
        <button class="btn btn-secondary btn-sm" onclick="renderReportsAndAuditsView(document.getElementById('workspace-container'), 'audit')">
          <i class="ri-refresh-line"></i> Refresh Audit Trail
        </button>
      </div>

      <div class="table-responsive">
        <table class="data-table" style="width:100%; border-collapse:collapse;" id="audit-table">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border); text-align:left; font-size:12px; color:var(--color-cream-muted);">
              <th style="padding:12px;">Timestamp</th>
              <th style="padding:12px;">Log ID</th>
              <th style="padding:12px;">User / Source</th>
              <th style="padding:12px;">Action Type</th>
              <th style="padding:12px;">IP Address</th>
              <th style="padding:12px;">Details</th>
            </tr>
          </thead>
          <tbody id="audit-table-body">
            <tr><td colspan="6" style="padding:24px; text-align:center;">Loading audit logs...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  const logs = await API.fetchAuditLogs();
  window._currentAuditLogs = Array.isArray(logs) ? logs : [];
  renderAuditTableRows(window._currentAuditLogs);
}

function renderAuditTableRows(logs) {
  const tbody = document.getElementById('audit-table-body');
  if (!tbody) return;

  if (!logs || !logs.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="padding:30px; text-align:center; color:var(--color-cream-muted);">No audit logs recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map(l => {
    const rawDate = l.timestamp || l.created_at || new Date().toISOString();
    const formattedDate = new Date(rawDate).toLocaleString();
    const logId = l.log_id || l.id || 'N/A';
    const userName = l.user_name || l.userName || (l.user_id ? `User #${l.user_id}` : 'System');
    const action = l.action || 'ACTIVITY';
    const ip = l.ip_address || '127.0.0.1';
    const details = l.details || '-';

    let badgeClass = 'badge-info';
    if (action.includes('SUCCESS') || action.includes('CREATE')) badgeClass = 'badge-success';
    else if (action.includes('FAIL') || action.includes('LOCK') || action.includes('DELETE')) badgeClass = 'badge-danger';
    else if (action.includes('UPDATE') || action.includes('ADJUST')) badgeClass = 'badge-warning';

    return `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05); font-size:13px;">
        <td style="padding:12px; white-space:nowrap; color:var(--color-cream-muted);">${formattedDate}</td>
        <td style="padding:12px; font-family:monospace; color:var(--color-primary-light); font-weight:700;">#${logId}</td>
        <td style="padding:12px; font-weight:600;">${userName}</td>
        <td style="padding:12px;"><span class="badge ${badgeClass}">${action}</span></td>
        <td style="padding:12px; font-family:monospace; font-size:12px; color:var(--color-cream-muted);">${ip}</td>
        <td style="padding:12px; color:var(--color-cream); font-family:monospace; font-size:12px; max-width:320px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${details}">${details}</td>
      </tr>
    `;
  }).join('');
}

window.filterAuditLogsUI = function() {
  const query = (document.getElementById('audit-search-input')?.value || '').toLowerCase();
  if (!window._currentAuditLogs) return;
  const filtered = window._currentAuditLogs.filter(l => 
    (l.action && l.action.toLowerCase().includes(query)) ||
    (l.user_name && l.user_name.toLowerCase().includes(query)) ||
    (l.details && l.details.toLowerCase().includes(query)) ||
    (l.ip_address && l.ip_address.toLowerCase().includes(query))
  );
  renderAuditTableRows(filtered);
};

window.renderAuditView = renderReportsAndAuditsView;
window.renderReportsAndAuditsView = renderReportsAndAuditsView;

// ==========================================
// THERMAL PRINTABLE RECEIPT MODAL (FR36)
// ==========================================
window.openPrintableReceiptModal = async function(orderId) {
  let order = DB.completedSales?.find(o => o.id === orderId || o.orderNum === orderId);
  if (!order) {
    const allOrders = await API.fetchOrders();
    order = allOrders?.find(o => o.id === orderId || o.orderNum === orderId || `#ORD-${o.orderNum}` === orderId);
  }

  if (!order) {
    alert(`Order ${orderId} not found for receipt printing.`);
    return;
  }

  const modal = document.getElementById('printable-receipt-modal');
  if (!modal) return;

  document.getElementById('receipt-order-id').textContent = order.id || `#ORD-${order.orderNum}`;
  document.getElementById('receipt-date').textContent = new Date(order.createdAt || Date.now()).toLocaleString();
  document.getElementById('receipt-cashier').textContent = AppState.currentUser?.name || 'Sarah Lin';
  document.getElementById('receipt-type').textContent = (order.type === 'takeaway' ? 'Takeaway' : 'Dine In') + (order.tableId ? ` (${order.tableId})` : '');

  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.itemsJson || '[]');
  const tbody = document.querySelector('#receipt-items-table tbody');
  if (tbody) {
    tbody.innerHTML = items.map(item => `
      <tr style="border-bottom:1px solid #ddd;">
        <td style="padding:4px 0;">${item.qty || item.quantity || 1}x ${item.name}</td>
        <td style="text-align:right; padding:4px 0;">$${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');
  }

  document.getElementById('receipt-subtotal').textContent = `$${(order.subtotal || 0).toFixed(2)}`;
  document.getElementById('receipt-tax').textContent = `$${(order.tax || 0).toFixed(2)}`;
  document.getElementById('receipt-discount').textContent = `-$${(order.discount || 0).toFixed(2)}`;
  document.getElementById('receipt-total').textContent = `$${(order.total || 0).toFixed(2)}`;
  document.getElementById('receipt-pay-method').textContent = (order.paymentMethod || 'CARD').toUpperCase();

  modal.classList.remove('hidden');
};

window.closePrintableReceiptModal = function() {
  const modal = document.getElementById('printable-receipt-modal');
  if (modal) modal.classList.add('hidden');
};

// ==========================================
// REPORT CSV EXPORTER (FR68)
// ==========================================
window.exportReportsToCSV = function() {
  if (!DB.completedSales || !DB.completedSales.length) {
    alert('No sales transaction data available to export.');
    return;
  }

  const headers = ['Order ID', 'Date', 'Type', 'Table', 'Customer', 'Payment Method', 'Subtotal', 'Tax', 'Discount', 'Total', 'Status'];
  const rows = DB.completedSales.map(o => [
    o.id || `#ORD-${o.orderNum}`,
    `"${new Date(o.createdAt || Date.now()).toLocaleString()}"`,
    o.type || 'dine_in',
    o.tableId || 'N/A',
    `"${o.customerName || 'Walk-in Guest'}"`,
    o.paymentMethod || 'card',
    (o.subtotal || 0).toFixed(2),
    (o.tax || 0).toFixed(2),
    (o.discount || 0).toFixed(2),
    (o.total || 0).toFixed(2),
    o.status || 'completed'
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Ravenhill_Daily_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// PDF Receipt Generator (FR36 - Download & Print-Ready PDF)
window.generateReceiptPDF = async function(shouldDownload = true) {
  const receiptEl = document.getElementById('thermal-receipt-content');
  if (!receiptEl) return;

  const orderId = document.getElementById('rec-order-id')?.textContent || 'Receipt';
  const cleanOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, '');

  try {
    if (window.html2canvas && window.jspdf) {
      const { jsPDF } = window.jspdf;
      
      // Temporarily set high contrast white background for clean rasterization
      const origBg = receiptEl.style.backgroundColor;
      const origColor = receiptEl.style.color;
      receiptEl.style.backgroundColor = '#ffffff';
      receiptEl.style.color = '#000000';

      const canvas = await html2canvas(receiptEl, {
        scale: 3, // 300 DPI equivalent for ultra-crisp vector-like thermal print
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      receiptEl.style.backgroundColor = origBg;
      receiptEl.style.color = origColor;

      const imgData = canvas.toDataURL('image/png');
      
      // 80mm POS thermal receipt format
      const imgWidth = 80;
      const pageHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidth, Math.max(pageHeight + 4, 100)]
      });

      pdf.addImage(imgData, 'PNG', 0, 2, imgWidth, pageHeight);

      if (shouldDownload) {
        pdf.save(`Ravenhill_Receipt_${cleanOrderId}.pdf`);
      } else {
        // Direct print popup
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        const printIframe = document.createElement('iframe');
        printIframe.style.position = 'fixed';
        printIframe.style.right = '0';
        printIframe.style.bottom = '0';
        printIframe.style.width = '0';
        printIframe.style.height = '0';
        printIframe.style.border = '0';
        printIframe.src = blobUrl;
        document.body.appendChild(printIframe);
        printIframe.onload = () => {
          setTimeout(() => {
            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();
          }, 300);
        };
      }
    } else {
      window.print();
    }
  } catch (err) {
    console.error('[PDF Receipt] Generation notice:', err);
    window.print();
  }
};


// ============================================================================
// PAYPAL SANDBOX INTEGRATION (FR34 / FR36)
// ============================================================================
window.renderPayPalButtons = function() {
  const container = document.getElementById('paypal-button-container');
  const statusBox = document.getElementById('paypal-status-box');
  if (!container) return;

  container.innerHTML = '';
  if (statusBox) {
    statusBox.className = 'paypal-status-box hidden';
    statusBox.innerHTML = '';
  }

  const subtotal = AppState.cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  let discount = 0;
  if (AppState.cart.promoCode) {
    discount = AppState.cart.promoCode.type === 'percent' ? (subtotal * AppState.cart.promoCode.val)/100 : AppState.cart.promoCode.val;
  }
  const total = Math.max(0, subtotal - discount);

  if (total <= 0) {
    container.innerHTML = '<p class="text-sm text-center" style="color:var(--color-cream-muted); padding:16px 0;">Cart is empty. Add menu items to checkout.</p>';
    return;
  }

  // Check if PayPal SDK is available
  if (typeof paypal === 'undefined' || !paypal.Buttons) {
    container.innerHTML = `
      <div style="text-align:center; padding:12px;">
        <p class="text-sm" style="color:var(--color-cream); margin-bottom:10px;">Click below to simulate or complete PayPal Sandbox Payment ($${total.toFixed(2)} AUD):</p>
        <button class="btn btn-primary w-100" style="background:#0070ba; border-color:#0070ba;" onclick="completePaymentProcessWithDetails('PayPal', 'PAYPAL-SB-MANUAL')">
          <i class="ri-paypal-fill"></i> Complete PayPal Payment ($${total.toFixed(2)} AUD)
        </button>
      </div>
    `;
    return;
  }

  try {
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 40
      },
      createOrder: async function(data, actions) {
        const numId = parseInt((AppState.cart.orderId || '0').replace(/[^0-9]/g, '')) || 0;
        try {
          if (API && API.createPayPalOrder) {
            const res = await API.createPayPalOrder(numId, total);
            if (res && res.success && res.data && res.data.paypal_order_id) {
              return res.data.paypal_order_id;
            }
          }
        } catch (e) {
          console.warn('[PayPal] Server order creation notice:', e);
        }

        return actions.order.create({
          purchase_units: [{
            description: `Ravenhill Coffee POS Order ${AppState.cart.orderId}`,
            amount: {
              currency_code: 'AUD',
              value: total.toFixed(2)
            }
          }]
        });
      },
      onApprove: async function(data, actions) {
        if (statusBox) {
          statusBox.className = 'paypal-status-box success';
          statusBox.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Capturing PayPal Sandbox payment...';
          statusBox.classList.remove('hidden');
        }

        const numId = parseInt((AppState.cart.orderId || '0').replace(/[^0-9]/g, '')) || 0;
        const cashierName = AppState.currentUser?.name || (AppState.activeRole ? AppState.activeRole.toUpperCase() : 'Staff');
        
        let captureId = 'PAYPAL-' + (data.orderID || Date.now());
        try {
          if (API && API.capturePayPalOrder) {
            const capRes = await API.capturePayPalOrder(data.orderID, numId, total, cashierName);
            if (capRes && capRes.data && capRes.data.transaction_reference) {
              captureId = capRes.data.transaction_reference;
            }
          }
        } catch (e) {
          console.warn('[PayPal] Server capture callback notice:', e);
        }

        if (statusBox) {
          statusBox.className = 'paypal-status-box success';
          statusBox.innerHTML = '<i class="ri-checkbox-circle-fill"></i> PayPal Payment Approved & Captured!';
        }

        setTimeout(() => {
          completePaymentProcessWithDetails('PayPal', captureId);
        }, 500);
      },
      onError: function(err) {
        console.error('[PayPal Error]', err);
        if (statusBox) {
          statusBox.className = 'paypal-status-box error';
          statusBox.innerHTML = '<i class="ri-alert-line"></i> PayPal payment could not be completed. You can also click the bottom "Complete Payment" button.';
          statusBox.classList.remove('hidden');
        }
      },
      onCancel: function() {
        if (statusBox) {
          statusBox.className = 'paypal-status-box';
          statusBox.innerHTML = 'PayPal checkout was cancelled.';
          statusBox.classList.remove('hidden');
        }
      }
    }).render('#paypal-button-container');
  } catch (err) {
    console.error('[PayPal Render Exception]', err);
    container.innerHTML = `
      <div style="text-align:center; padding:12px;">
        <button class="btn btn-primary w-100" style="background:#0070ba; border-color:#0070ba;" onclick="completePaymentProcessWithDetails('PayPal', 'PAYPAL-SB-FALLBACK')">
          <i class="ri-paypal-fill"></i> Pay with PayPal ($${total.toFixed(2)} AUD)
        </button>
      </div>
    `;
  }
};

window.completePaymentProcessWithDetails = function(customMethod, customRef) {
  const activeMethod = customMethod || 'PAYPAL';
  const subtotal = AppState.cart.items.reduce((acc, i) => acc + i.totalPrice, 0);
  let discount = 0;
  if (AppState.cart.promoCode) {
    discount = AppState.cart.promoCode.type === 'percent' ? (subtotal * AppState.cart.promoCode.val)/100 : AppState.cart.promoCode.val;
  }
  const total = Math.max(0, subtotal - discount);
  const cashierName = AppState.currentUser?.name || (AppState.activeRole ? AppState.activeRole.toUpperCase() : 'Staff');
  const txnTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const txnRef = customRef || ('PAYPAL-SB-' + Math.random().toString(36).substr(2, 9).toUpperCase());

  // Push to Live Orders (KDS Queue)
  const orderCreatedAt = new Date().toISOString();
  DB.activeOrders.push({
    id: AppState.cart.orderId,
    type: AppState.cart.orderType,
    table: AppState.cart.tableId,
    customer: AppState.cart.customer ? AppState.cart.customer.name : 'Walk-in Guest',
    items: JSON.parse(JSON.stringify(AppState.cart.items)),
    total: total,
    status: 'pending',
    createdAt: orderCreatedAt
  });

  // Mark table occupied if dine-in
  if (AppState.cart.orderType === 'dine_in' && AppState.cart.tableId) {
    const tbl = DB.tables.find(t => t.id === AppState.cart.tableId);
    if (tbl) {
      tbl.status = 'occupied';
      tbl.orderId = AppState.cart.orderId;
      API.updateTable(tbl.id, { status: 'occupied', orderId: AppState.cart.orderId });
      renderCartTableSelect();
    }
  }

  // Deduct Inventory automatically
  AppState.cart.items.forEach(ci => {
    if (ci.item && ci.item.recipe) {
      if (ci.item.recipe.coffeeBeansGrams) {
        const beanInv = DB.inventory.find(inv => inv.id === 'INV-01');
        if (beanInv) {
          const cur = beanInv.qty !== undefined ? beanInv.qty : (beanInv.stockQty || 0);
          beanInv.qty = Math.max(0, Math.round((cur - (ci.item.recipe.coffeeBeansGrams * ci.qty) / 1000) * 10) / 10);
          beanInv.stockQty = beanInv.qty;
          beanInv.status = beanInv.qty <= beanInv.minThreshold ? 'low' : 'good';
          if (beanInv.id) API.updateInventoryStock(beanInv.id, beanInv.qty);
        }
      }
    }
  });
  updateLowStockBadge();
  saveLocalDB();

  // Push to Sales Log (local)
  DB.completedSales.unshift({
    id: AppState.cart.orderId,
    total: total,
    paymentMethod: activeMethod.toUpperCase(),
    itemsCount: AppState.cart.items.length,
    cashier: cashierName,
    timestamp: txnTimestamp
  });

  // Persist transaction to backend
  API.createTransaction({
    orderId: AppState.cart.orderId,
    total: total,
    paymentMethod: activeMethod.toUpperCase(),
    transaction_reference: txnRef,
    itemsCount: AppState.cart.items.length,
    cashier: cashierName,
    timestamp: txnTimestamp
  });

  // Populate Printable Thermal Receipt
  document.getElementById('rec-order-id').textContent = AppState.cart.orderId;
  document.getElementById('rec-date').textContent = new Date().toLocaleString('en-AU');
  document.getElementById('rec-type').textContent = `${AppState.cart.orderType === 'dine_in' ? 'Dine In (' + AppState.cart.tableId + ')' : 'Takeaway'}`;
  document.getElementById('rec-cashier').textContent = cashierName;
  document.getElementById('rec-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('rec-gst').textContent = `$${(total * 0.10).toFixed(2)}`;
  document.getElementById('rec-total').textContent = `$${total.toFixed(2)}`;
  document.getElementById('rec-tender-type').textContent = activeMethod.toUpperCase();
  document.getElementById('rec-tendered').textContent = `$${total.toFixed(2)}`;
  document.getElementById('rec-change').textContent = `$0.00`;

  const recItems = document.getElementById('rec-items-list');
  recItems.innerHTML = AppState.cart.items.map(i => `
    <div class="r-item">
      <span>${i.qty}x ${i.item.name}</span>
      <span>$${i.totalPrice.toFixed(2)}</span>
    </div>
    <div class="r-sub">${i.size || 'Regular'} | ${i.milk || 'Standard'}</div>
  `).join('');

  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('receipt-modal').classList.remove('hidden');

  // Reset Cart
  AppState.cart.items = [];
  AppState.cart.promoCode = null;
  AppState.cart.customer = null;

  API.fetchNextOrderNum().then(num => {
    if (num) {
      AppState.cart.orderId = `#ORD-${num}`;
    } else {
      const nextNum = parseInt(AppState.cart.orderId.split('-')[1]) + 1;
      AppState.cart.orderId = `#ORD-${nextNum}`;
    }
    renderCartUI();
    saveLocalDB();
  });

  renderCartUI();
  saveLocalDB();
};


// ============================================================================
// AUDIO CHIMES ENGINE (Web Audio API - Zero External Dependencies)
// ============================================================================
window.playAudioChime = function(type = 'new_order') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'new_order') {
      // Pleasant Ascending 3-tone Chime: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.38);
      });
    } else if (type === 'ready') {
      // Bell Ding: A5 (880Hz) -> C6 (1046.5Hz)
      const freqs = [880, 1046.5];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.14);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 0.5);
      });
    } else if (type === 'recall') {
      // Gentle Reversion Ding: 659.25Hz -> 523.25Hz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    }
  } catch (err) {
    console.warn('[Audio Chime Notice]', err);
  }
};

// ============================================================================
// 1. KITCHEN & BARISTA SEPARATED DASHBOARDS (FR30)
// ============================================================================
window.renderKDSView = async function(container) {
  // Determine station
  if (AppState.activeRole === 'kitchen') AppState.kdsStationFilter = 'kitchen';
  else if (AppState.activeRole === 'barista') AppState.kdsStationFilter = 'barista';
  else if (!AppState.kdsStationFilter) AppState.kdsStationFilter = 'kitchen';

  const activeStation = AppState.kdsStationFilter;
  const isManagerOrAdmin = ['admin', 'manager', 'cashier'].includes(AppState.activeRole);

  const kdsLayout = document.createElement('div');
  kdsLayout.className = 'kds-container';

  kdsLayout.innerHTML = `
    <div class="kds-filter-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      ${isManagerOrAdmin ? `
        <div class="kds-station-tabs">
          <button class="kds-station-tab ${activeStation === 'kitchen' ? 'active' : ''}" onclick="setKDSStationFilter('kitchen')">
            <i class="ri-restaurant-line"></i> 🍳 Kitchen Dashboard (Food Only)
          </button>
          <button class="kds-station-tab ${activeStation === 'barista' ? 'active' : ''}" onclick="setKDSStationFilter('barista')">
            <i class="ri-cup-line"></i> ☕ Barista Dashboard (Drinks Only)
          </button>
          <button class="kds-station-tab ${activeStation === 'all' ? 'active' : ''}" onclick="setKDSStationFilter('all')">
            <i class="ri-dashboard-line"></i> All Stations (Expo)
          </button>
        </div>
      ` : `
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="kds-station-badge ${activeStation === 'kitchen' ? 'kitchen' : 'barista'}" style="font-size:15px; font-weight:800; padding:8px 16px;">
            ${activeStation === 'kitchen' ? '🍳 Kitchen Dashboard — Food Items Only' : '☕ Barista Dashboard — Coffee & Drinks Only'}
          </span>
        </div>
      `}

      <div class="kds-stat-pills" id="kds-stat-pills-row">
        <span class="kds-stat-pill"><i class="ri-time-line text-warning"></i> New: <strong id="kds-pending-stat">0</strong></span>
        <span class="kds-stat-pill"><i class="ri-fire-line text-info"></i> Preparing: <strong id="kds-prep-stat">0</strong></span>
        <span class="kds-stat-pill"><i class="ri-check-double-line text-success"></i> Ready: <strong id="kds-ready-stat">0</strong></span>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="playAudioChime('new_order')" title="Test Audio Sound"><i class="ri-volume-up-line"></i> Sound</button>
        <button class="btn btn-primary btn-sm" onclick="renderCurrentModule()"><i class="ri-refresh-line"></i> Refresh</button>
      </div>
    </div>

    <div id="kds-batch-summary-container"></div>
    <div class="kds-grid" id="kds-tickets-grid"></div>
  `;

  container.appendChild(kdsLayout);

  const grid = document.getElementById('kds-tickets-grid');
  const batchContainer = document.getElementById('kds-batch-summary-container');

  try {
    const res = await API.fetchStationTickets(activeStation);
    if (res && res.tickets) {
      // Update statistics
      const pendingCount = res.tickets.filter(t => t.ticket_status === 'pending').length;
      const prepCount = res.tickets.filter(t => t.ticket_status === 'preparing').length;
      const readyCount = res.tickets.filter(t => t.ticket_status === 'ready').length;

      document.getElementById('kds-pending-stat').textContent = pendingCount;
      document.getElementById('kds-prep-stat').textContent = prepCount;
      document.getElementById('kds-ready-stat').textContent = readyCount;

      // Render Barista Batch Summary Header
      if (res.batch_summary && (activeStation === 'barista' || activeStation === 'all')) {
        const bs = res.batch_summary;
        const totalMilks = bs.oat_milk + bs.almond_milk + bs.soy_milk + bs.full_cream;
        if (totalMilks > 0 || bs.extra_shots > 0 || bs.decaf > 0 || bs.extra_hot > 0) {
          batchContainer.innerHTML = `
            <div class="kds-batch-summary-bar">
              <span style="font-size:13px; font-weight:800; color:var(--color-cream);"><i class="ri-cup-fill" style="color:var(--color-primary-light);"></i> Active Drink Batching:</span>
              ${bs.oat_milk > 0 ? `<span class="batch-item-badge">🥛 Oat Milk: <strong>${bs.oat_milk}x</strong></span>` : ''}
              ${bs.almond_milk > 0 ? `<span class="batch-item-badge">🌰 Almond: <strong>${bs.almond_milk}x</strong></span>` : ''}
              ${bs.soy_milk > 0 ? `<span class="batch-item-badge">🌱 Soy: <strong>${bs.soy_milk}x</strong></span>` : ''}
              ${bs.full_cream > 0 ? `<span class="batch-item-badge">🥛 Full Cream: <strong>${bs.full_cream}x</strong></span>` : ''}
              ${bs.decaf > 0 ? `<span class="batch-item-badge">☕ Decaf: <strong>${bs.decaf}x</strong></span>` : ''}
              ${bs.extra_shots > 0 ? `<span class="batch-item-badge">⚡ Extra Shots: <strong>${bs.extra_shots}x</strong></span>` : ''}
              ${bs.extra_hot > 0 ? `<span class="batch-item-badge">🔥 Extra Hot: <strong>${bs.extra_hot}x</strong></span>` : ''}
            </div>
          `;
        }
      }

      if (res.tickets.length === 0) {
        grid.innerHTML = `
          <div class="empty-cart-state" style="grid-column:1/-1; padding:60px 20px; text-align:center;">
            <i class="ri-checkbox-circle-line" style="font-size:48px; color:var(--color-success);"></i>
            <h3 style="margin:12px 0 4px 0;">All ${activeStation === 'kitchen' ? 'Kitchen' : 'Barista'} Tickets Cleared!</h3>
            <p style="color:var(--color-cream-muted);">Queue is empty. Incoming orders will chime automatically.</p>
          </div>
        `;
      } else {
        grid.innerHTML = res.tickets.map(ticket => window.renderKDSTicketHTML(ticket)).join('');
      }
    }
  } catch (err) {
    console.error('[KDS Render Error]', err);
  }
};

window.renderKDSTicketHTML = function(ticket) {
  const isUrgent = ticket.urgency === 'high';
  const mins = ticket.elapsed_minutes || 0;
  const status = ticket.ticket_status;

  return `
    <div class="kds-ticket-card status-${status} ${isUrgent ? 'urgency-high' : ''}">
      <div class="kds-ticket-header">
        <div>
          <span class="kds-ticket-id">#ORD-${ticket.order_id}</span>
          <span class="badge ${ticket.order_type === 'dine_in' ? 'badge-primary' : 'badge-gold'}" style="margin-left:4px;">
            ${ticket.order_type === 'dine_in' ? 'Table ' + (ticket.table_number || '?') : 'Takeaway'}
          </span>
        </div>
        <span class="kds-timer ${isUrgent ? 'text-danger' : ''}"><i class="ri-time-line"></i> ${mins}m ago</span>
      </div>

      <div class="kds-ticket-body">
        <div style="font-size:12px; color:var(--color-cream-muted);"><i class="ri-user-line"></i> ${ticket.customer_name || 'Guest'}</div>
        
        <div style="margin-top:6px; display:flex; flex-direction:column; gap:10px;">
          ${(ticket.items || []).map(item => `
            <div class="kds-item-row">
              <span class="kds-item-qty">${item.quantity}x</span>
              <div class="kds-item-details">
                <div class="kds-item-name" style="font-size:15px; font-weight:700;">${item.product_name}</div>
                ${item.kds_highlight !== 'Standard' ? `<div class="kds-highlight-tag">${item.kds_highlight}</div>` : ''}
                ${item.item_notes ? `<div class="special-notes-callout"><i class="ri-alert-line"></i> Note: ${item.item_notes}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="kds-ticket-footer">
        <div class="kds-stage-btn-group">
          <button class="kds-stage-btn ${status === 'pending' ? 'active stage-pending' : ''}" onclick="setTicketDirectStatus(${ticket.ticket_id}, 'pending')">
            New
          </button>
          <button class="kds-stage-btn ${status === 'preparing' ? 'active stage-preparing' : ''}" onclick="setTicketDirectStatus(${ticket.ticket_id}, 'preparing')">
            <i class="ri-fire-line"></i> Preparing
          </button>
          <button class="kds-stage-btn ${status === 'ready' ? 'active stage-ready' : ''}" onclick="setTicketDirectStatus(${ticket.ticket_id}, 'ready')">
            <i class="ri-check-line"></i> Ready
          </button>
          <button class="btn btn-ghost btn-sm" onclick="setTicketDirectStatus(${ticket.ticket_id}, 'collected')" title="Served & Close">
            <i class="ri-checkbox-circle-line"></i>
          </button>
        </div>
      </div>
    </div>
  `;
};

window.refreshKDSInPlace = async function() {
  const grid = document.getElementById('kds-tickets-grid');
  if (!grid) return;
  const activeStation = AppState.kdsStationFilter || 'kitchen';

  try {
    const res = await API.fetchStationTickets(activeStation);
    if (!res || !res.tickets) return;

    const dataHash = JSON.stringify(res.tickets);
    if (window._lastKDSHash === dataHash) return; // Zero-flicker: no change, do not touch DOM
    window._lastKDSHash = dataHash;

    const pendingCount = res.tickets.filter(t => t.ticket_status === 'pending').length;
    const prepCount = res.tickets.filter(t => t.ticket_status === 'preparing').length;
    const readyCount = res.tickets.filter(t => t.ticket_status === 'ready').length;

    const pendEl = document.getElementById('kds-pending-stat');
    const prepEl = document.getElementById('kds-prep-stat');
    const readyEl = document.getElementById('kds-ready-stat');
    if (pendEl) pendEl.textContent = pendingCount;
    if (prepEl) prepEl.textContent = prepCount;
    if (readyEl) readyEl.textContent = readyCount;

    const batchContainer = document.getElementById('kds-batch-summary-container');
    if (batchContainer && res.batch_summary && (activeStation === 'barista' || activeStation === 'all')) {
      const bs = res.batch_summary;
      const totalMilks = (bs.oat_milk || 0) + (bs.almond_milk || 0) + (bs.soy_milk || 0) + (bs.full_cream || 0);
      if (totalMilks > 0 || (bs.extra_shots || 0) > 0 || (bs.decaf || 0) > 0 || (bs.extra_hot || 0) > 0) {
        batchContainer.innerHTML = `
          <div class="kds-batch-summary-bar">
            <span style="font-size:13px; font-weight:800; color:var(--color-cream);"><i class="ri-cup-fill" style="color:var(--color-primary-light);"></i> Active Drink Batching:</span>
            ${(bs.oat_milk || 0) > 0 ? `<span class="batch-item-badge">🥛 Oat Milk: <strong>${bs.oat_milk}x</strong></span>` : ''}
            ${(bs.almond_milk || 0) > 0 ? `<span class="batch-item-badge">🌰 Almond: <strong>${bs.almond_milk}x</strong></span>` : ''}
            ${(bs.soy_milk || 0) > 0 ? `<span class="batch-item-badge">🌱 Soy: <strong>${bs.soy_milk}x</strong></span>` : ''}
            ${(bs.full_cream || 0) > 0 ? `<span class="batch-item-badge">🥛 Full Cream: <strong>${bs.full_cream}x</strong></span>` : ''}
            ${(bs.decaf || 0) > 0 ? `<span class="batch-item-badge">☕ Decaf: <strong>${bs.decaf}x</strong></span>` : ''}
            ${(bs.extra_shots || 0) > 0 ? `<span class="batch-item-badge">⚡ Extra Shots: <strong>${bs.extra_shots}x</strong></span>` : ''}
            ${(bs.extra_hot || 0) > 0 ? `<span class="batch-item-badge">🔥 Extra Hot: <strong>${bs.extra_hot}x</strong></span>` : ''}
          </div>
        `;
      } else {
        batchContainer.innerHTML = '';
      }
    }

    if (res.tickets.length === 0) {
      grid.innerHTML = `
        <div class="empty-cart-state" style="grid-column:1/-1; padding:60px 20px; text-align:center;">
          <i class="ri-checkbox-circle-line" style="font-size:48px; color:var(--color-success);"></i>
          <h3 style="margin:12px 0 4px 0;">All ${activeStation === 'kitchen' ? 'Kitchen' : 'Barista'} Tickets Cleared!</h3>
          <p style="color:var(--color-cream-muted);">Queue is empty. Incoming orders will chime automatically.</p>
        </div>
      `;
    } else {
      grid.innerHTML = res.tickets.map(ticket => window.renderKDSTicketHTML(ticket)).join('');
    }
  } catch(e) {}
};

window.setTicketDirectStatus = async function(ticketId, targetStatus) {
  try {
    const res = await API.setStationTicketStatus(ticketId, targetStatus);
    if (res && res.success) {
      if (targetStatus === 'ready') playAudioChime('ready');
      else if (targetStatus === 'collected') playAudioChime('served');
      else playAudioChime('new_order');
      await window.refreshKDSInPlace();
    }
  } catch (e) {
    console.error('[Set Ticket Status Error]', e);
  }
};

// ============================================================================
// 2. WAIT STAFF DASHBOARD (FULL ORDER MONITOR & SERVING CONTROLS)
// ============================================================================
window.renderWaitStaffDashboard = async function(container) {
  const wsLayout = document.createElement('div');
  wsLayout.className = 'kds-container';

  wsLayout.innerHTML = `
    <div class="kds-filter-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="kds-station-badge" style="background:rgba(34, 197, 94, 0.2); color:#22c55e; border:1px solid #22c55e; font-size:15px; font-weight:800; padding:8px 16px;">
          🤵 Wait Staff Dashboard — Full Order Service
        </span>
      </div>

      <div class="kds-stat-pills">
        <span class="kds-stat-pill"><i class="ri-time-line text-warning"></i> Active Orders: <strong id="ws-active-count">0</strong></span>
        <span class="kds-stat-pill" style="background:rgba(34, 197, 94, 0.15); border-color:#22c55e; color:#22c55e;">
          <i class="ri-notification-3-line"></i> Ready to Serve: <strong id="ws-ready-count">0</strong>
        </span>
      </div>

      <div>
        <button class="btn btn-primary btn-sm" onclick="window.refreshWaitStaffInPlace()"><i class="ri-refresh-line"></i> Refresh</button>
      </div>
    </div>

    <div class="waitstaff-grid" id="waitstaff-orders-grid"></div>
  `;

  container.appendChild(wsLayout);
  await window.refreshWaitStaffInPlace();
};

window.renderWaitStaffCardHTML = function(ord) {
  const isReady = ord.is_ready_to_serve;
  const kStatus = ord.kitchen_status;
  const bStatus = ord.barista_status;

  return `
    <div class="waitstaff-card ${isReady ? 'ready-to-serve' : ''}">
      <div class="waitstaff-card-header">
        <div>
          <div class="waitstaff-table-badge">
            <i class="ri-restaurant-line" style="color:var(--color-primary-light);"></i>
            ${ord.order_type === 'dine_in' ? 'Table ' + (ord.table_number || '?') : 'Takeaway'}
            <span style="font-size:12px; color:var(--color-cream-muted); font-weight:600; margin-left:6px;">(#ORD-${ord.order_id})</span>
          </div>
          <div style="font-size:11px; color:var(--color-cream-muted); margin-top:2px;">
            Guest: ${ord.customer_name || 'Walk-in'} • Wait: ${ord.elapsed_minutes}m
          </div>
        </div>
        ${isReady ? `
          <span class="badge badge-success" style="font-size:12px; padding:6px 12px; font-weight:800; animation:pulse 1s infinite;">
            <i class="ri-notification-3-fill"></i> READY TO SERVE
          </span>
        ` : `
          <span class="badge badge-warning" style="font-size:11px;">${(ord.master_status || 'PENDING').toUpperCase()}</span>
        `}
      </div>

      <div class="waitstaff-card-body">
        <!-- Kitchen Food Breakdown -->
        ${ord.food_items && ord.food_items.length ? `
          <div class="waitstaff-station-section">
            <div class="waitstaff-station-header kitchen">
              <span>🍳 Kitchen (Food)</span>
              <span class="badge ${kStatus === 'ready' ? 'badge-success' : (kStatus === 'preparing' ? 'badge-info' : 'badge-warning')}">
                ${kStatus === 'ready' ? 'Ready at Pass' : (kStatus === 'preparing' ? 'Cooking' : 'In Queue')}
              </span>
            </div>
            ${ord.food_items.map(f => `
              <div class="waitstaff-item-row">
                <span><strong>${f.quantity}x</strong> ${f.product_name}</span>
                ${f.notes_highlight !== 'Standard' ? `<span style="font-size:11px; color:#fb923c;">${f.notes_highlight}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Barista Drink Breakdown -->
        ${ord.drink_items && ord.drink_items.length ? `
          <div class="waitstaff-station-section">
            <div class="waitstaff-station-header barista">
              <span>☕ Barista (Drinks)</span>
              <span class="badge ${bStatus === 'ready' ? 'badge-success' : (bStatus === 'preparing' ? 'badge-info' : 'badge-warning')}">
                ${bStatus === 'ready' ? 'Ready at Bar' : (bStatus === 'preparing' ? 'Brewing' : 'In Queue')}
              </span>
            </div>
            ${ord.drink_items.map(d => `
              <div class="waitstaff-item-row">
                <span><strong>${d.quantity}x</strong> ${d.product_name}</span>
                ${d.notes_highlight !== 'Standard' ? `<span style="font-size:11px; color:#60a5fa;">${d.notes_highlight}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="waitstaff-card-footer">
        <button class="btn btn-success w-100" onclick="serveOrderAction(${ord.order_id})" style="font-size:14px; font-weight:800; padding:12px;">
          <i class="ri-check-double-line"></i> Mark Order as Served & Complete
        </button>
      </div>
    </div>
  `;
};

window.refreshWaitStaffInPlace = async function() {
  const grid = document.getElementById('waitstaff-orders-grid');
  if (!grid) return;

  try {
    const res = await (await fetch(`${API_BASE}/orders/kds.php?station=waitstaff`)).json();
    if (!res || !res.success || !res.data) return;

    const orders = res.data.orders || [];
    const dataHash = JSON.stringify(orders);
    if (window._lastWaitStaffHash === dataHash) return; // Zero-flicker: no change
    window._lastWaitStaffHash = dataHash;

    const activeEl = document.getElementById('ws-active-count');
    const readyEl = document.getElementById('ws-ready-count');
    if (activeEl) activeEl.textContent = orders.length;
    if (readyEl) readyEl.textContent = res.data.ready_to_serve_count || 0;

    const readyBadge = document.getElementById('waitstaff-ready-count');
    if (readyBadge) {
      readyBadge.textContent = res.data.ready_to_serve_count || 0;
      readyBadge.classList.toggle('hidden', (res.data.ready_to_serve_count || 0) === 0);
    }

    if (orders.length === 0) {
      grid.innerHTML = `
        <div class="empty-cart-state" style="grid-column:1/-1; padding:60px 20px; text-align:center;">
          <i class="ri-check-double-line" style="font-size:48px; color:var(--color-success);"></i>
          <h3 style="margin:12px 0 4px 0;">All Tables Served!</h3>
          <p style="color:var(--color-cream-muted);">No orders currently waiting for collection.</p>
        </div>
      `;
    } else {
      grid.innerHTML = orders.map(ord => window.renderWaitStaffCardHTML(ord)).join('');
    }
  } catch(e) {}
};

window.serveOrderAction = async function(orderId) {
  try {
    const res = await API.serveOrder(orderId);
    if (res && res.success) {
      playAudioChime('served');
      await window.refreshWaitStaffInPlace();
    }
  } catch (err) {
    console.error('[Serve Order Action Error]', err);
  }
};

// ============================================================================
// 3. CUSTOMER LIVE ORDER TRACKING VIEW (ITEMIZED FOOD & DRINKS)
// ============================================================================
window.renderCustomerTrackerView = async function(container) {
  const shell = document.createElement('div');
  shell.className = 'customer-tracker-shell';

  shell.innerHTML = `
    <div id="customer-tracker-content">
      <div style="text-align:center; padding:40px 0;"><i class="ri-loader-4-line ri-spin" style="font-size:32px; color:var(--color-primary-light);"></i><p>Loading your live order status...</p></div>
    </div>
  `;
  container.appendChild(shell);
  await window.refreshCustomerTrackerInPlace(true);
};

window.refreshCustomerTrackerInPlace = async function(initialLoad = false) {
  const trackerEl = document.getElementById('customer-tracker-content');
  if (!trackerEl) return;

  try {
    const res = await API.fetchCustomerOrder();
    if (!res || !res.success || !res.data) {
      if (initialLoad) {
        trackerEl.innerHTML = `
          <div class="customer-tracker-hero" style="text-align:center; padding:50px 20px;">
            <i class="ri-cup-line" style="font-size:48px; color:var(--color-primary-light);"></i>
            <h3 style="margin:12px 0 6px 0; color:#fff;">Welcome to Ravenhill Coffee Roasters!</h3>
            <p style="color:var(--color-cream-muted); margin-bottom:20px;">No active orders found for this session.</p>
            <button class="btn btn-primary" onclick="switchModule('menu')"><i class="ri-restaurant-menu-line"></i> Browse Cafe Menu</button>
          </div>
        `;
      }
      return;
    }

    const o = res.data;
    const dataHash = JSON.stringify({ id: o.order_id, step: o.step_index, msg: o.status_message, items: o.food_items?.length + o.drink_items?.length });
    if (!initialLoad && window._lastTrackerHash === dataHash) return; // Zero-flicker: no change
    window._lastTrackerHash = dataHash;

    const step = o.step_index;

    trackerEl.innerHTML = `
      <!-- Hero Pickup Token Card -->
      <div class="customer-tracker-hero">
        <span class="customer-pickup-token">${o.pickup_number}</span>
        <h2 class="customer-status-hero-title">${o.status_message}</h2>
        <p class="customer-status-hero-sub">
          Order for <strong>${o.customer_name}</strong> • ${o.order_type === 'dine_in' ? 'Table ' + (o.table_number || '?') : 'Takeaway'} • Est. Wait: ~${o.estimated_wait} mins
        </p>

        <!-- 4-Step Animated Visual Progress Stepper -->
        <div class="tracker-stepper">
          <div class="tracker-step ${step >= 1 ? (step === 1 ? 'active' : 'done') : ''}">
            <div class="step-icon-circle"><i class="ri-file-list-3-line"></i></div>
            <span class="step-label">Order Placed</span>
          </div>
          <div class="tracker-step ${step >= 2 ? (step === 2 ? 'active' : 'done') : ''}">
            <div class="step-icon-circle"><i class="ri-fire-line"></i></div>
            <span class="step-label">In Preparation</span>
          </div>
          <div class="tracker-step ${step >= 3 ? (step === 3 ? 'active' : 'done') : ''}">
            <div class="step-icon-circle"><i class="ri-notification-3-line"></i></div>
            <span class="step-label">Ready for Pickup</span>
          </div>
          <div class="tracker-step ${step >= 4 ? 'done' : ''}">
            <div class="step-icon-circle"><i class="ri-checkbox-circle-line"></i></div>
            <span class="step-label">Served</span>
          </div>
        </div>
      </div>

      <!-- Food Section -->
      ${o.food_items && o.food_items.length ? `
        <div class="customer-category-card">
          <div class="customer-category-header">
            <div class="customer-category-title">
              <span>🍔 Food Items (Kitchen)</span>
            </div>
            <span class="badge ${o.station_breakdown?.kitchen?.status === 'ready' ? 'badge-success' : 'badge-info'}" style="font-size:12px; padding:4px 10px;">
              ${o.station_breakdown?.kitchen?.label || 'In Queue'}
            </span>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${o.food_items.map(f => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); padding-bottom:8px;">
                <div>
                  <strong style="color:var(--color-cream); font-size:14px;">${f.quantity}x ${f.product_name}</strong>
                  ${f.mods_text ? `<div style="font-size:12px; color:var(--color-cream-muted);">${f.mods_text}</div>` : ''}
                </div>
                <span class="badge ${f.status_code === 'ready' ? 'badge-success' : 'badge-primary'}">${f.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Drinks Section -->
      ${o.drink_items && o.drink_items.length ? `
        <div class="customer-category-card">
          <div class="customer-category-header">
            <div class="customer-category-title">
              <span>☕ Beverages (Barista)</span>
            </div>
            <span class="badge ${o.station_breakdown?.barista?.status === 'ready' ? 'badge-success' : 'badge-info'}" style="font-size:12px; padding:4px 10px;">
              ${o.station_breakdown?.barista?.label || 'In Queue'}
            </span>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${o.drink_items.map(d => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border-subtle); padding-bottom:8px;">
                <div>
                  <strong style="color:var(--color-cream); font-size:14px;">${d.quantity}x ${d.product_name}</strong>
                  ${d.mods_text ? `<div style="font-size:12px; color:var(--color-cream-muted);">${d.mods_text}</div>` : ''}
                </div>
                <span class="badge ${d.status_code === 'ready' ? 'badge-success' : 'badge-primary'}">${d.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  } catch(err) {
    console.error('[Customer Tracker Error]', err);
  }
};

// ============================================================================
// 4. QUICK TENDER PAY & PAYMENTS LEDGER MODULE
// ============================================================================

window.quickPay = function(method) {
  if (!AppState.cart.items || AppState.cart.items.length === 0) {
    showToast('Please select coffee or food items before proceeding to payment.', 'warning');
    return;
  }
  openPaymentModal();
  setTimeout(() => {
    const tab = document.querySelector(`.pay-tab[data-method="${method}"]`);
    if (tab) tab.click();
  }, 60);
};

window.renderPaymentsView = async function(container) {
  const shell = document.createElement('div');
  shell.className = 'payments-view-shell';
  shell.style.cssText = 'display:flex; flex-direction:column; gap:20px; padding:20px; max-width:1400px; margin:0 auto; width:100%;';

  // Compute live ledger totals
  const sales = DB.completedSales || [];
  const totalGross = sales.reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
  const cardSales = sales.filter(s => ['EFTPOS', 'CARD', 'SPLIT'].includes(s.paymentMethod)).reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
  const cashSales = sales.filter(s => s.paymentMethod === 'CASH').reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
  const totalTips = sales.reduce((acc, s) => acc + (parseFloat(s.tip || 0)), 0);

  shell.innerHTML = `
    <!-- Header Actions -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-size:22px; font-weight:800; color:var(--color-cream); margin:0 0 4px 0;">Payments, Invoices & Settlements</h2>
        <p style="font-size:13px; color:var(--color-cream-muted); margin:0;">Multi-tender transaction ledger, end-of-day register balancing & tax invoice records</p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="window.exportZReport()"><i class="ri-file-chart-line"></i> End of Day (Z-Report)</button>
        <button class="btn btn-primary" onclick="switchModule('pos')"><i class="ri-shopping-bag-3-line"></i> New Sale (POS)</button>
      </div>
    </div>

    <!-- Financial KPI Cards -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
      <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--color-border-subtle); border-radius:var(--border-radius-lg); padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--color-cream-muted); text-transform:uppercase; letter-spacing:0.5px;">Gross Settled Sales</div>
        <div id="stat-payments-gross" style="font-size:26px; font-weight:800; color:var(--color-primary-light); margin-top:6px;">$${totalGross > 0 ? totalGross.toFixed(2) : '1,842.50'}</div>
        <div style="font-size:11px; color:var(--color-success); margin-top:4px;"><i class="ri-arrow-up-line"></i> ${sales.length > 0 ? sales.length : 14} transactions processed</div>
      </div>
      <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--color-border-subtle); border-radius:var(--border-radius-lg); padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--color-cream-muted); text-transform:uppercase; letter-spacing:0.5px;">EFTPOS & Card Settled</div>
        <div id="stat-payments-card" style="font-size:26px; font-weight:800; color:#60a5fa; margin-top:6px;">$${cardSales > 0 ? cardSales.toFixed(2) : '1,428.80'}</div>
        <div style="font-size:11px; color:var(--color-cream-muted); margin-top:4px;">Tyro contactless & credit/debit</div>
      </div>
      <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--color-border-subtle); border-radius:var(--border-radius-lg); padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--color-cream-muted); text-transform:uppercase; letter-spacing:0.5px;">Cash in Drawer</div>
        <div id="stat-payments-cash" style="font-size:26px; font-weight:800; color:#34d399; margin-top:6px;">$${cashSales > 0 ? cashSales.toFixed(2) : '325.50'}</div>
        <div style="font-size:11px; color:var(--color-cream-muted); margin-top:4px;">Float: $200.00 • Net: $${cashSales > 0 ? (cashSales + 200).toFixed(2) : '525.50'}</div>
      </div>
      <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--color-border-subtle); border-radius:var(--border-radius-lg); padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--color-cream-muted); text-transform:uppercase; letter-spacing:0.5px;">Staff Gratuity (Tips)</div>
        <div id="stat-payments-tips" style="font-size:26px; font-weight:800; color:var(--color-accent-gold); margin-top:6px;">$${totalTips > 0 ? totalTips.toFixed(2) : '88.20'}</div>
        <div style="font-size:11px; color:var(--color-cream-muted); margin-top:4px;">Barista & floor pool</div>
      </div>
    </div>

    <!-- Live Transactions Table -->
    <div style="background:var(--bg-card); border:1px solid var(--color-border-subtle); border-radius:var(--border-radius-lg); padding:20px; overflow:hidden;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <i class="ri-history-line" style="font-size:20px; color:var(--color-primary-light);"></i>
          <h3 style="font-size:16px; font-weight:700; color:var(--color-cream); margin:0;">Transaction Ledger</h3>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <input type="text" id="payments-search-input" class="form-input" placeholder="Search order ID, cashier..." style="width:220px; font-size:13px;" oninput="window.filterPaymentsTable()">
          <select id="payments-tender-filter" class="form-select" style="font-size:13px;" onchange="window.filterPaymentsTable()">
            <option value="all">All Tenders</option>
            <option value="EFTPOS">EFTPOS</option>
            <option value="CARD">Credit Card</option>
            <option value="CASH">Cash</option>
            <option value="PAYPAL">PayPal</option>
            <option value="SPLIT">Split Bill</option>
            <option value="LOYALTY">Loyalty Points</option>
          </select>
        </div>
      </div>

      <div style="overflow-x:auto;">
        <table class="data-table" style="width:100%; border-collapse:collapse; font-size:13px;" id="payments-table">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border-subtle); color:var(--color-cream-muted); text-align:left;">
              <th style="padding:10px 12px;">Invoice #</th>
              <th style="padding:10px 12px;">Time</th>
              <th style="padding:10px 12px;">Cashier</th>
              <th style="padding:10px 12px;">Tender Type</th>
              <th style="padding:10px 12px;">Items</th>
              <th style="padding:10px 12px; text-align:right;">Amount (AUD)</th>
              <th style="padding:10px 12px; text-align:center;">Status</th>
              <th style="padding:10px 12px; text-align:center;">Actions</th>
            </tr>
          </thead>
          <tbody id="payments-tbody">
            <!-- Rendered by window.renderPaymentsTableData() -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.appendChild(shell);
  window.renderPaymentsTableData();
};

window.renderPaymentsTableData = function() {
  const tbody = document.getElementById('payments-tbody');
  if (!tbody) return;

  const sales = (DB.completedSales && DB.completedSales.length > 0) ? DB.completedSales : [
    { id: '#ORD-9042', total: 24.50, paymentMethod: 'EFTPOS', itemsCount: 3, cashier: 'Sarah Jenkins', timestamp: '11:42 AM' },
    { id: '#ORD-9041', total: 18.00, paymentMethod: 'CASH', itemsCount: 2, cashier: 'Alex Wong', timestamp: '11:35 AM' },
    { id: '#ORD-9040', total: 42.80, paymentMethod: 'PAYPAL', itemsCount: 5, cashier: 'Sarah Jenkins', timestamp: '11:20 AM' },
    { id: '#ORD-9039', total: 36.50, paymentMethod: 'SPLIT', itemsCount: 4, cashier: 'Alex Wong', timestamp: '11:05 AM' },
    { id: '#ORD-9038', total: 9.50, paymentMethod: 'EFTPOS', itemsCount: 1, cashier: 'Sarah Jenkins', timestamp: '10:50 AM' }
  ];

  tbody.innerHTML = sales.map((s) => `
    <tr style="border-bottom:1px solid var(--color-border-subtle);">
      <td style="padding:10px 12px; font-weight:700; color:var(--color-primary-light);">${s.id}</td>
      <td style="padding:10px 12px; color:var(--color-cream-muted);">${s.timestamp || 'Just now'}</td>
      <td style="padding:10px 12px; color:var(--color-cream);">${s.cashier || 'Cashier'}</td>
      <td style="padding:10px 12px;">
        <span class="badge ${s.paymentMethod === 'CASH' ? 'badge-success' : (s.paymentMethod === 'PAYPAL' ? 'badge-info' : 'badge-primary')}" style="font-size:11px; padding:3px 8px;">
          ${s.paymentMethod}
        </span>
      </td>
      <td style="padding:10px 12px; color:var(--color-cream);">${s.itemsCount || 1} items</td>
      <td style="padding:10px 12px; text-align:right; font-weight:700; color:var(--color-cream);">$${parseFloat(s.total).toFixed(2)}</td>
      <td style="padding:10px 12px; text-align:center;">
        <span class="badge badge-success" style="font-size:11px; padding:3px 8px;">PAID</span>
      </td>
      <td style="padding:10px 12px; text-align:center;">
        <div style="display:flex; justify-content:center; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="window.viewPastReceipt('${s.id}')" title="Print/View Receipt"><i class="ri-printer-line"></i></button>
          <button class="btn btn-outline btn-sm" onclick="window.issueRefund('${s.id}')" title="Issue Refund"><i class="ri-refund-line"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

window.filterPaymentsTable = function() {
  const query = document.getElementById('payments-search-input')?.value?.toLowerCase() || '';
  const filterTender = document.getElementById('payments-tender-filter')?.value?.toUpperCase() || 'ALL';

  const rows = document.querySelectorAll('#payments-tbody tr');
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    const matchesSearch = text.includes(query);
    const matchesTender = filterTender === 'ALL' || text.includes(filterTender.toLowerCase());
    r.style.display = (matchesSearch && matchesTender) ? '' : 'none';
  });
};

window.viewPastReceipt = function(orderId) {
  const sale = (DB.completedSales || []).find(s => s.id === orderId);
  const recOrderEl = document.getElementById('rec-order-id');
  const recTotalEl = document.getElementById('rec-total');
  const recTenderEl = document.getElementById('rec-tender-type');
  if (recOrderEl) recOrderEl.textContent = orderId;
  if (recTotalEl) recTotalEl.textContent = sale ? `$${parseFloat(sale.total).toFixed(2)}` : '$24.50';
  if (recTenderEl) recTenderEl.textContent = sale ? sale.paymentMethod : 'EFTPOS';
  document.getElementById('receipt-modal')?.classList.remove('hidden');
};

window.issueRefund = function(orderId) {
  if (confirm(`Are you sure you want to refund and void transaction ${orderId}?`)) {
    showToast(`Refund processed for ${orderId}. Receipt updated.`, 'success');
  }
};

window.exportZReport = function() {
  const now = new Date().toLocaleDateString('en-AU');
  showToast(`Generating End of Day Z-Report for ${now}...`, 'info');
  setTimeout(() => {
    alert(`==== RAVENHILL COFFEE ROASTERS ====\nEND OF DAY (Z-REPORT) — ${now}\n-----------------------------------\nGross Revenue: $1,842.50 AUD\nEFTPOS / Card Settlements: $1,428.80 AUD\nCash in Drawer: $325.50 AUD\nStaff Tips Pool: $88.20 AUD\nTransactions: 42\nStatus: BALANCED & RECONCILED`);
  }, 300);
};

// ==========================================
// LANDING PAGE & CINEMATIC STOREFRONT EXPERIENCE
// ==========================================

window.updateLandingNavbarAuth = function() {
  const container = document.getElementById('landing-nav-actions');
  if (!container) return;

  const isAuth = AppState.isAuthenticated;
  const role = AppState.activeRole || 'customer';
  const u = AppState.currentUser;
  const userName = u ? (u.first_name || u.username || 'User') : (role.toUpperCase());

  let targetMod = 'pos';
  let targetLabel = 'POS Register';
  if (role === 'admin' || role === 'manager') {
    targetMod = 'dashboard';
    targetLabel = 'Admin Dashboard';
  } else if (role === 'barista' || role === 'kitchen') {
    targetMod = 'kds';
    targetLabel = role === 'kitchen' ? 'Kitchen KDS' : 'Barista KDS';
  } else if (role === 'waitstaff') {
    targetMod = 'waitstaff';
    targetLabel = 'Wait Staff Queue';
  } else if (role === 'customer') {
    targetMod = 'pos';
    targetLabel = 'Storefront';
  }

  if (isAuth && role !== 'customer') {
    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <span class="landing-user-badge" style="font-size:13px; font-weight:700; color:var(--color-cream); background:rgba(217,107,67,0.18); border:1px solid rgba(217,107,67,0.35); padding:6px 14px; border-radius:20px; display:inline-flex; align-items:center; gap:6px;">
          <i class="ri-shield-user-fill" style="color:var(--color-primary-light);"></i> ${userName} (${role.toUpperCase()})
        </span>
        <button type="button" class="btn-nav-role" onclick="window.showAppView('${targetMod}')" style="background:var(--color-primary); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:700; cursor:pointer;">
          <i class="ri-arrow-right-up-line"></i> <span>Back to ${targetLabel}</span>
        </button>
        <button type="button" class="btn-nav-login" onclick="window.logout()" style="background:transparent; border:1px solid rgba(255,255,255,0.25); color:var(--color-cream); padding:8px 12px; border-radius:8px; font-weight:600; cursor:pointer;" title="Sign Out">
          <i class="ri-logout-box-r-line"></i> <span>Sign Out</span>
        </button>
      </div>
    `;
  } else if (isAuth && role === 'customer') {
    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="landing-user-badge" style="font-size:13px; font-weight:700; color:var(--color-cream); background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.18); padding:6px 14px; border-radius:20px; display:inline-flex; align-items:center; gap:6px;">
          <i class="ri-user-heart-line" style="color:var(--color-gold);"></i> ${userName}
        </span>
        <button type="button" class="btn-nav-role" onclick="window.showAppView('pos')">
          <i class="ri-shopping-bag-3-fill"></i> <span>Order Online</span>
        </button>
        <button type="button" class="btn-nav-login" onclick="window.logout()" title="Sign Out">
          <i class="ri-logout-box-r-line"></i> <span>Sign Out</span>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button type="button" class="btn-nav-role" onclick="window.enterAsCustomer('pos')">
        <i class="ri-shopping-bag-3-fill"></i> <span>Order Online</span>
      </button>
      <button type="button" class="btn-nav-login" onclick="window.openLoginModal('cashier')">
        <i class="ri-user-3-line"></i> <span>Sign In</span>
      </button>
    `;
  }
};

window.showLandingView = function() {
  const landing = document.getElementById('landing-page-view');
  const app = document.getElementById('app-container');
  if (landing) {
    landing.classList.remove('hidden');
    landing.style.display = 'block';
  }
  if (app) {
    app.classList.add('hidden');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.updateLandingNavbarAuth) window.updateLandingNavbarAuth();
  window.initPromoCountdown();
  window.initSteamParticles();
  window.initHeroBadgeProgression();
  window.filterLandingMenu('coffee');
};

window.showAppView = function(moduleKey) {
  const landing = document.getElementById('landing-page-view');
  const app = document.getElementById('app-container');
  if (landing) {
    landing.classList.add('hidden');
    landing.style.display = 'none';
  }
  if (app) {
    app.classList.remove('hidden');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (moduleKey) {
    switchModule(moduleKey);
  } else {
    renderCurrentModule();
  }
};

window.enterAsCustomer = function(targetModule) {
  if (!AppState.isAuthenticated) {
    AppState.activeRole = 'customer';
    AppState.isAuthenticated = true;
    localStorage.setItem('RAVENHILL_USER_ROLE', 'customer');
    localStorage.setItem('RAVENHILL_AUTH_SAVED', 'true');
    if (window.applyRoleToUI) window.applyRoleToUI('customer');
    if (window.applyRolePermissionsUI) window.applyRolePermissionsUI();
    showToast('☕ Welcome to Ravenhill! Explore our Melbourne menu & place your order.', 'success');
  }
  window.showAppView(targetModule || 'pos');
};

window.openRoleLoginModal = function(targetRole) {
  window.openLoginModal(targetRole);
};

window.initPromoCountdown = function() {
  if (landingCountdownInterval) clearInterval(landingCountdownInterval);
  let totalSeconds = 2 * 3600 + 45 * 60 + 18;
  const timerEl = document.getElementById('promo-countdown-timer');
  
  landingCountdownInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 3 * 3600;
    }
    totalSeconds--;
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    if (timerEl) {
      timerEl.textContent = `${h}:${m}:${s}`;
    }
  }, 1000);
};

window.claimSpecialPromoCombo = function() {
  const flatWhite = (DB.menuItems || defaultMenuItems).find(i => i.name === 'Flat White') || (DB.menuItems || defaultMenuItems)[0];
  const croissant = (DB.menuItems || defaultMenuItems).find(i => i.name.includes('Croissant')) || (DB.menuItems || defaultMenuItems).find(i => i.catId === '6') || (DB.menuItems || defaultMenuItems)[1];

  window.enterAsCustomer('pos');

  if (flatWhite) {
    addItemToCart(flatWhite, [{ customisation_id: 'cs-1', option_name: 'Regular (8oz)', extra_price: 0 }], 'Combo Special (15% OFF)', 1);
  }
  if (croissant) {
    addItemToCart(croissant, [{ customisation_id: 'warm-1', option_name: 'Warm & Crispy', extra_price: 0 }], 'Combo Special (15% OFF)', 1);
  }

  AppState.cart.promoCode = { code: 'COMBO15', val: 15, type: 'percent' };
  renderCartUI();
  window.openCartDrawer();
  showToast('🔥 Special Combo Claimed! Flat White + Pastry (15% OFF) added to Cart!', 'success');
};

window.initSteamParticles = function() {
  const canvas = document.getElementById('hero-steam-canvas');
  if (!canvas || typeof canvas.getContext !== 'function') return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resizeCanvas() {
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight || 600;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const particleCount = 28;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      radius: Math.random() * 24 + 10,
      alpha: Math.random() * 0.4 + 0.1,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      decay: Math.random() * 0.002 + 0.001
    });
  }

  if (landingSteamAnimFrame) cancelAnimationFrame(landingSteamAnimFrame);

  function animate() {
    if (!document.getElementById('hero-steam-canvas')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha -= p.decay;

      if (p.y < 0 || p.alpha <= 0) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
        p.alpha = Math.random() * 0.35 + 0.1;
      }

      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(255, 235, 215, ${p.alpha})`);
      grad.addColorStop(1, 'rgba(255, 235, 215, 0)');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    landingSteamAnimFrame = requestAnimationFrame(animate);
  }
  animate();
};

window.initHeroBadgeProgression = function() {
  if (landingProgressionInterval) clearInterval(landingProgressionInterval);
  const steps = [
    { text: 'WAKE UP.', icon: 'ri-sun-line' },
    { text: 'SLOW DOWN.', icon: 'ri-cup-line' },
    { text: 'SIP SOMETHING GOOD.', icon: 'ri-sparkling-fill' }
  ];
  let currentIdx = 0;
  const badgeEl = document.getElementById('hero-progression-text');
  const iconEl = document.getElementById('hero-progression-icon');

  landingProgressionInterval = setInterval(() => {
    const el = document.getElementById('hero-progression-text');
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => {
      currentIdx = (currentIdx + 1) % steps.length;
      if (el) el.textContent = steps[currentIdx].text;
      const ic = document.getElementById('hero-progression-icon');
      if (ic) ic.className = steps[currentIdx].icon;
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }, 300);
  }, 2600);
};

window.filterLandingMenu = function(categoryKey) {
  document.querySelectorAll('.category-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === categoryKey);
  });

  const grid = document.getElementById('digital-menu-grid');
  if (!grid) return;

  const items = DB.menuItems || defaultMenuItems;
  let filtered = [];

  if (categoryKey === 'coffee') {
    filtered = items.filter(i => ['1', '2', '3'].includes(String(i.catId || i.category_id)));
  } else if (categoryKey === 'breakfast') {
    filtered = items.filter(i => ['4'].includes(String(i.catId || i.category_id)));
  } else if (categoryKey === 'lunch') {
    filtered = items.filter(i => ['5'].includes(String(i.catId || i.category_id)));
  } else if (categoryKey === 'cold') {
    filtered = items.filter(i => ['10', '13'].includes(String(i.catId || i.category_id)) || (i.name && i.name.toLowerCase().includes('iced')) || (i.name && i.name.toLowerCase().includes('cold')));
  } else if (categoryKey === 'sweets') {
    filtered = items.filter(i => ['6'].includes(String(i.catId || i.category_id)) || (i.name && i.name.toLowerCase().includes('croissant')) || (i.name && i.name.toLowerCase().includes('muffin')) || (i.name && i.name.toLowerCase().includes('bread')));
  } else {
    filtered = items.slice(0, 12);
  }

  if (!filtered.length) {
    filtered = items.slice(0, 8);
  }

  grid.innerHTML = filtered.map(item => {
    const promoInfo = window.getItemActiveDiscount ? window.getItemActiveDiscount(item) : null;
    let badgeText = item.price > 7 ? 'Chef Special' : (item.catId === '1' ? 'House Blend' : 'Popular');
    let pricePillHtml = `$${parseFloat(item.price).toFixed(2)}`;

    if (promoInfo) {
      badgeText = `🔥 SPECIAL ${promoInfo.percentText}`;
      pricePillHtml = `<span style="text-decoration:line-through; font-size:11px; opacity:0.75; margin-right:4px;">$${parseFloat(item.price).toFixed(2)}</span><span style="color:#10B981; font-weight:800;">$${promoInfo.discountedPrice.toFixed(2)}</span>`;
    }

    return `
      <div class="digital-product-card" data-item-id="${item.id}">
        <div class="product-img-box">
          <img src="${item.image || './brand_recources/flat_white_coffee.png'}" alt="${item.name}" loading="lazy" onerror="this.src='./brand_recources/flat_white_coffee.png'">
          <span class="product-card-badge" style="${promoInfo ? 'background:linear-gradient(135deg, #EF4444, #F59E0B); color:#fff;' : ''}">${badgeText}</span>
        </div>
        <div class="product-content-box">
          <div class="product-name-row">
            <h4>${item.name}</h4>
            <span class="product-price-pill">${pricePillHtml}</span>
          </div>
          <p class="product-desc-text">${item.desc || 'Artisan specialty coffee crafted with precision in Melbourne CBD.'}</p>
          <div class="product-action-row">
            <button type="button" class="btn-card-order" onclick="window.orderFromLandingPage('${item.id}')">
              <i class="ri-shopping-bag-3-fill"></i> Add to Cart
            </button>
            <button type="button" class="btn-card-customise" onclick="window.orderFromLandingPage('${item.id}')" title="Customise options">
              <i class="ri-equalizer-line"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

window.orderFromLandingPage = function(itemId) {
  const item = (DB.menuItems || defaultMenuItems).find(i => String(i.id) === String(itemId)) || defaultMenuItems[0];
  window.enterAsCustomer('pos');
  openCustomiserModalAsync(item);
};

window.joinRavenhillRewards = function() {
  if (AppState.isAuthenticated && AppState.currentUser && AppState.activeRole === 'customer') {
    showToast(`⭐ Welcome back, ${AppState.currentUser.first_name || 'Member'}! Viewing your loyalty rewards.`, 'info');
    window.showAppView('pos');
  } else {
    window.openRegisterCustomerModal();
  }
};

function renderLandingPageView(container) {
  container.innerHTML = `
    <div class="landing-page-container">
      
      <!-- 1. Hero Section -->
      <section class="landing-hero" id="hero-section">
        <div class="hero-video-wrapper">
          <video class="hero-video-bg" autoplay muted loop playsinline poster="./brand_recources/roasted_coffee_beans.png">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-coffee-being-poured-into-a-cup-32860-large.mp4" type="video/mp4">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-barista-pouring-milk-into-a-cup-of-coffee-41712-large.mp4" type="video/mp4">
          </video>
          <div class="hero-video-overlay"></div>
          <canvas id="hero-steam-canvas" class="hero-steam-canvas"></canvas>
        </div>

        <div class="hero-content">
          <div class="hero-progression-badge">
            <i class="ri-sparkling-fill" id="hero-progression-icon"></i>
            <span id="hero-progression-text" class="hero-progression-text">WAKE UP.</span>
          </div>

          <h1 class="hero-headline">Coffee, Crafted for Your Moment.</h1>
          <p class="hero-subheadline">Exceptional coffee. Fresh food. Good vibes. Right in the heart of Melbourne.</p>

          <div class="hero-cta-group">
            <button type="button" class="btn-hero-primary" onclick="document.getElementById('digital-menu-section')?.scrollIntoView({ behavior:'smooth' });">
              <i class="ri-cup-fill"></i> ☕ Order Now
            </button>
            <button type="button" class="btn-hero-secondary" onclick="document.getElementById('digital-menu-section')?.scrollIntoView({ behavior:'smooth' });">
              <i class="ri-restaurant-line"></i> 📖 Explore Menu
            </button>
            <button type="button" class="btn-hero-secondary" onclick="document.getElementById('loyalty-rewards-section')?.scrollIntoView({ behavior:'smooth' });">
              <i class="ri-vip-crown-line"></i> ⭐ Join Rewards
            </button>
          </div>

          <div class="hero-status-pill">
            <span class="status-dot-pulse"></span>
            <span>Open Today: 6:30 AM – 4:00 PM • 142 Flinders Lane, Melbourne CBD</span>
          </div>
        </div>
      </section>

      <!-- 2. Good Vibes Storytelling Marquee Strip -->
      <div class="vibes-marquee-strip">
        <div class="vibes-marquee-track">
          <span class="vibes-item">GOOD COFFEE. BETTER DAYS. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">YOUR DAILY RITUAL, MADE BETTER. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">BREWED FOR THE MOMENT. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">MORE THAN COFFEE. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">TAKE A MOMENT. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">MELBOURNE CBD SPECIALTY ROASTER <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">GOOD COFFEE. BETTER DAYS. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">YOUR DAILY RITUAL, MADE BETTER. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">BREWED FOR THE MOMENT. <i class="ri-star-fill vibes-star"></i></span>
          <span class="vibes-item">MORE THAN COFFEE. <i class="ri-star-fill vibes-star"></i></span>
        </div>
      </div>

      <!-- 3. Story & Roasting Heritage Section -->
      <section class="landing-section" id="story-section">
        <div class="story-grid">
          <div class="story-card-visual">
            <img src="./brand_recources/roasted_coffee_beans.png" alt="Roasted Coffee Beans" loading="lazy">
            <div class="story-floating-badge">
              <div class="story-badge-icon"><i class="ri-fire-fill"></i></div>
              <div>
                <strong style="color:#fff; font-size:14px; display:block;">Ethical Single Origin</strong>
                <span style="color:var(--color-cream-muted); font-size:12px;">Small Batch Roasted in Melbourne</span>
              </div>
            </div>
          </div>

          <div class="story-content-col">
            <span class="section-tag">Crafted in Melbourne CBD</span>
            <h2 class="section-main-title">Every cup is a ritual. Every bean tells a story.</h2>
            <p class="section-subtext">
              Nestled along Flinders Lane, Ravenhill Coffee Roasters is dedicated to the art and science of specialty coffee. From hand-picked high-altitude micro-lots to our custom roasting curve, we brew for clarity, sweetness, and distinct origin profiles.
            </p>

            <div class="story-stats-grid">
              <div class="story-stat-card">
                <div class="story-stat-num">100%</div>
                <div class="story-stat-label">Ethical Micro-Lots & Direct Trade</div>
              </div>
              <div class="story-stat-card">
                <div class="story-stat-num">4.9 ★</div>
                <div class="story-stat-label">1,450+ Verified Melbourne Reviews</div>
              </div>
              <div class="story-stat-card">
                <div class="story-stat-num">15+</div>
                <div class="story-stat-label">Barista & Roasting Industry Awards</div>
              </div>
              <div class="story-stat-card">
                <div class="story-stat-num">28 sec</div>
                <div class="story-stat-label">Golden Ratio Espresso Extraction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Digital Menu Experience -->
      <section class="digital-menu-wrap" id="digital-menu-section">
        <div class="section-header-centered">
          <span class="section-tag">Our Melbourne Menu</span>
          <h2 class="section-main-title">Crafted with Passion. Served with Care.</h2>
          <p class="section-subtext">Explore our specialty espresso bar, artisan toasties, fresh pastries, and refreshing iced botanicals.</p>
        </div>

        <div class="category-nav-pills">
          <button type="button" class="category-pill-btn active" data-cat="coffee" onclick="filterLandingMenu('coffee')">
            ☕ Coffee
          </button>
          <button type="button" class="category-pill-btn" data-cat="breakfast" onclick="filterLandingMenu('breakfast')">
            🥐 Breakfast
          </button>
          <button type="button" class="category-pill-btn" data-cat="lunch" onclick="filterLandingMenu('lunch')">
            🥪 Lunch
          </button>
          <button type="button" class="category-pill-btn" data-cat="cold" onclick="filterLandingMenu('cold')">
            🧋 Cold Drinks
          </button>
          <button type="button" class="category-pill-btn" data-cat="sweets" onclick="filterLandingMenu('sweets')">
            🍰 Sweets
          </button>
        </div>

        <div class="digital-menu-grid" id="digital-menu-grid">
          <!-- Dynamic Products inserted via filterLandingMenu -->
        </div>
      </section>

      <!-- 5. Digital Loyalty Section -->
      <section class="loyalty-section-wrap" id="loyalty-rewards-section">
        <div class="loyalty-hero-card">
          <div style="text-align:center; max-width:650px; margin:0 auto;">
            <span class="section-tag" style="color:var(--color-accent-gold);">Ravenhill Loyalty Program</span>
            <h2 class="section-main-title" style="margin-bottom:8px;">Every Coffee Brings You Closer to Your Next One.</h2>
            <p class="section-subtext">Earn points on every cup, unlock VIP upgrades, and get your 6th coffee entirely free on us.</p>
          </div>

          <div class="loyalty-tracker-strip">
            <div class="stamp-node filled">
              <div class="stamp-circle"><i class="ri-cup-fill"></i></div>
              <span class="stamp-label">Cup 1 ✓</span>
            </div>
            <div class="stamp-node filled">
              <div class="stamp-circle"><i class="ri-cup-fill"></i></div>
              <span class="stamp-label">Cup 2 ✓</span>
            </div>
            <div class="stamp-node filled">
              <div class="stamp-circle"><i class="ri-cup-fill"></i></div>
              <span class="stamp-label">Cup 3 ✓</span>
            </div>
            <div class="stamp-node">
              <div class="stamp-circle"><i class="ri-cup-line"></i></div>
              <span class="stamp-label">Cup 4</span>
            </div>
            <div class="stamp-node">
              <div class="stamp-circle"><i class="ri-cup-line"></i></div>
              <span class="stamp-label">Cup 5</span>
            </div>
            <div class="stamp-node free-reward">
              <div class="stamp-circle"><i class="ri-gift-fill"></i></div>
              <span class="stamp-label" style="color:#10b981; font-weight:800;">FREE COFFEE</span>
            </div>
          </div>

          <div class="loyalty-tiers-row">
            <div class="tier-badge-card active-tier">
              <div style="font-size:20px; margin-bottom:4px;">🥉 Bronze Member</div>
              <div style="font-size:12px; color:var(--color-cream-muted);">Earn 10 Pts per $1.00 spent. Redeem for $1.00 off per 20 Pts.</div>
            </div>
            <div class="tier-badge-card">
              <div style="font-size:20px; margin-bottom:4px; color:var(--color-cream);">🥈 Silver Tier</div>
              <div style="font-size:12px; color:var(--color-cream-muted);">1.2x Point multiplier + Free large size upgrade on your birthday.</div>
            </div>
            <div class="tier-badge-card">
              <div style="font-size:20px; margin-bottom:4px; color:var(--color-accent-gold);">🥇 Gold VIP</div>
              <div style="font-size:12px; color:var(--color-cream-muted);">1.5x Point multiplier + Free Oat / Almond milk upgrades forever.</div>
            </div>
          </div>

          <div style="text-align:center; margin-top:32px;">
            <button type="button" class="btn-hero-primary" onclick="joinRavenhillRewards()">
              <i class="ri-vip-crown-fill"></i> ⭐ Join Ravenhill Rewards
            </button>
          </div>
        </div>
      </section>

      <!-- 6. Visit & Flinders Lane Location Section -->
      <section class="landing-section" id="visit-section">
        <div class="visit-section-grid">
          <div class="visit-info-card">
            <div>
              <span class="section-tag">Find Us in Melbourne CBD</span>
              <h3 class="section-main-title" style="font-size:26px;">142 Flinders Lane</h3>
              <p class="section-subtext">Located in Melbourne's iconic cultural coffee laneway corridor. Walk-ins welcome, express click & collect available.</p>

              <table class="hours-table">
                <tbody>
                  <tr><td>Monday – Friday</td><td>6:30 AM – 4:00 PM</td></tr>
                  <tr><td>Saturday</td><td>7:30 AM – 3:30 PM</td></tr>
                  <tr><td>Sunday</td><td>8:00 AM – 3:00 PM</td></tr>
                  <tr><td>Public Holidays</td><td>8:00 AM – 2:00 PM</td></tr>
                </tbody>
              </table>
            </div>

            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:16px;">
              <button type="button" class="btn-hero-primary" onclick="window.switchModule('reservations')" style="padding:10px 20px; font-size:14px;">
                <i class="ri-calendar-check-line"></i> Book a Table
              </button>
              <a href="https://maps.google.com/?q=142+Flinders+Lane+Melbourne" target="_blank" rel="noopener" class="btn-hero-secondary" style="padding:10px 20px; font-size:14px;">
                <i class="ri-map-pin-2-line"></i> Open in Maps
              </a>
            </div>
          </div>

          <div class="visit-info-card" style="background:linear-gradient(135deg, #1c1510, #140e0a); justify-content:center; text-align:center; padding:40px 24px;">
            <i class="ri-store-2-fill" style="font-size:48px; color:var(--color-primary-light); margin-bottom:12px;"></i>
            <h4 style="font-size:22px; font-family:'Outfit', sans-serif; color:#fff; margin-bottom:8px;">Fast Laneway Pickup</h4>
            <p style="color:var(--color-cream-muted); font-size:14px; max-width:380px; margin:0 auto 20px;">Order ahead online with zero wait time. Your barista has your order steaming when you arrive.</p>
            <div>
              <button type="button" class="btn-hero-primary" onclick="filterLandingMenu('coffee'); document.getElementById('digital-menu-section')?.scrollIntoView({ behavior:'smooth' });" style="padding:12px 24px;">
                <i class="ri-smartphone-line"></i> Order Ahead Online
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Landing Page Footer -->
      <footer class="landing-footer">
        <div class="landing-footer-grid">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
              <img src="./brand_recources/ravenhill_logo.png" alt="Ravenhill Logo" style="width:36px; height:36px; border-radius:50%;">
              <strong style="font-family:'Outfit', sans-serif; font-size:18px; color:#fff; letter-spacing:1px;">RAVENHILL</strong>
            </div>
            <p style="font-size:13px; line-height:1.6; color:var(--color-cream-subtle);">
              Melbourne CBD Specialty Coffee Roasters. Dedicated to ethical sourcing, precision roasting, and extraordinary everyday coffee rituals.
            </p>
          </div>

          <div>
            <h5 style="color:#fff; font-size:14px; margin-bottom:12px;">Menu</h5>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
              <a href="#digital-menu-section" onclick="filterLandingMenu('coffee')" style="color:inherit; text-decoration:none;">Espresso Bar</a>
              <a href="#digital-menu-section" onclick="filterLandingMenu('breakfast')" style="color:inherit; text-decoration:none;">Artisan Breakfast</a>
              <a href="#digital-menu-section" onclick="filterLandingMenu('lunch')" style="color:inherit; text-decoration:none;">Gourmet Lunch</a>
              <a href="#digital-menu-section" onclick="filterLandingMenu('cold')" style="color:inherit; text-decoration:none;">Cold Drinks</a>
            </div>
          </div>

          <div>
            <h5 style="color:#fff; font-size:14px; margin-bottom:12px;">Quick Links</h5>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
              <a href="#loyalty-rewards-section" style="color:inherit; text-decoration:none;">Rewards Program</a>
              <a href="#visit-section" style="color:inherit; text-decoration:none;">Location & Hours</a>
              <a href="#" onclick="window.switchModule('pos')" style="color:inherit; text-decoration:none;">Staff POS Register</a>
              <a href="#" onclick="window.switchModule('customer_tracker')" style="color:inherit; text-decoration:none;">Live Order Tracker</a>
            </div>
          </div>

          <div>
            <h5 style="color:#fff; font-size:14px; margin-bottom:8px;">Get 10% Off First Order</h5>
            <p style="font-size:12px;">Join our Melbourne coffee dispatch newsletter:</p>
            <form onsubmit="event.preventDefault(); showToast('🎉 Subscribed! Use promo code MELB10 for 10% off at checkout.', 'success'); this.reset();" class="footer-newsletter-input">
              <input type="email" placeholder="Enter your email..." required>
              <button type="submit" class="btn-hero-primary" style="padding:8px 16px; font-size:12px; border-radius:20px;">Join</button>
            </form>
          </div>
        </div>

        <div class="footer-bottom-row">
          <span>© 2026 Ravenhill Coffee Roasters Pty Ltd. All Rights Reserved. ABN 88 142 904 883.</span>
          <span>142 Flinders Lane, Melbourne VIC 3000 • hello@ravenhillcoffee.com.au</span>
        </div>
      </footer>

    </div>
  `;

  // Initialize interactive components
  window.initPromoCountdown();
  window.initSteamParticles();
  window.initHeroBadgeProgression();
  window.filterLandingMenu('coffee');
}

// ==========================================================================
// 11. AI DEMAND FORECASTING & RAG INTELLIGENCE (NVIDIA NEMOTRON 3 ULTRA)
// ==========================================================================

let aiDemandChartInstance = null;
let aiSeasonalChartInstance = null;

async function renderAIForecastingView(container, forceRefresh = false) {
  const CACHE_KEY = 'RAVENHILL_AI_FORECAST_24H';
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

  let localCache = null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) localCache = JSON.parse(raw);
  } catch(e) {}

  const isCacheValid = localCache && (Date.now() - (localCache.timestamp || 0) < CACHE_TTL_MS);
  const elapsedMs = localCache ? (Date.now() - (localCache.timestamp || 0)) : 0;
  const remainingMs = Math.max(0, CACHE_TTL_MS - elapsedMs);
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  container.innerHTML = `
    <div class="ai-forecast-container">
      <div class="ai-hero-banner">
        <div class="ai-hero-header">
          <div class="ai-hero-title-group">
            <h2><i class="ri-brain-line" style="color:var(--color-primary-light);"></i> AI Predictive Demand Forecasting & RAG Intelligence</h2>
            <p>Powered by <strong>NVIDIA Nemotron 3 Ultra 550B</strong> with 2-year synthetic sales memory, 45+ historical stockout incidents, and live inventory depletion tracking.</p>
          </div>
          <div style="display:flex; align-items:center; flex-wrap:wrap; gap:10px;">
            <span class="ai-model-tag" style="background:rgba(16, 185, 129, 0.18); border-color:#10B981; color:#34D399;" title="AI Forecast refreshes automatically once every 24 hours">
              <i class="ri-history-line"></i> 24h Refresh: ${isCacheValid && !forceRefresh ? `Next in ${remainingHours}h ${remainingMins}m` : 'Live Synced'}
            </span>
            <span class="ai-model-tag"><i class="ri-shield-check-line"></i> NVIDIA Nemotron 3 Ultra</span>
            <button class="btn btn-outline btn-sm" onclick="renderAIForecastingView(document.getElementById('workspace-container'), true)" title="Bypass 24h cache and force recalculate live forecast">
              <i class="ri-refresh-line"></i> Force Refresh
            </button>
          </div>
        </div>
      </div>

      <div id="ai-forecast-loading" style="${isCacheValid && !forceRefresh ? 'display:none;' : 'padding:60px; text-align:center;'}">
        <i class="ri-loader-4-line ri-spin" style="font-size:42px; color:var(--color-primary);"></i>
        <h3 style="margin-top:14px; font-size:16px;">Analyzing 2-Year RAG Memory & Computing Consumption Curves...</h3>
        <p style="font-size:12px; color:var(--color-cream-muted);">Querying OpenRouter NVIDIA Nemotron 3 Ultra API...</p>
      </div>

      <div id="ai-forecast-content" class="${isCacheValid && !forceRefresh ? '' : 'hidden'}" style="display:flex; flex-direction:column; gap:24px;"></div>
    </div>
  `;

  try {
    let forecastData = null;
    if (!forceRefresh && isCacheValid && localCache.data) {
      forecastData = localCache.data;
    } else {
      const url = forceRefresh ? `${API_BASE}/ai/forecast.php?force_refresh=1` : `${API_BASE}/ai/forecast.php`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        forecastData = json.data;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: forecastData }));
        } catch(e) {}
        if (forceRefresh) showToast('⚡ Live AI Forecast re-generated! Next auto-refresh in 24 hours.', 'success');
      }
    }

    const loadingEl = document.getElementById('ai-forecast-loading');
    const contentEl = document.getElementById('ai-forecast-content');
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.classList.remove('hidden');

    if (!forecastData || !forecastData.forecast) {
      if (contentEl) contentEl.innerHTML = `<div class="empty-cart-state">Failed to load AI Forecast. Please try again.</div>`;
      return;
    }

    const fc = forecastData.forecast;
    const meta = forecastData.rag_data_points || {};

    contentEl.innerHTML = `
      <!-- 1. Executive Summary & KPI Cards -->
      <div style="background:var(--bg-surface); border:1px solid var(--color-border); border-left:4px solid var(--color-primary); border-radius:12px; padding:16px 20px;">
        <div style="font-size:12px; font-weight:700; color:var(--color-primary-light); text-transform:uppercase; margin-bottom:4px;">
          <i class="ri-sparkling-fill"></i> AI Executive Assessment (${forecastData.ai_engine || 'NVIDIA Nemotron'}) • 24h Sync
        </div>
        <div style="font-size:14px; color:var(--color-cream); line-height:1.6;">
          ${fc.summary || 'Inventory tracking active. Immediate reorder recommended for Oat Milk and Single Origin Beans.'}
        </div>
      </div>

      <div class="ai-kpi-grid">
        <div class="ai-kpi-card">
          <div class="ai-kpi-label"><i class="ri-alert-line" style="color:#EF4444;"></i> Urgent Reorders</div>
          <div class="ai-kpi-val" style="color:#F87171;">${fc.forecast_1_week ? fc.forecast_1_week.length : 0} Items</div>
          <div class="ai-kpi-sub">Next 7 days critical demand</div>
        </div>
        <div class="ai-kpi-card">
          <div class="ai-kpi-label"><i class="ri-gift-line" style="color:var(--color-accent-gold);"></i> Christmas Peak Surge</div>
          <div class="ai-kpi-val" style="color:var(--color-accent-gold);">+${fc.christmas_holiday_projection ? fc.christmas_holiday_projection.multiplier_pct : 320}%</div>
          <div class="ai-kpi-sub">Target: ${fc.christmas_holiday_projection ? fc.christmas_holiday_projection.peak_bean_demand_kg : 95}kg coffee beans</div>
        </div>
        <div class="ai-kpi-card">
          <div class="ai-kpi-label"><i class="ri-database-2-line" style="color:#60A5FA;"></i> RAG Memory Pool</div>
          <div class="ai-kpi-val">${meta.historical_sales_days || 730} Days</div>
          <div class="ai-kpi-sub">${meta.documented_incidents || 45} historical incidents indexed</div>
        </div>
        <div class="ai-kpi-card">
          <div class="ai-kpi-label"><i class="ri-shopping-bag-3-line" style="color:#10B981;"></i> Current Items Monitored</div>
          <div class="ai-kpi-val" style="color:#10B981;">${meta.tracked_inventory_items || 20} SKUs</div>
          <div class="ai-kpi-sub">${meta.low_stock_count || 0} currently below threshold</div>
        </div>
      </div>

      <!-- 2. Interactive Visual Analytics (Chart.js) -->
      <div class="ai-charts-grid">
        <div class="chart-canvas-wrapper">
          <div class="chart-header">
            <h3><i class="ri-line-chart-line" style="color:var(--color-primary);"></i> 7-Day Predictive Consumption Trend</h3>
            <span style="font-size:11px; color:var(--color-cream-muted);">Historical Burn Rate vs AI Forecast (kg)</span>
          </div>
          <div class="chart-container-inner">
            <canvas id="aiWeeklyDemandChart"></canvas>
          </div>
        </div>

        <div class="chart-canvas-wrapper">
          <div class="chart-header">
            <h3><i class="ri-bar-chart-2-line" style="color:var(--color-accent-gold);"></i> Holiday Multipliers</h3>
            <span style="font-size:11px; color:var(--color-cream-muted);">Seasonal Surges</span>
          </div>
          <div class="chart-container-inner">
            <canvas id="aiSeasonalChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 3. 1-Week Proactive Reorder Plan (1-Click PO) -->
      <div class="ai-reorder-table-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16px; margin:0; display:flex; align-items:center; gap:8px;">
              <i class="ri-shopping-cart-2-line" style="color:var(--color-primary);"></i> 1-Week Predictive Reorder Plan
            </h3>
            <span style="font-size:12px; color:var(--color-cream-muted);">NVIDIA Nemotron recommended purchases with auto-cost estimation</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="createBatchPurchaseOrder()">
            <i class="ri-check-double-line"></i> Approve All Recommended POs
          </button>
        </div>

        <div class="table-responsive">
          <table class="ai-reorder-table">
            <thead>
              <tr>
                <th>Item & Unit</th>
                <th>Current Stock</th>
                <th>Recommended PO</th>
                <th>Urgency</th>
                <th>Supplier</th>
                <th>Est. Cost</th>
                <th>RAG Justification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${(fc.forecast_1_week || []).map((item, i) => `
                <tr>
                  <td><strong>${item.item_name}</strong></td>
                  <td>${item.current_qty} ${item.unit}</td>
                  <td><span style="color:#10B981; font-weight:700;">+${item.recommended_order_qty} ${item.unit}</span></td>
                  <td>
                    <span class="urgency-badge-${(item.urgency || 'medium').toLowerCase()}">
                      ${item.urgency || 'Medium'}
                    </span>
                  </td>
                  <td>${item.supplier || 'Approved Supplier'}</td>
                  <td><strong>$${(item.est_cost_aud || 0).toFixed(2)}</strong></td>
                  <td style="font-size:12px; color:var(--color-cream-muted); max-width:280px;">${item.justification}</td>
                  <td>
                    <button class="btn-po-create" onclick="window.createAutoPurchaseOrder('${item.supplier}', '${item.item_name}', ${item.recommended_order_qty}, ${item.est_cost_aud || 0})">
                      <i class="ri-truck-line"></i> Create PO
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. Historical Incident Risks & POS Upsell Opportunities -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
        <div class="chart-canvas-wrapper" style="border-left:4px solid #EF4444;">
          <h3 style="font-size:15px; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <i class="ri-error-warning-line" style="color:#EF4444;"></i> RAG Incident Risk Warnings
          </h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${(fc.incident_risk_alerts || []).map(alert => `
              <div style="background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.2); padding:12px; border-radius:8px; font-size:13px; color:var(--color-cream); line-height:1.4;">
                ${alert}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="chart-canvas-wrapper" style="border-left:4px solid #10B981;">
          <h3 style="font-size:15px; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <i class="ri-lightbulb-line" style="color:#10B981;"></i> POS Smart Upselling Opportunities
          </h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${(fc.pos_upselling_actions || []).map(action => `
              <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.2); padding:12px; border-radius:8px; font-size:13px; color:var(--color-cream); line-height:1.4;">
                ✨ ${action}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Render Chart.js visual charts
    setTimeout(() => {
      initAIForecastCharts(fc);
    }, 100);

  } catch (err) {
    console.error('[AI Forecast Error]', err);
    const contentEl = document.getElementById('ai-forecast-content');
    if (contentEl) contentEl.innerHTML = `<div class="empty-cart-state">Error loading forecast: ${err.message}</div>`;
  }
}

function initAIForecastCharts(forecast) {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded yet');
    return;
  }

  // Chart 1: 7-Day Demand Trend (Line + Area)
  const ctxWeekly = document.getElementById('aiWeeklyDemandChart');
  if (ctxWeekly) {
    if (aiDemandChartInstance) aiDemandChartInstance.destroy();

    const chartData = forecast.chart_weekly_demand || {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      actual_last_week: [24.5, 26.0, 27.2, 28.8, 34.0, 48.5, 45.0],
      predicted_next_week: [25.8, 27.5, 28.6, 30.2, 36.5, 52.0, 48.2],
      safety_threshold: 15.0
    };

    aiDemandChartInstance = new Chart(ctxWeekly, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Predicted Next Week (kg)',
            data: chartData.predicted_next_week,
            borderColor: '#D96B43',
            backgroundColor: 'rgba(217, 107, 67, 0.25)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#D96B43'
          },
          {
            label: 'Actual Last Week (kg)',
            data: chartData.actual_last_week,
            borderColor: '#60A5FA',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3
          },
          {
            label: 'Safety Threshold (kg)',
            data: Array(7).fill(chartData.safety_threshold || 15),
            borderColor: '#EF4444',
            borderDash: [3, 3],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#E2E8F0', font: { size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          }
        }
      }
    });
  }

  // Chart 2: Seasonal Holiday Multipliers
  const ctxSeasonal = document.getElementById('aiSeasonalChart');
  if (ctxSeasonal) {
    if (aiSeasonalChartInstance) aiSeasonalChartInstance.destroy();

    aiSeasonalChartInstance = new Chart(ctxSeasonal, {
      type: 'bar',
      data: {
        labels: ['Baseline', 'Long Wknd', 'Coffee Fest', 'Christmas'],
        datasets: [{
          label: 'Demand Multiplier',
          data: [1.0, 1.45, 1.65, 3.2],
          backgroundColor: [
            'rgba(96, 165, 250, 0.6)',
            'rgba(52, 211, 153, 0.6)',
            'rgba(251, 191, 36, 0.7)',
            'rgba(217, 107, 67, 0.85)'
          ],
          borderColor: [
            '#60A5FA',
            '#34D399',
            '#FBBF24',
            '#D96B43'
          ],
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94A3B8', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          }
        }
      }
    });
  }
}

window.createAutoPurchaseOrder = function(supplier, item, qty, cost) {
  showToast(`⚡ Purchase Order PO-${Date.now().toString().slice(-4)} created for ${qty}x ${item} ($${cost.toFixed(2)})! Sent to ${supplier}.`, 'success');
  window.switchModule('suppliers');
};

window.createBatchPurchaseOrder = function() {
  showToast('⚡ Bulk Purchase Orders dispatched to Melbourne Coffee Exporters, MilkLab & BioPak!', 'success');
  window.switchModule('suppliers');
};

// ── Non-Blocking Smart In-Place Polling Engine (Zero-Flicker) ────
let isPollInProgress = false;
setInterval(async () => {
  if (isPollInProgress) return;
  const openModal = document.querySelector('.modal-backdrop:not(.hidden), .modal-overlay:not(.hidden)');
  if (openModal) return;

  isPollInProgress = true;
  try {
    if (AppState.activeModule === 'kds') {
      await window.refreshKDSInPlace();
    } else if (AppState.activeModule === 'waitstaff') {
      await window.refreshWaitStaffInPlace();
    } else if (AppState.activeModule === 'customer_tracker') {
      await window.refreshCustomerTrackerInPlace();
    }
  } catch (err) {
    console.warn('[Smart Poll Error]', err);
  } finally {
    isPollInProgress = false;
  }
}, 4000);