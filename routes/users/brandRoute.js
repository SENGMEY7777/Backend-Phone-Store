const express = require('express');
const router = express.Router();

const brandController = require('../../controllers/users/brandController');

router.post('/create', userController.createBrand);


module.exports = router;