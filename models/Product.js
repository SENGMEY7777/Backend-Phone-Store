// Product Model
// Represents the Product database schema and operations

const pool = require('../configs/database');

class Product {
  static async getAll() {
    const connection = await pool.getConnection();
    try {
      const [products] = await connection.query('SELECT * FROM products');
      return products;
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const connection = await pool.getConnection();
    try {
      const [product] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
      return product[0];
    } finally {
      connection.release();
    }
  }

  static async create(productData) {
    const connection = await pool.getConnection();
    try {
      const { name, description, price, stock, brandId } = productData;
      const [result] = await connection.query(
        'INSERT INTO products (name, description, price, stock, brand_id) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, stock, brandId]
      );
      return result;
    } finally {
      connection.release();
    }
  }

  static async update(id, productData) {
    const connection = await pool.getConnection();
    try {\n      const { name, description, price, stock, brandId } = productData;
      const [result] = await connection.query(
        'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, brand_id = ? WHERE id = ?',
        [name, description, price, stock, brandId, id]
      );
      return result;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM products WHERE id = ?', [id]);
      return result;
    } finally {
      connection.release();
    }
  }
}

module.exports = Product;
