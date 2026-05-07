const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkData() {
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
        const [rows] = await connection.execute('SELECT * FROM inquiries ORDER BY id DESC LIMIT 5');
        console.log('Last 5 inquiries:', JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error('Error fetching data:', err);
    } finally {
        await connection.end();
    }
}

checkData();
