require('dotenv').config({ path: '../backend/.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seed() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log("Connected to MySQL.");

        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        await connection.query(schema);
        console.log("Schema executed successfully!");

        await connection.end();
    } catch (error) {
        console.error("Error executing schema:", error.message);
    }
}

seed();
