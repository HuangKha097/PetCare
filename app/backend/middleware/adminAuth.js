/**
 * Admin Authorization Middleware
 * Must be used AFTER the auth middleware (which sets req.userRole).
 */
module.exports = function (req, res, next) {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};
