const db = require('../config/db');
const { verifyAccessToken } = require('../utils/tokenUtils');


module.exports = async function (req, res, next) {

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = verifyAccessToken(token);
        

        const [users] = await db.execute('SELECT id, role, is_active FROM users WHERE id = ?', [decoded.userId]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        const user = users[0];
        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is banned' });
        }


        req.user = decoded.userId;
        req.userRole = user.role;
        next();
    } catch (err) {

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};
