const userService = require('../../services/users/userService');
const { sendResponse } = require('../../utils/responeHelper');


const getAllUser = async (req, res) => {
    try {
        let result = await userService.getAllUser();
        return sendResponse(res, 200, true, 'Get all user successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}
const register = async (req, res) => {
    try {
        let body = req.body;
        let result = await userService.register(body);
        return sendResponse(res, 200, true, 'Register successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const login = async (req, res) => {
    try {
        let body = req.body;
        let result = await userService.login(body);
        return sendResponse(res, 200, true, 'Login successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const logout = async (req, res) => {
    try {
        let resutl = await userService.logout();
        return sendResponse(res, 200, true, 'Logout successfully', resutl);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const verifyEmail = async (req, res) => {
    try {
        let token = req.query.token;
        let result = await userService.verifyEmail(token);
        return sendResponse(res, 200, true, 'Verify email successfully', result);
    } catch (error) {
        console.error("Verification Error:", error); 
        return sendResponse(res, 400, false, error.message);
    }
}

const resendVerificationEmail = async (req, res) => {
    try {
        let result = await userService.resendVerificationEmail(req.body);
        return sendResponse(res, 200, true, 'Verification email sent successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const forgotPassword = async (req, res) => {
    try {
        let result = await userService.forgotPassword(req.body);
        return sendResponse(res, 200, true, 'Password reset OTP sent successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const verifyPasswordResetOtp = async (req, res) => {
    try {
        let result = await userService.verifyPasswordResetOtp(req.body);
        return sendResponse(res, 200, true, 'OTP verified successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        let result = await userService.resetPassword(req.body);
        return sendResponse(res, 200, true, 'Password reset successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    getAllUser,
    register,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    verifyPasswordResetOtp,
    resetPassword
}
