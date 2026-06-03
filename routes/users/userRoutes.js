const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');
const isLogin = require('../../middlewares/authMiddleware');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/all', isLogin, userController.getAllUser);
router.delete('/logout', userController.logout);
router.get('/verify-email', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerificationEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-reset-otp', userController.verifyPasswordResetOtp);
router.post('/reset-password', userController.resetPassword);


module.exports = router;
