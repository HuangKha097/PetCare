require('dotenv').config();
const mysql = require('mysql2/promise');

/**
 * Migration: Create refresh_tokens table
 * Stores refresh tokens linked to users with expiration tracking.
 */
async function migrate() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log('Creating refresh_tokens table...');

        await conn.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(255) NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_token (token),
                INDEX idx_user_id (user_id),
                INDEX idx_expires_at (expires_at)
            )
        `);

        console.log('✅ refresh_tokens table created successfully!');
        await conn.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        await conn.end();
        process.exit(1);
    }
}

migrate();
