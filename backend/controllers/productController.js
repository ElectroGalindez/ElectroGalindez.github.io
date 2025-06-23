const Product = require('../models/product');
const { body, validationResult } = require('express-validator');

// Validaciones
const validateProduct = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('price').isFloat({ min: 0.01 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('category').notEmpty().withMessage('La categoría es requerida')
];

// Controladores
const getAllProducts = async (req, res) => {
  try {
    let products;
    
    if (req.query.category) {
      products = await Product.getByCategory(req.query.category);
    } else {
      products = await Product.getAll();
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { name, description, price, stock, category } = req.body;
    const newProduct = await Product.create({ name, description, price, stock, category });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { name, description, price, stock, category } = req.body;
    const updatedProduct = await Product.update(req.params.id, { name, description, price, stock, category });
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.delete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  validateProduct,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};