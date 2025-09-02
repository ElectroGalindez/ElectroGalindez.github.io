// controllers/product.controller.js
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, image_url, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'El precio es inválido' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'La descripción es requerida' });
    }
    if (!category) {
      return res.status(400).json({ error: 'La categoría es requerida' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : image_url;
    if (!image) {
      return res.status(400).json({ error: 'Se requiere una imagen' });
    }

    const product = new Product({
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      images: [image],
      category
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, featured, onSale, page = 1, limit = 10 } = req.query;
    let filter = { active: true };

    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (onSale) filter.onSale = true;

    // ✅ Filtrar ofertas activas
    if (onSale === 'true') {
      filter.onSale = true;
      filter.salePrice = { $gt: 0 };
      filter.saleEndDate = { $gt: new Date() };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    console.error('Error en getProducts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category', 'name description');
    if (!product || !product.active) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, price, description, category, brand, model, 
      specifications, stock, featured, onSale, salePrice, saleEndDate 
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ 
        error: 'Nombre, precio y categoría son requeridos' 
      });
    }

    const updateData = {
      name,
      price: parseFloat(price),
      description,
      category,
      brand,
      model,
      specifications: specifications ? JSON.parse(specifications) : undefined,
      stock: parseInt(stock) || 0,
      featured: featured === 'true',
      onSale: onSale === 'true',
      salePrice: onSale ? parseFloat(salePrice) : 0,
      saleEndDate: onSale ? saleEndDate : undefined
    };

    if (req.file) {
      updateData.images = [`/uploads/${req.file.filename}`];
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product
    });

  } catch (error) {
    console.error('Error en updateProduct:', error);
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
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      active: true 
    })
    .populate('category', 'name')
    .limit(6)
    .sort({ createdAt: -1 });

    const validProducts = products.filter(p => p.category);

    res.json(validProducts);
  } catch (error) {
    console.error('Error en getFeaturedProducts:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};