const { pool } = require('../../configs/db');

const getAllOrders = async () => {
    const [rows] = await pool.query(`
        SELECT o.*, u.full_name, u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.ordered_at DESC
    `);

    return rows;
};

const getOrderById = async (id) => {
    const [rows] = await pool.query(`
        SELECT o.*, u.full_name, u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
    `, [id]);

    return rows;
};

const getOrderItemsByOrderId = async (orderId) => {
    const [rows] = await pool.query(`
        SELECT oi.*, p.name AS product_name, p.image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `, [orderId]);

    return rows;
};

const createOrder = async (order, items) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, order_type, status, total_amount)
             VALUES (?, ?, ?, ?)`,
            [
                order.user_id,
                order.order_type,
                order.status,
                order.total_amount
            ]
        );

        const orderId = orderResult.insertId;
        const orderItems = items.map((item) => [
            orderId,
            item.product_id,
            item.quantity,
            item.unit_price,
            item.subtotal
        ]);

        await connection.query(
            `INSERT INTO order_items
             (order_id, product_id, quantity, unit_price, subtotal)
             VALUES ?`,
            [orderItems]
        );

        await connection.commit();

        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updateOrderStatus = async (id, status) => {
    const [result] = await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
    );

    return result.affectedRows;
};

const deleteOrder = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM orders WHERE id = ?',
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrderItemsByOrderId,
    createOrder,
    updateOrderStatus,
    deleteOrder
};
