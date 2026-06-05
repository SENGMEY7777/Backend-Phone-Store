const express = require('express');
const router = express.Router();

const reviewController = require('../../controllers/users/reviewController');
const isLogin = require('../../middlewares/authMiddleware');

router.post('/create', isLogin, reviewController.createReview);
router.get('/all', isLogin, reviewController.getAllReviews);
router.get('/product/:productId', isLogin, reviewController.getReviewsByProductId);
router.get('/:id', isLogin, reviewController.getReviewById);
router.put('/:id', isLogin, reviewController.updateReview);
router.delete('/:id', isLogin, reviewController.deleteReview);

module.exports = router;
