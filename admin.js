// Admin Dashboard Script

// Check if logged in
if (sessionStorage.getItem('munch_admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
}

const closeModal = document.querySelector('.close');
const editModal = document.getElementById('editModal');
const saveQuantityBtn = document.getElementById('saveQuantityBtn');
const cancelQuantityBtn = document.getElementById('cancelQuantityBtn');
const quantityInput = document.getElementById('quantityInput');
let currentEditingItem = null;
const SHARED_ORDERS_API = '/.netlify/functions/orders';

function getBusinessDayKey(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadInventoryFromStorage();
    setupEventListeners();
    updateTabs();
    const savedLang = typeof getSavedLanguage === 'function' ? getSavedLanguage() : 'en';
    setLanguage(savedLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
    });
});

function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            const tabId = e.target.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            updateTabs();
        });
    });

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            setLanguage(e.target.getAttribute('data-lang'));
        });
    });

    // Inventory filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateInventoryTable(e.target.getAttribute('data-filter'));
        });
    });

    // Modal
    closeModal.addEventListener('click', () => editModal.style.display = 'none');
    cancelQuantityBtn.addEventListener('click', () => editModal.style.display = 'none');
    saveQuantityBtn.addEventListener('click', saveQuantityChange);

    // Reset button
    document.getElementById('resetAllBtn').addEventListener('click', resetAllData);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
}

async function updateTabs() {
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    if (activeTab === 'today') {
        await updateTodayTab();
    } else if (activeTab === 'monthly') {
        await updateMonthlyTab();
    } else if (activeTab === 'inventory') {
        updateInventoryTab();
    }
}

async function updateTodayTab() {
    const todayOrders = await loadOrdersByDate(getBusinessDayKey());

    // Stats
    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const itemsSold = todayOrders.reduce((sum, order) => sum + order.items.reduce((s, i) => s + i.quantity, 0), 0);

    document.getElementById('todayOrderCount').textContent = totalOrders;
    document.getElementById('todayRevenue').textContent = `${totalRevenue.toFixed(2)} LE`;
    document.getElementById('avgOrderValue').textContent = `${avgOrderValue.toFixed(2)} LE`;
    document.getElementById('itemsSoldCount').textContent = itemsSold;

    // Orders Table
    const todayOrdersTable = document.getElementById('todayOrdersTable');
    if (todayOrders.length === 0) {
        todayOrdersTable.innerHTML = `<tr><td colspan="4" class="empty-state" data-i18n="no-orders">${t('no-orders')}</td></tr>`;
    } else {
        todayOrdersTable.innerHTML = todayOrders.map(order => {
            const itemsList = order.items.map(item => {
                const name = currentLanguage === 'ar' ? item.nameAr : item.name;
                return `${name} x${item.quantity}`;
            }).join(', ');

            const timeFormat = currentLanguage === 'ar' 
                ? order.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                : order.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            return `
                <tr>
                    <td><strong>#${order.id}</strong></td>
                    <td>${timeFormat}</td>
                    <td>${itemsList}</td>
                    <td><strong>${order.total.toFixed(2)} LE</strong></td>
                </tr>
            `;
        }).join('');
    }

    // Top Items
    updateTopItems(todayOrders, 'todayTopItems');
}

async function updateMonthlyTab() {
    const allOrders = await loadAllMonthlyOrders();

    // Stats
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const itemsSold = allOrders.reduce((sum, order) => sum + order.items.reduce((s, i) => s + i.quantity, 0), 0);

    document.getElementById('monthlyOrderCount').textContent = totalOrders;
    document.getElementById('monthlyRevenue').textContent = `${totalRevenue.toFixed(2)} LE`;
    document.getElementById('monthlyAvgOrderValue').textContent = `${avgOrderValue.toFixed(2)} LE`;
    document.getElementById('monthlySoldCount').textContent = itemsSold;

    // Monthly Breakdown
    const byDate = {};
    allOrders.forEach(order => {
        const dateStr = order.timestamp.toDateString();
        if (!byDate[dateStr]) {
            byDate[dateStr] = { orders: [], revenue: 0, items: 0 };
        }
        byDate[dateStr].orders.push(order);
        byDate[dateStr].revenue += order.total;
        byDate[dateStr].items += order.items.reduce((s, i) => s + i.quantity, 0);
    });

    const breakdown = document.getElementById('monthlyBreakdown');
    breakdown.innerHTML = Object.entries(byDate)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, data]) => {
            const dateObj = new Date(date);
            const dateStr = dateObj.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US');
            return `
                <div class="breakdown-card">
                    <div class="breakdown-date">${dateStr}</div>
                    <div class="breakdown-stats">
                        <div class="breakdown-stat">
                            <span>${t('order')}:</span>
                            <span>${data.orders.length}</span>
                        </div>
                        <div class="breakdown-stat">
                            <span>${t('items')}:</span>
                            <span>${data.items}</span>
                        </div>
                        <div class="breakdown-stat">
                            <span>${t('total')}:</span>
                            <span>${data.revenue.toFixed(2)} LE</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    // Top Items
    updateTopItems(allOrders, 'monthlyTopItems');
}

function updateTopItems(orders, elementId) {
    const itemCounts = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const name = currentLanguage === 'ar' ? item.nameAr : item.name;
            if (!itemCounts[name]) {
                itemCounts[name] = 0;
            }
            itemCounts[name] += item.quantity;
        });
    });

    const topItems = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    const container = document.getElementById(elementId);
    if (topItems.length === 0) {
        container.innerHTML = `<p class="empty-state" data-i18n="no-items">${t('no-items')}</p>`;
    } else {
        container.innerHTML = topItems.map(([name, qty]) => `
            <div class="item-card">
                <div class="item-name">${name}</div>
                <div class="item-quantity">${qty}</div>
                <div class="item-sold" data-i18n="items-sold">${t('items-sold')}</div>
            </div>
        `).join('');
    }
}

function updateInventoryTab() {
    updateInventoryTable('sandwiches');
}

function updateInventoryTable(category) {
    const inventoryTable = document.getElementById('inventoryTable');
    let items = [];

    if (category === 'all') {
        for (let cat in menuData) {
            items.push(...menuData[cat]);
        }
    } else {
        items = menuData[category] || [];
    }

    if (items.length === 0) {
        inventoryTable.innerHTML = `<tr><td colspan="5" class="empty-state" data-i18n="no-items">${t('no-items')}</td></tr>`;
    } else {
        inventoryTable.innerHTML = items.map(item => {
            const name = currentLanguage === 'ar' ? item.nameAr : item.name;
            let statusClass = 'status-good';
            let statusText = 'In Stock';
            
            if (item.quantity === 0) {
                statusClass = 'status-danger';
                statusText = 'Out of Stock';
            } else if (item.quantity < 10) {
                statusClass = 'status-warning';
                statusText = 'Low Stock';
            }

            if (currentLanguage === 'ar') {
                if (item.quantity === 0) statusText = 'ØºÙŠØ± Ù…ØªÙˆÙØ±';
                else if (item.quantity < 10) statusText = 'ÙƒÙ…ÙŠØ© Ù‚Ù„ÙŠÙ„Ø©';
                else statusText = 'Ù…ØªÙˆÙØ±';
            }

            return `
                <tr>
                    <td>${name}</td>
                    <td>${item.price} LE</td>
                    <td><strong>${item.quantity}</strong></td>
                    <td>
                        <button class="edit-btn" onclick="openEditQuantity(${item.id}, '${name}', ${item.quantity})" data-i18n="edit">Edit</button>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function openEditQuantity(itemId, itemName, currentQty) {
    currentEditingItem = itemId;
    document.getElementById('editItemName').textContent = itemName;
    quantityInput.value = currentQty;
    editModal.style.display = 'block';
    quantityInput.focus();
}

function saveQuantityChange() {
    if (currentEditingItem === null) return;

    const newQty = parseInt(quantityInput.value);
    if (isNaN(newQty) || newQty < 0) {
        alert(currentLanguage === 'ar' ? 'Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø¥Ø¯Ø®Ø§Ù„ ÙƒÙ…ÙŠØ© ØµØ­ÙŠØ­Ø©' : 'Please enter a valid quantity');
        return;
    }

    const item = getMenuItemById(currentEditingItem);
    if (item) {
        item.quantity = newQty;
        saveInventoryToStorage();
        updateInventoryTable(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
        editModal.style.display = 'none';
    }
}

// Storage Functions
async function loadOrdersByDate(dateStr) {
    try {
        const response = await fetch(`${SHARED_ORDERS_API}?dayKey=${encodeURIComponent(dateStr)}`, {
            cache: 'no-store'
        });
        if (response.ok) {
            const payload = await response.json();
            const sharedOrders = Array.isArray(payload.orders) ? payload.orders : [];
            return sharedOrders.map(o => ({
                ...o,
                timestamp: new Date(o.timestamp)
            }));
        }
    } catch (e) {
        // fallback to local storage below
    }

    const stored = localStorage.getItem('munch_orders_' + dateStr);
    if (stored) {
        try {
            return JSON.parse(stored).map(o => ({
                ...o,
                timestamp: new Date(o.timestamp)
            }));
        } catch (e) {
            return [];
        }
    }
    return [];
}

async function loadAllMonthlyOrders() {
    const orders = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (let day = 1; day <= currentDate.getDate(); day++) {
        const date = new Date(currentYear, currentMonth, day);
        if (date > currentDate) break;
        const dateStr = getBusinessDayKey(date);
        const dayOrders = await loadOrdersByDate(dateStr);
        orders.push(...dayOrders);
    }

    return orders;
}

function saveInventoryToStorage() {
    localStorage.setItem('munch_inventory', JSON.stringify(menuData));
}

function loadInventoryFromStorage() {
    const stored = localStorage.getItem('munch_inventory');
    if (stored) {
        try {
            const savedData = JSON.parse(stored);
            for (let category in savedData) {
                if (menuData[category]) {
                    menuData[category].forEach((item, idx) => {
                        if (savedData[category][idx]) {
                            item.quantity = savedData[category][idx].quantity;
                        }
                    });
                }
            }
        } catch (e) {
            console.error('Error loading inventory:', e);
        }
    }
}

function getMenuItemById(id) {
    for (let category in menuData) {
        const item = menuData[category].find(i => i.id === id);
        if (item) return item;
    }
    return null;
}

// Add translation update function for admin
function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    updatePageTranslations();
    updateTabs();
}

// Reset all data for testing
function resetAllData() {
    const confirmMsg = currentLanguage === 'ar' 
        ? 'Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø±ØºØ¨ØªÙƒ ÙÙŠ Ø­Ø°Ù Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø·Ù„Ø¨Ø§Øª ÙˆØ§Ù„Ø¨ÙŠØ§Ù†Ø§ØªØŸ Ù‡Ø°Ø§ Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡ Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„ØªØ±Ø§Ø¬Ø¹ Ø¹Ù†Ù‡!'
        : 'Are you sure you want to delete ALL orders and reset inventory? This action cannot be undone!';
    
    if (confirm(confirmMsg)) {
        // Clear all orders from today
        const today = getBusinessDayKey();
        localStorage.removeItem('munch_orders_' + today);
        
        // Reset inventory to initial values
        const initialInventory = {
            sandwiches: [
                { id: 1, name: 'Pulled Beef', price: 180, icon: 'ðŸ¥©', nameAr: 'Ù„Ø­Ù… Ù…Ø³Ø­ÙˆØ¨', quantity: 50 },
                { id: 2, name: 'Beef Burger', price: 175, icon: 'ðŸ”', nameAr: 'Ø¨Ø±Ø¬Ø± Ù„Ø­Ù…', quantity: 45 },
                { id: 3, name: 'Chicken Fajita', price: 140, icon: 'ðŸŒ®', nameAr: 'ÙØ§Ø¬ÙŠØªØ§ Ø¯Ø¬Ø§Ø¬', quantity: 40 },
                { id: 4, name: 'Dynamite Chicken', price: 160, icon: 'ðŸŒ¶ï¸', nameAr: 'Ø¯Ø¬Ø§Ø¬ Ø¯ÙŠÙ†Ø§Ù…ÙŠØª', quantity: 35 },
                { id: 5, name: 'Falafel & Eggplants', price: 80, icon: 'ðŸŸ¤', nameAr: 'ÙÙ„Ø§ÙÙ„ ÙˆØ¨Ø§Ø°Ù†Ø¬Ø§Ù†', quantity: 60 },
                { id: 6, name: 'Halloumi Cheese', price: 120, icon: 'ðŸ§€', nameAr: 'Ø¬Ø¨Ù† Ø­Ù„ÙˆÙ…', quantity: 38 },
            ],
            sliders: [
                { id: 7, name: 'Beef Burger Slider', price: 140, icon: 'ðŸ”', nameAr: 'Ø´Ø±ÙŠØ­Ø© Ø¨Ø±Ø¬Ø± Ù„Ø­Ù…', quantity: 50 },
                { id: 8, name: 'Fried Chicken Slider', price: 100, icon: 'ðŸ—', nameAr: 'Ø´Ø±ÙŠØ­Ø© Ø¯Ø¬Ø§Ø¬ Ù…Ù‚Ù„ÙŠ', quantity: 42 },
                { id: 9, name: 'Fried Shrimps Slider', price: 280, icon: 'ðŸ¤', nameAr: 'Ø´Ø±ÙŠØ­Ø© Ø¬Ù…Ø¨Ø±ÙŠ Ù…Ù‚Ù„ÙŠ', quantity: 28 },
            ],
            snacks: [
                { id: 10, name: 'Burger Coin Slimmies', price: 220, icon: 'ðŸ’°', nameAr: 'Ù‚Ø·Ø¹ Ø§Ù„Ø¨Ø±Ø¬Ø±', quantity: 50 },
                { id: 11, name: 'Mini Hawawshi', price: 150, icon: 'ðŸ¥–', nameAr: 'Ø­ÙˆØ§ÙˆØ´ÙŠ ØµØºÙŠØ±', quantity: 40 },
                { id: 12, name: 'Tortilla Kebab Skewers', price: 250, icon: 'ðŸŒ¯', nameAr: 'Ø´ÙŠØ´ Ø·Ø±Ø·ÙˆØ± Ø§Ù„ÙƒØ¨Ø§Ø¨', quantity: 30 },
                { id: 13, name: 'Mini Corn Dogs', price: 140, icon: 'ðŸŒ­', nameAr: 'Ù†Ù‚Ø§Ù†Ù‚ Ø§Ù„Ø°Ø±Ø© Ø§Ù„ØµØºÙŠØ±Ø©', quantity: 35 },
                { id: 14, name: 'Dynamite Shrimp', price: 275, icon: 'ðŸŒ¶ï¸', nameAr: 'Ø¬Ù…Ø¨Ø±ÙŠ Ø¯ÙŠÙ†Ø§Ù…ÙŠØª', quantity: 25 },
                { id: 15, name: 'Sweet Corn on the Cob', price: 75, icon: 'ðŸŒ½', nameAr: 'Ø°Ø±Ø© Ø­Ù„ÙˆØ©', quantity: 45 },
                { id: 16, name: 'Stuffed Vine Leaves', price: 95, icon: 'ðŸƒ', nameAr: 'ÙˆØ±Ù‚ Ø¹Ù†Ø¨ Ù…Ø­Ø´ÙŠ', quantity: 40 },
                { id: 17, name: 'Loaded Chips Bag', price: 85, icon: 'ðŸ¥”', nameAr: 'ÙƒÙŠØ³ Ø´ÙŠØ¨Ø³ÙŠ Ù…Ø­Ù…Ù„', quantity: 60 },
                { id: 18, name: 'Mini Roz Maamor', price: 100, icon: 'ðŸš', nameAr: 'Ø£Ø±Ø² Ù…Ù…ÙˆØ± ØµØºÙŠØ±', quantity: 30 },
                { id: 19, name: 'Mini Roz Maamor - Meat', price: 180, icon: 'ðŸš', nameAr: 'Ø£Ø±Ø² Ù…Ù…ÙˆØ± ØµØºÙŠØ± Ù„Ø­Ù…', quantity: 25 },
                { id: 20, name: 'Mini Roz Maamor - Hamam', price: 275, icon: 'ðŸš', nameAr: 'Ø£Ø±Ø² Ù…Ù…ÙˆØ± ØµØºÙŠØ± Ø­Ù…Ø§Ù…', quantity: 20 },
                { id: 27, name: 'Plate Chicken Tenders with Fries', price: 140, icon: 'ðŸŸ', nameAr: 'ØµØ¯ÙˆØ± Ø¯Ø¬Ø§Ø¬ Ù…Ø¹ Ø¨Ø·Ø§Ø·Ø³', quantity: 55 },
                { id: 28, name: 'Fries Cup', price: 100, icon: 'â˜•', nameAr: 'ÙƒÙˆØ¨ Ø¨Ø·Ø§Ø·Ø³', quantity: 100 },
            ],
            extras: [
                { id: 29, name: 'Soft Drink', price: 30, icon: '🥤', nameAr: 'مشروب غازي', quantity: 200 },
                { id: 30, name: 'Extra Sauce', price: 10, icon: '🥫', nameAr: 'صوص إضافي', quantity: 300 },
                { id: 34, name: 'Truffle Mayo', price: 30, icon: '🍄', nameAr: 'مايونيز ترافل', quantity: 150 },
            ],
            desserts: [
                { id: 21, name: 'Sweet Potato CrÃ¨me BrÃ»lÃ©e', price: 100, icon: 'ðŸ®', nameAr: 'ÙƒØ±ÙŠÙ…Ø© Ø§Ù„Ø¨Ø·Ø§Ø·Ø§ Ø§Ù„Ø­Ù„ÙˆØ©', quantity: 32 },
                { id: 22, name: 'Vanilla Ice Cream', price: 20, icon: 'ðŸ¦', nameAr: 'Ø¢ÙŠØ³ ÙƒØ±ÙŠÙ… ÙØ§Ù†ÙŠÙ„ÙŠØ§', quantity: 100 },
                { id: 23, name: 'Cookie Fries', price: 80, icon: 'ðŸª', nameAr: 'Ø¨Ø³ÙƒÙˆÙŠØª Ù…Ù‚Ù„ÙŠ', quantity: 44 },
                { id: 24, name: 'Cookie Sandwich', price: 180, icon: 'ðŸª', nameAr: 'Ø³Ù†Ø¯ÙˆÙŠØªØ´ Ø§Ù„Ø¨Ø³ÙƒÙˆÙŠØª', quantity: 25 },
                { id: 25, name: 'Strawberry Dubai Kunafa', price: 150, icon: 'ðŸ“', nameAr: 'ÙƒÙ†Ø§ÙØ© ÙØ±Ø§ÙˆÙ„Ø© Ø¯Ø¨ÙŠ', quantity: 20 },
                { id: 26, name: 'Tiramisu Cup', price: 100, icon: 'â˜•', nameAr: 'ÙƒÙˆØ¨ ØªÙŠØ±Ø§Ù…ÙŠØ³Ùˆ', quantity: 30 },
            ]
        };
        
        // Update menuData globally
        Object.assign(menuData, initialInventory);
        
        // Save to storage
        localStorage.setItem('munch_inventory', JSON.stringify(initialInventory));
        
        // Refresh the page
        setTimeout(() => {
            window.location.reload();
        }, 500);
        
        const msg = currentLanguage === 'ar' ? 'âœ… ØªÙ… Ø¥Ø¹Ø§Ø¯Ø© ØªØ¹ÙŠÙŠÙ† Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª!' : 'âœ… All data has been reset!';
        alert(msg);
    }
}

// Logout function
function logout() {
    const confirmMsg = currentLanguage === 'ar' 
        ? 'Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø±ØºØ¨ØªÙƒ ÙÙŠ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬ØŸ'
        : 'Are you sure you want to logout?';
    
    if (confirm(confirmMsg)) {
        sessionStorage.removeItem('munch_admin_logged_in');
        sessionStorage.removeItem('munch_admin_login_time');
        window.location.href = 'login.html';
    }
}

