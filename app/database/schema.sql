CREATE DATABASE IF NOT EXISTS petcaredb;
USE petcaredb;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(255),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed some dummy products
INSERT INTO products (name, description, price, category, image_url, rating) VALUES
('Premium Salmon Kibble', 'High-quality salmon kibble for adult dogs. Grain-free and rich in Omega-3.', 24.99, 'Dog Food', 'https://images.unsplash.com/photo-1585846416120-3a73f51b1f61?q=80&w=400&auto=format&fit=crop', 4.8),
('Interactive Squeaky Toy', 'Durable chew toy with an internal squeaker to keep your dog entertained for hours.', 12.50, 'Toys', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=400&auto=format&fit=crop', 4.5),
('Organic Beef Bites', 'Healthy, organic beef treats perfect for training.', 15.99, 'Treats', 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?q=80&w=400&auto=format&fit=crop', 4.9);
