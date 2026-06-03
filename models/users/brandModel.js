const { pool } = require('../../configs/db');

const getBrandById = async (id) => {
    let [rows] = await pool.query('SELECT * FROM brands WHERE id = ?', [id]);

    return rows;
}

const getBrandByName = async (name) => {
    let [rows] = await pool.query('SELECT * FROM brands WHERE name = ?', [name]);

    return rows;
}

const getAllBrand = async () => {
    let [rows] = await pool.query('SELECT * FROM brands');

    return rows;
}
const createBrand = async (body) => {
    let arr = [body.name, body.description];
    let [result] = await pool.query(
        'INSERT INTO brands (name, description) VALUES (?, ?)',
        arr
    );

    return result.insertId;
}

const updateBrand = async (id, body) => {
    let arr = [body.name, body.description, id];
    let [result] = await pool.query(
        'UPDATE brands SET name = ?, description = ? WHERE id = ?',
        arr
    );

    return result.affectedRows;
}

const deleteBrand = async (id) => {
    let [rows] = await pool.query('DELETE FROM brands WHERE id = ?', [id]);

    return rows;
}
module.exports = { 
    getBrandById,
    getBrandByName,
    getAllBrand,
    createBrand,
    updateBrand,
    deleteBrand
};