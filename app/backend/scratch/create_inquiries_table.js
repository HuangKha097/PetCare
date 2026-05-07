const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'petcaredb',
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS inquiries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                service_type VARCHAR(100),
                status ENUM('pending', 'contacted', 'resolved') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "inquiries" created or already exists.');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await connection.end();
    }
}

createTable();
