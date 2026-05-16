const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');





const ACCESS_TOKEN_EXPIRY = '15m';   // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 days




const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};


const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};




const generateRefreshToken = async (userId) => {
    const token = crypto.randomBytes(40).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await db.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
    );

    return token;
};


const verifyRefreshToken = async (token) => {
    const [rows] = await db.execute(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
        [token]
    );
    return rows.length > 0 ? rows[0] : null;
};


const revokeRefreshToken = async (token) => {
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};


const revokeAllUserTokens = async (userId) => {
    await db.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
};


const cleanupExpiredTokens = async () => {
    await db.execute('DELETE FROM refresh_tokens WHERE expires_at <= NOW()');
};



module.exports = {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    revokeAllUserTokens,
    cleanupExpiredTokens,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY_DAYS,
};
