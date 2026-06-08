const express = require('express');
const router = express.Router();

const inventoryController = require('../../controllers/users/inventoryController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const stockMovementSchema = require('../../validators/users/invetorySchema');

router.post('/create', validator(stockMovementSchema), isLogin, inventoryController.createInventoryLog);
router.get('/all', isLogin, inventoryController.getAllInventoryLogs);
router.get('/product/:productId', isLogin, inventoryController.getInventoryLogsByProductId);
router.get('/:id', isLogin, inventoryController.getInventoryLogById);

module.exports = router;
