const { pool } = require('../../configs/db');


const findEmail = async (email) => {
    let [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    return rows;
}

const getUserById = async (id) => {
    let [rows] = await pool.query('SELECT id, full_name, email, role, token, is_active,  created_at FROM users WHERE id = ?', [id]);

    return rows;
}

const getAllUser = async () => {
    let [rows] = await pool.query('SELECT id, full_name, email, role, is_active,  created_at FROM users');

    return rows;
}
const register = async (body) => {
    let arr = [body.full_name, body.email, body.password_hash, body.verification_token, body.verification_expires];
    const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password_hash, verification_token, verification_expires) VALUES (?, ?, ?, ?, ?)',
        arr
    );

    return result.insertId; 
};

const login = async (body) => {
    let arr = [body.email, body.password_hash];
    let [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password_hash = ?', arr);

    return rows;
}

const addToken = async (token, id) => {
    let [rows] = await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, id]);

    return rows;
}

const getTokenById = async (id) => {
    let [rows ] = await pool.query('SELECT token FROM users WHERE id = ?', [id]);

    return rows;
}

const deleteToken = async (id) => {
    let [rows] = await pool.query('UPDATE users SET token = NULL WHERE id = ?', [id]);

    return rows;
}

const verifyEmail = async (token) => {
    let [rows] = await pool.query('SELECT id, full_name, email, is_verified, token, verification_token, verification_expires FROM users WHERE verification_token = ?', [token]);

    return rows;
}

const markEmailAsVerified = async (id) => {
    let [rows] = await pool.query(
        'UPDATE users SET is_verified = 1, is_active = 1, verification_token = NULL, verification_expires = NULL WHERE id = ?',
        [id]
    );

    return rows;
}

const updateVerificationToken = async (id, verification_token, verification_expires) => {
    let [rows] = await pool.query(
        'UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?',
        [verification_token, verification_expires, id]
    );

    return rows;
}

const updatePasswordResetOtp = async (id, password_reset_otp, password_reset_expires) => {
    let [rows] = await pool.query(
        'UPDATE users SET password_reset_otp = ?, password_reset_expires = ? WHERE id = ?',
        [password_reset_otp, password_reset_expires, id]
    );

    return rows;
}

const clearPasswordResetOtp = async (id) => {
    let [rows] = await pool.query(
        'UPDATE users SET password_reset_otp = NULL, password_reset_expires = NULL WHERE id = ?',
        [id]
    );

    return rows;
}

const updatePassword = async (id, password_hash) => {
    let [rows] = await pool.query(
        'UPDATE users SET password_hash = ?, password_reset_otp = NULL, password_reset_expires = NULL WHERE id = ?',
        [password_hash, id]
    );

    return rows;
}



module.exports = {
    findEmail,
    getUserById,
    getAllUser,
    register,
    login,
    addToken,
    getTokenById,
    deleteToken,
    verifyEmail,
    markEmailAsVerified,
    updateVerificationToken,
    updatePasswordResetOtp,
    clearPasswordResetOtp,
    updatePassword,
}
