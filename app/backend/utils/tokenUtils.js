const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');

/**
 * Token Utilities
 * Centralized module for generating and managing Access Tokens & Refresh Tokens.
 * 
 * Access Token  - Short-lived (15 minutes), used for API authorization.
 * Refresh Token - Long-lived (7 days), used to obtain new access tokens without re-login.
 */

// ─── Configuration ───────────────────────────────────────────────────────────

const ACCESS_TOKEN_EXPIRY = '15m';   // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 days

// ─── Access Token ────────────────────────────────────────────────────────────

/**
 * Generate a short-lived Access Token (JWT).
 * @param {Object} payload - { userId, email, role }
 * @returns {string} Signed JWT access token.
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

/**
 * Verify an Access Token.
 * @param {string} token - JWT access token string.
 * @returns {Object} Decoded token payload.
 * @throws {Error} If token is invalid or expired.
 */
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// ─── Refresh Token ───────────────────────────────────────────────────────────

/**
 * Generate a long-lived Refresh Token and store it in the database.
 * @param {number} userId - The user's ID.
 * @returns {Promise<string>} The refresh token string.
 */
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

/**
 * Verify a Refresh Token by checking it exists and is not expired in the database.
 * @param {string} token - The refresh token string.
 * @returns {Promise<Object|null>} The refresh token record if valid, or null.
 */
const verifyRefreshToken = async (token) => {
    const [rows] = await db.execute(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
        [token]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Revoke (delete) a specific refresh token.
 * @param {string} token - The refresh token string to revoke.
 */
const revokeRefreshToken = async (token) => {
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};

/**
 * Revoke all refresh tokens for a specific user (e.g., on password change or full logout).
 * @param {number} userId - The user's ID.
 */
const revokeAllUserTokens = async (userId) => {
    await db.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
};

/**
 * Clean up expired refresh tokens from the database.
 * Can be called periodically via a cron job.
 */
const cleanupExpiredTokens = async () => {
    await db.execute('DELETE FROM refresh_tokens WHERE expires_at <= NOW()');
};

// ─── Exports ─────────────────────────────────────────────────────────────────

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
