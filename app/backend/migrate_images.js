require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
  try {
    // Check if images column exists first
    const [cols] = await pool.query(`
      SELECT COLUMN_NAME FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'images'
    `);
    if (cols.length === 0) {
      await pool.query(`ALTER TABLE products ADD COLUMN images JSON DEFAULT NULL`);
      console.log('Column "images" added.');
    } else {
      console.log('Column "images" already exists, skipping ALTER.');
    }

    // Backfill: build images array from existing image_url for every product
    const [products] = await pool.query('SELECT id, image_url FROM products');
    for (const p of products) {
      if (p.image_url) {
        // Use image_url as first image; derive a second variant with different crop
        const second = p.image_url.replace('w=500', 'w=600').replace('q=60', 'q=80');
        const images = JSON.stringify([p.image_url, second]);
        await pool.query('UPDATE products SET images = ? WHERE id = ?', [images, p.id]);
      }
    }
    console.log(`Backfilled images for ${products.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
