const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user is still active in DB
        const [users] = await db.execute('SELECT id, role, is_active FROM users WHERE id = ?', [decoded.userId]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        const user = users[0];
        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is banned' });
        }

        req.user = user.id; // Maintain compatibility
        req.userRole = user.role;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
