const express = require('express');
const router = express.Router();

const authController = require('../../controllers/admin/authController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const  authSchema = require('../../validators/admin/authAdmin');

router.post('/login', validator(authSchema), authController.login);
router.delete('/logout', isLogin, authController.logout);


module.exports = router;