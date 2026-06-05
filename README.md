# Backend Phone Store

A comprehensive backend application for managing a phone store e-commerce system built with Node.js and Express.js.

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [License](#license)
- [Author](#author)

## Overview

This project provides a robust backend service for a phone store e-commerce platform. It handles phone inventory management, user authentication, order processing, product reviews, brand management, and inventory tracking. The application is built with a clean architecture following industry best practices with proper separation of concerns.

## Technologies

### Core Stack
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MySQL 2
- **ORM/Query Builder**: MySQL2 with Promise support
- **Development**: Nodemon (auto-restart on file changes)

### Authentication & Security
- **JWT**: jsonwebtoken 9.0.3
- **Password Hashing**: bcrypt 6.0.0
- **Validation**: Joi 18.2.1

### File & Image Management
- **File Upload**: multer 2.1.1
- **Cloud Storage**: Cloudinary 2.10.0

### Email & Communication
- **Email Service**: Nodemailer 8.0.10

### Utilities
- **CORS**: cors 2.8.6
- **Environment Variables**: dotenv 17.4.2

## Features

- ✅ **User Authentication** - Secure login/register with JWT and bcrypt
- ✅ **Product Management** - Full CRUD operations for phones
- ✅ **Brand Management** - Brand organization and tracking
- ✅ **Order Processing** - Complete order lifecycle management
- ✅ **Inventory Management** - Real-time stock tracking
- ✅ **Product Reviews** - Customer ratings and reviews system
- ✅ **Image Upload** - Cloudinary integration for product images
- ✅ **Email Notifications** - Welcome emails and password reset
- ✅ **Input Validation** - Joi schema validation
- ✅ **Error Handling** - Centralized error management
- ✅ **Connection Pooling** - MySQL connection pool for performance

## Project Structure

```
Backend-Phone-Store/
├── app.js                           # Main application entry point
├── package.json                     # Project dependencies
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore configuration
├── README.md                        # Project documentation
│
├── configs/                         # Configuration files
│   ├── database.js                 # MySQL connection pool
│   ├── cloudinary.js               # Cloudinary setup
│   └── mailer.js                   # Email service setup
│
├── controllers/                    # Request handlers & business logic
│   ├── authController.js           # Authentication logic (login, register, logout)
│   └── productController.js        # Product CRUD operations
│
├── middlewares/                    # Express middleware functions
│   ├── authMiddleware.js           # JWT token verification
│   ├── errorHandler.js             # Centralized error handling
│   └── validationMiddleware.js     # Request data validation
│
├── models/                         # Database models & queries
│   ├── User.js                     # User database operations
│   └── Product.js                  # Product database operations
│
├── routes/                         # API route definitions
│   ├── admin/
│   │   └── authRoute.js            # Admin authentication routes
│   └── users/
│       ├── userRoutes.js           # User-related routes
│       ├── brandRoute.js           # Brand management routes
│       ├── productRoute.js         # Product endpoints
│       ├── orderRoute.js           # Order management routes
│       ├── reviewRoute.js          # Product review routes
│       └── inventoryRoute.js       # Inventory management routes
│
├── services/                       # Business logic & integrations
│   ├── authService.js              # Authentication utilities
│   └── emailService.js             # Email sending service
│
├── utils/                          # Helper functions & utilities
│   └── helpers.js                  # Common utility functions
│
├── validators/                     # Input validation schemas
│   ├── userValidator.js            # User data validation
│   └── productValidator.js         # Product data validation
│
└── sql/                            # Database scripts
    └── schema.sql                  # Database schema creation
```

### Directory Details

#### `/configs`
Central configuration management for external services
- `database.js` - MySQL connection pool with connection limits
- `cloudinary.js` - Image upload service configuration
- `mailer.js` - Email transport configuration

#### `/controllers`
Handle HTTP requests and coordinate with services/models
- `authController.js` - Login, register, logout endpoints
- `productController.js` - Product CRUD endpoints

#### `/middlewares`
Express middleware for cross-cutting concerns
- `authMiddleware.js` - Validates JWT tokens on protected routes
- `errorHandler.js` - Global error response formatting
- `validationMiddleware.js` - Validates request body against schemas

#### `/models`
Database interaction layer
- `User.js` - User table operations with connection pooling
- `Product.js` - Product table operations with connection pooling

#### `/routes`
API endpoint definitions organized by feature
- Admin routes for administrative operations
- User routes for customer-facing operations

#### `/services`
Reusable business logic and third-party integrations
- `authService.js` - Password hashing, JWT operations
- `emailService.js` - Email sending and templates

#### `/utils`
Utility functions used across the application
- `helpers.js` - Date formatting, validation, currency formatting

#### `/validators`
Joi schemas for input validation
- `userValidator.js` - User registration, login, update schemas
- `productValidator.js` - Product creation and update schemas

#### `/sql`
Database initialization scripts
- `schema.sql` - Complete database schema with tables and relationships

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL Server (v5.7 or higher)
- Cloudinary account (for image uploads)
- Email provider account (for Nodemailer)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SENGMEY7777/Backend-Phone-Store.git
   cd Backend-Phone-Store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see Configuration section below)

4. **Create the database**
   ```bash
   mysql -u root -p < sql/schema.sql
   ```
   Or connect to MySQL and run the schema commands

5. **Start the development server**
   ```bash
   npm start
   ```
   The server will start on the port specified in your `.env` file (default: 3000)

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=phone_store
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Application Environment
NODE_ENV=development
```

### Configuration Details

- **DB_HOST**: MySQL server address
- **DB_USER**: MySQL username
- **DB_PASSWORD**: MySQL password
- **DB_NAME**: Database name to create/use
- **DB_PORT**: MySQL port (default: 3306)
- **JWT_SECRET**: Secret key for signing JWT tokens (use a strong random string)
- **JWT_EXPIRE**: JWT token expiration time (e.g., '7d', '24h')
- **CLOUDINARY_NAME**: Your Cloudinary cloud name
- **CLOUDINARY_API_KEY**: Your Cloudinary API key
- **CLOUDINARY_API_SECRET**: Your Cloudinary API secret
- **EMAIL_HOST**: SMTP server address
- **EMAIL_PORT**: SMTP port
- **EMAIL_USER**: Email account for sending emails
- **EMAIL_PASSWORD**: Email account password or app password
- **NODE_ENV**: Application environment (development/production)

## Getting Started & Running the Application

### Development Mode (with Nodemon)

To run the application with **Nodemon** (auto-restart on file changes):

```bash
npm start
```

This will:
- Start the server using Nodemon
- Enable auto-restart when you modify files
- Display logs in the console
- Connect to the configured MySQL database

**Benefits of Development Mode:**
- Automatically restarts the server when you make changes to files
- Perfect for development and debugging
- No need to manually restart after each code change

### Alternative: Run Directly with Nodemon

```bash
nodemon app.js
```

### Production Mode

For production deployment, run the app directly without Nodemon:

```bash
node app.js
```

### Production Best Practices

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start app.js --name "phone-store-api"
   ```
3. Set up environment variables securely
4. Enable HTTPS in production
5. Set up database backups
6. Configure rate limiting
7. Monitor application logs

## API Routes

### Authentication Routes

#### Admin Authentication
```
POST   /api/auth/admin/login          - Admin login
POST   /api/auth/admin/register       - Admin registration
POST   /api/auth/admin/logout         - Admin logout
```

#### User Authentication
```
GET    /api/auth/users                - User profile (requires auth)
POST   /api/auth/users/login          - User login
POST   /api/auth/users/register       - User registration
POST   /api/auth/users/logout         - User logout
```

### Product Routes
```
GET    /api/user/products             - Get all products
GET    /api/user/products/:id         - Get product by ID
POST   /api/user/products             - Create product (requires auth)
PUT    /api/user/products/:id         - Update product (requires auth)
DELETE /api/user/products/:id         - Delete product (requires auth)
```

### Brand Routes
```
GET    /api/user/brands               - Get all brands
GET    /api/user/brands/:id           - Get brand by ID
POST   /api/user/brands               - Create brand (requires auth)
PUT    /api/user/brands/:id           - Update brand (requires auth)
DELETE /api/user/brands/:id           - Delete brand (requires auth)
```

### Order Routes
```
GET    /api/user/orders               - Get all orders (requires auth)
GET    /api/user/orders/:id           - Get order by ID (requires auth)
POST   /api/user/orders               - Create order (requires auth)
PUT    /api/user/orders/:id           - Update order (requires auth)
DELETE /api/user/orders/:id           - Delete order (requires auth)
```

### Review Routes
```
GET    /api/user/reviews              - Get all reviews
GET    /api/user/reviews/:id          - Get review by ID
POST   /api/user/reviews              - Create review (requires auth)
PUT    /api/user/reviews/:id          - Update review (requires auth)
DELETE /api/user/reviews/:id          - Delete review (requires auth)
```

### Inventory Routes
```
GET    /api/user/inventory            - Get all inventory (requires auth)
GET    /api/user/inventory/:id        - Get inventory by ID (requires auth)
POST   /api/user/inventory            - Create inventory entry (requires auth)
PUT    /api/user/inventory/:id        - Update inventory (requires auth)
DELETE /api/user/inventory/:id        - Delete inventory (requires auth)
```

## Database Schema

The application uses the following main tables:

### Users Table
Stores user account information
```sql
- id (Primary Key)
- email (Unique)
- password (hashed)
- name
- avatar
- created_at
- updated_at
```

### Brands Table
Stores phone brand information
```sql
- id (Primary Key)
- name
- description
- logo
- created_at
- updated_at
```

### Products Table
Stores phone product information
```sql
- id (Primary Key)
- name
- description
- price
- stock
- image
- brand_id (Foreign Key)
- created_at
- updated_at
```

### Orders Table
Stores customer orders
```sql
- id (Primary Key)
- user_id (Foreign Key)
- total_amount
- status (pending, processing, shipped, delivered, cancelled)
- created_at
- updated_at
```

### Order Items Table
Stores individual items in orders
```sql
- id (Primary Key)
- order_id (Foreign Key)
- product_id (Foreign Key)
- quantity
- price
- created_at
```

### Reviews Table
Stores product reviews and ratings
```sql
- id (Primary Key)
- product_id (Foreign Key)
- user_id (Foreign Key)
- rating (1-5)
- comment
- created_at
- updated_at
```

### Inventory Table
Stores inventory tracking information
```sql
- id (Primary Key)
- product_id (Foreign Key, Unique)
- quantity
- last_restocked
- created_at
- updated_at
```

## Available Scripts

```bash
npm start           # Run the application with Nodemon (development mode)
npm test            # Run tests (configure as needed)
nodemon app.js      # Alternative way to run with Nodemon
node app.js         # Run directly without Nodemon (production mode)
```

## Security Features

✅ **Password Security**
- Passwords are hashed using bcrypt with 10 salt rounds
- Never stored in plain text

✅ **Authentication**
- JWT-based authentication for API endpoints
- Token expiration configured to 7 days

✅ **Input Validation**
- All user inputs validated with Joi schemas
- Email format validation
- Type checking for all parameters

✅ **Error Handling**
- Centralized error handling prevents information leakage
- Consistent error response format

✅ **Database Security**
- Connection pooling for secure database access
- Parameterized queries to prevent SQL injection

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database and tables are created

### Port Already in Use
- Change the port in `.env` file
- Or stop the process using the current port

### JWT Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration with `JWT_EXPIRE` setting

### Email Not Sending
- Verify email credentials in `.env`
- Check if email provider requires app-specific passwords
- Ensure firewall allows SMTP connections

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure file type is supported

## Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] User wishlist feature
- [ ] Advanced product filtering and search
- [ ] Admin dashboard analytics
- [ ] SMS notifications
- [ ] Real-time order tracking
- [ ] Customer support chat
- [ ] Multi-language support

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

**SENGMEY7777** - [GitHub Profile](https://github.com/SENGMEY7777)

---

Feel free to contribute to this project! For questions or suggestions, please open an issue or submit a pull request.

For more information about the project structure and implementation details, refer to the STRUCTURE.md file.
