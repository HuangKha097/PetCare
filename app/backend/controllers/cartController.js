const db = require('../config/db');

exports.getCart = async (req, res) => {
    try {
        const query = `
            SELECT c.id as cart_item_id, c.quantity, p.* 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `;
        const [cartItems] = await db.execute(query, [req.user]);
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity) || 1;
        
        // Check if item already in cart
        const [existing] = await db.execute(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
            [req.user, productId]
        );

        if (existing.length > 0) {
            // Update quantity
            await db.execute(
                'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [qty, req.user, productId]
            );
        } else {
            // Insert new item
            await db.execute(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user, productId, qty]
            );
        }
        
        // Return updated cart
        const query = `
            SELECT c.id as cart_item_id, c.quantity, p.* 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `;
        const [cartItems] = await db.execute(query, [req.user]);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        await db.execute(
            'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, req.params.id, req.user]
        );
        
        const query = `
            SELECT c.id as cart_item_id, c.quantity, p.* 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `;
        const [cartItems] = await db.execute(query, [req.user]);
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        await db.execute(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [req.params.id, req.user]
        );
        
        const query = `
            SELECT c.id as cart_item_id, c.quantity, p.* 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `;
        const [cartItems] = await db.execute(query, [req.user]);
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await db.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user]);
        res.json([]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
