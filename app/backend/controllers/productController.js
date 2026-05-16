const db = require('../config/db');
const { createMultilingualField } = require('../services/translationService');


const parseProduct = (p) => {
    if (!p) return null;
    
    const safeParse = (str) => {
        try { return typeof str === 'string' && str.startsWith('{') ? JSON.parse(str) : str; }
        catch { return str; }
    };

    const images = p.images
        ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images)
        : [p.image_url].filter(Boolean);
        
    return {
        ...p,
        images,
        image_url: (images && images.length > 0) ? images[0] : p.image_url,
        name: safeParse(p.name),
        description: safeParse(p.description),
        ingredients: safeParse(p.ingredients)
    };
};

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM products';
        let countQuery = 'SELECT COUNT(*) as total FROM products';
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
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        if (req.query.sort === 'price_asc') {
            query += ' ORDER BY price ASC';
        } else if (req.query.sort === 'price_desc') {
            query += ' ORDER BY price DESC';
        } else if (req.query.sort === 'newest') {
            query += ' ORDER BY created_at DESC';
        }


        const [countResult] = await db.execute(countQuery, params);
        const totalCount = countResult[0].total;
        const totalPages = Math.ceil(totalCount / limit);


        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);


        const [products] = await db.query(query, params);
        
        res.json({
            products: products.map(parseProduct),
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit
            }
        });
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


        const translatedName = await createMultilingualField(name);
        const translatedDesc = await createMultilingualField(description);
        const translatedIngr = ingredients ? await createMultilingualField(ingredients) : null;

        const [result] = await db.execute(
            `INSERT INTO products (name, description, price, category, image_url, images, ingredients, brand, pet_type, stock_quantity, sku, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [
                JSON.stringify(translatedName), 
                JSON.stringify(translatedDesc), 
                price, 
                category, 
                mainImage, 
                JSON.stringify(imageArray), 
                translatedIngr ? JSON.stringify(translatedIngr) : null, 
                brand || null, 
                pet_type || null, 
                stock_quantity || 0, 
                sku || null
            ]
        );
        const [created] = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(parseProduct(created[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateProduct = async (req, res) => {
    try {

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

        const safe = (val) => val === undefined ? null : val;


        const translatedName = name !== undefined ? await createMultilingualField(name) : undefined;
        const translatedDesc = description !== undefined ? await createMultilingualField(description) : undefined;
        const translatedIngr = ingredients !== undefined ? await createMultilingualField(ingredients) : undefined;

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
            [
                safe(translatedName ? JSON.stringify(translatedName) : undefined), 
                safe(translatedDesc ? JSON.stringify(translatedDesc) : undefined), 
                safe(price), 
                safe(category), 
                safe(mainImage), 
                images ? JSON.stringify(imageArray) : null, 
                safe(translatedIngr ? JSON.stringify(translatedIngr) : undefined), 
                safe(brand), 
                safe(pet_type), 
                safe(stock_quantity), 
                safe(sku), 
                safe(is_active), 
                req.params.id
            ]
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


exports.deleteProduct = async (req, res) => {
    try {
        await db.execute('UPDATE products SET is_active = FALSE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


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


exports.getAllProductsAdmin = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        res.json(products.map(parseProduct));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
