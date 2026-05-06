const bcrypt = require('bcryptjs');
const db = require('../config/db');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    revokeAllUserTokens,
} = require('../utils/tokenUtils');

// ─── Register ────────────────────────────────────────────────────────────────

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user with default role 'user'
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'user']
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Login ───────────────────────────────────────────────────────────────────

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        if (!user.is_active) {
            return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens using tokenUtils
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = await generateRefreshToken(user.id);

        res.json({
            token: accessToken,
            refreshToken,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role || 'user', 
                is_active: user.is_active,
                phone: user.phone,
                address: user.address,
                city: user.city 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Refresh Token ───────────────────────────────────────────────────────────

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Verify the refresh token exists and is not expired
        const storedToken = await verifyRefreshToken(refreshToken);
        if (!storedToken) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Get the user associated with this token
        const [users] = await db.execute(
            'SELECT id, email, role, is_active FROM users WHERE id = ?',
            [storedToken.user_id]
        );

        if (users.length === 0) {
            await revokeRefreshToken(refreshToken);
            return res.status(401).json({ message: 'User no longer exists' });
        }

        const user = users[0];

        if (!user.is_active) {
            await revokeAllUserTokens(user.id);
            return res.status(403).json({ message: 'Account is banned' });
        }

        // Rotate: revoke old refresh token and generate new ones
        await revokeRefreshToken(refreshToken);

        const newAccessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const newRefreshToken = await generateRefreshToken(user.id);

        res.json({
            token: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Logout ──────────────────────────────────────────────────────────────────

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await revokeRefreshToken(refreshToken);
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Get Current User ────────────────────────────────────────────────────────

exports.getMe = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, phone, address, city, role FROM users WHERE id = ?', [req.user]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Update Profile ──────────────────────────────────────────────────────────

exports.updateProfile = async (req, res) => {
    try {
        const { phone, address, city } = req.body;
        await db.execute(
            'UPDATE users SET phone = ?, address = ?, city = ? WHERE id = ?',
            [phone || null, address || null, city || null, req.user]
        );
        const [updated] = await db.execute('SELECT id, name, email, phone, address, city, role FROM users WHERE id = ?', [req.user]);
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
