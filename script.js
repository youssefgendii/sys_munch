// State management
let cart = [];
let orders = [];
let orderIdCounter = 1;

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const orderItems = document.getElementById('orderItems');
const ordersList = document.getElementById('ordersList');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const dailyRevenueEl = document.getElementById('dailyRevenue');
const dailySummaryEl = document.getElementById('dailySummary');
const orderCountEl = document.getElementById('orderCount');
const clearBtn = document.getElementById('clearBtn');
const completeBtn = document.getElementById('completeBtn');
const langBtns = document.querySelectorAll('.lang-btn');
const timeDisplay = document.getElementById('timeDisplay');
const modal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close');
const modalOrderDetails = document.getElementById('modalOrderDetails');
const menuSectionOrder = ['sandwiches', 'sliders', 'snacks', 'extras', 'desserts'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = typeof getSavedLanguage === 'function' ? getSavedLanguage() : 'en';
    setLanguage(savedLang);
    langBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang));
    loadInventoryFromStorage();
    initializeMenu();
    setupEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
    loadOrdersFromStorage();
});

function setupEventListeners() {
    // Language switcher
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            langBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const lang = e.target.getAttribute('data-lang');
            setLanguage(lang);
            updatePageDisplay();
        });
    });

    // Order buttons
    clearBtn.addEventListener('click', clearOrder);
    completeBtn.addEventListener('click', confirmOrder);

    // Modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function initializeMenu() {
    displayMenuItems('all-sections');
}

function createMenuItemCard(item) {
    const itemEl = document.createElement('div');
    itemEl.className = 'menu-item';
    itemEl.innerHTML = `
        <div class="menu-item-icon">${item.icon}</div>
        <div class="menu-item-name">${getMenuItemName(item)}</div>
        <div class="menu-item-price">${item.price} LE</div>
    `;
    itemEl.addEventListener('click', () => addToCart(item));
    return itemEl;
}

function displayMenuItems(category) {
    menuGrid.innerHTML = '';

    if (category === 'all-sections') {
        menuSectionOrder.forEach(section => {
            const sectionItems = getMenuItemsByCategory(section);
            if (sectionItems.length === 0) return;

            const sectionEl = document.createElement('section');
            sectionEl.className = 'menu-category-section';
            sectionEl.innerHTML = `<h3 class="menu-section-title">${t(section)}</h3>`;

            const sectionGridEl = document.createElement('div');
            sectionGridEl.className = 'menu-section-grid';
            sectionItems.forEach(item => sectionGridEl.appendChild(createMenuItemCard(item)));

            sectionEl.appendChild(sectionGridEl);
            menuGrid.appendChild(sectionEl);
        });
        return;
    }

    const items = getMenuItemsByCategory(category);

    items.forEach(item => menuGrid.appendChild(createMenuItemCard(item)));
}

function addToCart(item) {
    const existingItem = cart.find(ci => ci.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1,
            name: item.name,
            nameAr: item.nameAr
        });
    }
    
    updateCartDisplay();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

function updateQuantity(itemId, change) {
    const item = cart.find(ci => ci.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    // Display order items
    if (cart.length === 0) {
        orderItems.innerHTML = `<p class="empty-message" data-i18n="no-items">${t('no-items')}</p>`;
        completeBtn.disabled = true;
    } else {
        orderItems.innerHTML = '';
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'order-item';
            const itemName = currentLanguage === 'ar' ? item.nameAr : item.name;
            const itemTotal = item.price * item.quantity;
            
            itemEl.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${itemName}</div>
                    <div class="order-item-qty">${item.quantity} x ${item.price} LE</div>
                </div>
                <div class="order-item-price">${itemTotal} LE</div>
                <div class="order-item-actions">
                    <button class="qty-btn" data-id="${item.id}" data-action="minus">âˆ’</button>
                    <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
                    <button class="remove-btn" data-id="${item.id}">âœ•</button>
                </div>
            `;
            
            itemEl.querySelector('[data-action="minus"]').addEventListener('click', () => updateQuantity(item.id, -1));
            itemEl.querySelector('[data-action="plus"]').addEventListener('click', () => updateQuantity(item.id, 1));
            itemEl.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item.id));
            
            orderItems.appendChild(itemEl);
        });
        completeBtn.disabled = false;
    }
    
    // Update totals
    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    subtotalEl.textContent = `${subtotal.toFixed(2)} LE`;
    totalEl.textContent = `${total.toFixed(2)} LE`;
}

function clearOrder() {
    if (cart.length > 0 && confirm(currentLanguage === 'ar' ? 'Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ø§Ù„Ø·Ù„Ø¨ØŸ' : 'Are you sure you want to clear the order?')) {
        cart = [];
        updateCartDisplay();
    }
}

function confirmOrder() {
    if (cart.length === 0) {
        alert(currentLanguage === 'ar' ? 'Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø¥Ø¶Ø§ÙØ© Ø¹Ù†Ø§ØµØ± Ø¥Ù„Ù‰ Ø§Ù„Ø·Ù„Ø¨' : 'Please add items to the order');
        return;
    }

    // Check inventory for all items
    const insufficientItems = [];
    cart.forEach(cartItem => {
        const menuItem = getMenuItemById(cartItem.id);
        if (menuItem && menuItem.quantity < cartItem.quantity) {
            insufficientItems.push({
                name: currentLanguage === 'ar' ? cartItem.nameAr : cartItem.name,
                available: menuItem.quantity,
                requested: cartItem.quantity
            });
        }
    });

    // If not enough inventory, show alert
    if (insufficientItems.length > 0) {
        let message = currentLanguage === 'ar' 
            ? 'Ø§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„Ù…ØªØ§Ø­Ø© ØºÙŠØ± ÙƒØ§ÙÙŠØ©:\n\n'
            : 'Insufficient quantity:\n\n';
        
        insufficientItems.forEach(item => {
            if (currentLanguage === 'ar') {
                message += `${item.name}: ${item.available} Ù…ØªÙˆÙØ±ØŒ ${item.requested} Ù…Ø·Ù„ÙˆØ¨\n`;
            } else {
                message += `${item.name}: ${item.available} available, ${item.requested} requested\n`;
            }
        });

        // Show popup notification
        showAlert(message, insufficientItems[0].name);
        return;
    }

    // Update inventory
    cart.forEach(cartItem => {
        const menuItem = getMenuItemById(cartItem.id);
        if (menuItem) {
            menuItem.quantity -= cartItem.quantity;
        }
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    const order = {
        id: orderIdCounter++,
        items: JSON.parse(JSON.stringify(cart)),
        subtotal: subtotal,
        total: total,
        timestamp: new Date(),
        timeString: new Date().toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')
    };

    orders.unshift(order);
    saveOrdersToStorage();
    saveInventoryToStorage();
    cart = [];
    updateCartDisplay();
    updateOrdersList();

    // Show confirmation message
    const message = currentLanguage === 'ar' ? `ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨ #${order.id}` : `Order #${order.id} confirmed!`;
    showNotification(message);
}

function updateOrdersList() {
    if (orders.length === 0) {
        ordersList.innerHTML = `<p class="empty-message" data-i18n="no-orders">${t('no-orders')}</p>`;
        if (dailySummaryEl) dailySummaryEl.style.display = 'none';
    } else {
        ordersList.innerHTML = '';
        orders.forEach((order, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'order-card';
            
            const itemsList = order.items.map(item => {
                const name = currentLanguage === 'ar' ? item.nameAr : item.name;
                return `${name} x${item.quantity}`;
            }).join(', ');
            
            const timeFormat = currentLanguage === 'ar' 
                ? order.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                : order.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            
            const deleteText = currentLanguage === 'ar' ? 'âœ• Ø­Ø°Ù' : 'âœ• Delete';
            
            cardEl.innerHTML = `
                <div class="order-card-header">
                    <div>
                        <span class="order-card-id">${t('order')} #${order.id}</span>
                        <span class="order-card-time">${timeFormat}</span>
                    </div>
                    <button class="order-delete-btn" data-index="${index}" title="${deleteText}">âœ•</button>
                </div>
                <div class="order-card-items">${itemsList}</div>
                <div class="order-card-price">${order.total.toFixed(2)} LE</div>
            `;
            
            // Click to show details
            cardEl.querySelector('.order-card-items').addEventListener('click', () => showOrderDetails(order));
            
            // Delete button
            cardEl.querySelector('.order-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteOrder(index);
            });
            
            ordersList.appendChild(cardEl);
        });
        
        if (dailySummaryEl) dailySummaryEl.style.display = 'block';
        updateDailyRevenue();
    }
    
    orderCountEl.textContent = orders.length;
}

function deleteOrder(index) {
    const order = orders[index];
    const confirmText = currentLanguage === 'ar' 
        ? `Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ø§Ù„Ø·Ù„Ø¨ #${order.id}ØŸ` 
        : `Are you sure you want to delete Order #${order.id}?`;
    
    if (confirm(confirmText)) {
        orders.splice(index, 1);
        saveOrdersToStorage();
        updateOrdersList();
        
        const message = currentLanguage === 'ar' 
            ? `ØªÙ… Ø­Ø°Ù Ø§Ù„Ø·Ù„Ø¨ #${order.id}` 
            : `Order #${order.id} deleted`;
        showNotification(message);
    }
}

function showOrderDetails(order) {
    modalOrderDetails.innerHTML = '';
    
    order.items.forEach(item => {
        const itemName = currentLanguage === 'ar' ? item.nameAr : item.name;
        const div = document.createElement('div');
        div.className = 'modal-item';
        div.innerHTML = `
            <span>${itemName} x${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)} LE</span>
        `;
        modalOrderDetails.appendChild(div);
    });
    
    const totalDiv = document.createElement('div');
    totalDiv.className = 'modal-item';
    totalDiv.innerHTML = `
        <span>${t('total')}</span>
        <span>${order.total.toFixed(2)} LE</span>
    `;
    modalOrderDetails.appendChild(totalDiv);
    
    modal.style.display = 'block';
}

function updateDailyRevenue() {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    if (dailyRevenueEl) dailyRevenueEl.textContent = `${revenue.toFixed(2)} LE`;
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    timeDisplay.textContent = timeString;
}

function showNotification(message) {
    // Simple notification - can be enhanced
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function showAlert(message, itemName) {
    // Alert-style notification for inventory issues
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        max-width: 400px;
        text-align: center;
        border-left: 4px solid #e74c3c;
    `;
    alertBox.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 15px;">âš ï¸</div>
        <div style="font-weight: bold; margin-bottom: 10px; color: #e74c3c;">${currentLanguage === 'ar' ? 'Ø¹Ø¯Ù… ØªÙˆÙØ± Ø§Ù„ÙƒÙ…ÙŠØ©' : 'Insufficient Stock'}</div>
        <div style="color: #2c3e50; margin-bottom: 20px; white-space: pre-wrap; font-size: 14px;">${message}</div>
        <button id="closeAlert" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        ">${currentLanguage === 'ar' ? 'Ø­Ø³Ù†Ø§Ù‹' : 'OK'}</button>
    `;
    
    document.body.appendChild(alertBox);
    
    document.getElementById('closeAlert').addEventListener('click', () => {
        alertBox.style.opacity = '0';
        alertBox.style.transition = 'opacity 0.3s ease';
        setTimeout(() => alertBox.remove(), 300);
    });
}

function updatePageDisplay() {
    displayMenuItems('all-sections');
    updateCartDisplay();
    updateOrdersList();
}

// Local Storage Management
function saveOrdersToStorage() {
    const today = new Date().toDateString();
    localStorage.setItem('munch_orders_' + today, JSON.stringify(orders.map(o => ({
        ...o,
        timestamp: o.timestamp.toISOString()
    }))));
}

function loadOrdersFromStorage() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('munch_orders_' + today);
    if (stored) {
        try {
            orders = JSON.parse(stored).map(o => ({
                ...o,
                timestamp: new Date(o.timestamp)
            }));
            orderIdCounter = (Math.max(...orders.map(o => o.id)) || 0) + 1;
            updateOrdersList();
        } catch (e) {
            console.error('Error loading orders:', e);
        }
    }
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

