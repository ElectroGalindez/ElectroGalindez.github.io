const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, brand, model, specifications, stock, featured } = req.body;

    // Validación básica
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
    }

    // Crear el nuevo producto
    const product = new Product({
      name,
      price,
      description,
      images,
      category,
      brand,
      model,
      specifications,
      stock,
      featured
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 10 } = req.query;
    const filter = { active: true };
    
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category', 'name description');
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product,
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, active: true })
      .populate('category', 'name')
      .limit(6)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
