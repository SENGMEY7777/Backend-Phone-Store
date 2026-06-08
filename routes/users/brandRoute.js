const express = require('express');
const router = express.Router();

const brandController = require('../../controllers/users/brandController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const { brandSchema } = require('../../validators/users/brandSchema'); 

router.get('/all', isLogin, brandController.getAllBrand);
router.post('/create', validator(brandSchema), isLogin, brandController.createBrand);
router.put('/:id', validator(brandSchema), isLogin, brandController.updateBrand);
router.delete('/:id', isLogin, brandController.deleteBrand);


module.exports = router;