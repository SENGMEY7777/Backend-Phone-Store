const authService = require('../../services/admin/authService');
const { sendResponse } = require('../../utils/responeHelper');

const login = async (req, res) => {
    try {
        let result = await authService.login(req.body);
        return sendResponse(res, 200, true, 'Admin login successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    login
}
