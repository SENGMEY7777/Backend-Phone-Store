const express = require('express');
const router = express.Router();

const orderController = require('../../controllers/users/orderController');
const isLogin = require('../../middlewares/authMiddleware');

router.post('/create', isLogin, orderController.createOrder);
router.get('/all', isLogin, orderController.getAllOrders);
router.get('/:id', isLogin, orderController.getOrderById);
router.put('/:id/status', isLogin, orderController.updateOrderStatus);
router.delete('/:id', isLogin, orderController.deleteOrder);

module.exports = router;
