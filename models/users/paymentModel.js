const { pool } = require('../../configs/db');

const getPaymentByOrderId = async (orderId) => {
    const [rows] = await pool.query(
        'SELECT * FROM payments WHERE order_id = ?',
        [orderId]
    );
    return rows;
};

const getPaymentByMd5 = async (md5) => {
    const [rows] = await pool.query(
        'SELECT * FROM payments WHERE md5_hash = ?',
        [md5]
    );
    return rows;
};

const createPayment = async (payment) => {
    const [result] = await pool.query(
        `INSERT INTO payments (order_id, payment_method, amount, payment_status, qr_code, md5_hash)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            payment_status = VALUES(payment_status),
            amount = VALUES(amount),
            qr_code = VALUES(qr_code),
            md5_hash = VALUES(md5_hash)`,
        [
            payment.order_id,
            payment.payment_method || 'BAKONG',
            payment.amount,
            payment.payment_status || 'PENDING',
            payment.qr_code,
            payment.md5_hash
        ]
    );
    return result.insertId || payment.order_id;
};

const updatePaymentStatus = async (orderId, status, paidAt = null) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Update payment status
        await connection.query(
            'UPDATE payments SET payment_status = ?, paid_at = ? WHERE order_id = ?',
            [status, paidAt, orderId]
        );

        // If payment is SUCCESS, update the corresponding order status to PAID
        if (status === 'SUCCESS') {
            await connection.query(
                "UPDATE orders SET status = 'PAID' WHERE id = ?",
                [orderId]
            );
        } else if (status === 'FAILED') {
            await connection.query(
                "UPDATE orders SET status = 'CANCELLED' WHERE id = ?",
                [orderId]
            );
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    getPaymentByOrderId,
    getPaymentByMd5,
    createPayment,
    updatePaymentStatus
};
