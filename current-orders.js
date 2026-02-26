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
        order: "Order",
        total: "Total"
    },
    ar: {
        title: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u064a\u0629",
        subtitle: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0637\u0628\u062e - \u062a\u062d\u062f\u064a\u062b \u062a\u0644\u0642\u0627\u0626\u064a \u0643\u0644 \u062b\u0627\u0646\u064a\u062a\u064a\u0646",
        refresh: "\u062a\u062d\u062f\u064a\u062b",
        back: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0643\u0627\u0634\u064a\u0631",
        orders: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a",
        inProgress: "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0636\u064a\u0631",
        done: "\u062a\u0645\u062a",
        lastUpdate: "\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b",
        noInProgress: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u062c\u0627\u0631\u064a\u0629",
        noDone: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u0645\u0646\u062a\u0647\u064a\u0629",
        markDone: "\u062a\u0639\u064a\u064a\u0646 \u0643\u0645\u0646\u062a\u0647\u064a",
        markProgress: "\u0625\u0639\u0627\u062f\u0629 \u0625\u0644\u0649 \u062c\u0627\u0631\u064a",
        order: "\u0637\u0644\u0628",
        total: "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a"
    }
};

function getCurrentLanguage() {
    try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return saved === "ar" ? "ar" : "en";
    } catch (e) {
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
    return "munch_orders_" + new Date().toDateString();
}

function getStatusKey() {
    return "munch_order_status_" + new Date().toDateString();
}

function loadTodayOrders() {
    const raw = localStorage.getItem(getTodayKey());
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return parsed
            .map((order) => ({
                ...order,
                timestamp: new Date(order.timestamp)
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
        return [];
    }
}

function loadStatusMap() {
    const raw = localStorage.getItem(getStatusKey());
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch (e) {
        return {};
    }
}

function saveStatusMap(statusMap) {
    localStorage.setItem(getStatusKey(), JSON.stringify(statusMap));
}

function setOrderStatus(orderId, status) {
    const statusMap = loadStatusMap();
    statusMap[String(orderId)] = status;
    saveStatusMap(statusMap);
}

function cleanupStatusMap(orders, statusMap) {
    const existingIds = new Set(orders.map((order) => String(order.id)));
    let changed = false;
    Object.keys(statusMap).forEach((id) => {
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

function renderOrders() {
    applyPageLanguage();
    const orders = loadTodayOrders();
    const statusMap = loadStatusMap();
    cleanupStatusMap(orders, statusMap);

    const inProgressOrders = [];
    const doneOrders = [];

    orders.forEach((order) => {
        const state = statusMap[String(order.id)] || "inprogress";
        if (state === "done") {
            doneOrders.push(order);
        } else {
            inProgressOrders.push(order);
        }
    });

    orderCount.textContent = String(orders.length);
    inProgressCount.textContent = String(inProgressOrders.length);
    doneCount.textContent = String(doneOrders.length);
    inProgressBadge.textContent = String(inProgressOrders.length);
    doneBadge.textContent = String(doneOrders.length);
    lastUpdate.textContent = formatTime(new Date());

    inProgressContainer.innerHTML = inProgressOrders.length === 0
        ? `<div class="empty-state">${tr("noInProgress")}</div>`
        : inProgressOrders.map((order) => {
        const items = order.items.map((item) => `
            <div class="item-row">
                <span class="item-name">${getCurrentLanguage() === "ar" ? (item.nameAr || item.name) : item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            </div>
        `).join("");

        return `
            <article class="order-card">
                <div class="order-top">
                    <div class="order-id">${tr("order")} #${order.id}</div>
                    <div class="order-time">${formatTime(order.timestamp)}</div>
                </div>
                <div class="item-list">${items}</div>
                <div class="order-total">${tr("total")}: ${Number(order.total).toFixed(2)} LE</div>
                <div class="order-actions">
                    <button class="state-btn mark-done" data-order-id="${order.id}" data-next-state="done">${tr("markDone")}</button>
                </div>
            </article>
        `;
    }).join("");

    doneContainer.innerHTML = doneOrders.length === 0
        ? `<div class="empty-state">${tr("noDone")}</div>`
        : doneOrders.map((order) => {
        const items = order.items.map((item) => `
            <div class="item-row">
                <span class="item-name">${getCurrentLanguage() === "ar" ? (item.nameAr || item.name) : item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            </div>
        `).join("");

        return `
            <article class="order-card done-card">
                <div class="order-top">
                    <div class="order-id">${tr("order")} #${order.id}</div>
                    <div class="order-time">${formatTime(order.timestamp)}</div>
                </div>
                <div class="item-list">${items}</div>
                <div class="order-total">${tr("total")}: ${Number(order.total).toFixed(2)} LE</div>
                <div class="order-actions">
                    <button class="state-btn mark-progress" data-order-id="${order.id}" data-next-state="inprogress">${tr("markProgress")}</button>
                </div>
            </article>
        `;
    }).join("");
}

refreshBtn.addEventListener("click", renderOrders);
window.addEventListener("storage", renderOrders);
inProgressContainer.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-order-id]");
    if (!btn) return;
    const orderId = btn.getAttribute("data-order-id");
    const nextState = btn.getAttribute("data-next-state");
    setOrderStatus(orderId, nextState);
    renderOrders();
});
doneContainer.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-order-id]");
    if (!btn) return;
    const orderId = btn.getAttribute("data-order-id");
    const nextState = btn.getAttribute("data-next-state");
    setOrderStatus(orderId, nextState);
    renderOrders();
});

renderOrders();
setInterval(renderOrders, 2000);
