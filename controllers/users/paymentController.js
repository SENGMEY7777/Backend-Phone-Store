const paymentService = require('../../services/users/paymentService');
const { sendResponse } = require('../../utils/responeHelper');

const generate = async (req, res) => {
    try {
        const orderId = req.params.orderId || req.body.order_id || req.body.orderId;
        if (!orderId) {
            return sendResponse(res, 400, false, 'Order ID is required');
        }

        const result = await paymentService.generatePaymentQR(parseInt(orderId, 10));
        return sendResponse(res, 200, true, 'Payment QR generated successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const verify = async (req, res) => {
    try {
        const md5 = req.params.md5 || req.body.md5;
        if (!md5) {
            return sendResponse(res, 400, false, 'MD5 transaction hash is required');
        }

        const result = await paymentService.checkPaymentStatusByMd5(md5);
        return sendResponse(res, 200, true, 'Payment status verified successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

module.exports = {
    generate,
    verify
};
