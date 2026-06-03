require('dotenv').config();

const bcrypt = require('bcrypt');
const { pool } = require('../configs/db');

const defaultAdmin = {
    full_name: 'Seng Mey',
    email: 'sengmey2004@gmail.com',
    password: 'PhoneStore@123',
    role: 'admin'
};

const seedDefaultAdmin = async () => {
    const passwordHash = await bcrypt.hash(defaultAdmin.password, 10);
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [defaultAdmin.email]);

    if(existing.length > 0) {
        await pool.query(
            'UPDATE users SET full_name = ?, password_hash = ?, role = ?, is_verified = 1, is_active = 1 WHERE id = ?',
            [defaultAdmin.full_name, passwordHash, defaultAdmin.role, existing[0].id]
        );

        return existing[0].id;
    }

    const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password_hash, role, is_verified, is_active) VALUES (?, ?, ?, ?, 1, 1)',
        [defaultAdmin.full_name, defaultAdmin.email, passwordHash, defaultAdmin.role]
    );

    return result.insertId;
};

seedDefaultAdmin()
    .then(async (id) => {
        console.log(`Default admin ready: ${defaultAdmin.email} (id: ${id})`);
        await pool.end();
    })
    .catch(async (error) => {
        console.error(error.message);
        await pool.end();
        process.exit(1);
    });
