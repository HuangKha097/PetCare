require('dotenv').config();
const db = require('./config/db');
const { createMultilingualField } = require('./services/translationService');

async function migrate() {
    try {
        console.log('Starting i18n database migration...');

        // 1. Fetch all existing products
        const [products] = await db.execute('SELECT id, name, description, ingredients FROM products');
        console.log(`Found ${products.length} products to migrate.`);

        // 2. Loop and translate each product
        for (const product of products) {
            console.log(`Translating Product ID: ${product.id} - ${product.name}`);
            
            // If it's already a JSON string (has '{"en":'), skip or parse it.
            // But we assume it's currently a plain string.
            let newName, newDesc, newIngr;

            // Name
            if (product.name && !product.name.startsWith('{"en"')) {
                newName = await createMultilingualField(product.name);
            } else {
                newName = product.name; // Keep as is if already JSON or null
            }

            // Description
            if (product.description && !product.description.startsWith('{"en"')) {
                newDesc = await createMultilingualField(product.description);
            } else {
                newDesc = product.description;
            }

            // Ingredients
            if (product.ingredients && !product.ingredients.startsWith('{"en"')) {
                newIngr = await createMultilingualField(product.ingredients);
            } else {
                newIngr = product.ingredients;
            }

            // 3. Update the row with JSON strings
            // Note: MySQL will accept valid JSON strings into TEXT or JSON columns.
            await db.execute(
                `UPDATE products SET 
                    name = ?, 
                    description = ?, 
                    ingredients = ? 
                 WHERE id = ?`,
                [
                    typeof newName === 'object' ? JSON.stringify(newName) : newName,
                    typeof newDesc === 'object' ? JSON.stringify(newDesc) : newDesc,
                    typeof newIngr === 'object' ? JSON.stringify(newIngr) : newIngr,
                    product.id
                ]
            );
            
            // Sleep slightly to avoid rate-limiting from Bing Translate
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 4. Alter table columns to JSON (Optional but good for data integrity)
        // Note: name was VARCHAR(255), changing to JSON.
        console.log('Altering column types to JSON...');
        await db.execute('ALTER TABLE products MODIFY name JSON');
        await db.execute('ALTER TABLE products MODIFY description JSON');
        await db.execute('ALTER TABLE products MODIFY ingredients JSON');

        console.log('Migration completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
