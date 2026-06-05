const inventoryService = require('../../services/users/inventoryService');
const { sendResponse } = require('../../utils/responeHelper');

const createInventoryLog = async (req, res) => {
    try {
        const result = await inventoryService.createInventoryLog(req.body || {}, req.user);

        return sendResponse(res, 200, true, 'Create inventory log successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getAllInventoryLogs = async (req, res) => {
    try {
        const result = await inventoryService.getAllInventoryLogs();

        return sendResponse(res, 200, true, 'Get all inventory logs successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getInventoryLogById = async (req, res) => {
    try {
        const result = await inventoryService.getInventoryLogById(req.params.id);

        return sendResponse(res, 200, true, 'Get inventory log successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getInventoryLogsByProductId = async (req, res) => {
    try {
        const result = await inventoryService.getInventoryLogsByProductId(req.params.productId);

        return sendResponse(res, 200, true, 'Get product inventory logs successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

module.exports = {
    createInventoryLog,
    getAllInventoryLogs,
    getInventoryLogById,
    getInventoryLogsByProductId
};
