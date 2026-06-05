const express = require('express');
const router = express.Router();

const brandController = require('../../controllers/users/brandController');
const isLogin = require('../../middlewares/authMiddleware');

router.get('/all', isLogin, brandController.getAllBrand);
router.post('/create', isLogin, brandController.createBrand);
router.put('/:id', isLogin, brandController.updateBrand);
router.delete('/:id', isLogin, brandController.deleteBrand);


module.exports = router;