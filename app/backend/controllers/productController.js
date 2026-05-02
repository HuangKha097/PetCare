const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        let query = 'SELECT * FROM products';
        let params = [];
        let conditions = [];

        const searchQuery = req.query.search || req.query.q;

        if (searchQuery) {
            conditions.push('(name LIKE ? OR description LIKE ?)');
            const searchTerm = `%${searchQuery}%`;
            params.push(searchTerm, searchTerm);
        }
        if (req.query.category) {
            conditions.push('category = ?');
            params.push(req.query.category);
        }
        if (req.query.pet_type) {
            conditions.push('pet_type = ?');
            params.push(req.query.pet_type);
        }
        if (req.query.brand) {
            conditions.push('brand = ?');
            params.push(req.query.brand);
        }
        if (req.query.minPrice) {
            conditions.push('price >= ?');
            params.push(req.query.minPrice);
        }
        if (req.query.maxPrice) {
            conditions.push('price <= ?');
            params.push(req.query.maxPrice);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        if (req.query.sort === 'price_asc') {
            query += ' ORDER BY price ASC';
        } else if (req.query.sort === 'price_desc') {
            query += ' ORDER BY price DESC';
        } else if (req.query.sort === 'newest') {
            query += ' ORDER BY created_at DESC';
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

exports.getPopularProducts = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT * 
FROM products
ORDER BY rating DESC
LIMIT 4;`
        );


        const products = rows.map(p => ({
            ...p,
            images: p.images
                ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images)
                : [p.image_url].filter(Boolean),
        }));

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

