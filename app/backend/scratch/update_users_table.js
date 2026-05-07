const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../config/db');

async function updateUsersTable() {
    try {
        console.log('Adding google_id column to users table...');
        await db.execute('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE AFTER email');
        console.log('Column added successfully!');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column google_id already exists.');
            process.exit(0);
        }
        console.error('Error updating table:', error);
        process.exit(1);
    }
}

updateUsersTable();
