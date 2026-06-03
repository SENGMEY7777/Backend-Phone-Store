const express = require('express');
const router = express.Router();

const brandController = require('../../controllers/users/brandController');

router.get('/all', brandController.getAllBrand);
router.post('/create', brandController.createBrand);
router.put('/:id', brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);


module.exports = router;