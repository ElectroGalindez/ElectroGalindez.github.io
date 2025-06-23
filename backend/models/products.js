const pool = require('../db');

class Product {
  static async getAll() {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ name, description, price, stock, category }) {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock, category]
    );
    return result.rows[0];
  }

  static async update(id, { name, description, price, stock, category }) {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5 WHERE id = $6 RETURNING *',
      [name, description, price, stock, category, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async updateStock(id, stock) {
    const result = await pool.query(
      'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
      [stock, id]
    );
    return result.rows[0];
  }

  static async getByCategory(category) {
    const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
    return result.rows;
  }
}

module.exports = Product;