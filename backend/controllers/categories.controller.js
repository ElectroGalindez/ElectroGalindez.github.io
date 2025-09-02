// controllers/category.controller.js
const Category = require('../models/Category');

// === GET /api/categories ===
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};
// === GET /api/categories/:id ===
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    console.error('Error al obtener categoría:', err);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

// === POST /api/categories ===
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : image_url;

    // ✅ Validación robusta
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const trimmedName = name.trim();

    // ✅ Evitar duplicados
    const existing = await Category.findOne({ 
      name: trimmedName, 
      active: true 
    });

    if (existing) {
      return res.status(400).json({ error: 'Ya existe una categoría con este nombre' });
    }
    const existingInactive = await Category.findOne({ 
      name: trimmedName, 
      active: false 
    });

    if (existingInactive) {
      // ✅ Reactivar en lugar de crear
      existingInactive.active = true;
      existingInactive.image = image || null;
      existingInactive.description = description || '';
      const saved = await existingInactive.save();
      return res.status(200).json(saved);
    }

    // ✅ Crear categoría
    const category = new Category({
      name: trimmedName,
      description: description || '',
      image: image || null,
      active: true,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);

  } catch (err) {
    console.error('Error al crear categoría:', err.message, err.stack);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: err.message 
    });
  }
};

// === PUT /api/categories/:id ===
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, active } = req.body;
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

    const updateData = { name, description, image, active };
    
    // Filtrar campos undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// === DELETE /api/categories/:id ===
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};