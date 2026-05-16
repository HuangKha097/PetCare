const db = require('../config/db');


exports.getProductReviews = async (req, res) => {
    try {
        const [reviews] = await db.execute(`
            SELECT r.*, u.name as user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = ? 
            ORDER BY r.created_at DESC
        `, [req.params.productId]);
        
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user;

    if (!rating || !comment) {
        return res.status(400).json({ message: 'Rating and comment are required' });
    }

    try {

        const [existing] = await db.execute(
            'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
            [productId, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        await db.execute(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [productId, userId, rating, comment]
        );


        const [avgResult] = await db.execute(
            'SELECT AVG(rating) as avgRating FROM reviews WHERE product_id = ?',
            [productId]
        );
        
        const newAvg = avgResult[0].avgRating || rating;

        await db.execute(
            'UPDATE products SET rating = ? WHERE id = ?',
            [newAvg, productId]
        );

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
