const express = require('express');
const router = express.Router();

const authController = require('../../controllers/admin/authController');
// const validator = require('../../middlewares/validate');
// const authSchema = require('../../validators/admin/authAdmin');

router.post('/login',  authController.login);


module.exports = router;