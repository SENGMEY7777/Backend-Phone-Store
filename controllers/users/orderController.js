const orderService = require('../../services/users/orderService');
const { sendResponse } = require('../../utils/responeHelper');

const createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.body || {}, req.user);

        return sendResponse(res, 200, true, 'Create order successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getAllOrders = async (req, res) => {
    try {
        const result = await orderService.getAllOrders();

        return sendResponse(res, 200, true, 'Get all orders successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getOrderById = async (req, res) => {
    try {
        const result = await orderService.getOrderById(req.params.id);

        return sendResponse(res, 200, true, 'Get order successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const result = await orderService.updateOrderStatus(req.params.id, req.body || {});

        return sendResponse(res, 200, true, 'Update order status successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const deleteOrder = async (req, res) => {
    try {
        const result = await orderService.deleteOrder(req.params.id);

        return sendResponse(res, 200, true, 'Delete order successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
