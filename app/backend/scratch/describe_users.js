const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../config/db');

async function describeUsers() {
    try {
        const [rows] = await db.execute('DESCRIBE users');
        console.log(rows);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

describeUsers();
