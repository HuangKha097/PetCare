const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const runMigration = async () => {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connected! Starting migration...');
        
        // 1. Delete all order items
        console.log('Deleting from order_items...');
        const [delItemsResult] = await connection.execute('DELETE FROM order_items');
        console.log(`Deleted order items:`, delItemsResult);

        // 2. Delete all orders
        console.log('Deleting from orders...');
        const [delOrdersResult] = await connection.execute('DELETE FROM orders');
        console.log(`Deleted orders:`, delOrdersResult);

        // 3. Convert prices to VNĐ with capping at 1.500.000đ and rounding to thousands
        console.log('Converting product prices to native VNĐ...');
        const [updateProductsResult] = await connection.execute(
            'UPDATE products SET price = LEAST(ROUND(price * 25000, -3), 1500000)'
        );
        console.log(`Updated products:`, updateProductsResult);

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Error executing migration:', error);
    } finally {
        await connection.end();
        console.log('Database connection closed.');
    }
};

runMigration();
