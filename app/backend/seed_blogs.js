require("dotenv").config();
const pool = require("./config/db");

const blogs = [
  {
    title: 'The Ultimate Guide to Puppy Nutrition',
    excerpt: 'Discover what nutrients your growing pup needs to stay healthy and energetic. We cover everything from protein to essential vitamins.',
    content: '<p>Bringing a new puppy home is an exciting experience, but it also comes with a lot of responsibility. One of the most important decisions you will make is what to feed your growing pup.</p><h3>The Building Blocks of Puppy Nutrition</h3><p>Puppies need a diet rich in protein, fat, calcium, and carbohydrates to support their rapid growth and development. High-quality puppy food is specifically formulated to provide these essential nutrients in the right proportions.</p><ul><li><strong>Protein:</strong> Essential for muscle growth and repair. Look for named meat sources like chicken, beef, or lamb as the first ingredient.</li><li><strong>Fat:</strong> Provides energy and helps with the absorption of fat-soluble vitamins. DHA, an omega-3 fatty acid, is crucial for brain and vision development.</li><li><strong>Calcium and Phosphorus:</strong> Necessary for strong bones and teeth. However, the ratio of these minerals must be carefully balanced, especially for large breed puppies.</li></ul><p>Consult with your veterinarian to determine the best diet and feeding schedule for your specific puppy breed and individual needs.</p>',
    author: 'Dr. Sarah Jenkins',
    date: 'Oct 12, 2026',
    image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60',
    category: 'Nutrition'
  },
  {
    title: 'How to Train Your Cat to Do Tricks',
    excerpt: 'Yes, cats can learn tricks too! Follow these simple steps for a fun bonding experience with your feline friend.',
    content: '<p>Think only dogs can learn tricks? Think again! Cats are highly intelligent animals capable of learning a variety of fun and impressive tricks. Training your cat is not only mentally stimulating for them but also a fantastic way to strengthen your bond.</p><h3>Getting Started with Clicker Training</h3><p>Clicker training is a highly effective, positive reinforcement method. The clicker makes a distinct sound that marks the exact moment your cat performs the desired behavior, followed immediately by a reward.</p><p>Here is how to teach the "High Five":</p><ol><li><strong>Charge the Clicker:</strong> Click and immediately give a treat several times so your cat associates the sound with a reward.</li><li><strong>Targeting:</strong> Hold a treat slightly above your cat\'s head. When they reach up with their paw to touch your hand, click and treat.</li><li><strong>Add the Cue:</strong> Once your cat consistently touches your hand, start saying "High Five" right before they perform the action.</li></ol><p>Remember to keep training sessions short (2-3 minutes) and always end on a positive note!</p>',
    author: 'Emily Carter',
    date: 'Oct 05, 2026',
    image_url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format&fit=crop&q=60',
    category: 'Training'
  },
  {
    title: 'Top 10 Indestructible Toys for Heavy Chewers',
    excerpt: 'Tired of toys being destroyed in minutes? Here are the toughest toys on the market that will actually last.',
    content: '<p>If your dog is a power chewer, you know the frustration of buying a new toy only to have it destroyed within minutes. Not only is this expensive, but it can also be dangerous if your dog swallows pieces of the toy. Fear not! We have compiled a list of the toughest toys built to withstand the most determined jaws.</p><h3>What Makes a Toy "Indestructible"?</h3><p>Look for toys made from durable materials like heavy-duty rubber, nylon, or thick rope. Avoid plush toys with squeakers or soft plastic toys that can easily be ripped apart.</p><h3>Our Top Picks</h3><ul><li><strong>The Classic Kong:</strong> Made of ultra-durable rubber, it\'s perfect for stuffing with treats and keeping your dog entertained for hours.</li><li><strong>GoughNuts Black Ring:</strong> Designed by mechanical and polymer engineers, this is widely considered one of the toughest toys available. It even has an inner red layer to indicate when it\'s time to replace it.</li><li><strong>West Paw Zogoflex Hurley:</strong> A tough, bouncy, and floatable bone-shaped toy that is guaranteed against dog damage.</li></ul><p>Always supervise your dog during playtime and regularly inspect toys for wear and tear.</p>',
    author: 'Michael Chen',
    date: 'Sep 28, 2026',
    image_url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=60',
    category: 'Reviews'
  },
  {
    title: 'Preparing Your Pet for Winter',
    excerpt: 'Essential tips to keep your furry friend warm, safe, and happy during the colder months of the year.',
    content: '<p>As the temperatures drop and winter sets in, it\'s crucial to take extra precautions to ensure your pets stay warm, safe, and comfortable. Here are some essential tips for winterizing your pet care routine.</p><h3>Keep Them Warm</h3><p>Not all dogs have a thick double coat to protect them from the cold. Short-haired breeds, small dogs, and senior pets can benefit greatly from a warm sweater or coat during walks.</p><h3>Protect Their Paws</h3><p>Salt and chemical de-icers used on sidewalks can be toxic to pets and irritating to their paws. Wipe their paws thoroughly with a damp towel after every walk. You can also use pet-safe booties or paw wax for added protection.</p><h3>Watch Out for Antifreeze</h3><p>Antifreeze has a sweet taste that can be attractive to animals, but it is highly toxic and can be fatal even in small amounts. Keep all containers tightly sealed and clean up any spills immediately.</p>',
    author: 'Dr. Sarah Jenkins',
    date: 'Sep 15, 2026',
    image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60',
    category: 'Wellness'
  }
];

async function seedBlogs() {
  try {
    console.log('Connecting to database...');
    
    // Create the blogs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL
      )
    `);
    console.log('Blogs table created or already exists.');

    // Clear existing blogs (optional, for idempotency)
    await pool.query('TRUNCATE TABLE blogs');
    console.log('Cleared existing blogs.');

    // Insert new blogs
    for (const blog of blogs) {
      await pool.query(
        'INSERT INTO blogs (title, excerpt, content, author, date, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [blog.title, blog.excerpt, blog.content, blog.author, blog.date, blog.image_url, blog.category]
      );
    }
    console.log('Mock blogs inserted successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
}

seedBlogs();
