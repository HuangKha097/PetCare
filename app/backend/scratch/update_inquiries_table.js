const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateTable() {
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
            ALTER TABLE inquiries 
            ADD COLUMN name VARCHAR(255),
            ADD COLUMN message TEXT;
        `);
        console.log('Table "inquiries" updated with name and message columns.');
    } catch (err) {
        console.error('Error updating table:', err);
    } finally {
        await connection.end();
    }
}

updateTable();
