const db = require('../config/db');

// Helper to parse product images
const parseProduct = (p) => {
    const images = p.images
        ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images)
        : [p.image_url].filter(Boolean);
    return {
        ...p,
        images,
        image_url: (images && images.length > 0) ? images[0] : p.image_url
    };
};

exports.getAllProducts = async (req, res) => {
    try {
        let query = 'SELECT * FROM products';
        let params = [];
        let conditions = ['is_active = TRUE'];

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
        res.json(products.map(parseProduct));
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
        res.json(parseProduct(products[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPopularProducts = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM products WHERE is_active = TRUE ORDER BY rating DESC LIMIT 4`
        );
        res.json(rows.map(parseProduct));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── Admin: Create Product ──
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image_url, images, ingredients, brand, pet_type, stock_quantity, sku } = req.body;
        
        let imageArray = images;
        if (typeof images === 'string') {
            try { imageArray = JSON.parse(images); } catch(e) { imageArray = []; }
        }
        
        if (!imageArray || !Array.isArray(imageArray) || imageArray.length === 0 || imageArray.length > 5) {
            return res.status(400).json({ message: 'Images must be an array containing between 1 and 5 items' });
        }

        const mainImage = imageArray[0];

        const [result] = await db.execute(
            `INSERT INTO products (name, description, price, category, image_url, images, ingredients, brand, pet_type, stock_quantity, sku, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [name, description, price, category, mainImage, JSON.stringify(imageArray), ingredients || null, brand || null, pet_type || null, stock_quantity || 0, sku || null]
        );
        const [created] = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(parseProduct(created[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── Admin: Update Product ──
exports.updateProduct = async (req, res) => {
    try {
        // We do not extract admin_password here, it's used in the middleware
        const { name, description, price, category, images, ingredients, brand, pet_type, stock_quantity, sku, is_active } = req.body;
        
        let imageArray = images;
        let mainImage = null;
        if (images) {
            if (typeof images === 'string') {
                try { imageArray = JSON.parse(images); } catch(e) { imageArray = []; }
            }
            if (!Array.isArray(imageArray) || imageArray.length === 0 || imageArray.length > 5) {
                return res.status(400).json({ message: 'Images must be an array containing between 1 and 5 items' });
            }
            mainImage = imageArray[0];
        }

        await db.execute(
            `UPDATE products SET 
                name = COALESCE(?, name), 
                description = COALESCE(?, description), 
                price = COALESCE(?, price), 
                category = COALESCE(?, category), 
                image_url = COALESCE(?, image_url), 
                images = COALESCE(?, images), 
                ingredients = COALESCE(?, ingredients), 
                brand = COALESCE(?, brand), 
                pet_type = COALESCE(?, pet_type), 
                stock_quantity = COALESCE(?, stock_quantity), 
                sku = COALESCE(?, sku),
                is_active = COALESCE(?, is_active)
             WHERE id = ?`,
            [name, description, price, category, mainImage, images ? JSON.stringify(imageArray) : null, ingredients, brand, pet_type, stock_quantity, sku, is_active, req.params.id]
        );
        
        const [updated] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (updated.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(parseProduct(updated[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── Admin: Delete Product (soft delete) ──
exports.deleteProduct = async (req, res) => {
    try {
        await db.execute('UPDATE products SET is_active = FALSE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── Admin: Quick Toggle Status ──
exports.updateProductStatus = async (req, res) => {
    try {
        const { is_active } = req.body;
        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ message: 'is_active must be a boolean' });
        }
        await db.execute('UPDATE products SET is_active = ? WHERE id = ?', [is_active, req.params.id]);
        res.json({ message: 'Product status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── Admin: Get ALL products (including inactive) ──
exports.getAllProductsAdmin = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        res.json(products.map(parseProduct));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
