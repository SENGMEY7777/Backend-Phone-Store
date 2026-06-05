const reviewService = require('../../services/users/reviewService');
const { sendResponse } = require('../../utils/responeHelper');

const createReview = async (req, res) => {
    try {
        const result = await reviewService.createReview(req.body || {}, req.user);

        return sendResponse(res, 200, true, 'Create review successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getAllReviews = async (req, res) => {
    try {
        const result = await reviewService.getAllReviews();

        return sendResponse(res, 200, true, 'Get all reviews successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getReviewById = async (req, res) => {
    try {
        const result = await reviewService.getReviewById(req.params.id);

        return sendResponse(res, 200, true, 'Get review successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const getReviewsByProductId = async (req, res) => {
    try {
        const result = await reviewService.getReviewsByProductId(req.params.productId);

        return sendResponse(res, 200, true, 'Get product reviews successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const updateReview = async (req, res) => {
    try {
        const result = await reviewService.updateReview(req.params.id, req.body || {});

        return sendResponse(res, 200, true, 'Update review successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const deleteReview = async (req, res) => {
    try {
        const result = await reviewService.deleteReview(req.params.id);

        return sendResponse(res, 200, true, 'Delete review successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    getReviewsByProductId,
    updateReview,
    deleteReview
};
