const { pool } = require('../../configs/db');

const getAllProducts = async () => {
    let [rows] = await pool.query(`
        SELECT p.*, b.name AS brand_name
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
    `);

    return rows;
};

const getProductById = async (id) => {
    let [rows] = await pool.query(`
        SELECT p.*, b.name AS brand_name
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.id = ?
    `, [id]);

    return rows;
};

const createProduct = async (body) => {
    let [result] = await pool.query(
        `INSERT INTO products 
        (brand_id, name, description, price, stock_quantity, preorder_available, preorder_release_date, image_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            body.brand_id,
            body.name,
            body.description,
            body.price,
            body.stock_quantity,
            body.preorder_available,
            body.preorder_release_date,
            body.image_url,
            body.is_active
        ]
    );

    return result.insertId;
};

const updateProduct = async (id, body) => {
    let [result] = await pool.query(
        `UPDATE products SET
            brand_id = ?,
            name = ?,
            description = ?,
            price = ?,
            stock_quantity = ?,
            preorder_available = ?,
            preorder_release_date = ?,
            image_url = ?,
            is_active = ?
        WHERE id = ?`,
        [
            body.brand_id,
            body.name,
            body.description,
            body.price,
            body.stock_quantity,
            body.preorder_available,
            body.preorder_release_date,
            body.image_url,
            body.is_active,
            id
        ]
    );

    return result.affectedRows;
};

const deleteProduct = async (id) => {
    let [result] = await pool.query(
        'DELETE FROM products WHERE id = ?',
        [id]
    );

    return result.affectedRows;
};

const getBrandById = async (id) => {
    let [rows] = await pool.query('SELECT * FROM brands WHERE id = ?', [id]);

    return rows;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getBrandById
};