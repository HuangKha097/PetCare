require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Running completion migration...\n');

    // ── 1. Users: add role column ──
    const [userCols] = await conn.query(`SHOW COLUMNS FROM users LIKE 'role'`);
    if (userCols.length === 0) {
      await conn.query(`ALTER TABLE users ADD COLUMN role ENUM('user','admin') NOT NULL DEFAULT 'user'`);
      console.log('✅ Added "role" column to users');
    } else {
      console.log('⏭️  "role" column already exists in users');
    }

    // ── 2. Products: add inventory columns ──
    const [prodCols] = await conn.query(`SHOW COLUMNS FROM products`);
    const colNames = prodCols.map(c => c.Field);

    if (!colNames.includes('stock_quantity')) {
      await conn.query(`ALTER TABLE products ADD COLUMN stock_quantity INT NOT NULL DEFAULT 0`);
      console.log('✅ Added "stock_quantity" column to products');
    } else {
      console.log('⏭️  "stock_quantity" already exists in products');
    }

    if (!colNames.includes('sku')) {
      await conn.query(`ALTER TABLE products ADD COLUMN sku VARCHAR(50) DEFAULT NULL`);
      console.log('✅ Added "sku" column to products');
    } else {
      console.log('⏭️  "sku" already exists in products');
    }

    if (!colNames.includes('is_active')) {
      await conn.query(`ALTER TABLE products ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE`);
      console.log('✅ Added "is_active" column to products');
    } else {
      console.log('⏭️  "is_active" already exists in products');
    }

    // ── 3. Blogs: add created_at ──
    const [blogCols] = await conn.query(`SHOW COLUMNS FROM blogs LIKE 'created_at'`);
    if (blogCols.length === 0) {
      await conn.query(`ALTER TABLE blogs ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
      console.log('✅ Added "created_at" column to blogs');
    } else {
      console.log('⏭️  "created_at" already exists in blogs');
    }

    // ── 4. Set default stock_quantity for existing products that have 0 ──
    const [updated] = await conn.query(`UPDATE products SET stock_quantity = 100 WHERE stock_quantity = 0`);
    console.log(`✅ Set default stock to 100 for ${updated.affectedRows} products`);

    // ── 5. Generate SKU for products missing it ──
    const [noSku] = await conn.query(`SELECT id, category FROM products WHERE sku IS NULL`);
    for (const prod of noSku) {
      const prefix = (prod.category || 'GEN').substring(0, 3).toUpperCase();
      const sku = `${prefix}-${String(prod.id).padStart(5, '0')}`;
      await conn.query(`UPDATE products SET sku = ? WHERE id = ?`, [sku, prod.id]);
    }
    console.log(`✅ Generated SKU for ${noSku.length} products`);

    console.log('\n🎉 Migration completed successfully!');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    await conn.end();
    process.exit(1);
  }
}

migrate();
