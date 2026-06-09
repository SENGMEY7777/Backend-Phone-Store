# Backend Phone Store

A comprehensive backend application for managing a phone store e-commerce system built with Node.js and Express.js.

## Overview

This project provides a robust backend service for a phone store e-commerce platform. It handles phone inventory management, user authentication, order processing, product reviews, and brand management.

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
   Edit `.env` with your configuration

4. **Create the database**
   ```bash
   mysql -u root -p < sql/schema.sql
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## Getting Started & Running the Application

### Development Mode (with Nodemon)

To run the application with **Nodemon** (auto-restart on file changes):

```bash
npm start
```

### Production Mode

For production deployment, run the app directly without Nodemon:

```bash
node app.js
```

## Available Scripts

```bash
npm start           # Run the application with Nodemon (development mode)
npm test            # Run tests (configure as needed)
nodemon app.js      # Alternative way to run with Nodemon
node app.js         # Run directly without Nodemon (production mode)
```

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

### How to run mysql with docker 
```
docker compose up -d --build
docker exec -it phone_store_db mysql -u root -prootpassword 
```

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure file type is supported

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

**SENGMEY7777** - [GitHub Profile](https://github.com/SENGMEY7777)

---

Feel free to contribute to this project! For questions or suggestions, please open an issue or submit a pull request.



 
