const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/users/paymentController');
const isLogin = require('../../middlewares/authMiddleware');

router.get('/generateqr/:orderId', isLogin, paymentController.generate);
router.post('/generateqr/:orderId', isLogin, paymentController.generate);

router.get('/verify/:md5', isLogin, paymentController.verify);
router.post('/verify/:md5', isLogin, paymentController.verify);

module.exports = router;
