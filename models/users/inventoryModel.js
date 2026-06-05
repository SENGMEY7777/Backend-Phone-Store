const { pool } = require('../../configs/db');

const getAllInventoryLogs = async () => {
    const [rows] = await pool.query(`
        SELECT il.*, p.name AS product_name, u.full_name AS performed_by_name
        FROM inventory_logs il
        LEFT JOIN products p ON il.product_id = p.id
        LEFT JOIN users u ON il.performed_by = u.id
        ORDER BY il.created_at DESC
    `);

    return rows;
};

const getInventoryLogById = async (id) => {
    const [rows] = await pool.query(`
        SELECT il.*, p.name AS product_name, u.full_name AS performed_by_name
        FROM inventory_logs il
        LEFT JOIN products p ON il.product_id = p.id
        LEFT JOIN users u ON il.performed_by = u.id
        WHERE il.id = ?
    `, [id]);

    return rows;
};

const getInventoryLogsByProductId = async (productId) => {
    const [rows] = await pool.query(`
        SELECT il.*, u.full_name AS performed_by_name
        FROM inventory_logs il
        LEFT JOIN users u ON il.performed_by = u.id
        WHERE il.product_id = ?
        ORDER BY il.created_at DESC
    `, [productId]);

    return rows;
};

const createInventoryLog = async (body) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [productRows] = await connection.query(
            'SELECT id, stock_quantity FROM products WHERE id = ? FOR UPDATE',
            [body.product_id]
        );

        if (productRows.length === 0) {
            throw new Error('Product not found');
        }

        const previousStock = Number(productRows[0].stock_quantity);
        const newStock = previousStock + body.quantity_changed;

        if (newStock < 0) {
            throw new Error('New stock cannot be less than 0');
        }

        await connection.query(
            'UPDATE products SET stock_quantity = ? WHERE id = ?',
            [newStock, body.product_id]
        );

        const [result] = await connection.query(
            `INSERT INTO inventory_logs
             (product_id, action_type, quantity_changed, previous_stock, new_stock, performed_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                body.product_id,
                body.action_type,
                body.quantity_changed,
                previousStock,
                newStock,
                body.performed_by
            ]
        );

        await connection.commit();

        return result.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllInventoryLogs,
    getInventoryLogById,
    getInventoryLogsByProductId,
    createInventoryLog
};
