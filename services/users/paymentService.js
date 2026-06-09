const { BakongKHQR, khqrData, MerchantInfo } = require("bakong-khqr");
const paymentModel = require('../../models/users/paymentModel');
const orderModel = require('../../models/users/orderModel');

const generatePaymentQR = async (orderId) => {
    // 1. Fetch the order from the database
    const orderRows = await orderModel.getOrderById(orderId);
    if (orderRows.length === 0) {
        throw new Error('Order not found');
    }
    const order = orderRows[0];

    // Check if the order is already paid or cancelled
    if (order.status === 'PAID') {
        throw new Error('Order is already paid');
    }
    if (order.status === 'CANCELLED') {
        throw new Error('Order is cancelled');
    }

    // 2. Prepare Merchant Information
    const amount = Number(order.total_amount);
    
    // Read config from environment variables or use defaults
    const bakongAccountId = process.env.BAKONG_ACCOUNT_ID || 'developer@devb';
    const merchantName = process.env.BAKONG_MERCHANT_NAME || 'CamboPhoneStore';
    const merchantCity = process.env.BAKONG_MERCHANT_CITY || 'Phnom Penh';
    const bankName = process.env.BAKONG_ACQUIRING_BANK || 'Dev Bank';
    const mobileNumber = process.env.BAKONG_ACCOUNT_PHONE || '85512233455';
    const storeLabel = process.env.BAKONG_STORE_LABEL || 'CamboPhoneStore';
    const terminalLabel = process.env.BAKONG_TERMINAL_LABEL || 'Web Terminal 01';
    
    // We can use the bank name or account ID prefix as merchant ID/bank code
    const merchantId = bakongAccountId.split('@')[0];

    const optionalData = {
        currency: khqrData.currency.usd, // Default to USD since database prices are in USD
        amount: amount,
        mobileNumber: mobileNumber,
        storeLabel: storeLabel.slice(0, 25), // Ensure length is within limits
        terminalLabel: terminalLabel.slice(0, 25),
        expirationTimestamp: Date.now() + 30 * 60 * 1000 // 30 minutes expiration
    };

    const merchantInfo = new MerchantInfo(
        bakongAccountId,
        merchantName,
        merchantCity,
        merchantId,
        bankName,
        optionalData
    );

    // 3. Generate KHQR
    const KHQR = new BakongKHQR();
    const merchant = KHQR.generateMerchant(merchantInfo);

    if (!merchant || !merchant.data) {
        throw new Error('Failed to generate Bakong KHQR');
    }

    const qrCode = merchant.data.qr;
    const md5Hash = merchant.data.md5;

    // 4. Save/Update Payment Record in the database
    await paymentModel.createPayment({
        order_id: orderId,
        payment_method: 'BAKONG',
        amount: amount,
        payment_status: 'PENDING',
        qr_code: qrCode,
        md5_hash: md5Hash
    });

    return {
        order_id: orderId,
        amount: amount,
        qr_code: qrCode,
        md5_hash: md5Hash,
        status: 'PENDING'
    };
};

const checkPaymentStatus = async (orderId) => {
    // 1. Get payment from database
    const paymentRows = await paymentModel.getPaymentByOrderId(orderId);
    if (paymentRows.length === 0) {
        throw new Error('Payment record not found for this order');
    }
    const payment = paymentRows[0];

    // If it's already marked as SUCCESS in our database, return it
    if (payment.payment_status === 'SUCCESS') {
        return {
            order_id: orderId,
            status: 'SUCCESS',
            paid_at: payment.paid_at
        };
    }

    const md5 = payment.md5_hash;
    if (!md5) {
        throw new Error('MD5 hash not found for this payment');
    }

    // 2. Call Bakong API to check status by MD5
    const apiToken = process.env.BAKONG_API_TOKEN;
    const baseUrl = process.env.BAKONG_API_BASE_URL;

    if (!apiToken || !baseUrl) {
        throw new Error('Bakong API configuration (token or base URL) is missing in environment variables');
    }

    // Construct the proxy endpoint URL
    const checkStatusUrl = `${baseUrl}/v1/check_transaction_by_md5`;

    try {
        const response = await fetch(checkStatusUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({ md5 })
        });

        if (!response.ok) {
            throw new Error(`Bakong API responded with status ${response.status}`);
        }

        const result = await response.json();

        // 3. Handle response based on responseCode and errorCode
        if (result.responseCode === 0 && result.data) {
            // Success! Transaction processed
            const paidAt = new Date();
            await paymentModel.updatePaymentStatus(orderId, 'SUCCESS', paidAt);
            return {
                order_id: orderId,
                status: 'SUCCESS',
                paid_at: paidAt,
                transaction_details: result.data
            };
        } else if (result.errorCode === 3) {
            // Failed
            await paymentModel.updatePaymentStatus(orderId, 'FAILED');
            return {
                order_id: orderId,
                status: 'FAILED',
                message: result.responseMessage || 'Transaction failed.'
            };
        } else {
            // Either not found (errorCode: 1) or still pending
            return {
                order_id: orderId,
                status: payment.payment_status, // Keep current status (usually PENDING)
                message: result.responseMessage || 'Transaction is still pending or not found.'
            };
        }
    } catch (error) {
        console.error('Error verifying Bakong payment:', error);
        return {
            order_id: orderId,
            status: payment.payment_status,
            message: `Verifying status failed: ${error.message}`
        };
    }
};

const checkPaymentStatusByMd5 = async (md5) => {
    // 1. Get payment from database by MD5
    const paymentRows = await paymentModel.getPaymentByMd5(md5);
    if (paymentRows.length === 0) {
        throw new Error('Payment record not found for this transaction hash');
    }
    const payment = paymentRows[0];
    const orderId = payment.order_id;

    // If it's already marked as SUCCESS in our database, return it
    if (payment.payment_status === 'SUCCESS') {
        return {
            order_id: orderId,
            status: 'SUCCESS',
            paid_at: payment.paid_at
        };
    }

    // 2. Call Bakong API to check status by MD5
    const apiToken = process.env.BAKONG_API_TOKEN;
    const baseUrl = process.env.BAKONG_API_BASE_URL;

    if (!apiToken || !baseUrl) {
        throw new Error('Bakong API configuration (token or base URL) is missing in environment variables');
    }

    // Construct the proxy endpoint URL
    const checkStatusUrl = `${baseUrl}/v1/check_transaction_by_md5`;

    try {
        const response = await fetch(checkStatusUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({ md5 })
        });

        if (!response.ok) {
            throw new Error(`Bakong API responded with status ${response.status}`);
        }

        const result = await response.json();

        // 3. Handle response based on responseCode and errorCode
        if (result.responseCode === 0 && result.data) {
            // Success! Transaction processed
            const paidAt = new Date();
            await paymentModel.updatePaymentStatus(orderId, 'SUCCESS', paidAt);
            return {
                order_id: orderId,
                status: 'SUCCESS',
                paid_at: paidAt,
                transaction_details: result.data
            };
        } else if (result.errorCode === 3) {
            // Failed
            await paymentModel.updatePaymentStatus(orderId, 'FAILED');
            return {
                order_id: orderId,
                status: 'FAILED',
                message: result.responseMessage || 'Transaction failed.'
            };
        } else {
            // Either not found (errorCode: 1) or still pending
            return {
                order_id: orderId,
                status: payment.payment_status, // Keep current status (usually PENDING)
                message: result.responseMessage || 'Transaction is still pending or not found.'
            };
        }
    } catch (error) {
        console.error('Error verifying Bakong payment:', error);
        return {
            order_id: orderId,
            status: payment.payment_status,
            message: `Verifying status failed: ${error.message}`
        };
    }
};

module.exports = {
    generatePaymentQR,
    checkPaymentStatus,
    checkPaymentStatusByMd5
};
