const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { items, totalAmount, paymentMethod, address, phone, city, note } = req.body;
        const userId = req.user;

        // 1. Check stock for all items before proceeding
        for (const item of items) {
            const productId = item.id || item.product_id;
            const [product] = await connection.execute(
                'SELECT id, name, stock_quantity, is_active FROM products WHERE id = ? FOR UPDATE',
                [productId]
            );
            if (product.length === 0) {
                await connection.rollback();
                return res.status(400).json({ message: `Product not found (ID: ${productId})` });
            }
            if (!product[0].is_active) {
                await connection.rollback();
                return res.status(400).json({ message: `"${product[0].name}" is no longer available` });
            }
            if (product[0].stock_quantity < item.quantity) {
                await connection.rollback();
                return res.status(400).json({ 
                    message: `"${product[0].name}" only has ${product[0].stock_quantity} items in stock`,
                    productId: productId,
                    availableStock: product[0].stock_quantity
                });
            }
        }

        // 2. Create Order record
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount, payment_method, address, phone, city, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, totalAmount, paymentMethod, address, phone, city, note || '']
        );
        const orderId = orderResult.insertId;

        // 3. Create Order Items records and deduct stock
        for (const item of items) {
            const productId = item.id || item.product_id;
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, productId, item.quantity, item.price]
            );
            // Deduct stock
            await connection.execute(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, productId]
            );
        }

        // 4. Clear Cart
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
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items] = await db.execute(
                    `SELECT oi.*, 
              p.name, 
              JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image_url
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
                    [order.id]
                );

                return { ...order, items };
            })
        );
        res.json(ordersWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// ── Admin: Get ALL orders ──
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.execute(
            `SELECT o.*, u.name as user_name, u.email as user_email 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             ORDER BY o.created_at DESC`
        );

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items] = await db.execute(
                    `SELECT oi.*, p.name, 
                     JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image_url
                     FROM order_items oi 
                     JOIN products p ON oi.product_id = p.id 
                     WHERE oi.order_id = ?`,
                    [order.id]
                );
                return { ...order, items };
            })
        );
        res.json(ordersWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// ── Admin: Update Order Status ──
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const [orderRows] = await db.execute('SELECT status FROM orders WHERE id = ?', [req.params.id]);
        if (orderRows.length === 0) return res.status(404).json({ message: 'Order not found' });
        
        const currentStatus = orderRows[0].status;

        // Terminal State Check
        if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
            return res.status(400).json({ message: `Order is already ${currentStatus}. Cannot modify terminal states.` });
        }

        // Allowed Transitions
        const allowedTransitions = {
            'Pending': ['Confirmed', 'Cancelled'],
            'Confirmed': ['Processing', 'Cancelled'],
            'Processing': ['Shipped'],
            'Shipped': ['Delivered']
        };

        if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(status)) {
            return res.status(400).json({ message: `Illegal transition from ${currentStatus} to ${status}` });
        }

        // If cancelling, restore stock
        if (status === 'Cancelled') {
            const [orderItems] = await db.execute('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [req.params.id]);
            for (const item of orderItems) {
                await db.execute(
                    'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }
        }

        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated', status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};
