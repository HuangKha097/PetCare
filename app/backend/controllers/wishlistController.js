const db = require('../config/db');

exports.getWishlist = async (req, res) => {
    try {
        const [items] = await db.execute(
            `SELECT w.id as wishlist_id, p.* 
             FROM wishlist w 
             JOIN products p ON w.product_id = p.id 
             WHERE w.user_id = ?`,
            [req.user]
        );
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Check if already in wishlist
        const [existing] = await db.execute(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
            [req.user, productId]
        );

        if (existing.length > 0) {
            // Remove
            await db.execute(
                'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
                [req.user, productId]
            );
            res.json({ message: 'Removed from wishlist', action: 'removed' });
        } else {
            // Add
            await db.execute(
                'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
                [req.user, productId]
            );
            res.json({ message: 'Added to wishlist', action: 'added' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
