require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = '123456';
    const adminName = 'Admin';

    console.log('🔄 Seeding admin account...\n');

    // Check if admin already exists
    const [existing] = await conn.query('SELECT id, role FROM users WHERE email = ?', [adminEmail]);

    if (existing.length > 0) {
      if (existing[0].role === 'admin') {
        console.log('⏭️  Admin account already exists with admin role');
      } else {
        await conn.query('UPDATE users SET role = ? WHERE email = ?', ['admin', adminEmail]);
        console.log('✅ Updated existing user to admin role');
      }
    } else {
      // Create new admin account
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await conn.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, 'admin']
      );
      console.log('✅ Admin account created successfully');
    }

    console.log(`\n📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👑 Role:     admin`);

    console.log('\n🎉 Seed completed!');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    await conn.end();
    process.exit(1);
  }
}

seedAdmin();
