const inventoryModel = require('../../models/users/inventoryModel');
const productModel = require('../../models/users/productModel');
const userModel = require('../../models/users/userModel');

const ACTION_TYPES = ['ADD', 'REMOVE', 'SET', 'SALE', 'RETURN', 'ADJUST'];

const toNumber = (value, fieldName) => {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        throw new Error(`${fieldName} must be a number`);
    }

    return numberValue;
};

const normalizeActionType = (value) => {
    const actionType = (value || '').toString().toUpperCase();

    if (!ACTION_TYPES.includes(actionType)) {
        throw new Error('Invalid action type');
    }

    return actionType;
};

const normalizeQuantityChange = (actionType, value) => {
    const quantity = toNumber(value, 'Quantity changed');

    if (!Number.isInteger(quantity) || quantity === 0) {
        throw new Error('Quantity changed must be a non-zero integer');
    }

    if (['REMOVE', 'SALE'].includes(actionType)) {
        return -Math.abs(quantity);
    }

    if (['ADD', 'RETURN'].includes(actionType)) {
        return Math.abs(quantity);
    }

    return quantity;
};

const createInventoryLog = async (body, authUser = null) => {
    const productId = toNumber(body.product_id, 'Product id');
    const actionType = normalizeActionType(body.action_type);
    const quantityChanged = normalizeQuantityChange(actionType, body.quantity_changed);
    const performedBy = authUser?.id || body.performed_by || null;

    const productRows = await productModel.getProductById(productId);
    if (productRows.length === 0) {
        throw new Error('Product not found');
    }

    if (performedBy) {
        const userRows = await userModel.getUserById(performedBy);
        if (userRows.length === 0) {
            throw new Error('User not found');
        }
    }

    const id = await inventoryModel.createInventoryLog({
        product_id: productId,
        action_type: actionType,
        quantity_changed: quantityChanged,
        performed_by: performedBy
    });

    const rows = await inventoryModel.getInventoryLogById(id);

    return rows[0];
};

const getAllInventoryLogs = async () => {
    return inventoryModel.getAllInventoryLogs();
};

const getInventoryLogById = async (id) => {
    const rows = await inventoryModel.getInventoryLogById(id);

    if (rows.length === 0) {
        throw new Error('Inventory log not found');
    }

    return rows[0];
};

const getInventoryLogsByProductId = async (productId) => {
    const productRows = await productModel.getProductById(productId);

    if (productRows.length === 0) {
        throw new Error('Product not found');
    }

    return inventoryModel.getInventoryLogsByProductId(productId);
};

module.exports = {
    createInventoryLog,
    getAllInventoryLogs,
    getInventoryLogById,
    getInventoryLogsByProductId
};
