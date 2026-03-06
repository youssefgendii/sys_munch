const inProgressContainer = document.getElementById("inProgressContainer");
const doneContainer = document.getElementById("doneContainer");
const orderCount = document.getElementById("orderCount");
const inProgressCount = document.getElementById("inProgressCount");
const doneCount = document.getElementById("doneCount");
const inProgressBadge = document.getElementById("inProgressBadge");
const doneBadge = document.getElementById("doneBadge");
const lastUpdate = document.getElementById("lastUpdate");
const refreshBtn = document.getElementById("refreshBtn");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const backToCashierBtn = document.getElementById("backToCashierBtn");
const ordersLabel = document.getElementById("ordersLabel");
const inProgressLabel = document.getElementById("inProgressLabel");
const doneLabel = document.getElementById("doneLabel");
const lastUpdateLabel = document.getElementById("lastUpdateLabel");
const inProgressHeader = document.getElementById("inProgressHeader");
const doneHeader = document.getElementById("doneHeader");

const LANGUAGE_STORAGE_KEY = "munch_language";
const SHARED_ORDERS_API = "/.netlify/functions/orders";

function getBusinessDayKey() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Cairo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

const pageI18n = {
    en: {
        title: "Current Orders",
        subtitle: "Chef View - Auto refresh every 2 seconds",
        refresh: "Refresh",
        back: "Back to Cashier",
        orders: "Orders",
        inProgress: "In Progress",
        done: "Done",
        lastUpdate: "Last update",
        noInProgress: "No in-progress orders",
        noDone: "No done orders",
        markDone: "Mark Done",
        markProgress: "Move to In Progress",
        delete: "Delete",
        order: "Order",
        total: "Total"
    },
    ar: {
        title: "الطلبات الحالية",
        subtitle: "عرض المطبخ - تحديث تلقائي كل ثانيتين",
        refresh: "تحديث",
        back: "العودة إلى الكاشير",
        orders: "الطلبات",
        inProgress: "جاري التحضير",
        done: "تمت",
        lastUpdate: "آخر تحديث",
        noInProgress: "لا توجد طلبات جارية",
        noDone: "لا توجد طلبات منتهية",
        markDone: "تعيين كمنتهي",
        markProgress: "إعادة إلى جاري",
        delete: "حذف",
        order: "طلب",
        total: "الإجمالي"
    }
};

function getCurrentLanguage() {
    try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return saved === "ar" ? "ar" : "en";
    } catch {
        return "en";
    }
}

function tr(key) {
    const lang = getCurrentLanguage();
    return pageI18n[lang][key] || pageI18n.en[key] || key;
}

function applyPageLanguage() {
    const lang = getCurrentLanguage();

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    pageTitle.textContent = tr("title");
    pageSubtitle.textContent = tr("subtitle");
    refreshBtn.textContent = tr("refresh");
    backToCashierBtn.textContent = tr("back");
    ordersLabel.textContent = tr("orders");
    inProgressLabel.textContent = tr("inProgress");
    doneLabel.textContent = tr("done");
    lastUpdateLabel.textContent = tr("lastUpdate");
    inProgressHeader.textContent = tr("inProgress");
    doneHeader.textContent = tr("done");
}

function getTodayKey() {
    return "munch_orders_" + getBusinessDayKey();
}

function getStatusKey() {
    return "munch_order_status_" + getBusinessDayKey();
}

async function loadSharedDayData() {
    const dayKey = getBusinessDayKey();

    try {
        const response = await fetch(`${SHARED_ORDERS_API}?dayKey=${encodeURIComponent(dayKey)}`, {
            cache: "no-store"
        });

        if (response.ok) {
            const payload = await response.json();

            const parsedOrders = Array.isArray(payload.orders) ? payload.orders : [];
            const parsedStatus = payload.statusMap && typeof payload.statusMap === "object" ? payload.statusMap : {};

            localStorage.setItem(getTodayKey(), JSON.stringify(parsedOrders));
            localStorage.setItem(getStatusKey(), JSON.stringify(parsedStatus));

            return { orders: parsedOrders, statusMap: parsedStatus };
        }
    } catch { }

    const rawOrders = localStorage.getItem(getTodayKey());
    const rawStatus = localStorage.getItem(getStatusKey());

    let parsedOrders = [];
    let parsedStatus = {};

    try { parsedOrders = rawOrders ? JSON.parse(rawOrders) : []; } catch { }
    try { parsedStatus = rawStatus ? JSON.parse(rawStatus) : {}; } catch { }

    return { orders: parsedOrders, statusMap: parsedStatus };
}

function normalizeOrder(order, index) {
    const timestamp = new Date(order.timestamp || Date.now());

    const rawId = Number(order.id);
    const hasValidId = Number.isFinite(rawId) && rawId > 0;

    const uid = hasValidId
        ? `id_${rawId}`
        : `ts_${timestamp.getTime()}_${index}`;

    return {
        ...order,
        timestamp,
        uid,
        displayId: hasValidId ? String(rawId) : "",
        total: Number(order.total || 0),
        items: Array.isArray(order.items) ? order.items : []
    };
}

function loadStatusMap() {
    const raw = localStorage.getItem(getStatusKey());
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
}

function saveStatusMap(statusMap) {
    localStorage.setItem(getStatusKey(), JSON.stringify(statusMap));
}

async function setOrderStatus(orderKey, status) {
    const statusMap = loadStatusMap();

    statusMap[String(orderKey)] = status;
    saveStatusMap(statusMap);

    try {
        const dayKey = getBusinessDayKey();

        await fetch(SHARED_ORDERS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "setStatus",
                dayKey,
                orderKey,
                status
            })
        });

    } catch { }
}

async function deleteOrder(orderKey) {

    const rawOrders = localStorage.getItem(getTodayKey());
    let orders = [];

    try {
        orders = rawOrders ? JSON.parse(rawOrders) : [];
    } catch {
        orders = [];
    }

    const normalized = orders.map((o, i) => normalizeOrder(o, i));
    const filtered = normalized.filter(o => o.uid !== orderKey);

    localStorage.setItem(getTodayKey(), JSON.stringify(filtered));

    const statusMap = loadStatusMap();
    delete statusMap[orderKey];
    saveStatusMap(statusMap);

    try {
        const dayKey = getBusinessDayKey();

        await fetch(SHARED_ORDERS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "deleteOrder",
                dayKey,
                orderKey
            })
        });

    } catch { }
}

function cleanupStatusMap(orders, statusMap) {

    const existingIds = new Set(orders.map(o => String(o.uid)));
    let changed = false;

    Object.keys(statusMap).forEach(id => {
        if (!existingIds.has(id)) {
            delete statusMap[id];
            changed = true;
        }
    });

    if (changed) saveStatusMap(statusMap);
}

function formatTime(date) {

    const locale = getCurrentLanguage() === "ar" ? "ar-EG" : "en-US";

    return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}

async function renderOrders() {

    applyPageLanguage();

    const dayData = await loadSharedDayData();

    const orders = (dayData.orders || [])
        .map((order, index) => normalizeOrder(order, index))
        .sort((a, b) => b.timestamp - a.timestamp);

    const statusMap = dayData.statusMap || {};

    cleanupStatusMap(orders, statusMap);

    const inProgressOrders = [];
    const doneOrders = [];

    orders.forEach(order => {
        const state = statusMap[String(order.uid)] || "inprogress";

        if (state === "done") doneOrders.push(order);
        else inProgressOrders.push(order);
    });

    orderCount.textContent = orders.length;
    inProgressCount.textContent = inProgressOrders.length;
    doneCount.textContent = doneOrders.length;

    inProgressBadge.textContent = inProgressOrders.length;
    doneBadge.textContent = doneOrders.length;

    lastUpdate.textContent = formatTime(new Date());

    inProgressContainer.innerHTML = inProgressOrders.length === 0
        ? `<div class="empty-state">${tr("noInProgress")}</div>`
        : inProgressOrders.map(order => {

            const items = order.items.map(item => `
            <div class="item-row">
                <span class="item-name">${getCurrentLanguage() === "ar" ? (item.nameAr || item.name) : item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            </div>
        `).join("");

            return `
        <article class="order-card">
            <div class="order-top">
                <div class="order-id">${tr("order")} ${order.displayId ? "#" + order.displayId : ""}</div>
                <div class="order-time">${formatTime(order.timestamp)}</div>
            </div>

            <div class="item-list">${items}</div>

            <div class="order-total">
                <span>${tr("total")}:</span>
                <span>${order.total.toFixed(2)} LE</span>
            </div>

            <div class="order-actions">
                <button class="state-btn mark-done" data-order-key="${order.uid}" data-next-state="done">${tr("markDone")}</button>
                <button class="state-btn delete-order" data-delete-key="${order.uid}">${tr("delete")}</button>
            </div>
        </article>
        `;
        }).join("");

    doneContainer.innerHTML = doneOrders.length === 0
        ? `<div class="empty-state">${tr("noDone")}</div>`
        : doneOrders.map(order => {

            const items = order.items.map(item => `
            <div class="item-row">
                <span class="item-name">${getCurrentLanguage() === "ar" ? (item.nameAr || item.name) : item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            </div>
        `).join("");

            return `
        <article class="order-card done-card">
            <div class="order-top">
                <div class="order-id">${tr("order")} ${order.displayId ? "#" + order.displayId : ""}</div>
                <div class="order-time">${formatTime(order.timestamp)}</div>
            </div>

            <div class="item-list">${items}</div>

            <div class="order-total">
                <span>${tr("total")}:</span>
                <span>${order.total.toFixed(2)} LE</span>
            </div>

            <div class="order-actions">
                <button class="state-btn mark-progress" data-order-key="${order.uid}" data-next-state="inprogress">${tr("markProgress")}</button>
                <button class="state-btn delete-order" data-delete-key="${order.uid}">${tr("delete")}</button>
            </div>
        </article>
        `;
        }).join("");
}

refreshBtn.addEventListener("click", renderOrders);

window.addEventListener("storage", renderOrders);

inProgressContainer.addEventListener("click", async event => {

    const deleteBtn = event.target.closest("button[data-delete-key]");
    if (deleteBtn) {
        const key = deleteBtn.getAttribute("data-delete-key");
        if (confirm("Delete this order?")) {
            await deleteOrder(key);
            renderOrders();
        }
        return;
    }

    const btn = event.target.closest("button[data-order-key]");
    if (!btn) return;

    const orderKey = btn.getAttribute("data-order-key");
    const nextState = btn.getAttribute("data-next-state");

    await setOrderStatus(orderKey, nextState);
    renderOrders();
});

doneContainer.addEventListener("click", async event => {

    const deleteBtn = event.target.closest("button[data-delete-key]");
    if (deleteBtn) {
        const key = deleteBtn.getAttribute("data-delete-key");
        if (confirm("Delete this order?")) {
            await deleteOrder(key);
            renderOrders();
        }
        return;
    }

    const btn = event.target.closest("button[data-order-key]");
    if (!btn) return;

    const orderKey = btn.getAttribute("data-order-key");
    const nextState = btn.getAttribute("data-next-state");

    await setOrderStatus(orderKey, nextState);
    renderOrders();
});

renderOrders();
setInterval(renderOrders, 2000);