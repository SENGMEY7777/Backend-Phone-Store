const express = require('express');
const router = express.Router();

const orderController = require('../../controllers/users/orderController');
const isLogin = require('../../middlewares/authMiddleware');
const valdator = require('../../middlewares/validate');
const orderSchema = require('../../validators/users/orderSchema'); 

router.post('/create', valdator(orderSchema), isLogin, orderController.createOrder);
router.get('/all', isLogin, orderController.getAllOrders);
router.get('/:id', isLogin, orderController.getOrderById);
router.put('/:id/status', valdator(orderSchema), isLogin, orderController.updateOrderStatus);
router.delete('/:id', isLogin, orderController.deleteOrder);

module.exports = router;
