const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { items, totalAmount, paymentMethod, address, phone, city, note } = req.body;
        const userId = req.user;

        // 1. Create Order record
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount, payment_method, address, phone, city, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, totalAmount, paymentMethod, address, phone, city, note || '']
        );
        const orderId = orderResult.insertId;

        // 2. Create Order Items records
        for (const item of items) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id || item.product_id, item.quantity, item.price]
            );
        }

        // 3. Clear Cart
        await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Failed to place order' });
    } finally {
        connection.release();
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user;
        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Fetch items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const [items] = await db.execute(
                `SELECT oi.*, p.name, p.image_url 
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            return { ...order, items };
        }));

        res.json(ordersWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};
