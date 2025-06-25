const pool = require('../config/db');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, image_url, category_id } = req.body;

    // Validación básica
    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    // Insertar el nuevo producto en la base de datos
    const result = await pool.query(
      'INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, description, image_url, category_id]
    );

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category_id } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    if (category_id) {
      query += ' WHERE category_id = $1';
      params.push(category_id);
    }
    query += ' ORDER BY id';
    const result = await pool
      .query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos' });
    }

    // Retornar los productos encontrados
    res.status(200).json({
      success: true,
      products: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image_url, category_id } = req.body;

    // Validación básica
    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3, image_url = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [name, price, description, image_url, category_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
