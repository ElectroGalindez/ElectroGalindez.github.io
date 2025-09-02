// routes/category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol de admin
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', requireAuth, requireAdmin, categoryController.createCategory);
router.put('/:id', requireAuth, requireAdmin, categoryController.updateCategory);
router.delete('/:id', requireAuth, requireAdmin, categoryController.deleteCategory);

module.exports = router;