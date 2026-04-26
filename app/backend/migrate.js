require('dotenv').config();
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Starting migration...');
        
        // Add profile columns to users
        try { await db.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL'); } catch(e){}
        try { await db.execute('ALTER TABLE users ADD COLUMN address TEXT DEFAULT NULL'); } catch(e){}
        try { await db.execute('ALTER TABLE users ADD COLUMN city VARCHAR(100) DEFAULT NULL'); } catch(e){}

        // Create Orders Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                payment_method VARCHAR(50) NOT NULL,
                address TEXT NOT NULL,
                phone VARCHAR(20) NOT NULL,
                city VARCHAR(100) NOT NULL,
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Create Order Items Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);

        // Create Wishlist Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_wishlist (user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);

        console.log('Migration successful: All tables created.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Migration skipped: Columns already exist.');
        } else {
            console.error('Migration failed:', error.message);
        }
        process.exit(1);
    }
}

migrate();
