const brandService = require('../../services/users/brandService');
const { sendResponse } = require('../../utils/responeHelper');

const createBrand = async (req, res) => {
    try {
        let body = req.body;
        let result = await brandService.createBrand(body);
        return sendResponse(res, 200, true, 'Create brand successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getAllBrand = async (req, res) => {
    try {
        let result = await brandService.getAllBrand();
        return sendResponse(res, 200, true, 'Get all brand successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const updateBrand = async (req, res) => {
    try {
        let body = req.body;
        let id = req.params.id;
        let result = await brandService.updateBrand(id, body);
        return sendResponse(res, 200, true, 'Update brand successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const deleteBrand = async (req, res) => {
    try {
        let body = req.body;
        let id = req.params.id;
        let result = await brandService.deleteBrand(id);
        return sendResponse(res, 200, true, 'Delete brand successfully', result[0]);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}


module.exports = {
    createBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}