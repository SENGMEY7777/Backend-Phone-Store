const orderModel = require('../../models/users/orderModel');
const productModel = require('../../models/users/productModel');
const userModel = require('../../models/users/userModel');

const ORDER_TYPES = ['ORDER', 'PREORDER'];
const ORDER_STATUSES = [
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
];

const toNumber = (value, fieldName) => {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        throw new Error(`${fieldName} must be a number`);
    }

    return numberValue;
};

const normalizeOrderType = (value) => {
    const orderType = (value || 'ORDER').toString().toUpperCase();

    if (!ORDER_TYPES.includes(orderType)) {
        throw new Error('Invalid order type');
    }

    return orderType;
};

const normalizeStatus = (value, defaultStatus = 'PENDING') => {
    const status = (value || defaultStatus).toString().toUpperCase();

    if (!ORDER_STATUSES.includes(status)) {
        throw new Error('Invalid order status');
    }

    return status;
};

const buildOrderResponse = async (id) => {
    const rows = await orderModel.getOrderById(id);

    if (rows.length === 0) {
        throw new Error('Order not found');
    }

    const items = await orderModel.getOrderItemsByOrderId(id);

    return {
        ...rows[0],
        items
    };
};

const createOrder = async (body, authUser = null) => {
    const userId = authUser?.id || body.user_id;
    const orderType = normalizeOrderType(body.order_type);
    const status = normalizeStatus(body.status);

    if (!userId) {
        throw new Error('User id is required');
    }

    const userRows = await userModel.getUserById(userId);
    if (userRows.length === 0) {
        throw new Error('User not found');
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        throw new Error('Order items are required');
    }

    const items = [];

    for (const item of body.items) {
        const productId = toNumber(item.product_id, 'Product id');
        const quantity = toNumber(item.quantity, 'Quantity');

        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        if (!Number.isInteger(quantity)) {
            throw new Error('Quantity must be an integer');
        }

        const productRows = await productModel.getProductById(productId);
        if (productRows.length === 0) {
            throw new Error(`Product ${productId} not found`);
        }

        const product = productRows[0];
        if (product.is_active === 0) {
            throw new Error(`Product ${productId} is not active`);
        }

        if (orderType === 'PREORDER' && product.preorder_available === 0) {
            throw new Error(`Product ${productId} is not available for preorder`);
        }

        const unitPrice = Number(product.price);
        const subtotal = Number((unitPrice * quantity).toFixed(2));

        items.push({
            product_id: productId,
            quantity,
            unit_price: unitPrice,
            subtotal
        });
    }

    const totalAmount = Number(
        items.reduce((total, item) => total + item.subtotal, 0).toFixed(2)
    );

    const orderId = await orderModel.createOrder({
        user_id: userId,
        order_type: orderType,
        status,
        total_amount: totalAmount
    }, items);

    return buildOrderResponse(orderId);
};

const getAllOrders = async () => {
    return orderModel.getAllOrders();
};

const getOrderById = async (id) => {
    return buildOrderResponse(id);
};

const updateOrderStatus = async (id, body) => {
    const rows = await orderModel.getOrderById(id);

    if (rows.length === 0) {
        throw new Error('Order not found');
    }

    const status = normalizeStatus(body.status, rows[0].status);

    await orderModel.updateOrderStatus(id, status);

    return buildOrderResponse(id);
};

const deleteOrder = async (id) => {
    const rows = await orderModel.getOrderById(id);

    if (rows.length === 0) {
        throw new Error('Order not found');
    }

    await orderModel.deleteOrder(id);
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
