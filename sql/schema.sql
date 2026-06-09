CREATE DATABASE PhoneStore;
USE PhoneStore;

-- ==========================================
-- USERS
-- ==========================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    token TEXT NULL,
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 0,
    verification_token VARCHAR(255) NULL,
    verification_expires DATETIME NULL,
    password_reset_otp VARCHAR(6) NULL,
    password_reset_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- BRANDS
-- ==========================================

CREATE TABLE brands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- PRODUCTS
-- ==========================================

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    preorder_available TINYINT(1) NOT NULL DEFAULT 0,
    preorder_release_date DATE NULL,
    image_url TEXT,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_brand
        FOREIGN KEY (brand_id)
        REFERENCES brands(id)
);

-- ==========================================
-- ORDERS
-- ==========================================

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_type ENUM('ORDER', 'PREORDER') NOT NULL,
    status ENUM(
        'PENDING',
        'PAID',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(12,2) NOT NULL,
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- ==========================================
-- ORDER ITEMS
-- ==========================================

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    CONSTRAINT fk_orderitem_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_orderitem_product
        FOREIGN KEY (product_id)
        REFERENCES products(id),

    CONSTRAINT chk_orderitem_quantity
        CHECK (quantity > 0)
);

-- ==========================================
-- PAYMENTS
-- ==========================================

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP NULL,
    qr_code TEXT NULL,
    md5_hash VARCHAR(255) NULL,

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
);

-- ==========================================
-- PRODUCT REVIEWS
-- ==========================================

CREATE TABLE product_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_review_rating
        CHECK (rating BETWEEN 1 AND 5)
);

-- ==========================================
-- INVENTORY LOGS
-- ==========================================

CREATE TABLE inventory_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    action_type VARCHAR(30) NOT NULL,
    quantity_changed INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    performed_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id)
        REFERENCES products(id),

    CONSTRAINT fk_inventory_user
        FOREIGN KEY (performed_by)
        REFERENCES users(id)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_product_brand ON products(brand_id);
CREATE INDEX idx_review_product ON product_reviews(product_id);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_payment_status ON payments(payment_status);
CREATE INDEX idx_inventory_product ON inventory_logs(product_id);

ALTER TABLE products
ADD FULLTEXT INDEX idx_product_search (name, description);

-- ==========================================
-- SAMPLE BRANDS
-- ==========================================

INSERT INTO brands (name, description)
VALUES
    ('Samsung', 'Samsung Mobile Phones'),
    ('Apple', 'Apple iPhone Series'),
    ('Xiaomi', 'Xiaomi Smartphones')
ON DUPLICATE KEY UPDATE
    description = VALUES(description);

-- ==========================================
-- SAMPLE PRODUCTS
-- ==========================================

INSERT INTO products (id, brand_id, name, description, price, stock_quantity, preorder_available, preorder_release_date, image_url, is_active)
VALUES
    (1, 2, 'iPhone 15 Pro Max', 'Apple\'s flagship phone with a titanium design, A17 Pro chip, and advanced 5x Telephoto camera.', 1199.99, 45, 0, NULL, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80', 1),
    (2, 2, 'iPhone 15', 'Features Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design.', 799.99, 40, 0, NULL, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80', 1),
    (3, 2, 'iPhone SE (3rd Gen)', 'A powerful pocket-sized smartphone with the A15 Bionic chip, 5G speed, and home button with Touch ID.', 429.99, 25, 0, NULL, 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80', 1),
    (4, 1, 'Samsung Galaxy S24 Ultra', 'Titanium built exterior with 200MP camera, built-in S Pen, and Galaxy AI features for translation and editing.', 1299.99, 30, 0, NULL, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80', 1),
    (5, 1, 'Samsung Galaxy Z Fold 5', 'A large 7.6" screen foldable smartphone with multi-window multitasking, hands-free Flex Mode, and S Pen support.', 1799.99, 15, 0, NULL, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80', 1),
    (6, 1, 'Samsung Galaxy A55', 'A balance of performance and affordability with a 50MP triple camera, 120Hz display, and long-lasting 5000mAh battery.', 449.99, 60, 0, NULL, 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=600&q=80', 1),
    (7, 3, 'Xiaomi 14 Ultra', 'Leica quad-camera system with a 1-inch main sensor, Snapdragon 8 Gen 3, and premium vegan leather finish.', 999.99, 20, 0, NULL, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80', 1),
    (8, 3, 'Xiaomi Redmi Note 13 Pro+', '200MP camera with OIS, 1.5K 120Hz curved display, and ultra-fast 120W HyperCharge.', 399.99, 80, 0, NULL, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', 1),
    (9, 3, 'Xiaomi Poco F6', 'Flagship killer performance with Snapdragon 8s Gen 3, LiquidCool Technology 4.0, and a sleek modern design.', 349.99, 50, 0, NULL, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80', 1),
    (10, 2, 'iPhone 16 Pro', 'Upcoming generation with advanced Apple Intelligence, larger screen sizes, and new Capture Button.', 1099.99, 0, 1, '2026-09-15', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80', 1),
    (11, 1, 'Samsung Galaxy Z Fold 6', 'Next generation foldable with enhanced slim body, improved hinge durability, and advanced AI features.', 1899.99, 0, 1, '2026-07-24', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80', 1)
ON DUPLICATE KEY UPDATE
    brand_id = VALUES(brand_id),
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    stock_quantity = VALUES(stock_quantity),
    preorder_available = VALUES(preorder_available),
    preorder_release_date = VALUES(preorder_release_date),
    image_url = VALUES(image_url),
    is_active = VALUES(is_active);

