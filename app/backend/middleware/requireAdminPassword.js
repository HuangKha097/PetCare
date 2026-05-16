const bcrypt = require('bcryptjs');
const db = require('../config/db');

module.exports = async (req, res, next) => {
    try {
        const { adminPassword } = req.body;
        
        if (!adminPassword) {
            return res.status(400).json({ message: 'Admin password is required for this action' });
        }


        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [users] = await db.execute('SELECT password_hash, role FROM users WHERE id = ?', [req.user]);
        
        if (users.length === 0 || users[0].role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        const isMatch = await bcrypt.compare(adminPassword, users[0].password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin password' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during password verification' });
    }
};
