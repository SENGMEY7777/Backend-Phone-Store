const { pool } = require('../../configs/db');

const getAllReviews = async () => {
    const [rows] = await pool.query(`
        SELECT pr.*, p.name AS product_name, u.full_name, u.email
        FROM product_reviews pr
        LEFT JOIN products p ON pr.product_id = p.id
        LEFT JOIN users u ON pr.user_id = u.id
        ORDER BY pr.created_at DESC
    `);

    return rows;
};

const getReviewById = async (id) => {
    const [rows] = await pool.query(`
        SELECT pr.*, p.name AS product_name, u.full_name, u.email
        FROM product_reviews pr
        LEFT JOIN products p ON pr.product_id = p.id
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.id = ?
    `, [id]);

    return rows;
};

const getReviewsByProductId = async (productId) => {
    const [rows] = await pool.query(`
        SELECT pr.*, u.full_name
        FROM product_reviews pr
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.product_id = ?
        ORDER BY pr.created_at DESC
    `, [productId]);

    return rows;
};

const createReview = async (body) => {
    const [result] = await pool.query(
        `INSERT INTO product_reviews (product_id, user_id, rating, review_text)
         VALUES (?, ?, ?, ?)`,
        [
            body.product_id,
            body.user_id,
            body.rating,
            body.review_text
        ]
    );

    return result.insertId;
};

const updateReview = async (id, body) => {
    const [result] = await pool.query(
        `UPDATE product_reviews
         SET rating = ?, review_text = ?
         WHERE id = ?`,
        [
            body.rating,
            body.review_text,
            id
        ]
    );

    return result.affectedRows;
};

const deleteReview = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM product_reviews WHERE id = ?',
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByProductId,
    createReview,
    updateReview,
    deleteReview
};
