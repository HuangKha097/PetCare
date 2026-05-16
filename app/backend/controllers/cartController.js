const db = require('../config/db');


const getFullCart = async (userId) => {
    const [cartItems] = await db.execute(`
        SELECT c.id as cart_item_id, c.quantity, p.*, p.stock_quantity 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    `, [userId]);
    return cartItems;
};

exports.getCart = async (req, res) => {
    try {
        const cartItems = await getFullCart(req.user);


        const outOfStockItems = cartItems.filter(item => item.stock_quantity <= 0 || !item.is_active);
        const removedNames = [];

        for (const item of outOfStockItems) {
            await db.execute('DELETE FROM cart_items WHERE id = ?', [item.cart_item_id]);
            removedNames.push(item.name);
        }


        const overStockItems = cartItems.filter(item => item.stock_quantity > 0 && item.is_active && item.quantity > item.stock_quantity);
        const adjustedNames = [];

        for (const item of overStockItems) {
            await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [item.stock_quantity, item.cart_item_id]);
            adjustedNames.push({ name: item.name, newQty: item.stock_quantity });
        }


        const updatedCart = await getFullCart(req.user);


        const response = {
            items: updatedCart,
            notifications: []
        };

        if (removedNames.length > 0) {
            response.notifications.push({
                type: 'removed',
                message: `The following items are out of stock and have been removed from your cart: ${removedNames.join(', ')}`,
                products: removedNames
            });
        }

        if (adjustedNames.length > 0) {
            response.notifications.push({
                type: 'adjusted',
                message: `Some item quantities have been adjusted to match available stock`,
                products: adjustedNames
            });
        }

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity) || 1;


        const [product] = await db.execute(
            'SELECT id, name, stock_quantity, is_active FROM products WHERE id = ?',
            [productId]
        );

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product[0].is_active) {
            return res.status(400).json({ message: 'This product is no longer available' });
        }

        if (product[0].stock_quantity <= 0) {
            return res.status(400).json({ message: `"${product[0].name}" is currently out of stock` });
        }
        

        const [existing] = await db.execute(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
            [req.user, productId]
        );

        const currentQty = existing.length > 0 ? existing[0].quantity : 0;
        const newTotalQty = currentQty + qty;


        if (newTotalQty > product[0].stock_quantity) {
            return res.status(400).json({ 
                message: `Cannot add ${qty} items. Only ${product[0].stock_quantity - currentQty} more available.`,
                availableStock: product[0].stock_quantity,
                currentCartQty: currentQty
            });
        }

        if (existing.length > 0) {
            await db.execute(
                'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [qty, req.user, productId]
            );
        } else {
            await db.execute(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user, productId, qty]
            );
        }
        

        const updatedCart = await getFullCart(req.user);
        res.status(200).json({ items: updatedCart, notifications: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;


        const [cartItem] = await db.execute(
            `SELECT c.product_id, p.stock_quantity, p.name 
             FROM cart_items c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.id = ? AND c.user_id = ?`,
            [req.params.id, req.user]
        );

        if (cartItem.length > 0 && quantity > cartItem[0].stock_quantity) {
            return res.status(400).json({ 
                message: `"${cartItem[0].name}" only has ${cartItem[0].stock_quantity} items in stock`,
                availableStock: cartItem[0].stock_quantity
            });
        }

        await db.execute(
            'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, req.params.id, req.user]
        );
        
        const updatedCart = await getFullCart(req.user);
        res.json({ items: updatedCart, notifications: [] });
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
        
        const updatedCart = await getFullCart(req.user);
        res.json({ items: updatedCart, notifications: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await db.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user]);
        res.json({ items: [], notifications: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
