const productService = require('../../services/users/productService');
const imageUploadService = require('../../services/users/imageUploadService');
const { sendResponse } = require('../../utils/responeHelper');

const createProduct = async (req, res) => {
    try {
        let body = req.body || {};
        const imageUrl = await imageUploadService.uploadImage(req.file);

        if (imageUrl) {
            body.image_url = imageUrl;
        }

        let result = await productService.createProduct(body);
        return sendResponse(res, 200, true, 'Create product successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getAllProducts = async (req, res) => {
    try {
        let result = await productService.getAllProducts();
        return sendResponse(res, 200, true, 'Get all products successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getProductById = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await productService.getProductById(id);
        return sendResponse(res, 200, true, 'Get product successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const updateProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body || {};
        const imageUrl = await imageUploadService.uploadImage(req.file);

        if (imageUrl) {
            body.image_url = imageUrl;
        }

        let result = await productService.updateProduct(id, body);
        return sendResponse(res, 200, true, 'Update product successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await productService.deleteProduct(id);
        return sendResponse(res, 200, true, 'Delete product successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
