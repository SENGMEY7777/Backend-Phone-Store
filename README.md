# Backend Phone Store

A backend application for managing a phone store system.

## Overview

This project provides a backend service for a phone store, built with JavaScript. It handles phone inventory management, orders, and store operations.

## Technologies

- **Language**: JavaScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Development**: Nodemon (for auto-restart on file changes)

## Features

- Phone inventory management
- Order processing
- Store operations
- Admin authentication
- User management
- Brand management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SENGMEY7777/Backend-Phone-Store.git
cd Backend-Phone-Store
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```bash
PORT=3000
# Add other environment variables as needed
```

## Getting Started & Running the Application

### Development Mode (with Nodemon)

To run the application with **Nodemon** (auto-restart on file changes):

```bash
npm start
```

This will start the server on the port specified in your `.env` file (default: `3000`).

**Features:**
- Automatically restarts the server when you make changes to files
- Perfect for development and debugging
- No need to manually restart after each code change

### Alternative: Run Directly with Nodemon

You can also run nodemon directly on the app.js file:

```bash
nodemon app.js
```

### Production Mode

For production, you can run the app directly without Nodemon:

```bash
node app.js
```

## Configuration

Make sure to set up your `.env` file with the following variables:
- `PORT` - Server port (default: 3000)
- Database connection details
- JWT secrets
- Email configuration (if using nodemailer)

## Available Scripts

- `npm start` - Run the application with Nodemon (development mode)
- `nodemon app.js` - Alternative way to run with Nodemon
- `npm test` - Run tests (configure as needed)

## License

[Specify your license here]

## Author

- **SENGMEY7777** - [GitHub Profile](https://github.com/SENGMEY7777)

---

Feel free to modify this README to include more specific information about your project's features, API endpoints, configuration, and usage instructions.
