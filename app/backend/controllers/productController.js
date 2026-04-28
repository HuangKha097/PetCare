const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        let query = 'SELECT * FROM products';
        let params = [];

        if (req.query.q) {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            const searchTerm = `%${req.query.q}%`;
            params.push(searchTerm, searchTerm);
        } else if (req.query.category) {
            query += ' WHERE category = ?';
            params.push(req.query.category);
        }

        const [products] = await db.execute(query, params);
        const parsed = products.map(p => ({
            ...p,
            images: p.images
                ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images)
                : [p.image_url].filter(Boolean),
        }));
        res.json(parsed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const p = products[0];
        res.json({
            ...p,
            images: p.images
                ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images)
                : [p.image_url].filter(Boolean),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
