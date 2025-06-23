// controllers/adminController.js
const pool = require('../db');

const getOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT orders.*, users.email AS customer_email 
      FROM orders
      JOIN users ON orders.user_id = users.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    // Validación
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ error: 'Stock inválido' });
    }

    await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [stock, id]);
    res.json({ message: 'Stock actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando stock:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getOrders,
  getUsers,
  updateStock
};