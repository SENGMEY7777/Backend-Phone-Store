const express = require('express');
const router = express.Router();

const reviewController = require('../../controllers/users/reviewController');
const isLogin = require('../../middlewares/authMiddleware');
const valdator = require('../../middlewares/validate');
const  reviewSchema = require('../../validators/users/reviewProductSchema');

router.post('/create', valdator(reviewSchema), isLogin, reviewController.createReview);
router.get('/all', isLogin, reviewController.getAllReviews);
router.get('/product/:productId', isLogin, reviewController.getReviewsByProductId);
router.get('/:id', isLogin, reviewController.getReviewById);
router.put('/:id', valdator(reviewSchema), isLogin, reviewController.updateReview);
router.delete('/:id', isLogin, reviewController.deleteReview);

module.exports = router;
