const path = require('path');
const bcrypt = require('bcrypt');
const readline = require('readline');

// Load environment variables relative to this script
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { pool } = require('../configs/db');

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
    }));
};

const createAdmin = async () => {
    try {
        let fullName = process.argv[2];
        let email = process.argv[3];
        let password = process.argv[4];

        // If arguments are missing, fall back to interactive command line questions
        if (!fullName || !email || !password) {
            console.log('--- Admin Creation Script ---');
            fullName = fullName || await askQuestion('Enter Admin Full Name (default: admin): ') || 'admin';
            email = email || await askQuestion('Enter Admin Email (default: admin@gmail.com): ') || 'admin@gmail.com';
            password = password || await askQuestion('Enter Admin Password: ');
            
            if (!password) {
                console.error('\nError: Password is required');
                process.exitCode = 1;
                return;
            }
        }

        console.log(`\nCreating admin with:`);
        console.log(`- Name: ${fullName}`);
        console.log(`- Email: ${email}`);

        // Hash the password with bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // SQL query to insert or update the admin
        const query = `
            INSERT INTO users (
                full_name,
                email,
                password_hash,
                role,
                is_verified,
                is_active
            ) VALUES (?, ?, ?, 'admin', 1, 1)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                password_hash = VALUES(password_hash),
                role = VALUES(role),
                is_verified = VALUES(is_verified),
                is_active = VALUES(is_active);
        `;

        await pool.query(query, [fullName, email, passwordHash]);

        console.log(`\nAdmin user successfully created/updated!`);
    } catch (error) {
        console.error('\nError creating admin:', error.message);
        process.exitCode = 1;
    } finally {
        // Ensure pool connection is closed so Node can exit cleanly
        await pool.end();
    }
};

createAdmin();
