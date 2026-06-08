const express = require('express');
const router = express.Router();

const productController = require('../../controllers/users/productController');
const { uploadProductImage } = require('../../middlewares/upload');
const isLogin = require('../../middlewares/authMiddleware');
const valdator = require('../../middlewares/validate');
const productSchema = require('../../validators/users/productSchema');

router.post('/create', valdator(productSchema), isLogin, uploadProductImage, productController.createProduct);
router.get('/all', isLogin, productController.getAllProducts);
router.get('/:id', isLogin, productController.getProductById);
router.put('/:id', valdator(productSchema), isLogin, uploadProductImage, productController.updateProduct);
router.delete('/:id', isLogin, productController.deleteProduct);


module.exports = router;
