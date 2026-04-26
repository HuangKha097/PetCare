require("dotenv").config();
const pool = require("./config/db");

const products = [
    { name: 'Premium Puppy Kibble', price: 34.99, rating: 4.8, category: 'Puppy Specific', image_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60', description: 'Optimal nutrition for your growing puppy.' },
    { name: 'Organic Beef Jerky', price: 18.50, rating: 4.9, category: 'Organic Bites', image_url: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=60', description: '100% organic grass-fed beef.' },
    { name: 'Senior Mobility Bites', price: 29.99, rating: 4.7, category: 'Senior Care', image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=60', description: 'Supports joint health in senior dogs.' },
    { name: 'Grain-Free Salmon Mix', price: 42.99, rating: 4.6, category: 'Grain-Free', image_url: 'https://images.unsplash.com/photo-1623366302587-bca9fbcf9f46?w=500&auto=format&fit=crop&q=60', description: 'Hypoallergenic grain-free salmon formula.' },
    { name: 'High Protein Chicken Feast', price: 38.50, rating: 4.5, category: 'High Protein', image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60', description: 'Packed with lean chicken protein.' },
    { name: 'Duck & Potato Treats', price: 12.99, rating: 4.8, category: 'Grain-Free', image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60', description: 'Tasty duck treats for sensitive stomachs.' },
    { name: 'Holistic Turkey Dinner', price: 45.00, rating: 4.9, category: 'Organic Bites', image_url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&auto=format&fit=crop&q=60', description: 'Complete holistic nutrition.' },
    { name: 'Small Breed Vitality', price: 22.50, rating: 4.4, category: 'Puppy Specific', image_url: 'https://images.unsplash.com/photo-1591768793355-74d75b38f38c?w=500&auto=format&fit=crop&q=60', description: 'Designed for the high energy of small breeds.' },
    { name: 'Active Performance Mix', price: 55.00, rating: 4.7, category: 'High Protein', image_url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&auto=format&fit=crop&q=60', description: 'For highly active and working dogs.' },
    { name: 'Gentle Digestion Lamb', price: 39.99, rating: 4.3, category: 'Senior Care', image_url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60', description: 'Easy on the stomach lamb recipe.' },
    { name: 'Wild Boar & Apple', price: 48.99, rating: 4.9, category: 'Grain-Free', image_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=500&auto=format&fit=crop&q=60', description: 'Exotic wild boar protein source.' },
    { name: 'Puppy Growth Plus', price: 31.50, rating: 4.6, category: 'Puppy Specific', image_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&auto=format&fit=crop&q=60', description: 'Enhanced with DHA for brain development.' },
    { name: 'Dental Care Chews', price: 15.99, rating: 4.5, category: 'Organic Bites', image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60', description: 'Cleans teeth and freshens breath.' },
    { name: 'Hypoallergenic Venison', price: 62.00, rating: 4.8, category: 'Grain-Free', image_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&auto=format&fit=crop&q=60', description: 'Rare venison protein for severe allergies.' },
    { name: 'Lean Weight Control', price: 36.99, rating: 4.2, category: 'Senior Care', image_url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=500&auto=format&fit=crop&q=60', description: 'Helps maintain a healthy weight.' },
    { name: 'Ultra Protein Power', price: 59.99, rating: 5.0, category: 'High Protein', image_url: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=500&auto=format&fit=crop&q=60', description: 'Maximum protein for muscle maintenance.' },
    { name: 'Natural Harvest Mix', price: 27.50, rating: 4.7, category: 'Organic Bites', image_url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500&auto=format&fit=crop&q=60', description: 'Farm-fresh organic ingredients.' },
    { name: 'Calming Chamomile Treats', price: 14.50, rating: 4.6, category: 'Organic Bites', image_url: 'https://images.unsplash.com/photo-1541364983171-a8ba01d95cfc?w=500&auto=format&fit=crop&q=60', description: 'Helps reduce anxiety and stress.' },
    { name: 'Large Breed Joint Support', price: 52.00, rating: 4.8, category: 'Senior Care', image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60', description: 'Extra glucosamine for large breeds.' },
    { name: 'Superfood Berry Bites', price: 19.99, rating: 4.9, category: 'Organic Bites', image_url: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=500&auto=format&fit=crop&q=60', description: 'Antioxidant-rich superfood treats.' },
    { name: 'Arctic Fish Formula', price: 44.99, rating: 4.7, category: 'Grain-Free', image_url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60', description: 'Cold-water fish for healthy skin and coat.' },
    { name: 'Kitten Growth Support', price: 28.50, rating: 4.8, category: 'Puppy Specific', image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60', description: 'Essential nutrients for growing kittens.' },
    { name: 'Gourmet Cat Salmon', price: 32.99, rating: 4.9, category: 'Organic Bites', image_url: 'https://images.unsplash.com/photo-1513245538231-15434197ef3b?w=500&auto=format&fit=crop&q=60', description: 'Premium salmon for picky eaters.' },
    { name: 'Indoor Cat Weight Care', price: 25.50, rating: 4.5, category: 'Senior Care', image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop&q=60', description: 'Optimized for the energy levels of indoor cats.' }
];

async function seedProducts() {
    try {
        console.log('Connecting to database...');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                rating DECIMAL(3, 2) NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT
            )
        `);
        console.log('Products table created or already exists.');

        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE products');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Cleared existing products.');

        for (const product of products) {
            await pool.query(
                'INSERT INTO products (name, price, rating, category, image_url, description) VALUES (?, ?, ?, ?, ?, ?)',
                [product.name, product.price, product.rating, product.category, product.image_url, product.description]
            );
        }
        console.log('Mock products inserted successfully.');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();
