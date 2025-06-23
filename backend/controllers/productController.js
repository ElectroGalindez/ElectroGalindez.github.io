const pool = require('../db');

const getAllProducts = async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
};

const createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const result = await pool.query(
    'INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, stock, category]
  );
  res.status(201).json(result.rows[0]);
};

// ...updateProduct, deleteProduct (similares)