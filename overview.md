# Endpoint Phone Store

## Overview

Node.js + Express backend for a Phone Store API.

## App entry (app.js)

```jsx
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const authRoute = require('./routes/admin/authRoute');
const userRoutes = require('./routes/users/userRoutes');
const brandRoute = require('./routes/users/brandRoute');
const productRoute = require('./routes/users/productRoute');
const orderRoute = require('./routes/users/orderRoute');
const reviewRoute = require('./routes/users/reviewRoute');
const inventoryRoute = require('./routes/users/inventoryRoute');

app.use('/api/auth/admin', authRoute);
app.use('/api/auth/users', userRoutes);
app.use('/api/user/brands', brandRoute);
app.use('/api/user/products', productRoute);
app.use('/api/user/orders', orderRoute);
app.use('/api/user/reviews', reviewRoute);
app.use('/api/user/inventory', inventoryRoute);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
```

---

## Auth (Admin)

### Router

```jsx
const express = require('express');
const router = express.Router();

const authController = require('../../controllers/admin/authController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const authSchema = require('../../validators/admin/authAdmin');

router.post('/login', validator(authSchema), authController.login);
router.delete('/logout', isLogin, authController.logout);
```

### Login request example

```json
{
  "email": "",
  "password_hash": "PhoneStore@123"
}
```

---

## Auth (Users)

### Router

```jsx
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const { userSchema, resetPassword, verifyOtpSchema, resetPasswordSchema } = require('../../validators/users/authSchema');
const authSchema = require('../../validators/admin/authAdmin');

router.post('/register', validator(userSchema), userController.register);
router.post('/login', validator(authSchema), userController.login);
router.get('/all', isLogin, userController.getAllUser);
router.delete('/logout', userController.logout);
router.get('/verify-email', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerificationEmail);
router.post('/forgot-password', validator(resetPassword), userController.forgotPassword);
router.post('/verify-reset-otp', validator(verifyOtpSchema), userController.verifyPasswordResetOtp);
router.post('/reset-password', validator(resetPasswordSchema), userController.resetPassword);

module.exports = router;
```

### Example responses

```json
{
  "success": true,
  "message": "Login successfully",
  "data": [
    {
      "id": 16,
      "full_name": "Seng Mey",
      "email": "sengmey2004@gmail.com",
      "role": "admin",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImVtYWlsIjoic2VuZ21leTIwMDRAZ21haWwuY29tIiwiaWF0IjoxNzgwOTEyMTE5LCJleHAiOjE3ODA5OTg1MTl9.MVVWomVvUEYeY8WCS54fKRuIUECx1Jvlj54hVsdTrg4",
      "is_active": 1,
      "created_at": "2026-06-03T16:37:14.000Z"
    }
  ]
}

{
  "success": true,
  "message": "Register successfully",
  "data": {
    "id": 18,
    "full_name": "Vann Sengmey",
    "email": "vannsengmey748+16@gmail.com",
    "role": "CUSTOMER",
    "token": null,
    "is_active": 1,
    "created_at": "2026-06-08T12:07:22.000Z"
  }
}
```

### Forgot password flow (request examples)

**Forgot password**

```json
{
  "email": ""
}
```

**Verify OTP**

```json
{
  "email": "",
  "otp": "510787"
}
```

**Reset password**

```json
{
  "email": "",
  "otp": "445176",
  "password_hash": "newPassword123"
}
```

---

## Brands

### Router

```jsx
const express = require('express');
const router = express.Router();

const brandController = require('../../controllers/users/brandController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const { brandSchema } = require('../../validators/users/brandSchema');

router.get('/all', isLogin, brandController.getAllBrand);
router.post('/create', validator(brandSchema), isLogin, brandController.createBrand);
router.put('/:id', validator(brandSchema), isLogin, brandController.updateBrand);
router.delete('/:id', isLogin, brandController.deleteBrand);
```

### Get all brands (example response)

```json
{
  "success": true,
  "message": "Get all brand successfully",
  "data": [
    {
      "id": 3,
      "name": "Xiaomi",
      "description": "Xiaomi Smartphones",
      "created_at": "2026-06-02T15:21:17.000Z"
    },
    {
      "id": 7,
      "name": "Vivo",
      "description": "Apple iPhone Series",
      "created_at": "2026-06-03T17:40:24.000Z"
    },
    {
      "id": 8,
      "name": "Oppo",
      "description": "Apple iPhone Series",
      "created_at": "2026-06-03T17:42:12.000Z"
    },
    {
      "id": 9,
      "name": "Mac",
      "description": "Apple iPhone Series",
      "created_at": "2026-06-03T17:43:52.000Z"
    }
  ]
}
```

### Create brand (request example)

```json
{
  "name": "Mac M2",
  "description": "Apple iPhone Series"
}
```

---

## Products

### Router

```jsx
const express = require('express');
const router = express.Router();

const productController = require('../../controllers/users/productController');
const { uploadProductImage } = require('../../middlewares/upload');
const isLogin = require('../../middlewares/authMiddleware');
const valdator = require('../../middlewares/validate');
const productSchema = require('../../validators/users/productSchema');

router.post('/create', valdator(productSchema), isLogin, uploadProductImage, productController.createProduct);
router.get('/all', isLogin, productController.getAllProducts);
router.get('/:id', isLogin, productController.getProductById);
router.put('/:id', valdator(productSchema), isLogin, uploadProductImage, productController.updateProduct);
router.delete('/:id', isLogin, productController.deleteProduct);

module.exports = router;
```

### Get all products (example response)

```json
{
  "success": true,
  "message": "Get all products successfully",
  "data": [
    {
      "id": 4,
      "brand_id": 7,
      "name": "I phone 17 Pro Max",
      "description": "I phone 17 series",
      "price": "1300.00",
      "stock_quantity": 2,
      "preorder_available": 1,
      "preorder_release_date": "2025-12-31T17:00:00.000Z",
      "image_url": "https://res.cloudinary.com/dlkwubh55/image/upload/v1780646040/backend-ecommerce/products/nswljd5cyv5vzp1eqbom.jpg",
      "is_active": 1,
      "created_at": "2026-06-05T07:28:03.000Z",
      "brand_name": "Vivo"
    },
    {
      "id": 5,
      "brand_id": 3,
      "name": "iPhone 15 Pro",
      "description": "Latest Apple phone",
      "price": "999.99",
      "stock_quantity": 20,
      "preorder_available": 0,
      "preorder_release_date": "2025-12-31T17:00:00.000Z",
      "image_url": "https://example.com/img.jpg",
      "is_active": 1,
      "created_at": "2026-06-05T07:35:37.000Z",
      "brand_name": "Xiaomi"
    },
    {
      "id": 6,
      "brand_id": 3,
      "name": "iPhone 15 Pro",
      "description": "Latest Apple phone",
      "price": "999.99",
      "stock_quantity": 10,
      "preorder_available": 0,
      "preorder_release_date": "2025-12-31T17:00:00.000Z",
      "image_url": "https://res.cloudinary.com/dlkwubh55/image/upload/v1780645943/backend-ecommerce/products/wcf4lyti2krkakjqosvq.jpg",
      "is_active": 1,
      "created_at": "2026-06-05T07:52:24.000Z",
      "brand_name": "Xiaomi"
    }
  ]
}

CREATE:
```

!image.png

---

## Orders

### Router

```jsx
const express = require('express');
const router = express.Router();

const orderController = require('../../controllers/users/orderController');
const isLogin = require('../../middlewares/authMiddleware');
const valdator = require('../../middlewares/validate');
const orderSchema = require('../../validators/users/orderSchema');

router.post('/create', valdator(orderSchema), isLogin, orderController.createOrder);
router.get('/all', isLogin, orderController.getAllOrders);
router.get('/:id', isLogin, orderController.getOrderById);
router.put('/:id/status', valdator(orderSchema), isLogin, orderController.updateOrderStatus);
router.delete('/:id', isLogin, orderController.deleteOrder);

module.exports = router;
```

### Get all orders (example response)

```json
{
  "success": true,
  "message": "Get all orders successfully",
  "data": [
    {
      "id": 5,
      "user_id": 15,
      "order_type": "ORDER",
      "status": "PENDING",
      "total_amount": "999.99",
      "ordered_at": "2026-06-08T01:55:49.000Z",
      "full_name": "Vann Sengmey",
      "email": "vannsengmey748+14@gmail.com"
    },
    {
      "id": 4,
      "user_id": 15,
      "order_type": "ORDER",
      "status": "PENDING",
      "total_amount": "999.99",
      "ordered_at": "2026-06-05T11:16:13.000Z",
      "full_name": "Vann Sengmey",
      "email": "vannsengmey748+14@gmail.com"
    },
    {
      "id": 3,
      "user_id": 15,
      "order_type": "ORDER",
      "status": "PENDING",
      "total_amount": "999.99",
      "ordered_at": "2026-06-05T11:16:02.000Z",
      "full_name": "Vann Sengmey",
      "email": "vannsengmey748+14@gmail.com"
    }
  ]
}
```

### Create order (request + example response)

**Request**

```json
{
  "order_type": "ORDER",
  "items": [
    {
      "product_id": 7,
      "quantity": 1
    }
  ]
}
```

**Response**

```json
{
  "success": true,
  "message": "Create order successfully",
  "data": {
    "id": 6,
    "user_id": 15,
    "order_type": "ORDER",
    "status": "PENDING",
    "total_amount": "999.99",
    "ordered_at": "2026-06-08T12:21:26.000Z",
    "full_name": "Vann Sengmey",
    "email": "vannsengmey748+14@gmail.com",
    "items": [
      {
        "id": 6,
        "order_id": 6,
        "product_id": 7,
        "quantity": 1,
        "unit_price": "999.99",
        "subtotal": "999.99",
        "product_name": "iPhone 15 Pro",
        "image_url": "https://example.com/img.jpg"
      }
    ]
  }
}
```

---

## Product reviews

### Router

```jsx
const express = require('express');
const router = express.Router();

const reviewController = require('../../controllers/users/reviewController');
const isLogin = require('../../middlewares/authMiddleware');
const valdator = require('../../middlewares/validate');
const reviewSchema = require('../../validators/users/reviewProductSchema');

router.post('/create', valdator(reviewSchema), isLogin, reviewController.createReview);
router.get('/all', isLogin, reviewController.getAllReviews);
router.get('/product/:productId', isLogin, reviewController.getReviewsByProductId);
router.get('/:id', isLogin, reviewController.getReviewById);
router.put('/:id', valdator(reviewSchema), isLogin, reviewController.updateReview);
router.delete('/:id', isLogin, reviewController.deleteReview);

module.exports = router;
```

### Get all reviews (example response)

```json
{
  "success": true,
  "message": "Get all reviews successfully",
  "data": [
    {
      "id": 5,
      "product_id": 5,
      "user_id": 16,
      "rating": 5,
      "review_text": "Good and hight quantity",
      "created_at": "2026-06-08T11:42:37.000Z",
      "product_name": "iPhone 15 Pro",
      "full_name": "Seng Mey",
      "email": "sengmey2004@gmail.com"
    },
    {
      "id": 4,
      "product_id": 5,
      "user_id": 16,
      "rating": 5,
      "review_text": "Good phone2",
      "created_at": "2026-06-08T11:42:24.000Z",
      "product_name": "iPhone 15 Pro",
      "full_name": "Seng Mey",
      "email": "sengmey2004@gmail.com"
    }
  ]
}
```

### Create review (request + example response)

**Request**

```json
{
  "product_id": 5,
  "rating": 5,
  "review_text": "Good and hight quantity"
}
```

**Response**

```json
{
  "success": true,
  "message": "Create review successfully",
  "data": {
    "id": 5,
    "product_id": 5,
    "user_id": 16,
    "rating": 5,
    "review_text": "Good and hight quantity",
    "created_at": "2026-06-08T11:42:37.000Z",
    "product_name": "iPhone 15 Pro",
    "full_name": "Seng Mey",
    "email": "sengmey2004@gmail.com"
  }
}
```

---

## Inventory logs

### Router

```jsx
const express = require('express');
const router = express.Router();

const inventoryController = require('../../controllers/users/inventoryController');
const isLogin = require('../../middlewares/authMiddleware');
const validator = require('../../middlewares/validate');
const stockMovementSchema = require('../../validators/users/invetorySchema');

router.post('/create', validator(stockMovementSchema), isLogin, inventoryController.createInventoryLog);
router.get('/all', isLogin, inventoryController.getAllInventoryLogs);
router.get('/product/:productId', isLogin, inventoryController.getInventoryLogsByProductId);
router.get('/:id', isLogin, inventoryController.getInventoryLogById);

module.exports = router;
```

### Get all inventory logs (example response)

```json
{
  "success": true,
  "message": "Get all inventory logs successfully",
  "data": [
    {
      "id": 1,
      "product_id": 5,
      "action_type": "ADD",
      "quantity_changed": 10,
      "previous_stock": 10,
      "new_stock": 20,
      "performed_by": 15,
      "created_at": "2026-06-05T10:42:49.000Z",
      "product_name": "iPhone 15 Pro",
      "performed_by_name": "Vann Sengmey"
    }
  ]
}
```

### Create inventory log (request + example response)

**Request**

```json
{
  "product_id": 5,
  "action_type": "ADD",
  "quantity_changed": 10
}
```

**Response**

```json
{
  "success": true,
  "message": "Create inventory log successfully",
  "data": {
    "id": 2,
    "product_id": 5,
    "action_type": "ADD",
    "quantity_changed": 10,
    "previous_stock": 20,
    "new_stock": 30,
    "performed_by": 15,
    "created_at": "2026-06-08T12:27:20.000Z",
    "product_name": "iPhone 15 Pro",
    "performed_by_name": "Vann Sengmey"
  }
}
```

---

## Database schema (SQL)

```sql
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
```