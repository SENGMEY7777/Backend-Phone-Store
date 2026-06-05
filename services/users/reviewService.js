const reviewModel = require('../../models/users/reviewModel');
const productModel = require('../../models/users/productModel');
const userModel = require('../../models/users/userModel');

const toNumber = (value, fieldName) => {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        throw new Error(`${fieldName} must be a number`);
    }

    return numberValue;
};

const normalizeRating = (value) => {
    const rating = toNumber(value, 'Rating');

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be an integer between 1 and 5');
    }

    return rating;
};

const createReview = async (body, authUser = null) => {
    const productId = toNumber(body.product_id, 'Product id');
    const userId = authUser?.id || body.user_id;
    const rating = normalizeRating(body.rating);

    if (!userId) {
        throw new Error('User id is required');
    }

    const productRows = await productModel.getProductById(productId);
    if (productRows.length === 0) {
        throw new Error('Product not found');
    }

    const userRows = await userModel.getUserById(userId);
    if (userRows.length === 0) {
        throw new Error('User not found');
    }

    const id = await reviewModel.createReview({
        product_id: productId,
        user_id: userId,
        rating,
        review_text: body.review_text || null
    });

    const rows = await reviewModel.getReviewById(id);

    return rows[0];
};

const getAllReviews = async () => {
    return reviewModel.getAllReviews();
};

const getReviewById = async (id) => {
    const rows = await reviewModel.getReviewById(id);

    if (rows.length === 0) {
        throw new Error('Review not found');
    }

    return rows[0];
};

const getReviewsByProductId = async (productId) => {
    const productRows = await productModel.getProductById(productId);

    if (productRows.length === 0) {
        throw new Error('Product not found');
    }

    return reviewModel.getReviewsByProductId(productId);
};

const updateReview = async (id, body) => {
    const rows = await reviewModel.getReviewById(id);

    if (rows.length === 0) {
        throw new Error('Review not found');
    }

    await reviewModel.updateReview(id, {
        rating: normalizeRating(body.rating),
        review_text: body.review_text || null
    });

    const updatedRows = await reviewModel.getReviewById(id);

    return updatedRows[0];
};

const deleteReview = async (id) => {
    const rows = await reviewModel.getReviewById(id);

    if (rows.length === 0) {
        throw new Error('Review not found');
    }

    await reviewModel.deleteReview(id);
    
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    getReviewsByProductId,
    updateReview,
    deleteReview
};
