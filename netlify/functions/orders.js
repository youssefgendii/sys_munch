const { getStore } = require("@netlify/blobs");

const store = getStore("munch-orders");
const STORE_KEY = "orders-state-v1";

const defaultState = {
    ordersByDay: {},
    statusByDay: {},
    lastOrderIdByDay: {}
};

const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

function sanitizeDayKey(dayKey) {
    if (typeof dayKey !== "string" || !dayKey.trim()) {
        return new Intl.DateTimeFormat("en-CA", {
            timeZone: "Africa/Cairo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date());
    }
    return dayKey.trim();
}

async function loadState() {
    const saved = await store.get(STORE_KEY, { type: "json" });
    if (!saved || typeof saved !== "object") {
        return { ...defaultState };
    }

    return {
        ordersByDay: saved.ordersByDay || {},
        statusByDay: saved.statusByDay || {},
        lastOrderIdByDay: saved.lastOrderIdByDay || {}
    };
}

async function saveState(state) {
    await store.setJSON(STORE_KEY, state);
}

function parseBody(body) {
    try {
        return JSON.parse(body || "{}");
    } catch (e) {
        return {};
    }
}

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers: jsonHeaders, body: "" };
    }

    try {
        const state = await loadState();

        if (event.httpMethod === "GET") {
            const dayKey = sanitizeDayKey(event.queryStringParameters && event.queryStringParameters.dayKey);
            return {
                statusCode: 200,
                headers: jsonHeaders,
                body: JSON.stringify({
                    dayKey,
                    orders: state.ordersByDay[dayKey] || [],
                    statusMap: state.statusByDay[dayKey] || {},
                    lastOrderId: Number(state.lastOrderIdByDay[dayKey] || 0)
                })
            };
        }

        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                headers: jsonHeaders,
                body: JSON.stringify({ error: "Method not allowed" })
            };
        }

        const body = parseBody(event.body);
        const action = body.action;
        const dayKey = sanitizeDayKey(body.dayKey);

        if (!state.ordersByDay[dayKey]) state.ordersByDay[dayKey] = [];
        if (!state.statusByDay[dayKey]) state.statusByDay[dayKey] = {};
        if (!state.lastOrderIdByDay[dayKey]) state.lastOrderIdByDay[dayKey] = 0;

        if (action === "createOrder") {
            const nextId = Number(state.lastOrderIdByDay[dayKey] || 0) + 1;
            state.lastOrderIdByDay[dayKey] = nextId;

            const inputOrder = body.order && typeof body.order === "object" ? body.order : {};
            const order = {
                ...inputOrder,
                id: nextId,
                timestamp: inputOrder.timestamp || new Date().toISOString()
            };

            state.ordersByDay[dayKey].unshift(order);
            await saveState(state);

            return {
                statusCode: 200,
                headers: jsonHeaders,
                body: JSON.stringify({
                    ok: true,
                    order,
                    lastOrderId: nextId,
                    orders: state.ordersByDay[dayKey]
                })
            };
        }

        if (action === "deleteOrder") {
            const orderId = Number(body.orderId);
            state.ordersByDay[dayKey] = (state.ordersByDay[dayKey] || []).filter((o) => Number(o.id) !== orderId);
            await saveState(state);

            return {
                statusCode: 200,
                headers: jsonHeaders,
                body: JSON.stringify({ ok: true, orders: state.ordersByDay[dayKey] })
            };
        }

        if (action === "setStatus") {
            const orderKey = String(body.orderKey || "");
            const status = body.status === "done" ? "done" : "inprogress";
            if (orderKey) {
                state.statusByDay[dayKey][orderKey] = status;
                await saveState(state);
            }

            return {
                statusCode: 200,
                headers: jsonHeaders,
                body: JSON.stringify({ ok: true, statusMap: state.statusByDay[dayKey] })
            };
        }

        return {
            statusCode: 400,
            headers: jsonHeaders,
            body: JSON.stringify({ error: "Invalid action" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: jsonHeaders,
            body: JSON.stringify({
                error: "Server error",
                message: error && error.message ? error.message : "Unknown error"
            })
        };
    }
};
