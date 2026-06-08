const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const { userSchema, resetPassword, verifyOtpSchema , resetPasswordSchema } = require('../../validators/users/authSchema'); 
const authSchema = require('../../validators/admin/authAdmin');


router.post('/register', validator(userSchema), userController.register);
router.post('/login', validator(authSchema), userController.login);
router.get('/all', isLogin, userController.getAllUser);
router.delete('/logout', userController.logout);
router.get('/verify-email', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerificationEmail);
router.post('/forgot-password', validator(resetPassword), userController.forgotPassword);
router.post('/verify-reset-otp', validator(verifyOtpSchema), userController.verifyPasswordResetOtp);
router.post('/reset-password', validator(resetPasswordSchema), userController.resetPassword);


module.exports = router;
