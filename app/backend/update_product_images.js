require('dotenv').config();
const pool = require('./config/db');

// Curated Unsplash image sets per product id (2–3 images each, all relevant to the product)
const imageMap = {
  1: [ // Premium Puppy Kibble
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
  ],
  2: [ // Organic Beef Jerky Treats
    'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601758125946-6ec2ef64c5c7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&auto=format&fit=crop&q=80',
  ],
  3: [ // Senior Mobility Bites
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&auto=format&fit=crop&q=80',
  ],
  4: [ // Grain-Free Salmon Mix
    'https://images.unsplash.com/photo-1623366302587-bca9fbcf9f46?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513245538231-15434197ef3b?w=800&auto=format&fit=crop&q=80',
  ],
  5: [ // High Protein Chicken Feast
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop&q=80',
  ],
  6: [ // Duck & Potato Treats
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
  ],
  7: [ // Holistic Turkey Dinner
    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&auto=format&fit=crop&q=80',
  ],
  8: [ // Small Breed Vitality
    'https://images.unsplash.com/photo-1591768793355-74d75b38f38c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
  ],
  9: [ // Active Performance Mix
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
  ],
  10: [ // Gentle Digestion Lamb
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=80',
  ],
  11: [ // Wild Boar & Apple
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&auto=format&fit=crop&q=80',
  ],
  12: [ // Puppy Growth Plus
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80',
  ],
  13: [ // Dental Care Chews
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601758125946-6ec2ef64c5c7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&auto=format&fit=crop&q=80',
  ],
  14: [ // Hypoallergenic Venison
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&auto=format&fit=crop&q=80',
  ],
  15: [ // Lean Weight Control
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80',
  ],
  16: [ // Ultra Protein Power
    'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
  ],
  17: [ // Natural Harvest Mix
    'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&auto=format&fit=crop&q=80',
  ],
  18: [ // Calming Chamomile Treats
    'https://images.unsplash.com/photo-1541364983171-a8ba01d95cfc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&auto=format&fit=crop&q=80',
  ],
  19: [ // Large Breed Joint Support
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800&auto=format&fit=crop&q=80',
  ],
  20: [ // Superfood Berry Bites
    'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601758125946-6ec2ef64c5c7?w=800&auto=format&fit=crop&q=80',
  ],
  21: [ // Arctic Fish Formula
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1623366302587-bca9fbcf9f46?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513245538231-15434197ef3b?w=800&auto=format&fit=crop&q=80',
  ],
  22: [ // Kitten Growth Support
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
  ],
  23: [ // Gourmet Cat Salmon
    'https://images.unsplash.com/photo-1513245538231-15434197ef3b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
  ],
  24: [ // Indoor Cat Weight Care
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513245538231-15434197ef3b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=80',
  ],
};

async function updateImages() {
  let updated = 0;
  try {
    const [products] = await pool.query('SELECT id, name FROM products ORDER BY id');
    console.log(`Found ${products.length} products. Updating images...\n`);

    for (const p of products) {
      const imgs = imageMap[p.id];
      if (!imgs) {
        console.log(`  [SKIP] id=${p.id} "${p.name}" — no image map entry`);
        continue;
      }
      await pool.query(
        'UPDATE products SET image_url = ?, images = ? WHERE id = ?',
        [imgs[0], JSON.stringify(imgs), p.id]
      );
      console.log(`  [OK]   id=${p.id} "${p.name}" — ${imgs.length} images`);
      updated++;
    }

    console.log(`\nDone. Updated ${updated}/${products.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

updateImages();
