const db = require('../config/db');

exports.getDashboardAnalytics = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        
        // 1. Overview Stats
        const [revenueRes] = await db.execute(`SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`, [days]);
        const [ordersRes] = await db.execute(`SELECT COUNT(id) as total FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`, [days]);
        const [usersRes] = await db.execute(`SELECT COUNT(id) as total FROM users WHERE role = 'user' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`, [days]);
        const [productsRes] = await db.execute(`SELECT COUNT(id) as total FROM products WHERE is_active = TRUE`);

        // Get Previous Period for Comparison
        const [prevRevenueRes] = await db.execute(`SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`, [days * 2, days]);
        const [prevOrdersRes] = await db.execute(`SELECT COUNT(id) as total FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`, [days * 2, days]);
        
        // 2. Chart Data (Revenue & Orders by Date)
        const [chartData] = await db.execute(`
            SELECT 
                DATE(created_at) as date,
                SUM(total_amount) as revenue,
                COUNT(id) as orders
            FROM orders
            WHERE status != 'Cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `, [days]);

        // 3. Best Sellers
        const [bestSellers] = await db.execute(`
            SELECT 
                p.id, p.name, 
                JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) as image_url,
                p.stock_quantity, p.price,
                SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.status != 'Cancelled' AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 5
        `, [days]);

        res.json({
            overview: {
                revenue: revenueRes[0].total || 0,
                prevRevenue: prevRevenueRes[0].total || 0,
                orders: ordersRes[0].total || 0,
                prevOrders: prevOrdersRes[0].total || 0,
                users: usersRes[0].total || 0,
                activeProducts: productsRes[0].total || 0,
            },
            chartData: chartData.map(d => ({
                ...d,
                // Ensure date string formatting is clean for frontend
                date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            })),
            bestSellers
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRecentNotifications = async (req, res) => {
    try {
        // Fetch 5 most recent pending orders
        const [orders] = await db.execute(`
            SELECT o.id, o.total_amount, o.created_at, u.name as user_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.status = 'Pending'
            ORDER BY o.created_at DESC
            LIMIT 5
        `);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── User Management ──

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT 
                u.id, u.name, u.email, u.role, u.phone, u.address, u.city, u.is_active, u.is_protected, u.created_at,
                (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as total_orders,
                (SELECT IFNULL(SUM(total_amount), 0) FROM orders o WHERE o.user_id = u.id AND o.status != 'Cancelled') as total_spent
            FROM users u
            ORDER BY u.created_at DESC
        `);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT id, name, email, role, phone, address, city, is_active, is_protected, created_at 
            FROM users WHERE id = ?
        `, [req.params.id]);

        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const [orders] = await db.execute(`
            SELECT id, total_amount, status, created_at 
            FROM orders 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `, [req.params.id]);

        res.json({
            user: users[0],
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user details' });
    }
};

exports.updateUserInfo = async (req, res) => {
    try {
        const [targetUsers] = await db.execute('SELECT is_protected FROM users WHERE id = ?', [req.params.id]);
        if (targetUsers.length === 0) return res.status(404).json({ message: 'User not found' });
        
        if (targetUsers[0].is_protected) {
            return res.status(403).json({ message: 'This system account is protected and cannot be modified.' });
        }

        const { name, phone, address, city, role } = req.body;
        
        // Prevent changing own role via this endpoint for safety
        let updateRole = role;
        if (req.params.id == req.user && role !== undefined) {
            updateRole = undefined; // Don't update role if it's the current user
        }

        const updates = [];
        const params = [];

        if (name !== undefined) { updates.push('name = ?'); params.push(name); }
        if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
        if (address !== undefined) { updates.push('address = ?'); params.push(address); }
        if (city !== undefined) { updates.push('city = ?'); params.push(city); }
        if (updateRole !== undefined) { updates.push('role = ?'); params.push(updateRole); }

        if (updates.length === 0) return res.status(400).json({ message: 'No fields to update' });

        params.push(req.params.id);

        await db.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
        res.json({ message: 'User info updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating user info' });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT is_active, is_protected FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        if (users[0].is_protected) {
            return res.status(403).json({ message: 'System accounts cannot be banned.' });
        }

        if (req.params.id == req.user) {
            return res.status(400).json({ message: 'You cannot ban yourself.' });
        }

        const newStatus = users[0].is_active ? 0 : 1;
        await db.execute('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);
        
        res.json({ message: `User account ${newStatus ? 'activated' : 'banned'} successfully`, is_active: newStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error toggling user status' });
    }
};

exports.deleteUser = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const userId = req.params.id;

        const [targetUsers] = await db.execute('SELECT is_protected FROM users WHERE id = ?', [userId]);
        if (targetUsers.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (targetUsers[0].is_protected) {
            return res.status(403).json({ message: 'System accounts cannot be deleted.' });
        }

        if (userId == req.user) {
            return res.status(400).json({ message: 'You cannot delete yourself.' });
        }

        // Delete dependencies (cart items, reviews)
        await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
        await connection.execute('DELETE FROM reviews WHERE user_id = ?', [userId]);
        
        // Note: For orders, we might want to keep them or anonymize them.
        // If the DB has ON DELETE CASCADE it will handle it, otherwise we should leave orders intact 
        // to preserve financial records, but maybe set user_id to NULL.
        // Let's set user_id = NULL in orders to preserve revenue stats.
        await connection.execute('UPDATE orders SET user_id = NULL WHERE user_id = ?', [userId]);

        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
        
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'User not found' });
        }

        await connection.commit();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    } finally {
        connection.release();
    }
};
